import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Header from "../../components/Home/Header";
import PetListByCategory from "../../components/Home/PetListByCategory";
import Slider from "../../components/Home/Slider";
import Colors from "../../constants/Colors";
import ChatBot from "./../../components/ChatBot";

export default function Home() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Scrollable  Content */}
      <View style={styles.content}>
        {/* Header */}
        <Header />
        {/* Slider */}
        <Slider />
        {/* Pet List + Category */}
        <PetListByCategory />
        {/* Add New Pet Options */}
        <Pressable
          onPress={() => router.push("/add-new-pet")}
          style={({ pressed }) => [
            styles.addNewPetContainer,
            {
              backgroundColor: pressed ? Colors.PRIMARY : Colors.LIGHT_PRIMARY,
            },
          ]}
        >
          {({ pressed }) => (
            <>
              <MaterialIcons
                name="pets"
                size={24}
                color={pressed ? Colors.WHITE : Colors.PRIMARY}
              />
              <Text
                style={[
                  styles.addNewPetText,
                  { color: pressed ? Colors.WHITE : Colors.PRIMARY },
                ]}
              >
                Add New Pet
              </Text>
            </>
          )}
        </Pressable>
      </View>

      {/* Fixed ChatBot Button */}
      <ChatBot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: 30,
  },
  addNewPetContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 12,
    marginTop: 20,
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 15,
    borderStyle: "dashed",
    justifyContent: "center",
    textAlign: "center",
  },
  addNewPetText: {
    fontFamily: "Bold",
    fontSize: 22,
  },
});
