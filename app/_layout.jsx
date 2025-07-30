import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

// Cache Clerk session token securely
const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) console.log(`${key} was used 🔐`);
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key); // Clean bad cache
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error("SecureStore set item error: ", err);
    }
  },
};

// Gate to control navigation based on authentication
function AuthGate({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Check if the current segment is under /Login/*
  const inLoginGroup = segments[0] === "Login";

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn && !inLoginGroup) {
      router.replace("/Login");
    } else if (isSignedIn && inLoginGroup) {
      router.replace("/(tabs)");
    }
  }, [isLoaded, isSignedIn]);

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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <AuthGate>
        <Stack>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false, }} />
          <Stack.Screen name="Login/index" options={{ headerShown: false }} />
        </Stack>
      </AuthGate>
    </ClerkProvider>
  );
}
