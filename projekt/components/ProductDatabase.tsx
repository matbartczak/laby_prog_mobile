import * as SQLite from 'expo-sqlite';
import type { ParsedProduct } from './ProductData';
import {daily, engToPlNutriment} from './Charts'

import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});


export async function openDB() {
  const db = await SQLite.openDatabaseAsync('products.db');
  return db;
}

export async function initDatabase() {
  const db = await openDB();

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      category TEXT,
      salt REAL,
      carbs REAL,
      fat REAL,
      saturatedFat REAL,
      sugar REAL,
      protein REAL,
      energyKcal REAL,
      scannedAt TEXT
    );`
  );
}


export async function saveProduct(product: any) {
  const db = await openDB();
  const now = new Date().toISOString();

  try {
    const result = await db.runAsync(
      `INSERT INTO products
        (name, category, salt, carbs, fat, saturatedFat, sugar, protein, energyKcal, scannedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.name,
        product.category,
        product.nutriments.salt,
        product.nutriments.carbs,
        product.nutriments.fat,
        product.nutriments.saturatedFat,
        product.nutriments.sugar,
        product.nutriments.protein,
        product.nutriments.energyKcal,
        now,
      ]
    );
  } catch (error) {
    console.log('Error inserting product:', error);
  }

  const total_daily = await getTodayProducts();
  console.log(total_daily)

  const toSend: string[] = [];
  type toSendType = typeof engToPlNutriment;

  if (!total_daily) {
    console.log('No products scanned today');
  } 
  else {
    Object.entries(total_daily).map(([key, value]) => {
      if (value >= 100){
        const toSendKey = key as keyof toSendType;
        toSend.push(engToPlNutriment[toSendKey])
      }
    });
  }
  console.log(toSend)
  if(toSend.length > 0){
    Notifications.scheduleNotificationAsync({
      content: {
        title: '⚠️ Przekroczono dzienne zapotrzebowanie!',
        body: `Przekroczone wartości: ${toSend.join(', ')}`,
      },
      trigger: null,
    });
  }
      
    
  
}


export async function getAllProducts(): Promise<ParsedProduct[]> {
  const db = await openDB();
  const rows = await db.getAllAsync('SELECT * FROM products');

  return rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    nutriments: {
      salt: row.salt,
      carbs: row.carbs,
      fat: row.fat,
      saturatedFat: row.saturatedFat,
      sugar: row.sugar,
      protein: row.protein,
      energyKcal: row.energyKcal,
    },
    scannedAt: row.scannedAt, 
  }));
}


export async function deleteAllProducts() {
  const db = await openDB();

  try {
    await db.execAsync(`DROP TABLE IF EXISTS products;`);
    console.log('All products deleted successfully');
  } catch (error) {
    console.log('Error deleting products:', error);
  }
}

export async function deleteProductById(id: number) {
  const db = await openDB();
  await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
}

function getTodayPrefix() {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tzOffset)
    .toISOString()
    .slice(0, 10); // YYYY-MM-DD
}

async function getTodayProducts() {
  const db = await openDB();
  const today = getTodayPrefix(); // YYYY-MM-DD
  type NutrientTotals = {
    salt: number;
    carbs: number;
    fat: number;
    saturatedFat: number;
    sugar: number;
    protein: number;
    energyKcal: number;
  };

  const row = await db.getFirstAsync<NutrientTotals>(
    `SELECT 
      SUM(salt) AS salt,
      SUM(carbs) AS carbs,
      SUM(fat) AS fat,
      SUM(saturatedFat) AS saturatedFat,
      SUM(sugar) AS sugar,
      SUM(protein) AS protein,
      SUM(energyKcal) AS energyKcal
      FROM products
      WHERE scannedAt LIKE ?`,
    [`${today}%`]
  );
  const precentage: Record<string, number> = {}; // empty object
  type DailyType = typeof daily;

  if (!row) {
    console.log('No products scanned today');
  } else {
    Object.entries(row).map(([key, value]) => {
      const nutrientKey = key as keyof DailyType;
      precentage[key] = Number(((value / daily[nutrientKey]) * 100).toFixed(2))
    });
  }
  return (precentage)

}
