import { BarChart  } from 'react-native-chart-kit';
import { View, Dimensions, Text,StyleSheet,TouchableOpacity } from 'react-native';
import { useState } from 'react';
import type { ParsedProduct } from './ProductData';


export const daily = {"salt":2.3 , "carbs":260  , "fat":70  , "saturatedFat":20  ,
         "sugar":90  , "protein":50 , "energyKcal":2000 }
export const engToPlNutriment = {"salt":"sól" , "carbs":"węglowodany" , "fat":"tłuszcz" , "saturatedFat":"tłuszcze nasycone" ,
         "sugar":"cukier" , "protein":"białko" , "energyKcal":"Kalorie"}

interface PlotBarChartProps {
  onClose: () => void;
  title?: string;
  product: ParsedProduct;
}

export default function PlotBarChart({
  onClose,
  product,
}: PlotBarChartProps) {
    
    const [chartType, setChartType] = useState<'nutriments' | 'requirement'>(
        'nutriments'
        );
    const screenWidth = Dimensions.get('window').width;

    
    const nutrimentKeys = Object.keys(
    product.nutriments
    ) as (keyof typeof product.nutriments)[];

    const labels: string[] = [];
    const data: number[] = [];
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

    nutrimentKeys.forEach(key => {
        const value = product.nutriments[key];
        if (value === null || key === "energyKcal") return;
            labels.push(engToPlNutriment[key]);
            data.push(value);
            proc.push( Number(((value / daily[key]) * 100).toFixed(2)))
            colors.push(() => nutrimentColors[key])
    });
    const TARGET_VALUE = 100;
    const maxDataValue = Math.max(...proc, TARGET_VALUE); // largest value between data and target
    const paddedData = [...proc, maxDataValue];
    const paddedLabels = [...labels, '']; // must match paddedData length
    return(
        <View style={styles.container}>
            {chartType === 'nutriments' && (
            <>
                <Text style={styles.chartTitle}>Skład produktu</Text>
                <BarChart
                    data={{
                        labels: labels,
                        datasets: [
                        {
                            data: data,
                            colors:colors,
                        },
                        ],
                    }}
                    width={screenWidth - 32}
                    height={500}
                    yAxisLabel=""
                    yAxisSuffix="g"
                    fromZero
                    showValuesOnTopOfBars
                    withInnerLines={true}
                    withCustomBarColorFromData
                    verticalLabelRotation={50}
                    chartConfig={{
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffffff',
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: () => '#000',
                        barPercentage: 0.6,
                        propsForHorizontalLabels:{fontSize: 11,dx: -15},
                        propsForLabels:{fontWeight: 'bold'},
                        decimalPlaces: 0,
                        
                    }}
                    
                    style={{ 
                        marginTop: 16,
                        borderRadius: 30,
                    }}
                    />
                </>
                )}

                {chartType === 'requirement' && (
                <>
                <Text style={styles.chartTitle}>Dzienne</Text>


                <BarChart
                data={{
                    labels: paddedLabels,
                    datasets: [
                    {
                        data: paddedData,
                        colors: colors,
                    },
                    ],
                }}
                width={screenWidth - 32}
                height={520}
                yAxisLabel=""
                yAxisSuffix="%"
                fromZero
                showValuesOnTopOfBars
                withInnerLines={true}
                withCustomBarColorFromData
                verticalLabelRotation={50}
                chartConfig={{
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffffff',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: () => '#000',
                    barPercentage: 1,
                    propsForHorizontalLabels: { fontSize: 11, dx: -15 },
                    propsForLabels: { fontWeight: 'bold' },
                    decimalPlaces: 0,
                }}

                style={{
                    marginTop: 16,
                    borderRadius: 30,
                }}
                />
                                </>
            )}

            <View style={styles.previewButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={onClose}>
                    <Text style={styles.buttonText}>Zamknij wykres</Text>
                </TouchableOpacity>          
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                    setChartType(
                        chartType === 'nutriments'
                        ? 'requirement'
                        : 'nutriments'
                    )
                    }
                >
                    <Text style={styles.buttonText}>
                    {chartType === 'nutriments'
                        ? 'Zapotrzebowanie'
                        : 'Skład produktu'}
                    </Text>
                </TouchableOpacity>
            </View>             
        </View>
        


    )
}

const styles = StyleSheet.create({
  container: {
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
    marginTop: 16
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
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
});