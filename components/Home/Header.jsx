import { useUser } from '@clerk/clerk-expo';
import { Image, Text, View } from 'react-native';

export default function Header() {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "☀️ Good Morning"
      : hour < 18
        ? "🌤️ Good Afternoon"
        : "🌙 Good Evening";
  const { user } = useUser();
  return (
    <View style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <View>
        <Text style={{
          fontFamily: "Outfit-Medium",
          fontSize: 20
        }}>{greeting}, </Text>
        <Text style={{
          fontFamily: 'Outfit-Bold',
          fontSize: 25
        }}>{user?.firstName}</Text>
      </View>
      <Image
        source={
          user?.imageUrl
            ? { uri: user.imageUrl }
            : require("../../assets/images/user.png")
        }
        style={{
          height: 40,
          width: 40,
          borderRadius: 99
        }}
      />
    </View>
  )
}