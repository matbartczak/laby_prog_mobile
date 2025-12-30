import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import type { ParsedProduct } from './ProductData';
import DisplayProductData from './ProductData';
import { Ionicons } from '@expo/vector-icons';

export default function Cam({ onClose }: { onClose: () => void }) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [productData, setProductData] = useState<ParsedProduct | null>(null);
  const [lastScannedBarcode, setLastScannedBarcode] = useState<string | null>(null);
  const scannedRef = useRef(false);

  const handleBarcodeScanned = async (data: string) => {
    setLastScannedBarcode(data);
    setTimeout(() => setLastScannedBarcode(null), 3000);

    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
    const json = await response.json();
    const parsedProduct = parseOpenFoodFactsProduct(json);
    if (parsedProduct) setProductData(parsedProduct);
  };

  function parseOpenFoodFactsProduct(apiResponse: any): ParsedProduct | null {
    if (apiResponse.status !== 1 || !apiResponse.product) return null;
    const product = apiResponse.product;
    return {
      name: product.product_name ?? 'Unknown product',
      category: product.categories_hierarchy?.slice(-1)[0]?.replace('en:', '') ?? 'Unknown category',
      nutriments: {
        salt: product.nutriments?.salt_100g ?? null,
        carbs: product.nutriments?.carbohydrates_100g ?? null,
        fat: product.nutriments?.fat_100g ?? null,
        saturatedFat: product.nutriments?.['saturated-fat_100g'] ?? null,
        sugar: product.nutriments?.sugars_100g ?? null,
        protein: product.nutriments?.proteins_100g ?? null,
        energyKcal: product.nutriments?.['energy-kcal_100g'] ?? null,
      },
    };
  }

  if (!permission) return <View style={styles.container}><Text>Loading camera permissions...</Text></View>;
  if (!permission.granted)
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Camera access is required to scan barcodes</Text>
        <TouchableOpacity onPress={async () => await requestPermission()}>
          <Text style={styles.buttonText}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        onBarcodeScanned={({ data }) => {
          if (!scannedRef.current) {
            scannedRef.current = true;
            handleBarcodeScanned(data);
            setTimeout(() => (scannedRef.current = false), 5000);
          }
        }}
      />

      {/* Górna strzałka */}
      <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
        <Ionicons name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Wskazanie zeskanowanego kodu */}
      {lastScannedBarcode && (
        <View style={styles.barcodeContainer}>
          <Text style={styles.barcodeText}>Zeskanowano: {lastScannedBarcode}</Text>
        </View>
      )}

      {/* Ramka produktu */}
      {productData && <DisplayProductData productData={productData} 
       onClose={() => setProductData(null)} //
       />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  closeIcon: { position: 'absolute', top: 40, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 6, borderRadius: 20, zIndex: 10 },
  barcodeContainer: { position: 'absolute', top: 100, left: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 8, zIndex: 10 },
  barcodeText: { color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  message: { textAlign: 'center', paddingBottom: 150 },
});
