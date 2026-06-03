import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { db } from "../config/FirebaseConfig";

/* ---------- CONSTANTS ---------- */
const FIELD_KEYWORDS = [
  "age", "breed", "weight", "sex", "location",
  "address", "category", "about", "detail", "details",
];
const GREETINGS = ["hi", "hello", "hey"];

/* ---------- Helpers ---------- */
const parseQuery = (message) => {
  const lowerMsg = message.toLowerCase();
  const field = FIELD_KEYWORDS.find((kw) => lowerMsg.includes(kw));
  const nameQuery = lowerMsg
    .replace(field || "", "")
    .replace(/of|the|pet/g, "")
    .trim();
  return { field, nameQuery };
};

const searchPetsByName = (pets, name) =>
  pets.filter((p) => p.name?.toLowerCase().includes(name.toLowerCase()));

const makeBotMsg = (text, extra = {}) => ({
  id: Date.now().toString() + Math.random(),
  role: "bot",
  type: "text",
  text,
  ...extra,
});

/* ---------- Gemini ---------- */
const fetchFromGemini = async (message) => {
  try {
    const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!API_KEY) return "API key is missing. Please check your setup.";

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Adopto AI, a friendly pet adoption assistant. Keep answers concise and warm. User asked: ${message}`,
            }],
          }],
        }),
      }
    );
    const data = await res.json();
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini API."
    );
  } catch (err) {
    console.error("Gemini error:", err);
    return "Error connecting to AI service.";
  }
};

/* ---------- Hook ---------- */
export default function useChatBot() {
  const router = useRouter();
  const { user } = useUser();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allPets, setAllPets] = useState([]);

  const flatListRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false }); // false prevents animation fighting
    }, 100);
  }, []);

  /* Realtime pets */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "Pets"), (snap) => {
      setAllPets(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  /* Auto scroll */
  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);


  /* ---- Send handler (only depends on allPets + user, NOT on input) ---- */
  const handleSendMessage = useCallback(async (userMessage) => {
    // Push user bubble
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", type: "text", text: userMessage },
    ]);
    setLoading(true);

    const lowerMsg = userMessage.toLowerCase();

    // Greeting
    if (GREETINGS.includes(lowerMsg)) {
      setMessages((prev) => [
        ...prev,
        makeBotMsg(`Hi ${user?.fullName || "there"}! 👋 Welcome to Adopto. How may I assist you?`),
      ]);
      setLoading(false);
      return;
    }

    // Add / new pet redirect
    if (lowerMsg.includes("add pet") || lowerMsg.includes("new pet")) {
      setMessages((prev) => [
        ...prev,
        makeBotMsg("Redirecting to Add New Pet..."),
      ]);
      setTimeout(() => router.push("/add-new-pet"), 800);
      setLoading(false);
      return;
    }

    // Pet info lookup
    const { field, nameQuery } = parseQuery(userMessage);
    if (nameQuery) {
      const matched = searchPetsByName(allPets, nameQuery);

      if (matched.length === 1) {
        const pet = matched[0];
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
          setMessages((prev) => [
            ...prev,
            makeBotMsg(fieldMap[field] || "I couldn't find that detail."),
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { id: Date.now().toString(), role: "bot", type: "pet-card", pet, showImage: true },
          ]);
        }
        setLoading(false);
        return;
      }

      if (matched.length > 1) {
        setMessages((prev) => [
          ...prev,
          makeBotMsg("Multiple pets found. Please specify the exact name."),
        ]);
        setLoading(false);
        return;
      }
    }

    // Gemini fallback
    const reply = await fetchFromGemini(userMessage);
    setMessages((prev) => [...prev, makeBotMsg(reply)]);
    setLoading(false);
  }, [allPets, user?.fullName, router]);

  return { messages, loading, flatListRef, handleSendMessage };
}