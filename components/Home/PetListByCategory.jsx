import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { db } from "../../config/FirebaseConfig";
import Category from "./Category";
import PetListItem from "./PetListItem";

export default function PetListByCategory() {
  const [petList, setPetList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    GetPetList("Dogs");
  }, []);

  const GetPetList = async (category) => {
    setLoader(true);
    setPetList([]);
    const q = query(collection(db, "Pets"), where("category", "==", category));
    const querySnapshot = await getDocs(q);
    const pets = [];

    querySnapshot.forEach((doc) => {
      pets.push({ id: doc.id, ...doc.data() }); // ✅ include unique ID
    });

    setPetList(pets);
    setLoader(false);
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Category category={(value) => GetPetList(value)} />
      <FlatList
        data={petList}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 10 }}
        refreshing={loader}
        onRefresh={() => GetPetList("Dogs")}
        keyExtractor={(item) => item.id} // ✅ Use the unique id from Firestore
        renderItem={({ item }) => <PetListItem pet={item} />}
      />
    </View>
  );
}
