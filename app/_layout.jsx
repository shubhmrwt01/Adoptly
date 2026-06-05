import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { ActivityIndicator, Appearance, View } from "react-native";
Appearance.setColorScheme("light");

// Keep splash visible until fonts are ready
SplashScreen.preventAutoHideAsync();

function AuthGate({ children }) {
  const { isLoaded } = useAuth();
  console.log(Appearance.getColorScheme());

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
}

export default function RootLayout() {
  useEffect(() => {
    Appearance.setColorScheme("light");
    SystemUI.setBackgroundColorAsync("#ffffff");

    console.log(
      "Theme after forcing:",
      Appearance.getColorScheme()
    );
  }, []);

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const [fontsLoaded, fontError] = useFonts({
    "Outfit-Bold": require("../assets/fonts/Outfit-Bold.ttf"),
    "Outfit-Medium": require("../assets/fonts/Outfit-Medium.ttf"),
    "Outfit-Light": require("../assets/fonts/Outfit-Light.ttf"),
    "Outfit-Regular": require("../assets/fonts/Outfit-Regular.ttf"),
    "Outfit-Black": require("../assets/fonts/Outfit-Black.ttf"),

    ...Ionicons.font,
  });
  console.log("Fonts loaded:", fontsLoaded);
  console.log("Font error:", fontError);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Don't render until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <AuthGate>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthGate>
    </ClerkProvider>
  );
}