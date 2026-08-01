# Smart Expense Tracker

A production-quality full-stack expense tracking application built for a Software Engineering Apprenticeship assessment.

---

## Project Overview

Smart Expense Tracker provides a REST API and a polished React frontend for recording, filtering, and analysing personal expenses. All data is persisted in a JSON file — no database is required.

The codebase prioritises:

- Clean layered architecture (Route → Controller → Service → Repository → Storage)
- Strict TypeScript throughout both packages
- Professional UI matching the Figma design specification
- Comprehensive API test coverage with Jest + Supertest
- Full OpenAPI documentation

---

## Architecture

```
smart-expense-tracker/
├── backend/          Express + TypeScript REST API
│   ├── src/
│   │   ├── config/         Application constants
│   │   ├── controllers/    Thin HTTP handlers
│   │   ├── routes/         Route definitions with OpenAPI annotations
│   │   ├── services/       All business logic
│   │   ├── repositories/   JSON read/write (atomic, concurrent-safe)
│   │   ├── middleware/      Error handler, request logger
│   │   ├── validators/      Zod schemas
│   │   ├── types/          Shared TypeScript interfaces
│   │   ├── utils/          ID generator, formatters, response helpers
│   │   ├── storage/        expenses.json (persisted data)
│   │   ├── docs/           OpenAPI spec definition
│   │   ├── app.ts          Express application factory
│   │   └── server.ts       HTTP server entry point
│   └── tests/
│       └── expenses.test.ts
│
└── frontend/         React + Vite + TypeScript SPA
    └── src/
        ├── api/            Axios client and typed endpoint functions
        ├── components/
        │   ├── ui/         Button, Badge, Card, Input, Modal, etc.
        │   ├── layout/     Sidebar, TopBar, Layout wrapper
        │   └── expenses/   ExpenseRow, ExpenseTable, ExpenseModal
        ├── hooks/          React Query hooks
        ├── pages/          Dashboard, Expenses, Analytics
        ├── router/         Route definitions with lazy loading
        ├── types/          Shared TypeScript interfaces
        └── utils/          Currency/date formatters, category config
```

### Backend Layer Responsibilities

| Layer | Responsibility |
|-------|---------------|
| Route | Declare HTTP endpoints; attach OpenAPI annotations |
| Controller | Extract HTTP concerns; delegate to service |
| Service | All business logic; compute summaries; validate |
| Repository | Read/write JSON storage; no business logic |
| Storage | `expenses.json` on disk |

---

## Features

- **Dashboard** — 4 stat cards (total, count, highest category, current month) and a recent expenses table
- **Expenses** — Full-text search, category filter, sort, pagination (6 per page)
- **Analytics** — Monthly trend line chart, category donut chart, spend-by-category bar chart, horizontal ranked breakdown
- **Add Expense Modal** — Form with live character counters, Zod validation, toast feedback
- **Delete with confirmation** — Confirm dialog before irreversible deletion
- **Toast notifications** — Success and error states on all mutations
- **Loading and empty states** — Skeleton loaders and informative empty screens
- **Keyboard accessible** — Focus management, ARIA roles and labels, Escape to close modal
- **Swagger documentation** — Interactive OpenAPI UI at `/docs`

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/expenses` | List all expenses. Optional `?category=` filter |
| `POST` | `/expenses` | Create a new expense |
| `DELETE` | `/expenses/:id` | Delete expense by ID |
| `GET` | `/expenses/summary` | Summary statistics. Optional `?category=` filter |

### Request body — POST /expenses

```json
{
  "title": "Coffee",
  "amount": 188,
  "category": "Food",
  "date": "2026-07-28",
  "note": "Morning espresso at Blue Tokai"
}
```

### Categories

`Food` | `Transport` | `Shopping` | `Utilities` | `Health` | `Entertainment`

### Response envelope

All responses follow a consistent envelope:

```json
{ "success": true, "data": { ... } }
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```

---

## Installation

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Clone the repository
git clone https://github.com/grafenx07/Smart-Expense-Tracker.git
cd Smart-Expense-Tracker

# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

---

## Running the Application

### Development (both servers)

```bash
npm run dev
```

This starts:
- Backend API at `http://localhost:3001`
- Frontend dev server at `http://localhost:5173`

