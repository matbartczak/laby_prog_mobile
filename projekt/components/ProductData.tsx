import { Button, Text,Dimensions, TouchableOpacity, View,StyleSheet } from 'react-native';
import PlotBarChart from './Charts'
import { saveProduct } from './ProductDatabase';
import { useState } from 'react';

export interface ParsedProduct {
  id?: number;
  name: string;
  category: string;
  nutriments: {
    salt: number | null;
    carbs: number | null;
    fat: number | null;
    saturatedFat: number | null;
    sugar: number | null;
    protein: number | null;
    energyKcal: number | null;
  };
  scannedAt?: string; // ISO datetime
}


interface DisplayProductDataProps {
  productData: ParsedProduct;
}

export default function DisplayProductData({productData}: DisplayProductDataProps ){
    
    const [showChart, setShowChart] = useState(false);

    const onPress = () => {
      
      setShowChart(true);
    };


    return(

    <>
    {showChart ? (
      <PlotBarChart onClose={() => setShowChart(false)} product={productData}  />
      ): (
        <View style={styles.container}>
          

          <View style={styles.nutritionBox}>
            <Text style={styles.title}>{productData.name}</Text>
            <Text style={styles.subtitle}>
                Kategoria: {productData.category}
            </Text>
            <Text>Kalorie: {productData.nutriments.energyKcal} kcal</Text>
            <Text>Tłuszcz: {productData.nutriments.fat} g</Text>
            <Text>W tym kwasy tłuszczowe nasycone: {productData.nutriments.saturatedFat} g</Text>
            <Text>Węglowodany: {productData.nutriments.carbs} g</Text>
            <Text>W tym cukry: {productData.nutriments.sugar} g</Text>
            <Text>Białko: {productData.nutriments.protein} g</Text>
            <Text>Sól: {productData.nutriments.salt} g</Text>
            <View style={styles.previewButtons}>
                <TouchableOpacity
                style={styles.actionButton}
                onPress={onPress}
                >
                <Text style={styles.buttonText}>Wykres</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.actionButton}
                onPress={() => saveProduct(productData)}
                >
                <Text style={styles.buttonText}>Zapisz</Text>
                </TouchableOpacity>
                
            </View>
          </View>
        </View>
        )}
      </>
    );
}
        
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    padding: 10,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    borderRadius: 30,         // makes it circular if width = height
    borderWidth: 5,           // thickness of the outline
    borderColor: 'rgba(245, 163, 0, 1)',
  },
    previewButtons: {
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop:32
  },
  
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
    buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});