# AI Database Integration & Enhancements

## Overview
The backend now provides personalized AI answers based on user-saved cap table data from the database.

---

## Key Features Added

### 1. **Database-Driven AI Responses**
- AI queries now fetch user's saved cap table data from the database
- Personalized answers include specific numbers and percentages from the user's actual cap table
- AI can analyze shareholders, funding rounds, employees, and company info

### 2. **Enhanced Database Schema**
Three main tables:
- **users**: User authentication (id, name, email, password_hash)
- **cap_table_data**: User's saved cap table data by type (shareholders, rounds, employees, etc.)
- **ai_queries**: Audit trail of all AI queries and responses

### 3. **New API Endpoints**

#### AI Query Endpoint (Enhanced)
```
POST /api/ai/calculate
Body: { prompt, userId, currentCapTable }
Response: { result: "AI answer based on user's saved data" }
```
- Checks predefined Q&A first (instant responses)
- Falls back to OpenAI for complex questions
- Pulls user's database cap table and includes it in AI context
- Provides personalized analysis with specific numbers

#### Save AI Query (Audit Trail)
```
POST /api/ai/save-query
Body: { userId, query, response }
Response: { success: true, queryId: "..." }
```
- Saves all AI interactions to database
- Enables audit trail and history tracking
- Useful for compliance and improvement

#### Get Query History
```
GET /api/ai/query-history/:userId?limit=50
Response: [{ id, query, response, created_at }, ...]
```
- Retrieve user's past AI interactions
- Shows conversation history
- Sortable by date

### 4. **Smart Cap Table Context Formatting**
AI receives formatted cap table data:
```
📊 Shareholders:
  1. Founder A: 50,000 shares (50% ownership)
  2. Investor B: 25,000 shares (25% ownership)

💰 Funding Rounds:
  1. Seed Round: ₹1,00,00,000 at ₹1 Cr valuation

👥 Employees with Stock Options:
  1. Employee A: 5,000 options (50% vested)

🏢 Company Info:
  Name: StartupXYZ
  Total Shares Outstanding: 100,000
  Current Valuation: ₹5 Cr
```

### 5. **Database Logging**
All operations logged with `[DB]` prefix:
- `[DB] AI_QUERY`: When AI processes user question
- `[DB] DATA_SAVE`: When user saves cap table data
- `[DB] DATA_LOAD`: When user loads cap table
- `[DB] AI_QUERY_SAVED`: When interaction is stored

### 6. **Health Check with Statistics**
```
GET /api/health
Response: {
  status: "ok",
  database: {
    users: 5,
    dataRecords: 12,
    sizeInMB: "0.45"
  },
  timestamp: "2026-05-08T..."
}
```

---

## How It Works

### User Journey

1. **User Saves Cap Table Data**
   ```
   POST /api/data/save
   Body: { userId, dataType: "shareholders", data: [...] }
   → Data stored in `cap_table_data` table
   ```

2. **User Asks AI Question**
   ```
   POST /api/ai/calculate
   Body: { userId, prompt: "What's my dilution?" }
   → System fetches user's cap table from DB
   → Formats context with actual data
   → Sends to OpenAI with context
   ```

3. **AI Provides Personalized Answer**
   ```
   Based on your cap table:
   - You own 50% (50,000 shares)
   - After Series A: You own 30% (diluted by 20%)
   - New investors get 20%
   ```

4. **Query is Saved for Audit**
   ```
   POST /api/ai/save-query
   → Interaction stored in `ai_queries` table
   → Can be retrieved anytime
   ```

---

## Database Operations

### Retrieve User's Cap Table
```javascript
// Get all saved data for a user
db.prepare('SELECT data_type, data_json FROM cap_table_data WHERE user_id = ?')
  .all(userId)
```

### Save AI Query
```javascript
// Log AI interaction
db.prepare('INSERT INTO ai_queries (id, user_id, query, response) VALUES (?, ?, ?, ?)')
  .run(id, userId, query, response)
```

### Get Query History
```javascript
// Retrieve past interactions
db.prepare('SELECT id, query, response, created_at FROM ai_queries WHERE user_id = ? ORDER BY created_at DESC LIMIT ?')
  .all(userId, limit)
```

---

## Benefits

✅ **Personalized Answers**: AI knows exact cap table details
✅ **Audit Trail**: All interactions stored and retrievable
✅ **Context-Aware**: AI provides specific numbers and percentages
✅ **Database-Driven**: Fully integrated with user's saved data
✅ **Scalable**: Supports multiple users with isolated data
✅ **Logging**: Comprehensive operation logging for debugging

---

## Testing the Integration

### 1. Save Cap Table Data
```bash
curl -X POST http://localhost:3001/api/data/save \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "dataType": "shareholders",
    "data": [
      {"name": "Founder A", "shares": 50000, "ownership": 50},
      {"name": "Investor B", "shares": 25000, "ownership": 25}
    ]
  }'
```

### 2. Ask AI Question Based on Saved Data
```bash
curl -X POST http://localhost:3001/api/ai/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "prompt": "What will happen to my ownership after a Series A?"
  }'
```

### 3. Save the Query
```bash
curl -X POST http://localhost:3001/api/ai/save-query \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "query": "What will happen to my ownership after a Series A?",
    "response": "Based on your cap table..."
  }'
```

### 4. Check Query History
```bash
curl http://localhost:3001/api/ai/query-history/user123
```

### 5. Check Database Stats
```bash
curl http://localhost:3001/api/health
```

---

## Files Modified
- `/server/index.js` - All backend enhancements

## Database File
- `/server/capzen.db` - SQLite database with all user and AI data
