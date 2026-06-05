// ─────────────────────────────────────────────────────────────────────────────
// ChatScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────

import { useUser } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../config/FirebaseConfig";
import Colors from "../../constants/Colors";


// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const formatTime = (date) =>
  date instanceof Date
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

const formatDateLabel = (date) => {
  if (!(date instanceof Date)) return "";

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};


// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

// ── Chat Header ───────────────────────────────────────────────────────────────

const ChatHeader = ({ otherUser, onBack }) => (
  <SafeAreaView style={headerStyles.safeArea}>
    <View style={headerStyles.container}>
      <TouchableOpacity onPress={onBack} style={headerStyles.backBtn} hitSlop={12}>
        <View style={headerStyles.chevron} />
      </TouchableOpacity>

      {otherUser?.imageUrl ? (
        <Image source={{ uri: otherUser.imageUrl }} style={headerStyles.avatar} />
      ) : (
        <View style={headerStyles.avatarFallback}>
          <Text style={headerStyles.avatarInitial}>
            {(otherUser?.name || "?")[0].toUpperCase()}
          </Text>
        </View>
      )}

      <View style={headerStyles.info}>
        <Text style={headerStyles.name} numberOfLines={1}>
          {otherUser?.name || "Chat"}
        </Text>
      </View>
    </View>
  </SafeAreaView>
);

// ── Date Separator ────────────────────────────────────────────────────────────

const DateSeparator = ({ label }) => (
  <View style={styles.dateSeparatorRow}>
    <View style={styles.dateSeparatorLine} />
    <Text style={styles.dateSeparatorText}>{label}</Text>
    <View style={styles.dateSeparatorLine} />
  </View>
);

// ── Message Bubble ────────────────────────────────────────────────────────────

const MessageBubble = React.memo(({ item, isMe, showAvatar, showTail }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.messageRow,
        isMe ? styles.myMessageRow : styles.otherMessageRow,
        { opacity: anim },
      ]}
    >
      {!isMe && (
        <View style={styles.avatarSlot}>
          {showAvatar && item.user?.imageUrl ? (
            <Image source={{ uri: item.user.imageUrl }} style={styles.avatar} />
          ) : null}
        </View>
      )}

      <View
        style={[
          styles.bubble,
          isMe ? styles.myBubble : styles.otherBubble,
          isMe && showTail && styles.myBubbleTail,
          !isMe && showTail && styles.otherBubbleTail,
        ]}
      >
        <Text style={[styles.messageText, isMe && styles.myMessageText]}>
          {item.text}
        </Text>
        <View style={styles.bubbleMeta}>
          <Text style={[styles.timeText, isMe && styles.myTimeText]}>
            {formatTime(item.createdAt)}
          </Text>
          {isMe && (
            <Text style={styles.tickText}>{item.read ? "✓✓" : "✓"}</Text>
          )}
        </View>
      </View>

      {isMe && (
        <View style={styles.avatarSlot}>
          {showAvatar && item.user?.imageUrl ? (
            <Image source={{ uri: item.user.imageUrl }} style={styles.avatar} />
          ) : null}
        </View>
      )}
    </Animated.View>
  );
});


