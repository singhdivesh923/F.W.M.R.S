import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Fallback Store if MySQL is not currently connected
let fallbackRecords = [
  {
    id: 101,
    date: new Date().toISOString().split('T')[0],
    meal_type: 'Lunch',
    department: 'Buffet Line',
    category: 'Prepared / Cooked Dishes',
    dish_name: 'Grilled Herb Chicken & Gravy',
    quantity_kg: 16.50,
    unit_cost: 12.00,
    total_cost: 198.00,
    reason: 'Overproduction / Excess Cooking',
    action_prevention: 'Reduce batch size by 20% on Tuesdays',
    recorded_by: 'Chef Marco',
    facility_type: 'Hotel Dining & Banquets'
  },
  {
    id: 102,
    date: new Date().toISOString().split('T')[0],
    meal_type: 'Dinner',
    department: 'Plate Waste',
    category: 'Produce (Vegetables & Fruits)',
    dish_name: 'Mixed Caesar Salad Bowls',
    quantity_kg: 9.40,
    unit_cost: 4.50,
    total_cost: 42.30,
    reason: 'Plate Waste / Customer Leftovers',
    action_prevention: 'Decrease side portion sizing by 15%',
    recorded_by: 'Sarah Jenkins',
    facility_type: 'Hotel Dining & Banquets'
  },
  {
    id: 103,
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    meal_type: 'Breakfast',
    department: 'Bakery & Pastry',
    category: 'Bakery & Grains',
    dish_name: 'Assorted Butter Croissants',
    quantity_kg: 7.20,
    unit_cost: 5.50,
    total_cost: 39.60,
    reason: 'Expiration / Date Expired',
    action_prevention: 'Offer 50% discount item bundle at 10 AM',
    recorded_by: 'Chef Pierre',
    facility_type: 'Cafeteria'
  },
  {
    id: 104,
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    meal_type: 'Lunch',
    department: 'Kitchen Prep',
    category: 'Produce (Vegetables & Fruits)',
    dish_name: 'Carrot & Potato Peels',
    quantity_kg: 21.00,
    unit_cost: 2.20,
    total_cost: 46.20,
    reason: 'Trim & Prep Loss',
    action_prevention: 'Train prep staff on precision peeling knife skills',
    recorded_by: 'Dave Miller',
    facility_type: 'Restaurant'
  },
  {
    id: 105,
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    meal_type: 'Dinner',
    department: 'Cold Storage',
    category: 'Dairy & Eggs',
    dish_name: 'Whole Fresh Milk & Cream',
    quantity_kg: 14.00,
    unit_cost: 3.80,
    total_cost: 53.20,
    reason: 'Cold Chain / Temp Spikes',
    action_prevention: 'Re-calibrate chiller thermostat #2',
    recorded_by: 'Alex Vance',
    facility_type: 'Corporate Canteen'
  }
];

// MySQL Database Config
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'food_waste_db',
  port: parseInt(process.env.DB_PORT || '3306')
};

let dbPool = null;

async function getPool() {
  if (!dbPool) {
    try {
      dbPool = mysql.createPool(dbConfig);
      const conn = await dbPool.getConnection();
      conn.release();
    } catch (err) {
      dbPool = null;
      throw err;
    }
  }
  return dbPool;
}

// 1. Health Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const pool = await getPool();
    await pool.query('SELECT 1 + 1 AS result');
    res.json({ status: 'connected', mode: 'MySQL', database: dbConfig.database });
  } catch (error) {
    res.json({ status: 'fallback', mode: 'In-Memory Store', message: 'MySQL disconnected: ' + error.message });
  }
});

// 2. GET Records
app.get('/api/records', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM waste_records ORDER BY date DESC, id DESC');
    res.json({ success: true, mode: 'MySQL', data: rows });
  } catch (error) {
    res.json({ success: true, mode: 'Fallback', data: fallbackRecords });
  }
});

