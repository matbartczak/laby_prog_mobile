import {Text, View, StyleSheet, Image } from 'react-native';
import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import ActionButton from './ActionButton';

interface StudentCardProps{
  name : string;
  surname : string;
  student_id : Int32;
}

export default function StudentCard({name,surname,student_id} : StudentCardProps) {


  return (
    <View style={styles.container}>

      
      <View style={styles.leftColumn}>
        <Image style={styles.logo} source={require('../assets/zdjecie.jpg')} />
      </View>
      
      <View style={styles.midColumn}></View>

      <View style={styles.rightColumn } >

        <Image style={styles.logo2} source={require('../assets/ahe.jpg')} />
        <View />
        <View />
        <Text style={styles.paragraph}  numberOfLines={1} ellipsizeMode="tail"  >
          Name : {name}
        </Text>
        <View />
        <Text style={styles.paragraph}  numberOfLines={1} ellipsizeMode="tail"  >
          Surname : {surname}
        </Text>
        <View />
        <Text style={styles.paragraph}  numberOfLines={1} ellipsizeMode="tail"  >
          Student ID : {student_id}
        </Text>
        <View />
        <View style={{flexDirection:'column', gap: 25 }}>
          <View />
          <View />
        </View>

        <ActionButton/>
        
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: '#fecc42ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 44,
    borderRadius: 5,         // makes it circular if width = height
    borderWidth: 3,           // thickness of the outline
    borderColor: '#79767aff'
  },
    leftColumn: {
    flex: 1,                    // 1 part out of 3
    backgroundColor: '#8fbaeaff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  midColumn: {
    flex: 1,                    // 2 parts out of 3

  },
  rightColumn: {
    flex: 3, 
    flexDirection:'column', 
    gap: 5                    // 2 parts out of 3

  },
  paragraph: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  logo: {
  width: 150,
  height: 170,
  borderRadius: 20,         // makes it circular if width = height
  borderWidth: 5,           // thickness of the outline
  borderColor: '#9a1818ff',   // color of the outline
  },
  logo2: {
  width: 70,
  height: 70,
  borderRadius: 50,       
  },
});
