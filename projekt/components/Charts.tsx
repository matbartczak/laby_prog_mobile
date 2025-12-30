import { BarChart } from 'react-native-chart-kit';
import { View, Dimensions, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import type { ParsedProduct } from './ProductData';

export const daily = {
  "salt": 2.3,
  "carbs": 260,
  "fat": 70,
  "saturatedFat": 20,
  "sugar": 90,
  "protein": 50,
  "energyKcal": 2000
};

export const engToPlNutriment = {
  "salt": "sól",
  "carbs": "węglowodany",
  "fat": "tłuszcz",
  "saturatedFat": "tłuszcze nasycone",
  "sugar": "cukier",
  "protein": "białko",
  "energyKcal": "Kalorie"
};

interface PlotBarChartProps {
  onClose: () => void;
  title?: string;
  product: ParsedProduct;
}

export default function PlotBarChart({ onClose, product }: PlotBarChartProps) {
  const [chartType, setChartType] = useState<'nutriments' | 'requirement'>('nutriments');
  const screenWidth = Dimensions.get('window').width;

  const nutrimentKeys = Object.keys(product.nutriments) as (keyof typeof product.nutriments)[];
  let labels: string[] = [];
  let data: number[] = [];
  const proc: number[] = [];
  const colors: (() => string)[] = [];
  const nutrimentColors = {
    "salt": '#64748b',
    'carbs': '#3b82f6',
    'fat': '#f59e0b',
    'saturatedFat': '#ef4444',
    'sugar': '#ec4899',
    'protein': '#22c55e',
    'energyKcal': '#8b5cf6',
  };

  // Przygotowanie danych
  nutrimentKeys.forEach(key => {
    const value = product.nutriments[key];
    if (value === null || key === "energyKcal") return;
    labels.push(engToPlNutriment[key]);
    data.push(value);
    proc.push(Number(((value / daily[key]) * 100).toFixed(1)));
    colors.push(() => nutrimentColors[key]);
  });

  // Sortowanie malejąco
  const combined = labels.map((label, i) => ({ label, value: data[i], color: colors[i], procValue: proc[i] }));
  combined.sort((a, b) => (chartType === 'nutriments' ? b.value - a.value : b.procValue - a.procValue));

  labels = combined.map(item => chartType === 'nutriments' ? item.label : item.label + ' %');
  data = combined.map(item => chartType === 'nutriments' ? item.value : item.procValue);
  const sortedColors = combined.map(item => item.color);

  const containerWidth = Math.min(screenWidth - 32, 390);
  const containerHeight = 500; // wysokość kwadratu

  return (
    <View style={styles.screenOverlay}>
      <View style={[styles.card, { width: containerWidth, height: containerHeight }]}>
        {/* KRZYŻYK */}
        <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
          <Text style={styles.closeText}>✖</Text>
        </TouchableOpacity>

        {/* TYTUŁ */}
        <Text style={styles.chartTitle}>
          {chartType === 'nutriments' ? 'Skład produktu' : 'Dzienne zapotrzebowanie (%)'}
        </Text>

        {/* WYŚRODKOWANY WYKRES */}
        <View style={styles.chartWrapper}>
          <BarChart
            data={{
              labels: labels,
              datasets: [{ data: data, colors: sortedColors }],
            }}
            width={containerWidth - 32}
            height={350}
            yAxisLabel=""
            yAxisSuffix={chartType === 'nutriments' ? 'g' : '%'}
            fromZero
            showValuesOnTopOfBars
            withInnerLines
            withCustomBarColorFromData
            verticalLabelRotation={50}
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              labelColor: () => '#000',
              barPercentage: 0.6,
              propsForHorizontalLabels: { fontSize: 11, dx: -10 },
              propsForLabels: { fontWeight: 'bold',fontSize: 10  },
              decimalPlaces: chartType === 'nutriments' ? 0 : 1,
            }}
            style={{ marginTop: 16, borderRadius: 16 }}
          />
        </View>

        {/* SLICER POD WYKRESEM */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.tabButton, chartType === 'nutriments' ? styles.activeTab : {}]}
            onPress={() => setChartType('nutriments')}
          >
            <Text style={styles.tabText}>Skład produktu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, chartType === 'requirement' ? styles.activeTab : {}]}
            onPress={() => setChartType('requirement')}
          >
            <Text style={styles.tabText}>Zapotrzebowanie</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#22c55e', // zielona ramka
    elevation: 6,
    padding: 16,
    position: 'relative',
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
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chartWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabSwitcher: {
    flexDirection: 'row',
    marginTop: 12,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#66BB6A',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});
