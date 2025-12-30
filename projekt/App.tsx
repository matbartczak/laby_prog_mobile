import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import ActionButton from './components/ActionButton';

export default function App() {
  return (
    <ImageBackground
      source={require('./assets/main_page.png')}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ opacity: 0.5 }}
    >
      <ActionButton />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
