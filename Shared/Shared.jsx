import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from './../config/FirebaseConfig';
const GetFavList = async (user) => {
  const docRef = doc(db, 'UserFavPet', user?.primaryEmailAddress?.emailAddress);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    const newData = {
      email: user?.primaryEmailAddress?.emailAddress,
      favorites: []
    };
    await setDoc(docRef, newData);
    return newData; // return initialized data
  }
};

const UpdateFav=async(user,favorites)=>{
    const docRef=doc(db,'UserFavPet',user?.primaryEmailAddress?.emailAddress);
    try{
        await updateDoc(docRef,{
            favorites:favorites
        })
    }catch(e){

    }
}
export default{
    GetFavList,
    UpdateFav
}