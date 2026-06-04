import {
  Dimensions,
  Image,
  StyleSheet,
  View
} from "react-native";

export default function Slider() {
  return (
    <View style={{ marginTop: 15 }}>
      <Image
        source={{ uri: item?.imageUrl }}
        style={styles.sliderImage}
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