### Individual servers

```bash
# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm run dev
```

---

## Tests

```bash
npm test
# or
cd backend && npm test
```

The test suite uses Jest + Supertest against a temporary fixture file so the seed data is never touched. Each test gets a clean empty store via `beforeEach`.

For complete documentation on test architecture, fixtures, validation cases, and test strategy, see [TESTING.md](file:///d:/Github%20Projects/Smart%20Expense%20Tracker/TESTING.md).

Test coverage:

- Create expense (valid, trimming, field validation)
- List expenses (empty state, sorted, category filter, invalid category)
- Delete expense (existing, non-existent)
- Summary (empty, aggregates, category filter, monthly trend)
- 404 for unknown routes

---

## Swagger Documentation

With the backend running, visit:

```
http://localhost:3001/docs
```

The OpenAPI 3.0 spec documents all endpoints, request bodies, response schemas, and error responses.

---

## Folder Structure (detailed)

```
backend/src/
  config/constants.ts       Port, CORS origins, storage path
  controllers/
    expenseController.ts    Four thin handlers: list, create, delete, summary
  routes/
    expenseRoutes.ts        Route wiring with JSDoc OpenAPI annotations
  services/
    expenseService.ts       Business logic + AppError class
  repositories/
    expenseRepository.ts    Atomic JSON reads/writes, write queue
  middleware/
    errorHandler.ts         Global error handler (no stack traces to client)
    requestLogger.ts        Structured request logging
  validators/
    expenseValidator.ts     Zod schema for CreateExpense
  types/index.ts            All shared TypeScript interfaces
  utils/
    idGenerator.ts          nanoid wrapper
    responseHelper.ts       sendSuccess / sendError helpers
    dateUtils.ts            Month bucketing and labelling
  storage/expenses.json     Persisted data (seed data included)
  docs/swagger.ts           Programmatic OpenAPI spec
  app.ts                    Express app factory
  server.ts                 HTTP server entry

frontend/src/
  api/
    client.ts               Axios instance (proxied to /expenses)
    expenses.ts             Typed API functions
  hooks/useExpenses.ts      React Query hooks + QUERY_KEYS
  components/
    ui/                     Button, Badge, Card, Input, Select, Textarea,
                            Modal, Spinner, ConfirmDialog
    layout/                 Sidebar, TopBar, Layout
    expenses/               ExpenseRow, ExpenseTable, ExpenseModal
  pages/
    Dashboard.tsx           Stat cards + recent expenses
    Expenses.tsx            Search, filter, sort, pagination
    Analytics.tsx           Four Recharts visualisations
  router/index.tsx          Lazy-loaded routes
  types/index.ts            Frontend type definitions
  utils/
    formatters.ts           Intl currency and date formatting
    categoryConfig.ts       Category → colour/icon/class mapping
```

---

## Deployment

For step-by-step instructions on deploying via Render, Vercel, Docker Compose, or an Nginx VPS, see [DEPLOYMENT.md](file:///d:/Github%20Projects/Smart%20Expense%20Tracker/DEPLOYMENT.md).

### Quick Build Commands

```bash
# Backend build & start
cd backend && npm run build && npm start

# Frontend production bundle
cd frontend && npm run build
```


---

## Tradeoffs

| Decision | Rationale |
|----------|-----------|
| JSON file storage | Required by spec. Atomic writes (temp file + rename) prevent partial corruption. A sequential write queue prevents concurrent write races. |
| No auth | Out of scope per spec. |
| Client-side pagination | Simpler implementation; data volume with JSON storage does not warrant server-side pagination. |
| Recharts | Composable, React-native, tree-shakeable. Smaller bundle than Chart.js for this use case. |
| Intl formatters | Native API; no date/currency library needed for the scope. |

---

## Future Improvements

- Migrate to SQLite for concurrent write safety at scale
- Add server-side pagination with cursor-based navigation
- Introduce budget envelopes per category
- Add export to CSV
- Add authentication and multi-user support
- Replace request logger with structured pino logger
- Add React Query Devtools in development
