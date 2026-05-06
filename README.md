# CapZen

**The all-in-one equity management platform built for Indian startups.**

CapZen helps founders, CFOs, and lawyers manage cap tables, model funding rounds, track ESOPs, and get AI-powered equity advice — all natively in INR (₹).

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Pages & Components](#pages--components)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

CapZen is a full-stack SaaS application that provides Indian startups with a complete suite of equity management tools. It is built on a React + Vite frontend and a Node.js + SQLite backend, with an optional OpenAI integration for the AI Equity Advisor feature.

**Key design decisions:**
- All monetary values are in **INR (₹)** — no USD.
- All data is **persisted per user** in a SQLite database on the backend.
- Data is **auto-saved** on every change after the initial session load, preventing data loss.
- The platform is designed to be **self-hostable** with zero cloud dependencies.

---

## Features

| Feature | Description |
|---|---|
| **Cap Table Management** | Real-time ownership tracking across all share classes |
| **Shareholder Registry** | Manage founders, investors, employees, and advisors |
| **Investment Rounds** | Log Seed, Series A/B/C, and Bridge rounds with full details |
| **Dilution Modeling** | Simulate future rounds and see ownership impact |
| **Convertible Instruments** | Track SAFEs and convertible notes with cap/discount logic |
| **ESOP & Stock Grants** | Manage employee option pools with vesting schedules |
| **Waterfall Analysis** | Model exit scenarios (acquisition, IPO, liquidation) |
| **AI Equity Advisor** | Ask plain-English equity questions, powered by OpenAI GPT-4 |
| **XLSX Export** | One-click export of board-ready cap table reports |
| **Auth System** | Secure signup/login with password hashing (PBKDF2 + SHA-512) |

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI framework |
| TypeScript | 5.5 | Type safety |
| Vite | 5.4 | Build tool & dev server |
| Tailwind CSS | 3.4 | Styling |
| Radix UI | Various | Accessible component primitives |
| React Router DOM | 6.26 | Client-side routing |
| React Hook Form | 7.53 | Form management |
| Recharts | 2.12 | Data visualizations |
| Lucide React | 0.462 | Icon library |
| xlsx | 0.18 | Excel export |
| Zod | 3.23 | Schema validation |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | ≥18 | Runtime |
| Express | 4.x | HTTP server |
| better-sqlite3 | Latest | SQLite database driver |
| OpenAI SDK | Latest | AI Equity Advisor |
| crypto (built-in) | — | Password hashing |
| dotenv | 17.x | Environment variable management |

---

## Project Structure

```
captable-generator-main/
├── server/
│   └── index.js              # Express API server (auth, data, AI)
├── src/
│   ├── components/
│   │   ├── AIEquityCalculator.tsx     # AI Advisor tab UI
│   │   ├── CapTableDisplay.tsx        # Ownership table + chart
│   │   ├── CompanyInfo.tsx            # Company setup form
│   │   ├── ConvertibleInstruments.tsx # SAFEs & convertible notes
│   │   ├── Footer.tsx                 # Shared footer
│   │   ├── InvestmentRounds.tsx       # Funding rounds management
│   │   ├── Logo.tsx                   # CSS-based CapZen wordmark
│   │   ├── ShareholderManagement.tsx  # Shareholder CRUD
│   │   ├── StockGrants.tsx            # ESOP & RSU management
│   │   ├── WaterfallAnalysis.tsx      # Exit scenario modeler
│   │   └── ui/                        # Shadcn/Radix UI components
│   ├── contexts/
│   │   └── AuthContext.tsx            # Auth state + API helpers
│   ├── pages/
│   │   ├── Landing.tsx                # Marketing landing page
│   │   ├── Login.tsx                  # Login page
│   │   ├── Signup.tsx                 # Signup page
│   │   └── Index.tsx                  # Main dashboard (authenticated)
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces
│   ├── utils/
│   │   └── enhancedExportUtils.ts     # XLSX export logic
│   └── App.tsx                        # Route definitions
├── .env                               # Environment variables (not committed)
├── package.json
├── tailwind.config.ts
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- An **OpenAI API key** (optional — only required for AI Advisor feature)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sakshinikam05/CapZen.git
   cd CapZen
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Then edit .env with your values (see below)
   ```

---

## Environment Variables

Create a `.env` file in the project root with the following:

```env
# Required for the backend server
OPENAI_API_KEY=sk-your-openai-api-key-here
```

> **Note:** The `OPENAI_API_KEY` is only required if you want to use the **AI Equity Advisor** feature. All other features work without it.

---

## Running the Application

CapZen requires **two processes** to be running simultaneously: the frontend dev server and the backend API server.

### 1. Start the Backend API Server

```bash
node server/index.js
```

The server will start on **http://localhost:3001**. On first run, it will automatically create the SQLite database at `server/capzen.db`.

You should see:
```
🚀 CapZen API Server running at http://localhost:3001
📦 Database: /path/to/server/capzen.db
✅ SQLite database initialized
```

### 2. Start the Frontend Dev Server

In a **new terminal tab**:

```bash
npm run dev
```

The frontend will start on **http://localhost:8080**.

### Quick Start (Both together on macOS/Linux)

```bash
node server/index.js & npm run dev
```

### Production Build

```bash
npm run build
```

The built files will be in the `dist/` folder, ready for deployment to any static host (Vercel, Netlify, etc.). The backend can be deployed separately to Render, Railway, or any Node.js host.

---

## API Reference

All API endpoints are served from `http://localhost:3001`.

### Authentication

#### `POST /api/signup`
Create a new user account.

**Request Body:**
```json
{
  "name": "Sakshi Nikam",
  "email": "sakshi@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "user": { "id": "uuid", "name": "Sakshi Nikam", "email": "sakshi@example.com" }
}
```

---

#### `POST /api/login`
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "sakshi@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "user": { "id": "uuid", "name": "Sakshi Nikam", "email": "sakshi@example.com" }
}
```

---

### Cap Table Data

#### `POST /api/data/save`
Save or update a specific section of a user's cap table data.

**Request Body:**
```json
{
  "userId": "user-uuid",
  "dataType": "shareholders",
  "data": [ ... ]
}
```

`dataType` can be: `company`, `shareholders`, `investmentRounds`, `convertibleInstruments`, `stockGrants`, `waterfallScenarios`

---

#### `GET /api/data/load/:userId`
Load all cap table data for a user.

**Response:**
```json
{
  "company": { ... },
  "shareholders": [ ... ],
  "investmentRounds": [ ... ],
  "convertibleInstruments": [ ... ],
  "stockGrants": [ ... ],
  "waterfallScenarios": [ ... ]
}
```

---

### AI Advisor

#### `POST /api/ai/calculate`
Send an equity question to the AI Advisor.

**Request Body:**
```json
{
  "prompt": "If I raise ₹2 Cr at a ₹10 Cr pre-money valuation, what is my dilution?",
  "currentCapTable": { ... }
}
```

**Response:**
```json
{
  "result": "At a ₹10 Cr pre-money valuation with a ₹2 Cr raise..."
}
```

---

### Health Check

#### `GET /api/health`

```json
{
  "status": "ok",
  "users": 12
}
```

---

## Database Schema

CapZen uses **SQLite** (via `better-sqlite3`) with WAL mode enabled for performance.

### `users` table
| Column | Type | Description |
|---|---|---|
| `id` | TEXT (PK) | UUID |
| `name` | TEXT | User's full name |
| `email` | TEXT (UNIQUE) | User's email address |
| `password_hash` | TEXT | PBKDF2-SHA512 hash with salt |
| `created_at` | DATETIME | Timestamp of registration |

### `cap_table_data` table
| Column | Type | Description |
|---|---|---|
| `id` | TEXT (PK) | Composite: `{userId}_{dataType}` |
| `user_id` | TEXT (FK) | References `users.id` |
| `data_type` | TEXT | e.g. `company`, `shareholders` |
| `data_json` | TEXT | JSON-serialized data |
| `updated_at` | DATETIME | Last save timestamp |

> Data is saved using an **UPSERT** (`INSERT ... ON CONFLICT DO UPDATE`) strategy, ensuring only the latest version of each data type is stored per user.

---

## Pages & Components

### Pages

| Route | Component | Description |
|---|---|---|
| `/` | `Landing.tsx` | Public marketing landing page |
| `/login` | `Login.tsx` | User authentication |
| `/signup` | `Signup.tsx` | New user registration |
| `/dashboard` | `Index.tsx` | Main authenticated dashboard |

### Core Dashboard Components

| Component | Tab | Description |
|---|---|---|
| `CompanyInfo.tsx` | Company | Company name, jurisdiction, authorized shares |
| `ShareholderManagement.tsx` | Shareholders | Add/edit/delete shareholders |
| `InvestmentRounds.tsx` | Rounds | Log funding rounds with full term details |
| `AIEquityCalculator.tsx` | AI Advisor | Natural language equity Q&A via OpenAI |
| `ConvertibleInstruments.tsx` | Convertibles | Track SAFEs and convertible notes |
| `StockGrants.tsx` | Grants | ESOP pool and stock grant management |
| `WaterfallAnalysis.tsx` | Scenarios | Exit waterfall modeling |
| `CapTableDisplay.tsx` | Cap Table | Ownership summary table and chart |

---

## Data Persistence

CapZen implements a **safe auto-save** mechanism to ensure no data is ever lost:

1. On login, the dashboard **loads all data** from the SQLite backend.
2. A `isDataLoaded` flag is set to `true` only **after** successful fetch.
3. All `useEffect` auto-save hooks are **gated** behind `isDataLoaded`, preventing the initial empty state from overwriting saved data.
4. Any subsequent change to any data section triggers an **immediate save** to the backend.

---

## Security

- Passwords are hashed using **PBKDF2 with SHA-512** and a random 16-byte salt.
- User sessions are stored in `localStorage` (client-side) after authentication.
- All API requests are CORS-scoped to `localhost:8080` in development.
- The SQLite database file (`server/capzen.db`) is local and never exposed publicly.

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## Developers

| Name | GitHub |
|---|---|
| Sakshi Nikam | [@sakshinikam05](https://github.com/sakshinikam05) |

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

<p align="center">Made with ♥ for India's startup ecosystem</p>
