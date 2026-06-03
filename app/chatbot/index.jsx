import { useNavigation } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
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
      behavior="padding"                          // same for both iOS & Android
      keyboardVerticalOffset={Platform.OS === "android" ? 30 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: "#f1f1f1" }}>


          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Adopto AI</Text>
              <Image
                source={require("../../assets/images/ChatBot.png")}
                style={styles.image}
              />
            </View>
            <Text style={styles.subtitle}>powered by Gemini</Text>
          </View>


          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => <MessageItem item={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
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


          {/* Input — isolated component, won't trigger list re-render */}
          <ChatInput onSend={handleSendMessage} />


        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginTop: 40,
    paddingBottom: 10,
    zIndex: 10,
  },
  titleRow: {
    flexDirection: "row",
    gap: 5,
  },
  title: {
    fontSize: 26,


    marginLeft: 30,
  },
  image: {
    height: 40,
    width: 40
  },
  pawIcon: {
    fontSize: 18,
    height: 35,
    width: 35,
    backgroundColor: Colors.PRIMARY,
    padding: 5,
    borderRadius: 10,
    marginLeft: 5,
    marginTop: 6,
    textAlign: "center",
  },
  subtitle: {


    fontSize: 16,
    marginTop: -8,
    color: Colors.GRAY,
    marginRight: 20,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
});