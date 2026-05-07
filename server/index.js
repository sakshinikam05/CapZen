import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import crypto from 'crypto';
import fs from 'fs';
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

// ============ PREDEFINED Q&A DATABASE ============
const predefinedAnswers = {
  dilution: {
    keywords: ['dilution', 'dilute', 'ownership percentage', 'stake decrease', 'ownership decrease'],
    answer: 'Dilution occurs when new shares are issued, reducing the percentage ownership of existing shareholders. For example, if you own 50% of 100 shares (50 shares) and the company issues 100 new shares, your ownership drops to 33.33% (50 out of 150 shares). This is common in funding rounds.\n\nFormula: New Ownership % = (Your Shares / Total Shares After New Issuance) × 100'
  },
  valuation: {
    keywords: ['valuation', 'company value', 'post-money', 'pre-money', 'worth'],
    answer: 'Valuation is the estimated worth of your company. In cap table calculations, it\'s used to determine share prices in new funding rounds.\n\n• Pre-money Valuation: Company value before investor money arrives\n• Post-money Valuation: Pre-money + Investment amount\n• Share Price: Post-money Valuation ÷ Total Shares\n\nA higher valuation means existing shareholders\' equity is worth more, but they may face more dilution if raising funds.'
  },
  preference: {
    keywords: ['preference', 'preferred shares', 'investor priority', 'liquidation preference', '1x', '2x'],
    answer: 'Preference shares give investors priority in liquidation - they get their money back first before common shareholders.\n\nExample: If a Series A investor has 1x preference and invests ₹1 crore:\n• They receive ₹1 crore before any other distributions\n• Remaining proceeds go to common shareholders\n• Higher multiples (2x, 3x) mean higher priority and more returns\n\nThis protects investors if the company doesn\'t do well.'
  },
  esop: {
    keywords: ['esop', 'employee stock', 'option plan', 'stock options', 'employee ownership'],
    answer: 'Employee Stock Option Plans (ESOPs) give employees the right to buy company shares at a predetermined price (strike price).\n\nKey Features:\n• Incentivizes retention and aligns employee interests with company growth\n• Vesting periods (typically 4 years with 1-year cliff)\n• Employees only own shares after exercising options\n• Tax benefits in many jurisdictions\n\nExample: Employee receives 1000 options with ₹10 strike price. After 2 years, they can exercise 500 options by paying ₹5,000.'
  },
  cappable: {
    keywords: ['cap table', 'capitalization', 'ownership structure', 'shareholder list', 'who owns'],
    answer: 'A Cap Table (Capitalization Table) shows who owns what percentage of your company.\n\nIncludes:\n• Founders and their ownership percentages\n• Investors and their shareholdings\n• Employees with ESOPs and vesting details\n• Any other shareholders\n\nIt\'s essential for:\n• Understanding ownership structure\n• Calculating dilution in new rounds\n• Determining voting power and rights\n• Legal and financial planning'
  },
  liquidation: {
    keywords: ['liquidation', 'exit', 'waterfall', 'proceeds', 'payout order', 'distribution'],
    answer: 'Liquidation is when the company is sold or closed. The liquidation waterfall determines the order and amount each investor class receives.\n\nTypical Order:\n1. Debts and expenses are paid first\n2. Preference shares receive their preferred amount (1x, 2x, etc.)\n3. Remaining proceeds go to common shareholders\n\nExample: If company sells for ₹10 crore:\n• Series A investors get their invested amount first\n• Then remaining money splits between founders and other investors'
  },
  vesting: {
    keywords: ['vesting', 'cliff', 'earn over time', 'stock vesting', 'vesting schedule'],
    answer: 'Vesting is the process by which employees earn their stock options over time.\n\nStandard Structure:\n• 4-year vesting period\n• 1-year cliff (no shares earned in year 1)\n• Monthly vesting thereafter (25% per year)\n\nExample: 1200 options over 4 years\n• Year 1: 0 options (cliff)\n• Year 2: 300 options (25%)\n• Year 3: 600 options (50%)\n• Year 4: 900 options (75%)\n• Year 4 end: 1200 options (100%)\n\nThis prevents employees from leaving immediately with full grants.'
  },
  convertible: {
    keywords: ['convertible', 'safe', 'convertible note', 'conversion', 'seed round'],
    answer: 'Convertible instruments (like SAFEs or convertible notes) are loans that convert into equity during a future funding round.\n\nKey Features:\n• No immediate valuation needed\n• Investor gets a discount on next round (usually 20-30%)\n• Can have interest rates\n• Convert during Series A or later rounds\n\nAdvantages:\n• Faster fundraising (no valuation negotiations)\n• Useful for seed funding\n• Aligns early investors with future investors\n\nExample: ₹50 lakhs convertible note at 25% discount converts to equity at 25% less per share in Series A.'
  },
  warrant: {
    keywords: ['warrant', 'warrant exercise', 'right to buy', 'future purchase'],
    answer: 'Warrants give investors the right to buy shares at a specific price in the future.\n\nHow They Work:\n• Issued with debt instruments or preference shares\n• Investor can exercise anytime during the warrant period\n• Strike price is predetermined\n• If company does well, warrants become very valuable\n\nExample: Investor gets warrant to buy 1000 shares at ₹50 strike price:\n• If stock rises to ₹100, warrant is worth ₹50,000 (₹50 × 1000)\n• Investor can exercise and gain significant upside\n• If stock stays below ₹50, warrant expires worthless'
  },
  dividend: {
    keywords: ['dividend', 'dividend payment', 'profit sharing', 'returns'],
    answer: 'Dividends are payments to shareholders from company profits.\n\nKey Points:\n• Preference shareholders often have priority for dividends\n• Common shareholders receive dividends only after preference shareholders\n• Not all companies pay dividends (growth companies reinvest)\n• Dividend rate is specified in the cap table\n\nExample:\n• Company makes ₹1 crore profit\n• Preference shareholders receive 5% = ₹5 lakhs\n• Remaining ₹95 lakhs splits among common shareholders\n• Founders/employees receive their share based on ownership %'
  },
  series: {
    keywords: ['series a', 'series b', 'series c', 'funding round', 'round'],
    answer: 'Funding rounds are sequential capital raises by the company.\n\nTypical Sequence:\n• Seed Round: Early-stage funding from angels/friends/family\n• Series A: First institutional round, typically ₹50L - ₹5 Cr\n• Series B: Growth stage, typically ₹5 Cr - ₹25 Cr\n• Series C+: Later stage, ₹25 Cr and above\n\nEach Round:\n• Increases company valuation\n• Creates more dilution for existing shareholders\n• Brings new investors and governance\n• Improves credibility and resources'
  },
  ownership: {
    keywords: ['ownership', 'ownership percentage', 'how much', 'stake', 'shareholding'],
    answer: 'Your ownership percentage shows what portion of the company you own.\n\nCalculation: (Your Shares ÷ Total Shares) × 100 = Ownership %\n\nImportant Concepts:\n• Fully Diluted Ownership: Includes all options, convertibles, and warrants\n• Basic Ownership: Only issued shares\n• Voting Power: Usually proportional to ownership (unless different share classes)\n• Economic Rights: Rights to dividends and liquidation proceeds\n\nExample: If you own 50,000 shares out of 200,000 total = 25% ownership'
  },
  common: {
    keywords: ['common share', 'common stock', 'founder shares', 'employee shares'],
    answer: 'Common shares are the basic form of company ownership, typically held by founders and employees.\n\nCharacteristics:\n• Last in line in liquidation (after preference holders)\n• Usually have voting rights\n• May receive dividends (after preference dividends)\n• No special liquidation preferences\n• Most founders and employees hold common shares\n\nVs Preference Shares:\n• Preference holders get paid first in liquidation\n• Preference shares may have higher returns\n• Common shares are simpler but riskier'
  }
};

