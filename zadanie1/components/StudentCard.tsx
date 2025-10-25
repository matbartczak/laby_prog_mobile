import { Animated,Text, View, StyleSheet, Image, Alert,TouchableOpacity,TouchableWithoutFeedback } from 'react-native';
import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import React, { useRef } from 'react';
const alert_text = '-----';



interface StudentCardProps{
  name : string;
  surname : string;
  student_id : Int32;
}

export default function StudentCard({name,surname,student_id} : StudentCardProps) {
  
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.5,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 2,
      tension: 10,
      useNativeDriver: true,
    }).start(() => {
      // ✅ Run your alert after animation finishes
      Alert.alert('Student Info', `Name: ${name}\nSurname: ${surname}\nID: ${student_id}`);
    });
  };



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


        <View style={styles.buttonContainer} >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut}>
                <Animated.View style={styles.buttonContainer}>
                  <Text style={styles.buttonText}>Show Info</Text>
                </Animated.View>
              </TouchableWithoutFeedback>
            </Animated.View>
        </View>
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
  buttonContainer: {
    alignItems: 'center',
    backgroundColor: '#4a4a4aff',
    borderRadius: 25,
    marginHorizontal: 5,
    padding: 10,
  },
  buttonText: {
    color: '#ffffffff',
    fontSize: 15,
    fontWeight: 'bold',
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
