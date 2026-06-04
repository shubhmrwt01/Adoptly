import { useUser } from "@clerk/clerk-expo";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRouter } from "expo-router";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { db } from "../../config/FirebaseConfig";
import Colors from "./../../constants/Colors";

// ── Cloudinary config (via .env) ──────────────────────────────────────────────
const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export default function AddNewPet() {
  const { user } = useUser();
  const navigation = useNavigation();
  const router = useRouter();

  const [formData, setFormData] = useState({ category: "Dogs", sex: "Male" });
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [image, setImage] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add New Pet",
      headerTintColor: "black",
      headerTitleStyle: { fontSize: 24, fontFamily: "Medium", color: "black" },
    });
    GetCategories();
  }, []);

  const GetCategories = async () => {
    setCategoryList([]);
    const snapshot = await getDocs(collection(db, "Category"));
    snapshot.forEach((doc) => {
      setCategoryList((prev) => [...prev, doc.data()]);
    });
  };

  const imagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8, // slight compression keeps uploads fast
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({ ...prev, [fieldName]: fieldValue }));
  };

  const requiredFields = [
    "name", "category", "breed", "age",
    "sex", "weight", "address", "about",
  ];

  const onSubmit = () => {
    for (const field of requiredFields) {
      if (!formData[field]) {
        ToastAndroid.show(`Please fill in ${field}`, ToastAndroid.SHORT);
        return;
      }
    }
    if (!image) {
      ToastAndroid.show("Please upload a pet image", ToastAndroid.SHORT);
      return;
    }
    uploadToCloudinary();
  };

  // ── Upload to Cloudinary via unsigned preset ─────────────────────────────────
  const uploadToCloudinary = async () => {
    setLoader(true);
    try {
      // Build FormData — React Native requires uri/type/name format
      const fileName = image.split("/").pop();
      const fileType = fileName.split(".").pop();

      const formDataPayload = new FormData();
      formDataPayload.append("file", {
        uri: image,
        type: `image/${fileType}`,
        name: fileName,
      });
      formDataPayload.append("upload_preset", UPLOAD_PRESET);
      formDataPayload.append("folder", "adoptly/pets"); // organises uploads in Cloudinary

      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formDataPayload,
        // Do NOT set Content-Type — let fetch set multipart/form-data boundary automatically
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error?.message || "Upload failed");
      }

      const data = await response.json();
      await saveFormData(data.secure_url); // HTTPS URL from Cloudinary
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      ToastAndroid.show("Image upload failed. Try again.", ToastAndroid.LONG);
      setLoader(false);
    }
  };

  // ── Save rest of data to Firestore ───────────────────────────────────────────
  const saveFormData = async (imageUrl) => {
    try {
      const docId = Date.now().toString();
      await setDoc(doc(db, "Pets", docId), {
        ...formData,
        imageUrl,                    // Cloudinary CDN URL stored here
        username: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        userImage: user?.imageUrl,
        id: docId,
      });
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Firestore save error:", error);
      ToastAndroid.show("Failed to save pet data.", ToastAndroid.LONG);
    } finally {
      setLoader(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.BACKGROUND }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>🐾 Add New Pet for Adoption</Text>

          {/* ── Image Upload ── */}
          <View style={styles.imageWrapper}>
            <Pressable onPress={imagePicker}>
              <Image
                source={
                  image
                    ? { uri: image }
                    : require("./../../assets/images/placeholder.png")
                }
                style={styles.image}
              />
              <Text style={styles.imageHint}>Tap to upload photo</Text>
            </Pressable>
          </View>

          {/* ── Pet Details ── */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Pet Details</Text>

            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter pet name"
              placeholderTextColor="#A9A9A9"
              onChangeText={(v) => handleInputChange("name", v)}
            />

            <Text style={styles.label}>Category *</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(v) => {
                  setSelectedCategory(v);
                  handleInputChange("category", v);
                }}
              >
                {categoryList.map((cat, i) => (
                  <Picker.Item key={i} label={cat.name} value={cat.name} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Breed *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter breed"
              placeholderTextColor="#A9A9A9"
              onChangeText={(v) => handleInputChange("breed", v)}
            />

            <Text style={styles.label}>Age *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter age in years"
              placeholderTextColor="#A9A9A9"
              keyboardType="numeric"
              onChangeText={(v) => handleInputChange("age", v)}
            />

            <Text style={styles.label}>Gender *</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.sex}
                onValueChange={(v) => handleInputChange("sex", v)}
              >
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>

            <Text style={styles.label}>Weight (kg) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 12.5"
              placeholderTextColor="#A9A9A9"
              keyboardType="numeric"
              onChangeText={(v) => handleInputChange("weight", v)}
            />
          </View>

          {/* ── Location & Bio ── */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Location & Bio</Text>

            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mumbai, India"
              placeholderTextColor="#A9A9A9"
              onChangeText={(v) => handleInputChange("address", v)}
            />

            <Text style={styles.label}>About *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us something about the pet"
              placeholderTextColor="#A9A9A9"
              numberOfLines={4}
              multiline
              onChangeText={(v) => handleInputChange("about", v)}
            />
          </View>

          {/* ── Submit ── */}
          <TouchableOpacity
            style={styles.button}
            onPress={onSubmit}
            disabled={loader}
          >
            {loader ? (
              <View style={styles.loaderRow}>
                <ActivityIndicator color={Colors.WHITE} />
                <Text style={[styles.buttonText, { marginLeft: 10 }]}>
                  Uploading...
                </Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: "Bold",
    marginBottom: 20,
    textAlign: "center",
  },
  imageWrapper: { alignItems: "center", marginBottom: 20 },
  image: {
    width: 140,
    height: 140,
    borderRadius: 75,
    borderColor: Colors.GRAY,
    borderWidth: 1,
  },
  imageHint: { fontSize: 12, color: Colors.GRAY, marginTop: 8, marginLeft: 20 },
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: { fontFamily: "Medium", fontSize: 18, marginBottom: 10 },
  label: { marginTop: 10, fontFamily: "Regular", marginBottom: 4 },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    fontFamily: "Regular",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  pickerWrapper: {
    borderRadius: 8,
    overflow: "hidden",
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#f9f9f9",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  loaderRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    textAlign: "center",
    color: Colors.WHITE,
    fontSize: 20,
    fontFamily: "Medium",
  },
});