import { memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";

const MessageItem = memo(({ item }) => {
  if (item.type === "pet-card") {
    const pet = item.pet;
    return (
      <View style={styles.petCard}>
        {item.showImage && (
          <Image source={{ uri: pet.imageUrl }} style={styles.petImageTop} />
        )}
        <View style={styles.petCardContent}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petDetail}>
            Breed: <Text style={styles.petData}>{pet.breed}</Text>
          </Text>
          <Text style={styles.petDetail}>
            Category: <Text style={styles.petData}>{pet.category}</Text>
          </Text>
          <Text style={styles.petDetail}>
            Age: <Text style={styles.petData}>{pet.age} yrs</Text>
          </Text>
          <Text style={styles.petDetail}>
            Weight: <Text style={styles.petData}>{pet.weight} kg</Text>
          </Text>
          <Text style={styles.petDetail}>
            Gender: <Text style={styles.petData}>{pet.sex}</Text>
          </Text>
          <Text style={styles.petDetail}>
            Location: <Text style={styles.petData}>{pet.address}</Text>
          </Text>
          <Text style={styles.petDetail}>
            About: <Text style={styles.petData}>{pet.about}</Text>
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.messageBubble,
        item.role === "user" ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text style={{ color: item.role === "user" ? "#fff" : "#000" }}>
        {item.text}
      </Text>
    </View>
  );
}, (prev, next) => prev.item.id === next.item.id);
// ↑ Custom comparator — only re-renders if item id changes

export default MessageItem;

const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 12,
    marginVertical: 5,
  },
  userBubble: {
    backgroundColor: Colors.PRIMARY,
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  botBubble: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  petCard: {
    width: "80%",
    alignSelf: "stretch",
    backgroundColor: "#fff1c9",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  petImageTop: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  petCardContent: { padding: 12 },
  petName: {

    fontSize: 27,
    marginBottom: 6,
    textAlign: "center",
  },
  petDetail: {
    fontSize: 18,
    color: "Black",

    marginBottom: 2,
  },
  petData: {
    fontSize: 16,
    color: Colors.GRAY,

  },
});