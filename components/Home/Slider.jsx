import * as Linking from "expo-linking";
import * as Location from "expo-location";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "./../../config/FirebaseConfig";

export default function Slider() {
  const [sliderList, setSliderList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetSliders();
  }, []);

  const GetSliders = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Sliders"));
      const sliders = snapshot.docs.map((doc) => doc.data());
      setSliderList(sliders);
    } catch (error) {
      console.error("Error fetching sliders:", error);
    }
  };

  const handleImagePress = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to open the nearest adoption center."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const [address] = await Location.reverseGeocodeAsync(location.coords);

      if (address?.city) {
        const city = address.city.toLowerCase().replace(/\s+/g, "");
        const dynamicUrl = `https://www.justdial.com/${city}/Pet-Adoption-Centres/nct-11469363`;
        Linking.openURL(dynamicUrl);
      } else {
        Alert.alert("City not found", "We couldn't determine your city.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while fetching location.");
      console.error("Location error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ marginTop: 15 }}>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#999"
          style={{ marginBottom: 10 }}
        />
      )}
      <FlatList
        horizontal
        data={sliderList}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={handleImagePress}>
            <Image
              source={{ uri: item?.imageUrl }}
              style={styles.sliderImage}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sliderImage: {
    width: Dimensions.get("screen").width * 0.9,
    height: 170,
    borderRadius: 15,
    marginRight: 15,
  },
});
