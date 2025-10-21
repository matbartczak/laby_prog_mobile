import { Text, View, StyleSheet, Image, Button, Alert,TouchableOpacity } from 'react-native';

const alert_text = '-----';

function DisplayAlert() {
  Alert.alert('Simple Button 1')
}

interface StudentCardProps{
  name : string;
  surname : string;
}

export default function StudentCard({name,surname} : StudentCardProps) {
  
  return (
    <View style={styles.container}>

      
      <View style={styles.leftColumn}>
        <Image style={styles.logo} source={require('../assets/zdjecie.jpg')} />
      </View>
      
      <View style={styles.midColumn}></View>

      <View style={styles.rightColumn}>

        <Text style={styles.paragraph}  numberOfLines={1} ellipsizeMode="tail"  >
          Name : {name}
        </Text>

        <Text style={styles.paragraph}  numberOfLines={1} ellipsizeMode="tail"  >
          Surname : {surname}
        </Text>

        <View style={{flexDirection:'column', gap: 25 }}>
          <View />
          <View />
        </View>

        <View style={styles.buttonContainer} >
        <TouchableOpacity style={styles.buttonContainer} onPress={DisplayAlert}>
          <Text style={styles.buttonText}>Przycisk</Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
/* 

      <View style={styles.buttonContainer} >
      <TouchableOpacity style={styles.buttonContainer} onPress={DisplayAlert}>
        <Text style={styles.buttonText}>Przycisk</Text>
      </TouchableOpacity>

      </View> */


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
    padding: 44,
  },
    leftColumn: {
    flex: 1,                    // 1 part out of 3
    backgroundColor: '#EAB68F',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  midColumn: {
    flex: 1,                    // 2 parts out of 3

  },
  rightColumn: {
    flex: 3,                    // 2 parts out of 3

  },
  buttonContainer: {
    alignItems: 'center',
    backgroundColor: '#4a4a4aff',
    borderRadius: 55,
    marginHorizontal: 5,
    padding: 10,
  },
  buttonText: {
    color: '#ffffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  logo: {
    height: 128,
    width: 128,
  },
});
