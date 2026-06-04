import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { db } from "../config/FirebaseConfig";

/* ================================================================
   CONSTANTS
   ================================================================ */
const FIELD_KEYWORDS = [
  "age", "breed", "weight", "sex", "location",
  "address", "category", "about", "detail", "details",
];

const GREETINGS = new Set(["hi", "hello", "hey"]);

const CATEGORY_KEYWORDS = [
  { key: "dogs", label: "dog" },
  { key: "dog", label: "dog" },
  { key: "cats", label: "cat" },
  { key: "cat", label: "cat" },
  { key: "birds", label: "bird" },
  { key: "bird", label: "bird" },
  { key: "fishes", label: "fish" },
  { key: "fish", label: "fish" },
];

const NEARBY_KEYWORDS = [
  "nearby", "adoption center", "adoption centre", "shelter",
  "pet shop", "pet store", "where can i find", "where to find",
  "near me", "center near", "centre near", "shops near",
];

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/* ================================================================
   PURE HELPERS  (defined once, never re-created)
   ================================================================ */
const parseQuery = (message) => {
  const lower = message.toLowerCase();
  const field = FIELD_KEYWORDS.find((kw) => lower.includes(kw));
  const nameQuery = lower
    .replace(field ?? "", "")
    .replace(/\b(of|the|pet)\b/g, "")
    .trim();
  return { field, nameQuery };
};

const searchPetsByName = (pets, name) => {
  const q = name.toLowerCase();
  return pets.filter((p) => p.name?.toLowerCase().includes(q));
};

/**
 * Extracts every filterable field from the user message by scanning
 * real DB values — no hard-coding of breeds or cities needed.
 */
const extractPetRequirements = (message, pets) => {
  const lower = message.toLowerCase();

  // Age: "2 year(s)", "2 yr(s)", "aged 2", "of age 2", "age 2"
  const ageMatch = lower.match(
    /(?:aged?|of\s+age)?\s*(\d+)\s*(?:years?|yrs?)/
  );

  // Sex — check "female" first to avoid "male" matching inside it
  const sex = lower.includes("female")
    ? "female"
    : lower.includes("male")
      ? "male"
      : null;

  // Category — longest key wins (prevents "dog" shadowing "dogs")
  const foundCategory = CATEGORY_KEYWORDS
    .filter((c) => lower.includes(c.key))
    .sort((a, b) => b.key.length - a.key.length)[0] ?? null;

  // Breed — scan unique breeds from DB
  const uniqueBreeds = [
    ...new Set(pets.map((p) => p.breed?.trim().toLowerCase()).filter(Boolean)),
  ];
  const matchedBreed = uniqueBreeds.find((b) => lower.includes(b)) ?? null;

  // Location — match first segment of stored address
  const uniqueLocations = [
    ...new Set(
      pets
        .map((p) => p.address?.split(",")[0]?.trim().toLowerCase())
        .filter(Boolean)
    ),
  ];
  const matchedLocation =
    uniqueLocations.find((loc) => lower.includes(loc)) ?? null;

  return {
    breed: matchedBreed,
    age: ageMatch ? Number(ageMatch[1]) : null,
    sex,
    category: foundCategory?.label ?? null,
    location: matchedLocation,
  };
};

const buildPetDescription = ({ age, sex, breed, category, location }) =>
  [
    age ? `${age} year old` : "",
    sex ?? "",
    breed ?? category ?? "pet",
    location ? `in ${location}` : "",
  ]
    .filter(Boolean)
    .join(" ");

const makeBotMsg = (text, extra = {}) => ({
  id: `${Date.now()}${Math.random()}`,
  role: "bot",
  type: "text",
  text,
  ...extra,
});

const makePetCard = (pet) => ({
  id: `${Date.now()}${Math.random()}`,
  role: "bot",
  type: "pet-card",
  pet,
  showImage: true,
});

/* ================================================================
   GROQ CALLS
   ================================================================ */

const fetchFromGroq = async (message) => {
  try {
    const API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are Adopto AI, a friendly pet adoption assistant. Keep answers concise and warm.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.log("Groq Error:", data.error);
      return "⚠️ Adopto AI is currently unavailable.";
    }

    return (
      data?.choices?.[0]?.message?.content ||
      "No response received."
    );
  } catch (error) {
    console.error("Groq Error:", error);
    return "Error connecting to AI service.";
  }
};

const fetchNearbyCenters = async (
  location,
  petDescription
) => {
  return await fetchFromGroq(`
A user is looking for:
${petDescription}

Location:
${location}

Suggest nearby pet adoption centers,
animal shelters, rescue organizations,
and pet stores where they may find this pet.

Provide:
- Name
- Address
- Short description

Keep it concise.
`);
};
/* ================================================================
   HOOK
   ================================================================ */