// Helper function to find matching predefined answer
function findPredefinedAnswer(userQuestion) {
  const questionLower = userQuestion.toLowerCase();
  
  for (const [key, data] of Object.entries(predefinedAnswers)) {
    for (const keyword of data.keywords) {
      if (questionLower.includes(keyword)) {
        return data.answer;
      }
    }
  }
  return null;
}

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

  CREATE TABLE IF NOT EXISTS ai_queries (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

console.log('✅ SQLite database initialized at:', dbPath);

// Helper: Log database operations
function logDbOperation(operation, details) {
  console.log(`[DB] ${operation}: ${details}`);
}

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
      logDbOperation('SIGNUP_FAILED', `User already exists with email: ${email}`);
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const id = crypto.randomUUID();
    const passwordHash = hashPassword(password);

    db.prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)').run(id, name, email, passwordHash);

    logDbOperation('SIGNUP_SUCCESS', `New user created - ID: ${id}, Email: ${email}, Name: ${name}`);
    console.log(`👤 New user registered: ${email}`);
    res.json({ user: { id, name, email } });
  } catch (error) {
    logDbOperation('SIGNUP_ERROR', error.message);
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
      logDbOperation('LOGIN_FAILED', `Invalid credentials for email: ${email}`);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    logDbOperation('LOGIN_SUCCESS', `User logged in - ID: ${user.id}, Email: ${email}`);
    console.log(`🔑 User logged in: ${email}`);
    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    logDbOperation('LOGIN_ERROR', error.message);
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// Helper: Get user's saved cap table from database
function getUserCapTableFromDb(userId) {
  try {
    const rows = db.prepare('SELECT data_type, data_json FROM cap_table_data WHERE user_id = ?').all(userId);
    const capTableData = {};
    
    for (const row of rows) {
      try {
        capTableData[row.data_type] = JSON.parse(row.data_json);
      } catch {
        capTableData[row.data_type] = row.data_json;
      }
    }
    
    logDbOperation('RETRIEVE_CAP_TABLE', `User: ${userId}, Data types: ${Object.keys(capTableData).join(', ')}`);
    return capTableData;
  } catch (error) {
    logDbOperation('RETRIEVE_CAP_TABLE_ERROR', error.message);
    return {};
  }
}

// ============ AI ROUTES ============

app.post('/api/ai/calculate', async (req, res) => {
  const { prompt, userId, currentCapTable } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured on server.' });
  }

  try {
    // First, check if the prompt matches any predefined questions
    const predefinedAnswer = findPredefinedAnswer(prompt);

    if (predefinedAnswer) {
      console.log('✅ Predefined answer matched for:', prompt.substring(0, 50) + '...');
      return res.json({ result: predefinedAnswer });
    }

    // Get user's saved cap table from database
    let userCapTable = currentCapTable || {};
    if (userId) {
      const savedCapTable = getUserCapTableFromDb(userId);
      userCapTable = { ...savedCapTable, ...currentCapTable };
      logDbOperation('AI_QUERY', `User: ${userId}, Question: ${prompt.substring(0, 50)}...`);
    }

    console.log('🤖 Calling OpenAI for complex question:', prompt.substring(0, 50) + '...');
    
    // Build comprehensive cap table context
    const capTableContext = formatCapTableForAI(userCapTable);
    
    // Use OpenAI API for complex questions with user's actual data
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert equity and cap table advisor for Indian startups. You help founders understand dilution, valuations, and equity distribution. All currency values should be discussed in INR (₹/Rupees). Provide clear, concise, and professional advice. Keep answers concise (2-3 sentences) unless more detail is requested. When analyzing cap table data, provide specific numbers and percentages from the user's actual cap table."
        },
        {
          role: "user",
          content: `${capTableContext}\n\nUser Question: ${prompt}`
        }
      ],
      response_format: { type: "text" }
    });

    // Log the AI response
    logDbOperation('AI_RESPONSE', `User: ${userId}, Response length: ${completion.choices[0].message.content.length} chars`);
    
    res.json({ result: completion.choices[0].message.content });
  } catch (error) {
    console.error('AI Error:', error);
    logDbOperation('AI_ERROR', error.message);
    res.status(500).json({ error: 'AI processing failed' });
  }
});

