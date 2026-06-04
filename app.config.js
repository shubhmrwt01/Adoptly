import "dotenv/config";

export default ({ config }) => ({
  ...config,
  name: "Adoptly",
  slug: "Adoptly",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "adoptly",
  userInterfaceStyle: "light",
  newArchEnabled: false,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.shubhmrwt01.adoptly",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.shubhmrwt01.adoptly",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "The app accesses your photos to let you share them with your friends.",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: "27d160e0-e8ff-4bca-afd0-40f9a0a1a119",
    },
    geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY, // Loaded from .env
  },
});