// ─────────────────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────────────────

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const { user } = useUser();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [otherUser, setOtherUser] = useState(null);

  const flatListRef = useRef(null);
  const scrollTimer = useRef(null);
  const myId = user?.id;

  // ── Hide expo-router's default header (we render our own) ──────────────────

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // ── Fetch chat partner details ─────────────────────────────────────────────

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const snap = await getDoc(doc(db, "Chat", id));
        if (!snap.exists()) return;

        const other = snap.data()?.users?.find(
          (u) => u.email !== user?.primaryEmailAddress?.emailAddress
        );
        if (other) setOtherUser(other);
      } catch (e) {
        console.log("Header fetch error:", e);
      }
    })();
  }, [id]);

  // ── Subscribe to real-time messages ───────────────────────────────────────

  useEffect(() => {
    if (!id) return;

    const q = query(
      collection(db, "Chat", id, "Messages"),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            ...data,
            id: d.id,
            createdAt: data.createdAt?.toDate?.() ?? new Date(),
          };
        })
      );
    });
  }, [id]);

  // ── Scroll to bottom ───────────────────────────────────────────────────────

  const scrollToBottom = useCallback(() => {
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 60);
  }, []);

  // ── Send message ───────────────────────────────────────────────────────────

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || !id) return;

    setInputText("");

    try {
      await addDoc(collection(db, "Chat", id, "Messages"), {
        _id: Date.now().toString(),
        text,
        createdAt: new Date(),
        read: false,
        user: {
          _id: myId ?? "unknown",
          name: user?.fullName ?? "You",
          imageUrl: user?.imageUrl ?? "",
        },
      });
      scrollToBottom();
    } catch (e) {
      console.log("Send error:", e);
    }
  }, [inputText, id, myId, user, scrollToBottom]);

  // ── Render helpers ─────────────────────────────────────────────────────────

  const renderItem = useCallback(
    ({ item, index }) => {
      const isMe = item.user._id === myId;
      const nextMsg = messages[index + 1];

      const showAvatar = !nextMsg || nextMsg.user._id !== item.user._id;
      const showTail = showAvatar;
      const showDate =
        !nextMsg ||
        new Date(nextMsg.createdAt).toDateString() !==
        new Date(item.createdAt).toDateString();

      return (
        <>
          <MessageBubble
            item={item}
            isMe={isMe}
            showAvatar={showAvatar}
            showTail={showTail}
          />
          {showDate && <DateSeparator label={formatDateLabel(item.createdAt)} />}
        </>
      );
    },
    [messages, myId]
  );

  const keyExtractor = useCallback((item) => item.id ?? item._id, []);

  // ── Derived state ──────────────────────────────────────────────────────────

  const hasText = inputText.trim().length > 0;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F5F5F7" }}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "android" ? 30 : 0}
    >
      <ChatHeader otherUser={otherUser} onBack={() => router.back()} />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        inverted
        removeClippedSubviews={Platform.OS === "android"}
        maxToRenderPerBatch={12}
        updateCellsBatchingPeriod={40}
        windowSize={10}
        initialNumToRender={20}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Message..."
          placeholderTextColor="#aaa"
          multiline
          maxLength={1000}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !hasText && styles.sendBtnDisabled]}
          onPress={handleSend}
          activeOpacity={0.8}
          disabled={!hasText}
        >
          <Ionicons
            name="send-sharp"
            size={20}
            color={hasText ? "#1a1a18" : Colors.GRAY}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

// ── Header ────────────────────────────────────────────────────────────────────

const headerStyles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  chevron: {
    width: 10,
    height: 10,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: Colors.PRIMARY,
    transform: [{ rotate: "45deg" }],
    marginLeft: 4,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  avatarFallback: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Outfit-Medium",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: "Outfit-Medium",
    color: "#111",
  },
});

// ── Screen ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // List
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },

  // Message rows
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 3,
  },
  myMessageRow: { justifyContent: "flex-end" },
  otherMessageRow: { justifyContent: "flex-start" },

  // Avatars
  avatarSlot: {
    width: 32,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#fff",
  },

  // Bubbles
  bubble: {
    maxWidth: "72%",
    paddingHorizontal: 13,
    paddingTop: 8,
    paddingBottom: 6,
    borderRadius: 18,
    marginHorizontal: 4,
  },
  myBubble: {
    backgroundColor: Colors.PRIMARY,
    borderBottomRightRadius: 18,
  },
  myBubbleTail: { borderBottomRightRadius: 4 },
  otherBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  otherBubbleTail: { borderBottomLeftRadius: 4 },

  // Bubble text & meta
  messageText: {
    fontSize: 15,
    color: "#111",
    fontFamily: "Outfit-Regular",
    lineHeight: 21,
  },
  myMessageText: { color: "#fff" },
  bubbleMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 3,
    gap: 3,
  },
  timeText: { fontSize: 10, color: "#999", fontFamily: "Outfit-Regular" },
  myTimeText: { color: "rgba(255,255,255,0.7)" },
  tickText: { fontSize: 10, color: "rgba(255,255,255,0.75)" },

  // Date separator
  dateSeparatorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
    gap: 8,
  },
  dateSeparatorLine: { flex: 1, height: 1, backgroundColor: "#E0E0E0" },
  dateSeparatorText: {
    fontSize: 11,
    color: "#999",
    fontFamily: "Outfit-Regular",
    paddingHorizontal: 4,
  },

  // Input bar
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: Platform.OS === "ios" ? 28 : 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#F1F1F3",
    borderRadius: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    fontFamily: "Outfit-Regular",
    color: "#111",
    maxHeight: 110,
  },
  sendBtn: {
    padding: 12,
    marginBottom: 3,
    borderRadius: 10,
    backgroundColor: Colors.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  sendBtnDisabled: {
    backgroundColor: Colors.LIGHT_PRIMARY,
  },
});