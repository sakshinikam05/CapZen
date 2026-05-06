import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors({ origin: ['http://localhost:8080', 'http://localhost:8081'], credentials: true }));
app.use(express.json());

// Initialize SQLite Database
const dbPath = path.join(__dirname, 'capzen.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cap_table_data (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    data_type TEXT NOT NULL,
    data_json TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

console.log('✅ SQLite database initialized at:', dbPath);

// Helper: Hash password
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

// Helper: Verify password
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const verify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verify;
}

// ============ AUTH ROUTES ============

// POST /api/signup
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  // Check if user exists
  try {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const id = crypto.randomUUID();
    const passwordHash = hashPassword(password);

    db.prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)').run(id, name, email, passwordHash);

    console.log(`👤 New user registered: ${email}`);
    res.json({ user: { id, name, email } });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'Internal server error during signup.' });
  }
});

// POST /api/login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    console.log(`🔑 User logged in: ${email}`);
    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// ============ AI ROUTES ============

app.post('/api/ai/calculate', async (req, res) => {
  const { prompt, currentCapTable } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured on server.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert equity and cap table advisor for Indian startups. You help founders understand dilution, valuations, and equity distribution. All currency values should be discussed in INR (₹/Rupees). Provide clear, concise, and professional advice."
        },
        {
          role: "user",
          content: `Here is the current cap table data: ${JSON.stringify(currentCapTable)}. \n\nUser Question: ${prompt}`
        }
      ],
      response_format: { type: "text" }
    });

    res.json({ result: completion.choices[0].message.content });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'AI processing failed' });
  }
});

// ============ CAP TABLE DATA ROUTES ============

// POST /api/data/save
app.post('/api/data/save', (req, res) => {
  const { userId, dataType, data } = req.body;

  if (!userId || !dataType || data === undefined) {
    return res.status(400).json({ error: 'userId, dataType, and data are required.' });
  }

  try {
    const id = `${userId}_${dataType}`;
    const dataJson = JSON.stringify(data);

    db.prepare(`
      INSERT INTO cap_table_data (id, user_id, data_type, data_json, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET data_json = ?, updated_at = CURRENT_TIMESTAMP
    `).run(id, userId, dataType, dataJson, dataJson);

    res.json({ success: true });
  } catch (error) {
    console.error('Save Error:', error);
    res.status(500).json({ error: 'Failed to save data.' });
  }
});

// GET /api/data/load/:userId
app.get('/api/data/load/:userId', (req, res) => {
  const { userId } = req.params;

  try {
    const rows = db.prepare('SELECT data_type, data_json FROM cap_table_data WHERE user_id = ?').all(userId);

    const result = {};
    for (const row of rows) {
      try {
        result[row.data_type] = JSON.parse(row.data_json);
      } catch {
        result[row.data_type] = row.data_json;
      }
    }

    res.json(result);
  } catch (error) {
    console.error('Load Error:', error);
    res.status(500).json({ error: 'Failed to load data.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  try {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
    res.json({ status: 'ok', users: userCount.count });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 CapZen API Server running at http://localhost:${PORT}`);
  console.log(`📦 Database: ${dbPath}\n`);
});