// 3. POST Record
app.post('/api/records', async (req, res) => {
  const { date, meal_type, department, category, dish_name, quantity_kg, unit_cost, reason, action_prevention, recorded_by, facility_type } = req.body;
  const total_cost = parseFloat(quantity_kg) * parseFloat(unit_cost);

  try {
    const pool = await getPool();
    const sql = `INSERT INTO waste_records 
      (date, meal_type, department, category, dish_name, quantity_kg, unit_cost, reason, action_prevention, recorded_by, facility_type) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.query(sql, [
      date, meal_type, department, category, dish_name, quantity_kg, unit_cost, reason, action_prevention || '', recorded_by || 'Admin', facility_type || 'Restaurant'
    ]);
    res.json({ success: true, id: result.insertId, message: 'Record added to MySQL' });
  } catch (error) {
    const newRecord = {
      id: Date.now(),
      date,
      meal_type,
      department,
      category,
      dish_name,
      quantity_kg: parseFloat(quantity_kg),
      unit_cost: parseFloat(unit_cost),
      total_cost,
      reason,
      action_prevention: action_prevention || '',
      recorded_by: recorded_by || 'Admin',
      facility_type: facility_type || 'Restaurant'
    };
    fallbackRecords.unshift(newRecord);
    res.json({ success: true, id: newRecord.id, mode: 'Fallback', data: newRecord, message: 'Saved to session store' });
  }
});

// 4. PUT Update Record
app.put('/api/records/:id', async (req, res) => {
  const { id } = req.params;
  const { date, meal_type, department, category, dish_name, quantity_kg, unit_cost, reason, action_prevention, recorded_by, facility_type } = req.body;

  try {
    const pool = await getPool();
    const sql = `UPDATE waste_records SET 
      date=?, meal_type=?, department=?, category=?, dish_name=?, quantity_kg=?, unit_cost=?, reason=?, action_prevention=?, recorded_by=?, facility_type=?
      WHERE id=?`;
    await pool.query(sql, [date, meal_type, department, category, dish_name, quantity_kg, unit_cost, reason, action_prevention, recorded_by, facility_type, id]);
    res.json({ success: true, message: 'Record updated in MySQL' });
  } catch (error) {
    const idx = fallbackRecords.findIndex(r => r.id == id);
    if (idx !== -1) {
      fallbackRecords[idx] = {
        ...fallbackRecords[idx],
        date, meal_type, department, category, dish_name,
        quantity_kg: parseFloat(quantity_kg),
        unit_cost: parseFloat(unit_cost),
        total_cost: parseFloat(quantity_kg) * parseFloat(unit_cost),
        reason, action_prevention, recorded_by, facility_type
      };
    }
    res.json({ success: true, message: 'Record updated in fallback store' });
  }
});

// 5. DELETE Record
app.delete('/api/records/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    await pool.query('DELETE FROM waste_records WHERE id = ?', [id]);
    res.json({ success: true, message: 'Record deleted from MySQL' });
  } catch (error) {
    fallbackRecords = fallbackRecords.filter(r => r.id != id);
    res.json({ success: true, message: 'Record deleted from session store' });
  }
});

// 6. Test MySQL Credentials API
app.post('/api/db/test', async (req, res) => {
  const { host, user, password, database, port } = req.body;
  try {
    const conn = await mysql.createConnection({
      host: host || 'localhost',
      user: user || 'root',
      password: password || '',
      database: database || 'food_waste_db',
      port: parseInt(port || '3306')
    });
    await conn.ping();
    await conn.end();
    res.json({ success: true, message: 'MySQL Connection Successful!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Serve Production Built Static Assets from dist/
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.send('EcoWaste Pro Backend API is running. (To view frontend UI, run "npm run dev" or "npm run build")');
    }
  });
});

app.listen(PORT, () => {
  console.log(`[EcoWaste Pro Fullstack App] Server running on http://localhost:${PORT}`);
});
