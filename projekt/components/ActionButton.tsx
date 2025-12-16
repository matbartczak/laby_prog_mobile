import {Animated,View,Text,StyleSheet, Alert,TouchableOpacity, Linking  } from 'react-native';
import React, { useRef } from 'react';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import Cam from './Camera';
import { initDatabase, deleteAllProducts } from './ProductDatabase'
import SavedProductsList from './SavedProductsList'



const sendSMS = (phoneNumber : string, 
                message : string) => {
    const url = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

export default function ActionButton() {

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showList, setShowList] = useState(false);
  
  useEffect(() => {
    initDatabase();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);
  


  const onPress = () => {
      
      setShowCamera(true);
      /* const lat = location?.coords?.latitude;
      const lon = location?.coords?.longitude;

      const msg = location
        ? `Current location:\nLatitude: ${lat}\nLongitude: ${lon}`
        : "Location not available";
      sendSMS("690190820", msg) */
  };
    const onPressList = () => {
      //deleteAllProducts()
      setShowList(true);
      //getTodayProducts()
    };

  return (
  <>
      {showCamera ? (
        <Cam onClose={() => setShowCamera(false)} />
      ) : showList ? (
        <View style={{ flex: 1 }}>
          <SavedProductsList />

          <TouchableOpacity
            style={[styles.buttonContainer, { alignSelf: 'center', marginTop: 16 }]}
            onPress={() => setShowList(false)}
          >
            <Text style={styles.buttonText}>Cofnij</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.previewButtons}>
          <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
            <Text style={styles.buttonText}>Skanowanie</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonContainer} onPress={onPressList}>
            <Text style={styles.buttonText}>Dane</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
);}

const styles = StyleSheet.create({
  previewButtons: {

    flexDirection: 'column',
    gap: 16,
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
  }
})