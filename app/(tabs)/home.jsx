import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Home/Header";
import PetListByCategory from "../../components/Home/PetListByCategory";
import Colors from "../../constants/Colors";
import ChatBot from "./../../components/ChatBot";
export default function Home() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      {/* Scrollable  Content */}
      <View style={styles.content}>
        {/* Header */}
        <Header />
        <View style={{ marginTop: 15 }}>
          <Image
            source={require('../../assets/images/slider.png')}
            style={styles.sliderImage}
          />
        </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,

  },
  sliderImage: {
    width: Dimensions.get("screen").width * 0.9,
    height: 200,
    borderRadius: 15,
    marginRight: 15,
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
    fontFamily: "Outfit-Bold",
    fontSize: 22,
  },
});
