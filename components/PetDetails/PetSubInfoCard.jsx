import { Image, Text, View } from 'react-native'
import Colors from '../../constants/Colors'

export default function PetSubInfoCard({icon,title,value}) {
  return (
    <View style={{
               display:'flex',
               flexDirection:'row',
               alignItems:'center',
               backgroundColor:Colors.WHITE,
               padding:10,
               margin:5,
               borderRadius:8,
               gap:10,
               flex:1  
           }}>
               <Image source={icon}
               style={{
                   width:40,
                   height:40
               }}
               />
               <View style={{
                flex:1
               }}>
                   <Text style={{
                       fontFamily:'Regular',
                       fontSize:16,
                       color:Colors.GRAY
                   }}>{title}</Text>
                   <Text style={{
                       fontFamily:'Medium',
                       fontSize:18,
                       fontWeight:600
                   }}>{value}</Text>
               </View>
           </View>
  )
}