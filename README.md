<div align="center">

# CapZen

> ### 📊 **Cap Table & Equity Management Platform for Indian Startups** 📊
> ✨ **Real-time Cap Tables** &nbsp;|&nbsp; 🤖 **AI Equity Advisor** &nbsp;|&nbsp; 🇮🇳 **100% INR Native**

---

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-ffffff?style=for-the-badge&logo=react&logoColor=000000" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-000000?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-better--sqlite3-ffffff?style=for-the-badge&logo=sqlite&logoColor=000000" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4-000000?style=for-the-badge&logo=openai&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vite-5.4-ffffff?style=for-the-badge&logo=vite&logoColor=000000" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-000000?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-4.x-ffffff?style=for-the-badge&logo=express&logoColor=000000" />
  <img src="https://img.shields.io/badge/Currency-INR_%E2%82%B9-000000?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=20&pause=1000&color=FFFFFF&center=true&vCenter=true&width=600&lines=Real-time+Cap+Table+Management;AI-Powered+Equity+Advisor;ESOP+%26+Stock+Grant+Tracking;Dilution+Modeling+%26+Waterfall+Analysis;Secure+Per-User+SQLite+Persistence" alt="Typing SVG" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Cap_Tables-Fully_Managed-000000?style=for-the-badge" />
  <img src="https://img.shields.io/badge/ESOP-Automated_Vesting-ffffff?style=for-the-badge&labelColor=000000&color=ffffff" />
  <img src="https://img.shields.io/badge/Auth-PBKDF2_SHA512-000000?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Export-XLSX_Ready-ffffff?style=for-the-badge&labelColor=000000&color=ffffff" />
</p>

</div>

---

## 📋 Table of Contents