export default function useChatBot() {
  const router = useRouter();
  const { user } = useUser();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allPets, setAllPets] = useState([]);

  // Non-null while the bot is waiting for the user's location
  const pendingNotFound = useRef(null); // { petDescription: string } | null
  const flatListRef = useRef(null);

  /* ── Realtime Firestore listener ── */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "Pets"), (snap) =>
      setAllPets(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );
    return unsub;
  }, []);

  /* ── Append helpers ── */
  const push = useCallback(
    (...msgs) => setMessages((prev) => [...prev, ...msgs]),
    []
  );

  /* ── Main send handler ── */
  const handleSendMessage = useCallback(
    async (userMessage) => {
      push({ id: `${Date.now()}`, role: "user", type: "text", text: userMessage });
      setLoading(true);

      const lower = userMessage.toLowerCase().trim();

      try {
        /* A ── Awaiting location after "not found" */
        if (pendingNotFound.current) {
          const { petDescription } = pendingNotFound.current;
          pendingNotFound.current = null;
          push(makeBotMsg(`Got it! Searching near "${userMessage}"... 🔍`));
          push(makeBotMsg(await fetchNearbyCenters(userMessage, petDescription)));
          return;
        }

        /* B ── Greeting */
        if (GREETINGS.has(lower)) {
          push(makeBotMsg(`Hi ${user?.fullName ?? "there"}! 👋 Welcome to Adopto. How may I assist you?`));
          return;
        }

        /* C ── Add / new pet */
        if (lower.includes("add pet") || lower.includes("new pet")) {
          push(makeBotMsg("Redirecting to Add New Pet..."));
          setTimeout(() => router.push("/add-new-pet"), 800);
          return;
        }

        /* D ── Nearby centers intent (MUST run before pet search) */
        const isNearbyQuery = NEARBY_KEYWORDS.some((kw) => lower.includes(kw));
        if (isNearbyQuery) {
          // Prefer "in <location>" pattern; fall back to stripping noise
          const inMatch = userMessage.match(/\bin\s+([a-zA-Z\s,]+?)(?:\s*$)/i);
          const location = inMatch
            ? inMatch[1].trim()
            : userMessage
              .replace(
                /nearby|adoption\s+cent(?:er|re)s?|shelters?|pet\s+shops?|pet\s+stores?|i\s+want|find\s+me|show\s+me|near\s+me|near|pets?/gi,
                ""
              )
              .trim();

          if (location) {
            push(makeBotMsg(`Searching for adoption centers near "${location}"... 🔍`));
            push(makeBotMsg(await fetchNearbyCenters(location, "pets")));
          } else {
            pendingNotFound.current = { petDescription: "pets" };
            push(makeBotMsg(
              "Sure! 🐾 Could you share your **city or location** so I can find nearby adoption centers for you?"
            ));
          }
          return;
        }

        /* E ── Smart pet search */
        const req = extractPetRequirements(userMessage, allPets);

        const isPetQuery =
          req.breed !== null ||
          req.age !== null ||
          req.sex !== null ||
          req.category !== null ||
          req.location !== null;

        if (isPetQuery) {
          const matched = allPets.filter((pet) => {
            const breedOk = !req.breed || pet.breed?.toLowerCase().includes(req.breed);
            const ageOk = req.age == null || Number(pet.age) === req.age;
            const sexOk = !req.sex || pet.sex?.toLowerCase() === req.sex;
            const categoryOk = !req.category || pet.category?.toLowerCase().includes(req.category);
            const locationOk = !req.location ||
              pet.address?.split(",")[0]?.trim().toLowerCase() === req.location;
            return breedOk && ageOk && sexOk && categoryOk && locationOk;
          });

          if (matched.length > 0) {
            push(
              makeBotMsg(`I found ${matched.length} matching pet${matched.length > 1 ? "s" : ""} 🐾`),
              ...matched.map(makePetCard)
            );
            return;
          }

          // Not found → ask for location
          const petDescription = buildPetDescription(req);
          pendingNotFound.current = { petDescription };
          push(makeBotMsg(
            `😔 Sorry, I couldn't find a "${petDescription}" in our database.\n\n` +
            `But don't worry! Share your **city or location** and I'll suggest nearby ` +
            `adoption centers or shelters where you might find one! 🐾`
          ));
          return;
        }

        /* F ── Field / name query  e.g. "age of Max" */
        const { field, nameQuery } = parseQuery(userMessage);
        if (nameQuery) {
          const hits = searchPetsByName(allPets, nameQuery);

          if (hits.length === 1) {
            const [pet] = hits;
            if (field) {
              const fieldMap = {
                age: `${pet.age} years`,
                breed: pet.breed,
                weight: `${pet.weight} kg`,
                sex: pet.sex,
                gender: pet.sex,
                location: pet.address,
                address: pet.address,
                category: pet.category,
                about: pet.about,
                detail: pet.about,
                details: pet.about,
              };
              push(makeBotMsg(fieldMap[field] ?? "I couldn't find that detail."));
            } else {
              push(makePetCard(pet));
            }
            return;
          }

          if (hits.length > 1) {
            push(makeBotMsg("Multiple pets found. Please specify the exact name."));
            return;
          }
        }

        /* G ── Gemini fallback */
        push(makeBotMsg(await fetchFromGroq(userMessage)));

      } finally {
        setLoading(false);
      }
    },
    [allPets, user?.fullName, router, push]
  );

  return { messages, loading, flatListRef, handleSendMessage };
}