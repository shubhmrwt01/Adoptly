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

  const hasText = input.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.inputWrap}>
          <TextInput
            placeholder="Ask Adopto AI anything…"
            placeholderTextColor={Colors.GRAY}
            style={styles.input}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline
          />
        </View>
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
    </View>
  );
});

export default ChatInput;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    borderTopWidth: 0.5,
    borderTopColor: "#e8e8e4",
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  inputWrap: {
    flex: 1,
    backgroundColor: "#f4f4f0",
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "#e8e8e4",
    paddingHorizontal: 15,
    paddingVertical: 5,
    minHeight: 20,
    justifyContent: "center",
  },
  input: {
    fontSize: 14,
    color: "#1a1a18",
    maxHeight: 100,
    lineHeight: 20,
  },
  sendBtn: {
    // width: 44,
    // height: 44,
    padding: 18,
    marginBottom: 3,
    borderRadius: 10,
    backgroundColor: Colors.PRIMARY,       // gold #E8B20E
    alignItems: "center",
    justifyContent: "center",
    alignSelf: 'center'
  },
  sendBtnDisabled: {
    backgroundColor: Colors.LIGHT_PRIMARY, // pale gold when empty
  },
});