import { useNavigation } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View
} from "react-native";
import ChatInput from "../../ChatBot/ChatInput";
import MessageItem from "../../ChatBot/MessageItem";
import useChatBot from "../../ChatBot/useChatBot";
import Colors from "../../constants/Colors";


export default function ChatBotScreen() {
  const navigation = useNavigation();
  const { messages, loading, flatListRef, handleSendMessage } = useChatBot();

  useEffect(() => {
    navigation.setOptions({ headerTitle: "", headerTransparent: true });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "android" ? 30 : 0}
    >
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
      <View style={styles.container}>

        {/* ── Premium AI Header ── */}
        <View style={styles.header}>
          <View style={styles.leftSection}>
            <View style={styles.avatarWrap}>
              <Image
                source={require("../../assets/images/ChatBot.png")}
                style={styles.avatarImage}
              />

              <View style={styles.onlineIndicator} />
            </View>

            <View style={styles.headerText}>
              <Text style={styles.headerName}>Adopto AI </Text>

              <Text style={styles.headerSubtitle}>
                Your smart pet adoption assistant
              </Text>

              <View style={styles.badge}>
                <Text style={styles.badgeText}>✨ Powered by Gemini</Text>
              </View>
            </View>
          </View>

          <View style={styles.rightSection}>
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>
        {/* ── Messages ── */}
        <FlatList
          ref={flatListRef}
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 20,
          }}
          data={messages}
          renderItem={({ item }) => <MessageItem item={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* ── Typing indicator ── */}
        {loading && (
          <View style={styles.loadingRow}>
            <View style={styles.typingBubble}>
              <ActivityIndicator size="small" color={Colors.PRIMARY} />
              <Text style={styles.typingText}>Adopto is thinking…</Text>
            </View>
          </View>
        )}
        {/* ── Input ── */}
        <ChatInput onSend={handleSendMessage} />

      </View>
      {/* </TouchableWithoutFeedback> */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafaf8",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#fff",
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  rightSection: {
    alignItems: "flex-end",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#22C55E",
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.LIGHT_PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.PRIMARY,
  },
  avatarImage: {
    width: 28,
    height: 28,
  },
  headerText: {
    flex: 1,
    paddingLeft: 20,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a18",
    letterSpacing: -0.2,
  },
  badge: {
    marginTop: 3,
    alignSelf: "flex-start",
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    color: Colors.PRIMARY,
    fontWeight: "500",
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    backgroundColor: "#22c55e",
  },

  /* List */
  listContent: {
    padding: 20,
    paddingBottom: 12,
  },

  /* Typing */
  loadingRow: {
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    backgroundColor: Colors.WHITE,
    borderWidth: 0.5,
    borderColor: "#e8e8e4",
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  typingText: {
    fontSize: 13,
    color: Colors.GRAY,
  },

  /* Chips */
  chipsRow: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
    flexDirection: "row",
  },
  chip: {
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipText: {
    fontSize: 12,
    color: Colors.PRIMARY,
    fontWeight: "500",
  },
});