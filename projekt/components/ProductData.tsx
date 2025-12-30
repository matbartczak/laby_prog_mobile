import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import PlotBarChart from './Charts';
import { saveProduct } from './ProductDatabase';

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
  scannedAt?: string;
}

interface DisplayProductDataProps {
  productData: ParsedProduct;
  onClose?: () => void; // <- funkcja zamykająca ekran / powrót do kamery
}

export default function DisplayProductData({ productData, onClose }: DisplayProductDataProps) {
  const [showChart, setShowChart] = useState(false);

  if (showChart) {
    return (
      <PlotBarChart
        onClose={() => setShowChart(false)}
        product={productData}
      />
    );
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        {/* KRZYŻYK */}
        {onClose && (
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Text style={styles.closeText}>✖</Text>
          </TouchableOpacity>
        )}

        {/* HEADER */}
        <Text style={styles.title}>{productData.name}</Text>
        <Text style={styles.subtitle}>
          <Ionicons name="pricetag-outline" size={14} />{' '}
          {productData.category}
        </Text>

        {/* ENERGIA */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flash-outline" size={18} color="#66BB6A" />
            <Text style={styles.sectionTitle}>Energia</Text>
          </View>
          <Text style={styles.value}>
            {productData.nutriments.energyKcal} kcal
          </Text>
        </View>

        {/* MAKRO */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="nutrition-outline" size={18} color="#66BB6A" />
            <Text style={styles.sectionTitle}>Makroskładniki</Text>
          </View>

          <Text style={styles.row}>🥑 Tłuszcz: {productData.nutriments.fat} g</Text>
          <Text style={styles.subRow}>
            └ tłuszcze nasycone: {productData.nutriments.saturatedFat} g
          </Text>

          <Text style={styles.row}>🍞 Węglowodany: {productData.nutriments.carbs} g</Text>
          <Text style={styles.subRow}>
            └ w tym cukry: {productData.nutriments.sugar} g
          </Text>

          <Text style={styles.row}>🥩 Białko: {productData.nutriments.protein} g</Text>
          <Text style={styles.row}>🧂 Sól: {productData.nutriments.salt} g</Text>
        </View>

        {/* PRZYCISKI */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.button, styles.chartButton]}
            onPress={() => setShowChart(true)}
          >
            <Ionicons name="bar-chart-outline" size={18} color="#2f2f2f" />
            <Text style={styles.buttonTextDark}>Wykres</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={() => saveProduct(productData)}
          >
            <Ionicons name="save-outline" size={18} color="#fff" />
            <Text style={styles.buttonTextLight}>Zapisz</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 20,
  },

  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 3,
    borderColor: '#66BB6A',
    elevation: 8,
  },

  closeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 6,
  },

  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },

  section: {
    marginBottom: 14,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },

  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  row: {
    fontSize: 15,
    marginVertical: 5,
  },

  subRow: {
    fontSize: 13,
    marginLeft: 15,
    color: '#555',
  },

  buttonsRow: {
    marginTop: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 22,
  },

  chartButton: {
    backgroundColor: '#F5A300', // żółty
  },

  saveButton: {
    backgroundColor: '#66BB6A', // zielony
  },

  buttonTextLight: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  buttonTextDark: {
    color: '#2f2f2f',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
