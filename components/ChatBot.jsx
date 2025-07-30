// components/ChatBot.jsx
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";
import Colors from "../constants/Colors";

export default function ChatBot() {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={() => router.push("/chatbot")}
        style={({pressed})=>[
          styles.chatBotContainer,
          {
            backgroundColor:pressed?'#D0D7E2':'#F0F4F8'
          }
        ]}
      >
        <Image
          source={require("../assets/images/ChatBot.png")}
          style={styles.image}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 100,
  },
  chatBotContainer: {
    borderRadius: 20,
    padding: 5,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    elevation: 8,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});
