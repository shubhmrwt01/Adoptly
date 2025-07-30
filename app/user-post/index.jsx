import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from 'expo-router';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Colors from '../../constants/Colors';
import PetListItem from './../../components/Home/PetListItem';
import { db } from './../../config/FirebaseConfig';

export default function UserPost() {
  const navigation = useNavigation();
  const { user } = useUser();
  const [userPostList, setUserPostList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'User Posts',
       headerTitleStyle: {
       color:"black",
      fontFamily: 'Medium',
    fontSize: 26,
      },
    });

    if (user) GetUserPost();
  }, [user]);

  // 🔄 Fetch user posts
  const GetUserPost = async () => {
    setLoader(true);
    try {
      const q = query(
        collection(db, 'Pets'),
        where('email', '==', user?.primaryEmailAddress?.emailAddress)
      );
      const querySnapshot = await getDocs(q);

      const posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUserPostList(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setLoader(false);
  };

  // ❌ Confirm Delete
  const onDeletePost = (docId) => {
    Alert.alert(
      'Do you want to delete?',
      'Do you really want to delete this post?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Click'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deletePost(docId),
          style: 'destructive',
        },
      ]
    );
  };

  // 🗑️ Delete from Firestore
  const deletePost = async (docId) => {
    try {
      await deleteDoc(doc(db, 'Pets', docId));
      GetUserPost(); // Refresh after deletion
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <View style={styles.container}>
      {loader && <ActivityIndicator size="large" color={Colors.PRIMARY} style={{ marginVertical: 20 }} />}
      <FlatList
        data={userPostList}
        numColumns={2}
        refreshing={loader}
        onRefresh={GetUserPost}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <PetListItem pet={item} />
            <Pressable
              onPress={() => onDeletePost(item.id)}
              style={styles.deleteBtn}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          !loader && (
            <Text style={styles.emptyText}>No Post Found</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
  },
  itemWrapper: {
    marginBottom: 15,
    marginRight: 10,
  },
  deleteBtn: {
    backgroundColor: Colors.LIGHT_PRIMARY,
    padding: 5,
    borderRadius: 7,
    marginTop: 5,
  },
  deleteText: {
    fontFamily: 'Regular',
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: 'Medium',
    fontSize: 23,
    textAlign: 'center',
    marginTop: '70%',
    color: Colors.GRAY,
  },
});
