

import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


// or any files within the Snack
import ActionButton from './components/ActionButton';


export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
      </Text>
        <ActionButton/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});



