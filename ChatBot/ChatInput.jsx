import Ionicons from "@expo/vector-icons/Ionicons";
import { memo, useCallback, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../constants/Colors";

const ChatInput = memo(({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
  }, [input, onSend]);

  return (
    <View style={styles.inputContainer}>
      <View style={styles.divider} />
      <View style={styles.row}>
        <TextInput
          placeholder="Ask anything"
          placeholderTextColor="#888"
          style={styles.input}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default ChatInput;

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
    borderWidth: 1,
  },
  sendButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 12,
    padding: 12,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});