| # | Section |
|---|---------|
| 1 | [✨ Overview](#-overview) |
| 2 | [🎯 Features](#-features) |
| 3 | [🧠 Tech Stack](#-tech-stack) |
| 4 | [📂 Project Structure](#-project-structure) |
| 5 | [🚀 Getting Started](#-getting-started) |
| 6 | [🔧 Environment Variables](#-environment-variables) |
| 7 | [▶️ Running the App](#-running-the-app) |
| 8 | [🔌 API Reference](#-api-reference) |
| 9 | [🗄️ Database Schema](#-database-schema) |
| 10 | [🔐 Security](#-security) |
| 11 | [❤️ Contributors](#-contributors) |

---

## ✨ Overview

**CapZen** is a full-stack SaaS application that gives Indian startups a single source of truth for all things equity. Built on **React + Vite** (frontend) and **Node.js + Express + SQLite** (backend), with optional **OpenAI GPT-4** integration for the AI Equity Advisor.

**Key design decisions:**
- All monetary values are in **INR (₹)** — no USD ever.
- All data is **auto-saved per user** to a SQLite database on every change.
- A race-condition-safe `isDataLoaded` flag ensures saved data is **never overwritten** by an empty session on login.
- Fully **self-hostable** — no cloud dependencies required.

---

## 🎯 Features

<div align="center">

| Feature | Description |
|---|---|
| 📊 **Cap Table Management** | Real-time ownership percentages across all share classes |
| 👥 **Shareholder Registry** | Founders, investors, employees, advisors — all in one place |
| 💰 **Investment Rounds** | Log Seed, Series A/B/C, and Bridge rounds with full term details |
| 📉 **Dilution Modeling** | Simulate future rounds and see ownership impact instantly |
| 📄 **Convertible Instruments** | Track SAFEs and convertible notes with cap & discount logic |
| 🎁 **ESOP & Stock Grants** | Manage employee option pools with vesting schedules |
| 🌊 **Waterfall Analysis** | Model exit scenarios — acquisition, IPO, or liquidation |
| 🤖 **AI Equity Advisor** | Plain-English equity Q&A powered by OpenAI GPT-4 |
| 📥 **XLSX Export** | One-click export of board-ready cap table reports |
| 🔑 **Secure Auth** | Signup/login with PBKDF2-SHA512 password hashing |

</div>

---

## 🧠 Tech Stack

### 🎨 Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.3 | UI framework |
| **TypeScript** | 5.5 | Type safety |
| **Vite** | 5.4 | Build tool & dev server |
| **Tailwind CSS** | 3.4 | Utility-first styling |
| **Radix UI** | Various | Accessible component primitives |
| **React Router DOM** | 6.26 | Client-side routing |
| **Recharts** | 2.12 | Equity visualizations |
| **xlsx** | 0.18 | Excel export |

### ⚙️ Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **better-sqlite3** | Lightweight, fast SQLite driver |
| **OpenAI SDK** | AI Equity Advisor integration |
| **crypto** (built-in) | PBKDF2-SHA512 password hashing |
| **dotenv** | Environment variable management |

---

## 📂 Project Structure

```
CapZen/
├── server/
│   └── index.js                   ← Express API (auth, data save/load, AI)
├── src/
│   ├── components/
│   │   ├── AIEquityCalculator.tsx  ← AI Advisor UI
│   │   ├── CapTableDisplay.tsx     ← Ownership table + chart
│   │   ├── CompanyInfo.tsx         ← Company setup form
│   │   ├── ConvertibleInstruments.tsx
│   │   ├── InvestmentRounds.tsx
│   │   ├── ShareholderManagement.tsx
│   │   ├── StockGrants.tsx
│   │   ├── WaterfallAnalysis.tsx
│   │   └── Logo.tsx / Footer.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx         ← Auth state + API helpers
│   ├── pages/
│   │   ├── Landing.tsx             ← Marketing landing page
│   │   ├── Login.tsx / Signup.tsx
│   │   └── Index.tsx               ← Main dashboard
│   ├── types/index.ts              ← TypeScript interfaces
│   └── utils/enhancedExportUtils.ts← XLSX export logic
├── .env                            ← API keys (not committed)
├── package.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **npm** v9+
- **OpenAI API key** *(optional — only for AI Advisor)*

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/sakshinikam05/CapZen.git
cd CapZen

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your OpenAI key
```

---

## 🔧 Environment Variables

```env
# .env — place in project root
OPENAI_API_KEY=sk-your-openai-api-key-here
```

> The AI Equity Advisor is the **only** feature requiring an API key. All other features work without it.

---

## ▶️ Running the App

CapZen runs two processes in parallel:

```bash
# Terminal 1 — Backend API (port 3001)
node server/index.js

# Terminal 2 — Frontend dev server (port 8080)
npm run dev
```

**Or run both together (macOS/Linux):**
```bash
node server/index.js & npm run dev
```

On first run, the SQLite database is automatically created at `server/capzen.db`.

**Production build:**
```bash
npm run build   # Output in dist/
```

---

## 🔌 API Reference

> Base URL: `http://localhost:3001`

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/signup` | Create account |
| `POST` | `/api/login` | Authenticate user |

### Cap Table Data
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/data/save` | Save a data section (`company`, `shareholders`, etc.) |
| `GET` | `/api/data/load/:userId` | Load all data for a user |

### AI Advisor
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/calculate` | Submit equity question to GPT-4 |

### Health
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server + DB status check |

---

## 🗄️ Database Schema

> SQLite with WAL mode · Auto-created on first run

### `users`
| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (PK) | UUID |
| `name` | TEXT | Full name |
| `email` | TEXT UNIQUE | Login email |
| `password_hash` | TEXT | PBKDF2-SHA512 + random salt |
| `created_at` | DATETIME | Auto timestamp |

### `cap_table_data`
| Column | Type | Notes |
|---|---|---|
| `id` | TEXT (PK) | `{userId}_{dataType}` |
| `user_id` | TEXT (FK) | References `users.id` |
| `data_type` | TEXT | `company`, `shareholders`, etc. |
| `data_json` | TEXT | JSON-serialized data |
| `updated_at` | DATETIME | Last save timestamp |

> Uses **UPSERT** — each save replaces the previous version of that data type.

---

## 🔐 Security

| Concern | Implementation |
|---|---|
| 🔑 Passwords | PBKDF2 + SHA-512 + 16-byte random salt |
| 🔒 Sessions | Stored in `localStorage` post-auth |
| 🌐 CORS | Scoped to `localhost:8080` in dev |
| 💾 Database | Local SQLite file, never publicly exposed |
| 📁 Data isolation | All queries scoped strictly by `userId` |

---

## ❤️ Contributors

<br />

<table align="center">
  <tr>
    <td align="center">
      <img src="https://github.com/sakshinikam05.png?size=80" width="70" height="70" style="border-radius:50%;" alt="Sakshi Nikam"/>
      <br /><sub><b>Sakshi Nikam</b></sub>
    </td>
    <td align="center">
      <img src="" width="70" height="70" style="border-radius:50%;" alt="Sneha Andhale"/>
      <br /><sub><b>Sneha Andhale</b></sub>
    </td>
    <td align="center">
      <img src="" width="70" height="70" style="border-radius:50%;" alt="Shrushti Pawar"/>
      <br /><sub><b>Shrushti Pawar</b></sub>
    </td>
    <td align="center">
      <img src="" width="70" height="70" style="border-radius:50%;" alt="Vishakha Patil"/>
      <br /><sub><b>Vishakha Patil</b></sub>
    </td>
  </tr>
</table>

<br />

---

<div align="center">

> #### Built with 💻 & ☕ for India's startup ecosystem
>
> © CapZen 2026 · MIT License · Industry Project

</div>
