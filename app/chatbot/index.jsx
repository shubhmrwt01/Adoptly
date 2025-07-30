import { useUser } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import { useNavigation, useRouter } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { db } from "../../config/FirebaseConfig";
import Colors from "../../constants/Colors";

/* ---------- CONSTANTS ---------- */
const FIELD_KEYWORDS = [
  "age",
  "breed",
  "weight",
  "sex",
  "location",
  "address",
  "category",
  "about",
  "detail",
  "details",
];
const GREETINGS = ["hi", "hello", "hey"];

/* ---------- Helper Functions ---------- */
const parseQuery = (message) => {
  const lowerMsg = message.toLowerCase();
  const field = FIELD_KEYWORDS.find((keyword) => lowerMsg.includes(keyword));
  const nameQuery = lowerMsg
    .replace(field || "", "")
    .replace(/of|the|pet/g, "")
    .trim();
  return { field, nameQuery };
};

const searchPetsByName = (pets, name) =>
  pets.filter((pet) => pet.name?.toLowerCase().includes(name.toLowerCase()));

/* ---------- Memoized Message Component ---------- */
const MessageItem = memo(({ item }) => {
  if (item.type === "pet-card") {
    const pet = item.pet;
    return (
      <View style={styles.petCard}>
        {item.showImage && (
          <Image source={{ uri: pet.imageUrl }} style={styles.petImageTop} />
        )}
        <View style={styles.petCardContent}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petDetail}>
            Breed: <Text style={styles.petData}>{pet.breed}</Text>
          </Text>
          <Text style={styles.petDetail}>
            Category: <Text style={styles.petData}>{pet.category}</Text>
          </Text>
          <Text style={styles.petDetail}>
            Age: <Text style={styles.petData}>{pet.age} yrs</Text>
          </Text>
          <Text style={styles.petDetail}>
            Weight: <Text style={styles.petData}>{pet.weight} kg</Text>
          </Text>
          <Text style={styles.petDetail}>
            Gender: <Text style={styles.petData}>{pet.sex}</Text>
          </Text>
          <Text style={styles.petDetail}>
            Location: <Text style={styles.petData}>{pet.address}</Text>
          </Text>
          <Text style={styles.petDetail}>
            About: <Text style={styles.petData}>{pet.about}</Text>
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View
      style={[
        styles.messageBubble,
        item.role === "user" ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text style={{ color: item.role === "user" ? "#fff" : "#000" }}>
        {item.text}
      </Text>
    </View>
  );
});

/* ---------- Main Component ---------- */
export default function ChatBotScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { user } = useUser();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [allPets, setAllPets] = useState([]);

  const flatListRef = useRef(null);

  /* Scroll to bottom */
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 50);
    });
  }, []);

  /* Set Header */
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerTransparent: true,
    });
  }, [navigation]);

  /* Auto scroll when messages update */
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  /* Scroll on keyboard open */
  useEffect(() => {
    const keyboardListener = Keyboard.addListener(
      "keyboardDidShow",
      scrollToBottom
    );
    return () => keyboardListener.remove();
  }, [scrollToBottom]);

  /* Fetch pets realtime */
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Pets"), (snapshot) => {
      setAllPets(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  /* Gemini API request */
  const fetchFromGemini = async (message) => {
    try {
      const apiKey = Constants.expoConfig.extra.geminiApiKey;
      if (!apiKey) return "API key is missing. Please check your setup.";

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] }),
        }
      );

      const data = await response.json();
      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.candidates?.[0]?.output_text ||
        "No response from Gemini API."
      );
    } catch (error) {
      console.error("Gemini fetch error:", error);
      return "Error connecting to AI service.";
    }
  };

  /* Send Message Handler */
  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages((prev) => [
      ...prev,
      { role: "user", type: "text", text: userMessage },
    ]);
    setInput("");
    setLoading(true);

    const lowerMsg = userMessage.toLowerCase();

    /* Greeting Response */
    if (GREETINGS.includes(lowerMsg)) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          type: "text",
          text: `Hi ${
            user?.fullName || "there"
          }! 👋 Welcome to Adopto. How may I assist you ?`,
        },
      ]);
      setLoading(false);
      return;
    }

    /* Redirect to Add Pet */
    if (lowerMsg.includes("add pet") || lowerMsg.includes("new pet")) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", type: "text", text: "Redirecting to Add New Pet..." },
      ]);
      setTimeout(() => router.push("/add-new-pet"), 800);
      setLoading(false);
      return;
    }

    /* Pet Info Request */
    const { field, nameQuery } = parseQuery(userMessage);
    if (nameQuery) {
      const matchedPets = searchPetsByName(allPets, nameQuery);
      if (matchedPets.length) {
        if (matchedPets.length === 1) {
          const pet = matchedPets[0];

          if (field) {
            const fieldMap = {
              age: `${pet.age} years`,
              breed: pet.breed,
              weight: `${pet.weight} kg`,
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
              {
                role: "bot",
                type: "text",
                text: fieldMap[field] || "I couldn't find that detail.",
              },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              { role: "bot", type: "pet-card", pet, showImage: true },
            ]);
          }
          setLoading(false);
          return;
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              type: "text",
              text: "Multiple pets found. Please specify exact name.",
            },
          ]);
          setLoading(false);
          return;
        }
      }
    }

    /* Gemini fallback */
    const replyText = await fetchFromGemini(userMessage);
    setMessages((prev) => [
      ...prev,
      { role: "bot", type: "text", text: replyText },
    ]);
    setLoading(false);
  }, [input, user?.fullName, router, allPets]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: "#f1f1f1" }}>
          {/* Header */}
          <View
            style={{
              alignItems: "center",
              marginTop: 40,
              paddingBottom: 10,
              zIndex: 10,
            }}
          >
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text
                style={{ fontSize: 26, fontFamily: "Bold", marginLeft: 30 }}
              >
                Adopto AI
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  height: 35,
                  width: 35,
                  backgroundColor: Colors.PRIMARY,
                  padding: 5,
                  borderRadius: 10,
                  marginLeft: 5,
                  marginTop: 6,
                }}
              >
                🐾
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "Medium",
                fontSize: 16,
                marginTop: -8,
                color: Colors.GRAY,
                marginRight: 20,
              }}
            >
              powered by Gemini
            </Text>
          </View>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => <MessageItem item={item} />}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            initialNumToRender={8}
            maxToRenderPerBatch={4}
            windowSize={6}
          />

          {loading && (
            <ActivityIndicator
              size="small"
              color={Colors.PRIMARY}
              style={{ marginBottom: 10 }}
            />
          )}

          {/* Input at bottom */}
          <View style={styles.inputContainer}>
            <View style={styles.divider} />
            <View style={styles.row}>
              <TextInput
                placeholder="Ask anything"
                placeholderTextColor="#888"
                style={styles.input}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={handleSendMessage}
              />

              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
              >
                <Ionicons name="send" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "#f1f1f1",
    paddingBottom: 8,
    paddingTop: 4,
  },
  divider: {
    borderWidth: 0.2,
    backgroundColor: Colors.GRAY,
    width: "100%",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 120,
    minHeight: 50,
    borderColor: Colors.PRIMARY,
  },
  sendButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 12,
    padding: 12,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 12,
    marginVertical: 5,
  },
  userBubble: {
    backgroundColor: Colors.PRIMARY,
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  botBubble: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  petCard: {
    width: "80%",
    alignSelf: "stretch",
    backgroundColor: "#fff1c9",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  petImageTop: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  petCardContent: {
    padding: 12,
  },
  petName: {
    fontFamily: "Bold",
    fontSize: 27,
    marginBottom: 6,
    textAlign: "center",
  },
  petDetail: {
    fontSize: 18,
    color: "Black",
    fontFamily: "Medium",
    marginBottom: 2,
  },
  petData: {
    fontSize: 16,
    color: Colors.GRAY,
    fontFamily: "Regular",
  },
});
