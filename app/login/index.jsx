import { useSSO } from "@clerk/clerk-expo";
import { AntDesign } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect } from "react";
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "./../../constants/Colors";

WebBrowser.maybeCompleteAuthSession();

const { height, width } = Dimensions.get("window");

const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

export default function LoginScreen() {
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      const redirectUrl = Linking.createURL("/(tabs)/home", {
        scheme: "adoptly",
      });

      const { createdSessionId, signIn, signUp, setActive } =
        await startSSOFlow({
          strategy: "oauth_google",
          redirectUrl,
        });

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
        console.log("✅ Google SSO successful");
      } else {
        Alert.alert(
          "Additional Verification",
          "Complete the remaining authentication steps."
        );
      }
    } catch (err) {
      console.error("❌ SSO error:", err);
      Alert.alert("Google Sign-In Failed", err?.message || "Please try again.");
    }
  }, [startSSOFlow]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1 }}>
          <Image
            source={require("./../../assets/images/Login.png")}
            style={{
              height: height * 0.60, // 45% of screen height
              width: "100%",
              resizeMode: "cover",
            }}
          />

          <View style={{ padding: width * 0.06, alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "Bold",
                fontSize: width * 0.08,
                textAlign: "center",
                lineHeight: width * 0.1,
              }}
            >
              Ready to make a new friend?
            </Text>

            <Text
              style={{
                fontFamily: "Medium",
                fontSize: width * 0.045,
                textAlign: "center",
                color: Colors.GRAY,
                marginTop: 16,
                lineHeight: width * 0.06,
              }}
            >
              Let's adopt the pet you like and make their life happy again.
            </Text>

<TouchableOpacity
  onPress={onPress}
  style={{
    paddingVertical: 16,
    marginTop: height * 0.08,
    backgroundColor: Colors.PRIMARY,
    width: "100%",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  }}
>
  <AntDesign name="google" size={24} color="#fff" style={{ marginRight: 10 }} />
  <Text
    style={{
      textAlign: "center",
      fontFamily: "Bold",
      fontSize: width * 0.05,
      color: "#fff",
    }}
  > Continue with Google</Text>
</TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
