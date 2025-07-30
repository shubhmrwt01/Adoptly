import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { db } from "../../config/FirebaseConfig";
import Colors from "../../constants/Colors";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [otherUserData, setOtherUserData] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const flatListRef = useRef(null);

  /** Auto-scroll to bottom */
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    });
  }, []);

  /** Listen for keyboard events (fallback for Android) */
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardHeight(0)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  /** Fetch chat partner details */
  const getUserDetails = useCallback(async () => {
    if (!id) return;
    try {
      const docSnap = await getDoc(doc(db, "Chat", id));
      if (!docSnap.exists()) return;

      const chatData = docSnap.data();
      const otherUser = chatData?.users.find(
        (u) => u.email !== user?.primaryEmailAddress?.emailAddress
      );

      if (otherUser) {
        setOtherUserData(otherUser);
        navigation.setOptions({
          headerTitle: otherUser.name || "Chat",
        });
      }
    } catch (error) {
      console.log("Error fetching user details:", error);
    }
  }, [id, navigation, user?.primaryEmailAddress?.emailAddress]);

  /** Load messages in real-time */
  useEffect(() => {
    if (!id) return;
    getUserDetails();

    const q = query(
      collection(db, "Chat", id, "Messages"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate?.() ?? new Date(),
        };
      });
      setMessages(newMessages);
    });

    return unsubscribe;
  }, [id, getUserDetails]);

  /** Send message */
  const handleSend = async () => {
    if (!inputText.trim() || !id) return;

    const now = new Date();
    const newMessage = {
      _id: Date.now().toString(),
      text: inputText.trim(),
      createdAt: now,
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      user: {
        _id: user?.id || "unknown",
        name: user?.fullName || "You",
        imageUrl: user?.imageUrl || "https://via.placeholder.com/50",
      },
    };

    setInputText("");

    try {
      await addDoc(collection(db, "Chat", id, "Messages"), newMessage);
      scrollToBottom();
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  /** Render individual message */
  const renderItem = useCallback(
    ({ item, index }) => {
      const isMyMessage = item.user._id === user?.id;
      const previousMessage = messages[index - 1];
      const showAvatar =
        !previousMessage || previousMessage.user._id !== item.user._id;

      return (
        <View
          style={[
            styles.messageRow,
            isMyMessage ? styles.myMessageRow : styles.otherMessageRow,
          ]}
        >
          {/* Avatar (Other user) */}
          {!isMyMessage && showAvatar && (
            <Image source={{ uri: item.user.imageUrl }} style={styles.avatar} />
          )}

          <View
            style={[
              styles.messageBubble,
              isMyMessage ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestampText}>{item.time}</Text>
          </View>

          {/* Avatar (My message) */}
          {isMyMessage && showAvatar && (
            <Image source={{ uri: item.user.imageUrl }} style={styles.avatar} />
          )}
        </View>
      );
    },
    [messages, user?.id]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // header height offset
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {/* Messages */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item._id}
              inverted
              contentContainerStyle={{ paddingVertical: 12 }}
              renderItem={renderItem}
            />

            {/* Input */}
            <View
              style={[
                styles.inputContainer,
                { marginBottom: Platform.OS === "android" ? keyboardHeight : 0 },
              ]}
            >
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor="#888"
                multiline={false}
                returnKeyType="send"
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity
                onPress={handleSend}
                style={[
                  styles.sendButton,
                  { opacity: inputText.trim() ? 1 : 0.5 },
                ]}
                disabled={!inputText.trim()}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 6,
    paddingHorizontal: 10,
  },
  myMessageRow: {
    justifyContent: "flex-end",
  },
  otherMessageRow: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    maxWidth: "80%",
    flexShrink: 1,
  },
  myMessage: {
    backgroundColor: "#DCF8C6",
    borderBottomRightRadius: 0,
    alignSelf: "flex-end",
    marginRight: 10,
  },
  otherMessage: {
    backgroundColor: "#ADD8E6",
    borderBottomLeftRadius: 0,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  messageText: {
    fontSize: 15,
    color: "black",
    fontFamily: "Regular",
  },
  timestampText: {
    fontSize: 10,
    color: "#666",
    textAlign: "right",
    marginTop: 2,
    fontFamily: "Regular",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
});
