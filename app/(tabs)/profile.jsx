import { useAuth, useUser } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";
export default function Profile() {
  const Menu = [
    {
      id: 1,
      name: "Add New Pet",
      icon: "add-circle",
      path: "/add-new-pet",
    },
     {
      id: 5,
      name: "My Post ",
      icon: "bookmark",
      path: "/../user-post",
    },
    {
      id: 2,
      name: "Favorites",
      icon: "heart",
      path: "/(tabs)/favorite",
    },
    {
      id: 3,
      name: "Inbox",
      icon: "chatbubble",
      path: "/(tabs)/inbox",
    },
    {
      id: 4,
      name: "Logout",
      icon: "exit",
      path: "/logout",
    },

  ];
  const { signOut } = useAuth();
  const router = useRouter();
  const { user } = useUser();
  const onPressMenu = (menu) => {
    if (menu.name === "Logout") {
      signOut();
      return;
    }
    router.push(menu.path);
  };

  return (
    <View style={{ padding: 20, marginTop: 20 }}>
      <Text
        style={{
          fontFamily: "Medium",
          fontSize: 30,
        }}
      >Profile</Text>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          marginVertical: 25,
        }}
      >
        <Image
          source={{ uri: user?.imageUrl }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
          }}
        />
        <Text
          style={{
            fontFamily: "Bold",
            fontSize: 20,
            marginTop: 6,
          }}
        >
          {user?.fullName}
        </Text>
        <Text
          style={{
            fontFamily: "Regular",
            fontSize: 16,
            color: Colors.GRAY,
          }}
        >
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>
      <FlatList
        data={Menu}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => onPressMenu(item)}
            style={{
              marginVertical: 12,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: Colors.WHITE,
              padding: 10,
              borderRadius: 14,
            }}
          >
            <Ionicons
              name={item?.icon}
              size={35}
              color={Colors.PRIMARY}
              style={{
                padding: 10,
                backgroundColor: Colors.LIGHT_PRIMARY,
                borderRadius: 14,
              }}
            />
            <Text style={{ fontFamily: "Regular", fontSize: 20 }}>
              {item?.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
