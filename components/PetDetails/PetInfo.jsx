import { Image, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import MarkFav from "../MarkFav";
export default function PetInfo({ pet }) {
  return (
    <View>
      <Image
        source={{ uri: pet?.imageUrl }}
        style={{
          width: "100%",
          height: 430,
          objectFit: "cover",
        }}
      />
      <View
        style={{
          padding: 20,
          display:'flex',
          flexDirection:'row',
          justifyContent:'space-between',
          alignItems:'center'
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: "Bold",
              fontSize: 30,
            }}
          >{pet?.name}</Text>
          <Text
            style={{
              fontSize: 14,
              color: Colors.GRAY,
            }}
          >{pet?.address}</Text>
        </View>
         <View>
         </View>
         <MarkFav pet={pet}/>
      </View>
    </View>
  );
}
