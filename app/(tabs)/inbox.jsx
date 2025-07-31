import { useUser } from '@clerk/clerk-expo';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import ChatBot from '../../components/ChatBot';
import UserItem from '../../components/Inbox/UserItem';
import { db } from './../../config/FirebaseConfig';

export default function Inbox() {
  const { user } = useUser();
  const [userList, setUserList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (user) {
      GetUserList();
    }
  }, [user]);

  const GetUserList = async () => {
    setLoader(true);
    setUserList([]);
    try {
      const q = query(
        collection(db, 'Chat'),
        where('userIds', 'array-contains', user?.primaryEmailAddress?.emailAddress)
      );
      const querySnapshot = await getDocs(q);
      const chatList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserList(chatList);
    } catch (error) {
      console.error('Error fetching user chats:', error);
    }
    setLoader(false);
  };

  const MapOtherUserList = () => {
    return userList
      .map((record) => {
        const other = record?.users?.filter(
          u => u?.email !== user?.primaryEmailAddress?.emailAddress
        );
        if (!other?.[0]) return null;

        return {
          docId: record.id,
          ...other[0],
        };
      })
      .filter(Boolean); 
  };

  return (
    <View style={{ padding: 20, paddingTop: 40, flex: 1, backgroundColor: "#F1F1F1" }}>
      <Text style={{ fontFamily: 'Medium', fontSize: 28, marginBottom: 16 }}>
        Inbox
      </Text>

      {loader && (
        <ActivityIndicator size="large" color="#0A84FF" style={{ marginTop: 20 }} />
      )}

      {!loader && MapOtherUserList().length === 0 && (
        <Text style={{ textAlign: 'center', color: '#666', marginTop: 30 }}>
          No conversations found.
        </Text>
      )}

      <FlatList
        data={MapOtherUserList()}
        refreshing={loader}
        onRefresh={GetUserList}
        keyExtractor={(item) => item.docId}
        renderItem={({ item }) => <UserItem userInfo={item} />}
        contentContainerStyle={{ gap: 14, paddingBottom: 40 }}
      />
      <ChatBot/>
    </View>
  );
}
