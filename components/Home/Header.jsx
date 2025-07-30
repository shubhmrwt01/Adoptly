import { useUser } from '@clerk/clerk-expo';
import { Image, Text, View } from 'react-native';

export default function Header() {
    const {user}=useUser();
  return (
    <View style={{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    }}>
      <View>
        <Text style={{
            fontFamily:"Medium",
            fontSize:20
        }}>Welcome, </Text>
        <Text style={{
            fontFamily:'Bold',
            fontSize:25
        }}>{user?.fullName}</Text>
      </View>
      <Image source={{uri:user?.imageUrl}} style={{
        height:40,
        width:40,
        borderRadius:99
      }}/>
    </View>
  )
}