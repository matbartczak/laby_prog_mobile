import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import Cam from './Camera';
import { initDatabase } from './ProductDatabase';
import SavedProductsList from './SavedProductsList';

export default function ActionButton() {
  const [showCamera, setShowCamera] = useState(false);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    initDatabase();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied');
      }
    })();
  }, []);

  if (showCamera) {
    return <Cam onClose={() => setShowCamera(false)} />;
  }

  if (showList) {
    return <SavedProductsList onClose={() => setShowList(false)} />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.scan]}
        onPress={() => setShowCamera(true)}
      >
        <Text style={styles.text}>Skanowanie</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.data]}
        onPress={() => setShowList(true)}
      >
        <Text style={styles.text}>Dane</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 180,
    alignItems: 'center',
    gap: 20,
  },
  button: {
    width: 280,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  scan: { backgroundColor: '#66BB6A' },
  data: { backgroundColor: '#90A4AE' },
  text: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
});
