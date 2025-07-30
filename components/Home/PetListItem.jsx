import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';
import MarkFav from './../../components/MarkFav';

export default function PetListItem({ pet, onFavChange }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push({
        pathname: '/pet-details',
        params: pet
      })}
      style={{
        padding: 10,
        marginRight: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 10
      }}>
      <View style={{
        position: 'absolute',
        zIndex: 2,
        right: 10,
        top: 10
      }}>
        <MarkFav pet={pet} color={'white'} onFavChange={onFavChange} />
      </View>
      <Image
        source={{ uri: pet?.imageUrl }}
        style={{
          width: 150,
          height: 135,
          objectFit: 'cover',
          borderRadius: 10
        }}
      />
      <Text style={{
        fontFamily: 'Medium',
        fontSize: 18,
        textAlign: 'center'
      }}>{pet?.name}</Text>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Text style={{
          color: Colors.GRAY,
          fontFamily: 'Regular'
        }}>{pet?.breed}</Text>
        <Text style={{
          color: Colors.PRIMARY,
          fontFamily: 'Regular',
          fontSize: 11,
          backgroundColor: Colors.LIGHT_PRIMARY
        }}>{pet?.age} YRS</Text>
      </View>
    </TouchableOpacity>
  );
}
