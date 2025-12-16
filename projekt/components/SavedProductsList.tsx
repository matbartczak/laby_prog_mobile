import  { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator,TouchableOpacity } from 'react-native';
import { getAllProducts, deleteProductById  } from './ProductDatabase';
import type { ParsedProduct } from './ProductData';
import PlotBarChart from './Charts'

export default function SavedProductsList() {
  const [products, setProducts] = useState<ParsedProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<ParsedProduct | null>(null);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const rows = await getAllProducts();
        setProducts(rows);
      } catch (error) {
        console.log('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId?: number) => {
    if (!productId) return;

    await deleteProductById(productId);

    // remove from UI instantly
    setProducts(prev =>
        prev.filter(product => product.id !== productId)
    );
    };

  const renderItem = ({ item }: { item: ParsedProduct }) => (
    <View style={styles.productCard}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.date}>Zeskanowano: {item.scannedAt}</Text>
      <Text style={styles.category}>{item.category}</Text>
      <View style={styles.nutrients}>
        <Text style={styles.nutrient}>Sól: {item.nutriments.salt ?? '-'}</Text>
        <Text style={styles.nutrient}>Węglowodany: {item.nutriments.carbs ?? '-'}</Text>
        <Text style={styles.nutrient}>Tłusz: {item.nutriments.fat ?? '-'}</Text>
        <Text style={styles.nutrient}>Białko: {item.nutriments.protein ?? '-'}</Text>
        <Text style={styles.nutrient}>Kalorie: {item.nutriments.energyKcal ?? '-'}</Text>
      </View>
      <View style = {styles.previewButtons}>
        <TouchableOpacity
        style={styles.chartButton}
        onPress={() => setSelectedProduct(item)}
        >
            <Text style={styles.chartButtonText}>Pokaż wykres</Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={styles.chartButton}
        onPress={() => handleDelete(item.id)}
        >
            <Text style={styles.chartButtonText}>Usuń produkt</Text>
        </TouchableOpacity>
       </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4a4a4aff" />
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No saved products.</Text>
      </View>
    );
  }
  if (selectedProduct) {
  return (
    <PlotBarChart
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        />
    );
    }


  return (
    <FlatList
      data={products}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  productCard: {
    backgroundColor: '#f3f3f3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  nutrients: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nutrient: {
    fontSize: 12,
    color: '#333',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  chartButton: {
  marginTop: 12,
  backgroundColor: 'rgba(0,0,0,0.7)',
  paddingVertical: 8,
  borderRadius: 8,
  alignItems: 'center',
},

chartButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  padding: 3
},

date: {
  fontSize: 12,
  color: '#666',
  marginBottom: 4,
},
previewButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
