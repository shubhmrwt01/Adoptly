import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Colors from '../../constants/Colors';

export default function AboutPet({pet}) {
    const [readMore,setReadMore]=useState(true);
  return (
    <View style={{
        padding:20
    }}>
      <Text style={{
        fontFamily:'Bold',
        fontSize:20
      }}>About {pet?.name}</Text>
      <Text 
      numberOfLines={readMore?3:40}
       style={{
        fontFamily:'Regular',
        fontSize:14
      }}>{pet?.about} </Text>
        {readMore&&
        <Pressable onPress={()=>setReadMore(false)}>
             <Text style={{
            fontFamily:'Medium',
            fontSize:14,
            color:Colors.SECONDARY
        }}>Read More</Text>
        </Pressable>
        }
         {!readMore&&
        <Pressable onPress={()=>setReadMore(true)}>
             <Text style={{
            fontFamily:'Medium',
            fontSize:14,
            color:Colors.SECONDARY
        }}>Show Less</Text>
        </Pressable>
        }     
    </View>
  )
}