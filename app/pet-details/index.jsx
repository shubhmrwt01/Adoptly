import { useUser } from "@clerk/clerk-expo";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AboutPet from "../../components/PetDetails/AboutPet";
import OwnerInfo from "../../components/PetDetails/OwnerInfo";
import PetInfo from "../../components/PetDetails/PetInfo";
import PetSubInfo from "../../components/PetDetails/PetSubInfo";
import { db } from "../../config/FirebaseConfig";
import Colors from "../../constants/Colors";

const { width, height } = Dimensions.get("window");

export default function PetDetails() {
  const pet = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();
  const router = useRouter();
  const [sendPressed, setSendPressed] = useState(false);

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const petEmail = pet?.email;
  const isOwner = userEmail === petEmail;

  useFocusEffect(
    useCallback(() => {
      setSendPressed(false);
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: "black",
    });
  }, [navigation]);

  const InitiateChat = async () => {
    if (sendPressed || !userEmail || !petEmail) return;

    setSendPressed(true);

    const docId1 = `${userEmail}_${petEmail}`;
    const docId2 = `${petEmail}_${userEmail}`;

    try {
      const q = query(collection(db, "Chat"), where("id", "in", [docId1, docId2]));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingDoc = querySnapshot.docs[0];
        router.push(`/chat?id=${existingDoc.id}`);
        return;
      }

      await setDoc(doc(db, "Chat", docId1), {
        id: docId1,
        users: [
          {
            email: userEmail,
            imageUrl: user?.imageUrl,
            name: user?.fullName,
          },
          {
            email: petEmail,
            imageUrl: pet?.userImage,
            name: pet?.username,
          },
        ],
        userIds: [userEmail, petEmail],
      });

      router.push(`/chat?id=${docId1}`);
    } catch (error) {
      console.error("Error initiating chat:", error);
      setSendPressed(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <PetInfo pet={pet} />
        <PetSubInfo pet={pet} />
        <AboutPet pet={pet} />
        <OwnerInfo
          pet={pet}
          onSendPress={InitiateChat}
          pressed={sendPressed}
          isOwner={isOwner}
        />

        {/* Gap adjusted for different screen sizes */}
        <View style={{ height: height * 0.08 }} />
      </ScrollView>

      {!isOwner && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            onPress={InitiateChat}
            style={[
              styles.adoptBtn,
              sendPressed && { opacity: 0.6 },
              { paddingVertical: height * 0.018 }, // responsive padding
            ]}
            disabled={sendPressed}
          >
            <Text style={styles.adoptText}>Adopt Me</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  adoptBtn: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
  },
  bottomContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
  adoptText: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Medium",
  },
});
