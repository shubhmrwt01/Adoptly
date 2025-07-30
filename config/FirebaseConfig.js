import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "adoptly-b8aef.firebaseapp.com",
  projectId: "adoptly-b8aef",
  storageBucket: "adoptly-b8aef.firebasestorage.app",
  messagingSenderId: "398222686881",
  appId: "1:398222686881:web:fbceeb1f46f0e36961cee0",
  measurementId: "G-BGM9ZNLG24"
};

const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const storage=getStorage(app);











