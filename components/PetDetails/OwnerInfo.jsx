import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";

export default function OwnerInfo({ pet, onSendPress, pressed, isOwner }) {
  const handlePress = async () => {
    if (onSendPress) {
      await onSendPress(); // Trigger chat initiation
    }
  };

  return (
    <Pressable
      onPress={!isOwner ? handlePress : undefined}
      style={styles.ownerInfo}
    >
      <View style={styles.userInfoRow}>
        <Image
          source={{ uri: pet?.userImage }}
          style={styles.userImage}
        />
        <View>
          <Text style={styles.username}>{pet?.username}</Text>
          <Text style={styles.label}>Pet Owner</Text>
        </View>
      </View>

      {/* Show send icon only if NOT owner */}
      {!isOwner && (
        <Ionicons
          name="send"
          size={24}
          color={pressed ? "green" : "black"}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ownerInfo: {
    marginHorizontal: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.PRIMARY,
    padding: 10,
    backgroundColor: Colors.WHITE,
    justifyContent: 'space-between'
  },
  userInfoRow: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center'
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 40,
  },
  username: {
    fontFamily: "Medium",
    fontSize: 17,
  },
  label: {
    fontFamily: "Regular",
    color: Colors.GRAY,
  },
});
