import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import Colors from "./../../constants/Colors";

export default function UserItem({ userInfo }) {
  return (
    <View style={{ backgroundColor: Colors.WHITE ,}}>
      <Link href={`/chat?id=${userInfo.docId}`} asChild>
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: Colors.WHITE,
          }}
        >
          <Image
            source={{ uri: userInfo?.imageUrl }}
            style={{
              height: 48,
              width: 48,
              borderRadius: 24,
              marginRight: 12,
              borderWidth: 1,
              borderColor: "#eee",

            }}
          />
          <View>
            <Text
              style={{
                fontSize: 18,
                // fontWeight: "500",
                fontFamily: "Medium",
                color: "#111",
              }}
            >
              {userInfo?.name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#666",
                marginTop: 2,
              }}
            >
              Tap to chat →
            </Text>
          </View>
        </Pressable>
      </Link>

      {/* Subtle full-width separator */}
      <View
        style={{
          height: 1,
          backgroundColor: "#F0F0F0",
          marginHorizontal: 16,
        }}
      />
    </View>
  );
}
