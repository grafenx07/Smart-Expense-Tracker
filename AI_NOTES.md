# AI Notes & Engineering Transparency

**Applicant**: Grafenberg Langpen  
**GitHub**: [@grafenx07](https://github.com/grafenx07)  
**Email**: [grafenberglangpen7@gmail.com](mailto:grafenberglangpen7@gmail.com)  
**Live Application**: [https://smart-expense-tracker-nu-gold.vercel.app/](https://smart-expense-tracker-nu-gold.vercel.app/)  
**Interactive API Docs**: [https://smart-expense-tracker-42tw.onrender.com/docs](https://smart-expense-tracker-42tw.onrender.com/docs)  
**Target Role**: Diligent — Software Engineering Apprenticeship 2026  

---

## Executive Summary

Throughout building the **Smart Expense Tracker**, I utilized modern AI pair-programming tools (Antigravity AI powered by Claude 3.5 Sonnet / 3.6 Flash) as an intelligent velocity multiplier. My approach was not to blindly generate code, but rather to act as the primary Software Architect and Lead Engineer: defining exact API specs, enforcing clean layered separation of concerns, conducting code reviews, catching build/deployment edge cases, and writing automated test suites.

This document details the division of labor, my validation methodology, adjustments made to AI suggestions, and architectural trade-offs.

---

## 1. Division of Labor: AI Generation vs. Human Guidance

### Human-Led Architecture & Guidance (Grafenberg Langpen)
* **Domain & System Architecture**: Designed the 5-tier architecture (`Route → Controller → Service → Repository → Storage`) to guarantee strict separation of concerns, ensuring zero business logic leaked into HTTP handlers.
* **Concurrency Model Design**: Specified the promise-chained write-queue pattern (`enqueueWrite` + atomic temp-file rename) for JSON storage to guarantee zero data corruption under concurrent write requests.
* **Schema & Boundary Constraints**: Defined strict input validation parameters (e.g., max 40 chars for expense titles, 165 chars for notes, positive non-zero amounts, ISO `YYYY-MM-DD` date formatting).
* **Testing Strategy**: Orchestrated 100% test isolation using Jest module mocking to redirect `STORAGE_PATH` to temporary fixtures cleaned up before each test case (`beforeEach`).
* **Deployment & CI Configuration**: Solved TypeScript compilation output issues (`rootDir` setting) for Render server execution, configured CORS origin matching for Vercel cross-domain requests, and set up Docker environment files.

### AI-Assisted Implementation
* **Boilerplate & Scaffold Generation**: Accelerated setup of Express routing tables, Zod validation schemas, Swagger OpenAPI annotations, and React Query custom hooks.
* **UI Component Assembly**: Scaffolded Tailwind CSS layout components, Recharts visualizations, and reusable React UI primitives (`Modal`, `ConfirmDialog`, `Badge`, `Spinner`).
* **Test Case Expansion**: Expanded the integration test suite to cover multi-variant validation scenarios (zero amount, negative amount, character overflow, empty state).

---

## 2. What Was Validated, Tested & Adjusted (And Why)

### 🛠️ 1. TypeScript Build Output Path (`rootDir` & Render Deployment Fix)
* **Issue Caught**: During cloud deployment to Render, the server failed with `Error: Cannot find module '/opt/render/project/src/backend/dist/server.js'`.
* **Root Cause Analysis**: The initial `tsconfig.json` included both `src/` and `tests/` without a `rootDir`, causing `tsc` to output nested folders (`dist/src/server.js` and `dist/tests/`).
* **Human Adjustment**: Modified `backend/tsconfig.json` to explicitly enforce `"rootDir": "./src"` and `"include": ["src/**/*"]`. Verified locally that `npm run build` cleanly outputs `dist/server.js` at the expected top-level root.

### 🌐 2. Dynamic Cross-Origin Resource Sharing (CORS) Handling
* **Issue Caught**: Upon deploying the frontend to Vercel, requests to the Render backend threw `net::ERR_FAILED` preflight CORS blocks.
* **Human Adjustment**: Refactored `backend/src/config/constants.ts` and `backend/src/app.ts` to sanitize trailing slashes from origin strings (`.replace(/\/$/, '')`) and added dynamic origin evaluation to automatically trust Vercel domain patterns (`*.vercel.app`) as well as configured environment variables.

### 🔒 3. Concurrency Safety on JSON Storage
* **Validation**: Naive file writing (`fs.writeFile('expenses.json')`) creates race conditions when multiple POST/DELETE requests land simultaneously.
* **Human Adjustment**: Verified that the repository's `enqueueWrite` mechanism correctly chains writing promises and utilizes an atomic temporary file rename (`fs.writeFile('expenses.json.tmp')` followed by `fs.rename()`).

### 🧪 4. Fix for `jest.config.ts` Deprecation Warnings & Setup Typo
* **Issue Caught**: Initial Jest config referenced an invalid property `setupFilesAfterFramework`.
* **Human Adjustment**: Fixed the typo to `setupFilesAfterEnv`, eliminating warnings during automated test execution.

---

## 3. Rejected AI Suggestions & Architectural Decisions

| AI Suggestion | Decision | Human Engineering Rationale |
| :--- | :--- | :--- |
| **Use SQLite or MongoDB** | **REJECTED** | The Diligent assignment spec explicitly requested JSON file or in-memory storage with zero database setup. A custom atomic JSON repository was designed instead. |
| **Use Chart.js for Frontend Visualizations** | **REJECTED** | Chart.js requires imperative canvas context manipulation which collides with React 19's declarative rendering loop. Selected **Recharts**, a composable React-native SVG library. |
| **Use `date-fns` or `moment.js` for Date Handling** | **REJECTED** | Omitted third-party date dependencies to minimize bundle size. Standardized all formatting on JavaScript's native `Intl.DateTimeFormat` API. |
| **Server-Side Pagination & Complex Querying** | **REJECTED** | For a local JSON dataset of personal expenses, server-side pagination adds unnecessary latency and complexity. Client-side pagination (6 records per page) provides an instant 60fps UX matching the Figma specs. |
| **Monorepo Complexity via Turborepo/Nx** | **REJECTED** | For a lean 2-package project, monorepo orchestration tools add build overhead. Used simple `npm` scripts backed by `concurrently` for root-level developer experience. |

---

## 4. Key Takeaways & Developer Philosophy

Pairing with AI allowed me to complete what would normally be an 8-hour full-stack project in record time, but the **engineering ownership, reliability, correctness, and edge-case handling** remained 100% human-driven. Every line of code, test case, and configuration was reviewed, executed, and verified against real-world deployment environments before submission.
