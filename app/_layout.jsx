import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
function AuthGate({ children }) {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
}

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const [fontsLoaded] = useFonts({
    Bold: require("../assets/fonts/Outfit-Bold.ttf"),
    Medium: require("../assets/fonts/Outfit-Medium.ttf"),
    Light: require("../assets/fonts/Outfit-Light.ttf"),
    Regular: require("../assets/fonts/Outfit-Regular.ttf"),
    Black: require("../assets/fonts/Outfit-Black.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
    >
      <AuthGate>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthGate>
    </ClerkProvider>
  );
}