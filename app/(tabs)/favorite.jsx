import { useUser } from '@clerk/clerk-expo';
import { useFocusEffect } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { db } from '../../config/FirebaseConfig';
import Shared from './../../Shared/Shared';
import ChatBot from './../../components/ChatBot';
import PetListItem from './../../components/Home/PetListItem';
export default function Favorite() {
  const { user } = useUser();
  const [favPetList, setFavPetList] = useState([]);
  const [loader, setLoader] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (user) GetFavPetIds();
    }, [user])
  );

  const GetFavPetIds = async () => {
    setLoader(true);
    const result = await Shared.GetFavList(user);
    const favIds = result?.favorites || [];
    await GetFavPetList(favIds);
    setLoader(false);
  };

  const GetFavPetList = async (favId_) => {
    if (!favId_ || favId_.length === 0) {
      setFavPetList([]);
      return;
    }

    const q = query(collection(db, 'Pets'), where('id', 'in', favId_));
    const querySnapshot = await getDocs(q);
    const pets = querySnapshot.docs.map(doc => doc.data());
    setFavPetList(pets);
  };

  return (
    <View style={{ padding: 20, marginTop: 20 , flex: 1,
    position: "relative",}}>
      <Text style={{ fontFamily: 'Medium', fontSize: 30 }}>Favorites</Text>

      <FlatList
        data={favPetList}
        numColumns={2}
        keyExtractor={(item) => item.id}
        onRefresh={GetFavPetIds}
        refreshing={loader}
        renderItem={({ item }) => (
          <View>
            <PetListItem pet={item} onFavChange={GetFavPetIds} />
          </View>
        )}
      />
       <ChatBot />
    </View>
  );
}