// Helper: Format cap table data for AI context
function formatCapTableForAI(capTable) {
  if (!capTable || Object.keys(capTable).length === 0) {
    return 'No cap table data has been saved yet. User is asking a general question about cap tables.';
  }

  let context = 'Here is the user\'s saved cap table data:\n\n';
  
  if (capTable.shareholders && Array.isArray(capTable.shareholders)) {
    context += '📊 Shareholders:\n';
    capTable.shareholders.forEach((sh, idx) => {
      context += `  ${idx + 1}. ${sh.name || 'Unknown'}: ${sh.shares || 0} shares (${sh.ownership || 0}% ownership)\n`;
    });
    context += '\n';
  }
  
  if (capTable.rounds && Array.isArray(capTable.rounds)) {
    context += '💰 Funding Rounds:\n';
    capTable.rounds.forEach((round, idx) => {
      context += `  ${idx + 1}. ${round.name || `Round ${idx + 1}`}: ₹${round.amount || 0} at ${round.valuation || 'N/A'} valuation\n`;
    });
    context += '\n';
  }
  
  if (capTable.employees && Array.isArray(capTable.employees)) {
    context += '👥 Employees with Stock Options:\n';
    capTable.employees.forEach((emp, idx) => {
      context += `  ${idx + 1}. ${emp.name || 'Unknown'}: ${emp.options || 0} options (${emp.vested || 0}% vested)\n`;
    });
    context += '\n';
  }
  
  if (capTable.companyInfo) {
    context += '🏢 Company Info:\n';
    if (capTable.companyInfo.name) context += `  Name: ${capTable.companyInfo.name}\n`;
    if (capTable.companyInfo.totalShares) context += `  Total Shares Outstanding: ${capTable.companyInfo.totalShares}\n`;
    if (capTable.companyInfo.valuation) context += `  Current Valuation: ₹${capTable.companyInfo.valuation}\n`;
    context += '\n';
  }
  
  return context;
}

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

    logDbOperation('DATA_SAVE', `User: ${userId}, Type: ${dataType}, Size: ${dataJson.length} bytes`);
    res.json({ success: true });
  } catch (error) {
    logDbOperation('DATA_SAVE_ERROR', error.message);
    console.error('Save Error:', error);
    res.status(500).json({ error: 'Failed to save data.' });
  }
});

