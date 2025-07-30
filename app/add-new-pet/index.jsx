import { useUser } from "@clerk/clerk-expo";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRouter } from "expo-router";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
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
import { db, storage } from "../../config/FirebaseConfig";
import Colors from "./../../constants/Colors";

export default function AddNewPet() {
  const { user } = useUser();
  const navigation = useNavigation();
  const router = useRouter();

  const [formData, setFormData] = useState({ category: "Dogs", sex: "Male" });
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [image, setImage] = useState();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add New Pet",
      headerTintColor: "black",
      headerTitleStyle: {
        fontSize: 24,
        fontFamily: "Medium",
        color: "black",
      },
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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const requiredFields = [
    "name",
    "category",
    "breed",
    "age",
    "sex",
    "weight",
    "address",
    "about",
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

    uploadImage();
  };

  const uploadImage = async () => {
    setLoader(true);
    const resp = await fetch(image);
    const blobImage = await resp.blob();
    const storageRef = ref(storage, "/Adoptly" + Date.now() + ".jpg");

    uploadBytes(storageRef, blobImage)
      .then(() => {
        getDownloadURL(storageRef).then(async (downloadUrl) => {
          saveFormData(downloadUrl);
        });
      })
      .catch(() => {
        setLoader(false);
      });
  };

  const saveFormData = async (imageUrl) => {
    const docId = Date.now().toString();
    await setDoc(doc(db, "Pets", docId), {
      ...formData,
      imageUrl: imageUrl,
      username: user?.fullName,
      email: user?.primaryEmailAddress?.emailAddress,
      userImage: user?.imageUrl,
      id: docId,
    });
    setLoader(false);
    router.replace("/(tabs)/home");
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

          {/* Image Upload */}
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

          {/* Pet Details */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Pet Details</Text>

            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter pet name"
              placeholderTextColor="#A9A9A9"
              onChangeText={(value) => handleInputChange("name", value)}
            />

            <Text style={styles.label}>Category *</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue) => {
                  setSelectedCategory(itemValue);
                  handleInputChange("category", itemValue);
                }}
              >
                {categoryList.map((category, index) => (
                  <Picker.Item
                    key={index}
                    label={category.name}
                    value={category.name}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Breed *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter breed"
              placeholderTextColor="#A9A9A9"
              onChangeText={(value) => handleInputChange("breed", value)}
            />

            <Text style={styles.label}>Age *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter age in years"
              placeholderTextColor="#A9A9A9"
              keyboardType="numeric"
              onChangeText={(value) => handleInputChange("age", value)}
            />

            <Text style={styles.label}>Gender *</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.sex}
                onValueChange={(itemValue) => handleInputChange("sex", itemValue)}
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
              onChangeText={(value) => handleInputChange("weight", value)}
            />
          </View>

          {/* Location & Bio */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Location & Bio</Text>

            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mumbai, India"
              placeholderTextColor="#A9A9A9"
              onChangeText={(value) => handleInputChange("address", value)}
            />

            <Text style={styles.label}>About *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us something about the pet"
              placeholderTextColor="#A9A9A9"
              numberOfLines={4}
              multiline
              onChangeText={(value) => handleInputChange("about", value)}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={onSubmit}
            disabled={loader}
          >
            {loader ? (
              <ActivityIndicator color={Colors.WHITE} />
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

/** ---------- STYLES ---------- **/
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: "Bold",
    marginBottom: 20,
    textAlign: "center",
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 75,
    borderColor: Colors.GRAY,
    borderWidth: 1,
  },
  imageHint: {
    fontSize: 12,
    color: Colors.GRAY,
    marginTop: 8,
    marginLeft: 20,
  },
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontFamily: "Medium",
    fontSize: 18,
    marginBottom: 10,
  },
  label: {
    marginTop: 10,
    fontFamily: "Regular",
    marginBottom: 4,
  },
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
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  buttonText: {
    textAlign: "center",
    color: Colors.WHITE,
    fontSize: 20,
    fontFamily: "Medium",
  },
});
