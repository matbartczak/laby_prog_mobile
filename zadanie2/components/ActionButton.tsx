import {Animated,View,Text,StyleSheet, Alert,TouchableWithoutFeedback, Linking  } from 'react-native';
import React, { useRef } from 'react';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';


const sendSMS = (phoneNumber : string, 
                message : string) => {
    const url = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

export default function ActionButton() {

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

    // --- Get phone location on mount ---
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
      
      const lat = location?.coords?.latitude;
      const lon = location?.coords?.longitude;

      const msg = location
        ? `Current location:\nLatitude: ${lat}\nLongitude: ${lon}`
        : "Location not available";
      sendSMS("690190820", msg)
    });
  };

  return(
    <View style={styles.buttonContainer} >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut}>
                <Animated.View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Show Info</Text>
                </Animated.View>
            </TouchableWithoutFeedback>
        </Animated.View>
    </View>
)}

const styles = StyleSheet.create({
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