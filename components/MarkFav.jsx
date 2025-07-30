import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import Shared from "./../Shared/Shared";

export default function MarkFav({ pet, color = "black", onFavChange }) {
  const { user } = useUser();
  const [favList, setFavList] = useState([]);

  useEffect(() => {
    user && GetFav();
  }, [user]);

  const GetFav = async () => {
    const result = await Shared.GetFavList(user);
    setFavList(result?.favorites || []);
  };

  const AddToFav = async () => {
    const favResult = [...favList, pet.id];
    await Shared.UpdateFav(user, favResult);
    setFavList(favResult);
    if (onFavChange) onFavChange();  // ✅ notify parent
  };

  const RemoveFromFav = async () => {
    const favResult = favList.filter((item) => item !== pet.id);
    await Shared.UpdateFav(user, favResult);
    setFavList(favResult);
    if (onFavChange) onFavChange();  // ✅ notify parent
  };

  const isFav = favList.includes(pet.id);

  return (
    <Pressable onPress={isFav ? RemoveFromFav : AddToFav}>
      <Ionicons name={isFav ? "heart" : "heart-outline"} size={30} color={isFav ? "red" : color} />
    </Pressable>
  );
}
