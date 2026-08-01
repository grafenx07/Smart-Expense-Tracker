# 💳 Smart Expense Tracker

A production-grade full-stack personal expense tracking system built for the **Diligent Software Engineering Apprenticeship 2026 Assessment**.

---

### 👨‍💻 Candidate & Application Details

* **Developer**: Grafenberg Langpen
* **GitHub**: [@grafenx07](https://github.com/grafenx07)
* **Email**: [grafenberglangpen7@gmail.com](mailto:grafenberglangpen7@gmail.com)
* **🚀 Live Frontend**: [https://smart-expense-tracker-nu-gold.vercel.app/](https://smart-expense-tracker-nu-gold.vercel.app/)
* **⚡ Live Backend API & Swagger Docs**: [https://smart-expense-tracker-42tw.onrender.com/docs](https://smart-expense-tracker-42tw.onrender.com/docs)

---

## 🌟 Assignment Compliance & Highlights

This project fulfills **100% of required specifications** and delivers **ALL 4 optional bonus features**:

- [x] **Add Expense**: `POST /expenses` (id, title, amount, category, date, optional note)
- [x] **View All Expenses**: `GET /expenses`
- [x] **Filter Expenses by Category**: `GET /expenses?category=Food`
- [x] **Calculate Total Expenses**: Overall & category aggregates via `GET /expenses/summary`
- [x] **Delete Expense**: `DELETE /expenses/:id`
- [x] **Local JSON Storage**: Atomic, thread-safe write queue (zero database overhead required)
- [x] **Clean Monorepo Architecture**: Express + TypeScript REST API and React 19 + Vite SPA (Figma-first design)
- [x] **Figma-First Frontend UI**: UI/UX prototyped and designed in Figma before React component implementation
- [x] **Required Documents**: Complete `README.md`, human-evaluated `AI_NOTES.md`, `TESTING.md`, `DEPLOYMENT.md`

### 🎁 Optional Bonus Features Included
1. **Search Expenses**: Full-text client-side searching across titles, notes, and amounts.
2. **Monthly Summary Endpoint**: Comprehensive aggregation endpoint returning total, average, highest expense, and monthly trend breakdown.
3. **OpenAPI / Swagger Docs**: Interactive Swagger documentation live at `/docs`.
4. **Docker Support**: Containerized configuration via `Dockerfile` and `docker-compose.yml`.

---

## 🚀 Quick Start Instructions (For Evaluators)

Follow these exact commands to install dependencies, run the application, and execute tests on a clean checkout.

### 1. Prerequisites
* Node.js v18+ (tested on v20.x & v24.x)
* npm v9+

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/grafenx07/Smart-Expense-Tracker.git
cd Smart-Expense-Tracker

# Install root dependencies
npm install

# Install backend and frontend dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 3. Run Development Servers (Both Frontend & Backend)
Run the root concurrent dev script:
```bash
npm run dev
```
- **Frontend SPA**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:3001`
- **Swagger Documentation**: `http://localhost:3001/docs`

### 4. Run Test Suite
Run the automated integration test suite:
```bash
npm test
```
*(Or inside backend: `cd backend && npm test`)*

---

## 🏗️ Architecture & Project Structure

```
Smart-Expense-Tracker/
├── README.md               # Overview, quickstart, API reference, deployment details
├── AI_NOTES.md            # Required transparency documentation for AI pairing
├── TESTING.md             # Integration test methodology & 20-test breakdown matrix
├── DEPLOYMENT.md          # Cloud deployment guide (Render, Vercel, Docker, Nginx)
├── backend/               # Express + TypeScript REST API
│   ├── src/
│   │   ├── config/        Constants, env variable parsing (PORT, CORS_ORIGINS)
│   │   ├── controllers/   Thin HTTP request handlers
│   │   ├── routes/        Express routes with OpenAPI JSDoc annotations
│   │   ├── services/      Business logic & summary aggregate calculations
│   │   ├── repositories/  Atomic JSON disk file reader/writer with write-queue
│   │   ├── validators/    Zod input schemas & custom constraints
│   │   ├── middleware/    Global error handler & structured logger
│   │   ├── storage/       expenses.json persistent data file
│   │   └── server.ts      HTTP server entry point
│   └── tests/
│       └── expenses.test.ts # Supertest integration test suite (20 tests)
└── frontend/              # React 19 + Vite + TypeScript SPA (Figma-First UI Design)
    └── src/
        ├── api/           Typed Axios API client
        ├── components/    UI primitives, Modals, ConfirmDialogs, Expense tables (translated from Figma)
        ├── hooks/         React Query custom data hooks
        └── pages/         Dashboard, Expenses List, Analytics (Recharts)
```

---

## 📡 REST API Reference

| Method | Endpoint | Query Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/expenses` | `?category=Food` | View all expenses (sorted by date descending). Optional category filter. |
| `POST` | `/expenses` | None | Create a new expense. Input validated with Zod. |
| `DELETE` | `/expenses/:id` | None | Delete an expense by unique ID. |
| `GET` | `/expenses/summary` | `?category=Food` | Calculate total spend, average, count, highest expense, and monthly trend. |

### Sample POST /expenses Payload
```json
{
  "title": "Client Lunch",
  "amount": 450,
  "category": "Food",
  "date": "2026-08-01",
  "note": "Quarterly review meeting"
}
```

### Standard Response Envelope
```json
{
  "success": true,
  "data": {
    "id": "exp_abc123",
    "title": "Client Lunch",
    "amount": 450,
    "category": "Food",
    "date": "2026-08-01",
    "note": "Quarterly review meeting",
    "createdAt": "2026-08-01T12:00:00.000Z"
  }
}
```

---

## 🧪 Testing Summary

The test suite runs 20 automated integration tests using Jest and Supertest.

- **Data Isolation**: `jest.mock` redirects storage to a temporary fixture file.
- **Fixture Reset**: `beforeEach` resets fixture data to `[]` before every test case.
- **Coverage**: Creation validation, string sanitation, category filters, aggregate mathematics, non-existent record 404s, and global route error handling.

For full test suite details, view [TESTING.md](file:///d:/Github%20Projects/Smart%20Expense%20Tracker/TESTING.md).

---

## 🚀 Deployment

The project is deployed on production infrastructure:
- **Frontend**: Hosted on [Vercel](https://smart-expense-tracker-nu-gold.vercel.app/)
- **Backend API**: Hosted on [Render](https://smart-expense-tracker-42tw.onrender.com/docs)

For detailed instructions on deploying to Render, Vercel, Docker Compose, or an Nginx VPS, view [DEPLOYMENT.md](file:///d:/Github%20Projects/Smart%20Expense%20Tracker/DEPLOYMENT.md).