// GET /api/data/load/:userId
app.get('/api/data/load/:userId', (req, res) => {
  const { userId } = req.params;

  try {
    const rows = db.prepare('SELECT data_type, data_json FROM cap_table_data WHERE user_id = ?').all(userId);

    logDbOperation('DATA_LOAD', `User: ${userId}, Records found: ${rows.length}`);

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
    logDbOperation('DATA_LOAD_ERROR', error.message);
    console.error('Load Error:', error);
    res.status(500).json({ error: 'Failed to load data.' });
  }
});

// POST /api/ai/save-query - Save AI query and response for audit trail
app.post('/api/ai/save-query', (req, res) => {
  const { userId, query, response } = req.body;

  if (!userId || !query || !response) {
    return res.status(400).json({ error: 'userId, query, and response are required.' });
  }

  try {
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO ai_queries (id, user_id, query, response) VALUES (?, ?, ?, ?)').run(id, userId, query, response);
    
    logDbOperation('AI_QUERY_SAVED', `User: ${userId}, Query length: ${query.length}, Response length: ${response.length}`);
    res.json({ success: true, queryId: id });
  } catch (error) {
    logDbOperation('AI_QUERY_SAVE_ERROR', error.message);
    console.error('Save Query Error:', error);
    res.status(500).json({ error: 'Failed to save AI query.' });
  }
});

// GET /api/ai/query-history/:userId - Get user's AI query history
app.get('/api/ai/query-history/:userId', (req, res) => {
  const { userId } = req.params;
  const limit = req.query.limit || 50;

  try {
    const rows = db.prepare('SELECT id, query, response, created_at FROM ai_queries WHERE user_id = ? ORDER BY created_at DESC LIMIT ?').all(userId, limit);
    
    logDbOperation('QUERY_HISTORY_LOAD', `User: ${userId}, Records: ${rows.length}`);
    res.json(rows);
  } catch (error) {
    logDbOperation('QUERY_HISTORY_ERROR', error.message);
    console.error('Query History Error:', error);
    res.status(500).json({ error: 'Failed to load query history.' });
  }
});

// Health check with database stats
app.get('/api/health', (req, res) => {
  try {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
    const dataCount = db.prepare('SELECT COUNT(*) as count FROM cap_table_data').get();
    const dbSize = fs.statSync(dbPath).size;

    logDbOperation('HEALTH_CHECK', `Users: ${userCount.count}, Data Records: ${dataCount.count}, DB Size: ${(dbSize / 1024 / 1024).toFixed(2)} MB`);
    
    res.json({ 
      status: 'ok',
      database: {
        users: userCount.count,
        dataRecords: dataCount.count,
        sizeInMB: (dbSize / 1024 / 1024).toFixed(2)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 CapZen API Server running at http://localhost:${PORT}`);
  console.log(`📦 Database: ${dbPath}\n`);
  logDbOperation('SERVER_START', `Server initialized and listening on port ${PORT}`);
});
