import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, Text, TouchableOpacity, View,StyleSheet,Image } from 'react-native';
import type { ParsedProduct } from './ProductData';
import DisplayProductData from './ProductData';




export default function Cam({ onClose }: { onClose: () => void })  {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  //const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [productData, setProductData] = useState<ParsedProduct | null>(null);
  const [lastScannedBarcode, setLastScannedBarcode] = useState<string | null>(null);
  const scannedRef = useRef(false);




  const handleBarcodeScanned = async (data: string) => {
    setLastScannedBarcode(data);
    setTimeout(() => {
      setLastScannedBarcode(null);
    }, 3000);

    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${data}.json`
    );
    const json = await response.json();

    const parsedProduct = parseOpenFoodFactsProduct(json);

    if (parsedProduct) {
      setProductData(parsedProduct);
    }
    
  };


  function parseOpenFoodFactsProduct(apiResponse: any): ParsedProduct | null {
    if (apiResponse.status !== 1 || !apiResponse.product) {
      return null;
  }

  const product = apiResponse.product;

  return {
    name: product.product_name ?? "Unknown product",

    category:
      product.categories_hierarchy?.slice(-1)[0]?.replace("en:", "") ??
      "Unknown category",

    nutriments: {
      salt: product.nutriments?.salt_100g ?? null,
      carbs: product.nutriments?.carbohydrates_100g ?? null,
      fat: product.nutriments?.fat_100g ?? null,
      saturatedFat: product.nutriments?.["saturated-fat_100g"] ?? null,
      sugar: product.nutriments?.sugars_100g ?? null,
      protein: product.nutriments?.proteins_100g ?? null,
      energyKcal: product.nutriments?.["energy-kcal_100g"] ?? null,
    },
  };
}


  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }


  return (
  <View style={styles.container}>
    {lastScannedBarcode && (
    <View style={styles.barcodeContainer}>
      <Text style={styles.barcodeText}>Zeskanowano: {lastScannedBarcode}</Text>
    </View>
  )}
    {productData ? (
      <>
        <DisplayProductData productData= {productData} />

        <View style={styles.previewButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setProductData(null)}
          >
            <Text style={styles.buttonText}>Skanuj</Text>
          </TouchableOpacity>
        </View>
      </>
    ) : (
      <>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing={facing}
          onBarcodeScanned={
              ({ data }) => {
                  
                if (!scannedRef.current) {
                  scannedRef.current = true; // block further triggers
                  handleBarcodeScanned(data);

                  setTimeout(() => {
                    scannedRef.current = false; // allow scanning again
                  }, 5000);
                }
              }
          }
        />

      </>
    )}

    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
      <Text style={styles.buttonText}>Zamknij</Text>
    </TouchableOpacity>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  previewImage: {
  flex: 1,
  resizeMode: 'cover',
},
captureButton: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },

  captureText: {
    fontSize: 28,
  },

  previewButtons: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 8,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
    title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  nutritionBox: {
    padding: 12,
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
  },
  barcodeContainer: {
  position: 'absolute',
  top: 60,
  left: 16,
  right: 16,
  backgroundColor: 'rgba(0,0,0,0.6)',
  padding: 8,
  borderRadius: 8,
  zIndex: 10,
},
barcodeText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
},
});
