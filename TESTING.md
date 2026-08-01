# Testing Documentation: Smart Expense Tracker

This document provides a comprehensive overview of how testing is structured, configured, executed, and verified within the **Smart Expense Tracker** project.

---

## 1. Overview & Testing Strategy

The backend of Smart Expense Tracker features an automated integration test suite written with **Jest** and **Supertest**. The suite tests end-to-end API HTTP request/response flows against the Express application layer, service layer, Zod schemas, and local file storage repository.

### Key Objectives
* **API Behavior Verification**: Validate HTTP status codes, structured JSON envelopes (`{ success: true, data: ... }` / `{ success: false, error: ... }`), and edge-case error codes.
* **Schema & Input Validation**: Test strict enforcement of length, type, and range limits defined in Zod schemas.
* **Storage Isolation**: Ensure zero pollution of production/seed storage (`expenses.json`) during test runs.
* **Sequential Integrity**: Eliminate concurrent disk access conflicts using file-level fixture resets.

---

## 2. Test Architecture & Configuration

```
backend/
├── jest.config.ts
└── tests/
    ├── expenses.test.ts          # Main API integration test suite
    └── fixtures/
        └── test-expenses.json    # Isolated test storage file (auto-generated & cleaned)
```

### Config File (`backend/jest.config.ts`)
* **Preset**: `ts-jest` for native TypeScript transpilation during test execution.
* **Environment**: `node`.
* **Root Directory**: `tests/`.

### Module Mocking & Storage Redirection
In `expenses.test.ts`, `jest.mock('../src/config/constants')` dynamically overrides `STORAGE_PATH` to point to `tests/fixtures/test-expenses.json`.

```typescript
jest.mock('../src/config/constants', () => ({
  PORT: 3001,
  STORAGE_PATH: path.resolve(__dirname, 'fixtures', 'test-expenses.json'),
  CORS_ORIGINS: ['http://localhost:5173'],
  MAX_EXPENSE_AMOUNT: 10_000_000,
}));
```

---

## 3. Test Lifecycle & Data Isolation

To prevent test interdependence or state leakage across tests:

1. **`beforeEach` Hook**: Automatically resets `test-expenses.json` to an empty JSON array (`[]`) before every single test case runs.
2. **`afterAll` Hook**: Safely unlinks and deletes `test-expenses.json` after all tests in the suite complete.

```typescript
async function resetStorage(): Promise<void> {
  await fs.mkdir(path.dirname(TEST_STORAGE), { recursive: true });
  await fs.writeFile(TEST_STORAGE, JSON.stringify([]), 'utf-8');
}

beforeEach(async () => {
  await resetStorage();
});

afterAll(async () => {
  try {
    await fs.unlink(TEST_STORAGE);
  } catch {
    // Ignore cleanup errors if already removed
  }
});
```

---

## 4. Test Suite Coverage Breakdown

The suite currently contains **20 passed integration tests** divided into 5 logical sections:

### Section A: `POST /expenses` (Creation & Input Validation)
| Test Case Description | Expected Result / Status | Validation Targeted |
| :--- | :--- | :--- |
| **Create Expense** | `201 Created`, valid `id` string returned | Happy path record creation |
| **Trim Whitespace** | `201 Created`, leading/trailing spaces removed | String sanitation (`title`, `note`) |
| **Missing Title** | `400 Bad Request`, `VALIDATION_ERROR` | Required field check |
| **Zero Amount** | `400 Bad Request`, `VALIDATION_ERROR` | Positive number constraint (`amount > 0`) |
| **Negative Amount** | `400 Bad Request`, `VALIDATION_ERROR` | Positive number constraint (`amount > 0`) |
| **Invalid Category** | `400 Bad Request`, `VALIDATION_ERROR` | Category enum whitelist validation |
| **Invalid Date Format** | `400 Bad Request`, `VALIDATION_ERROR` | Regex ISO date matching (`YYYY-MM-DD`) |
| **Title > 40 Chars** | `400 Bad Request`, `VALIDATION_ERROR` | Max string length constraint |
| **Note > 165 Chars** | `400 Bad Request`, `VALIDATION_ERROR` | Max string length constraint |

### Section B: `GET /expenses` (Listing, Sorting & Filtering)
| Test Case Description | Expected Result / Status | Logic Tested |
| :--- | :--- | :--- |
| **Empty State** | `200 OK`, `data: []` | Returns empty array when storage has 0 items |
| **Date Descending Sort** | `200 OK`, dates ordered newest to oldest | Service-level sorting algorithm |
| **Filter by Category** | `200 OK`, filtered records array | Category filtering logic |
| **Invalid Category Query** | `400 Bad Request`, `INVALID_CATEGORY` | Enum check on query parameter |

### Section C: `DELETE /expenses/:id` (Deletion)
| Test Case Description | Expected Result / Status | Logic Tested |
| :--- | :--- | :--- |
| **Delete Existing ID** | `200 OK`, deleted ID returned, removed from list | Successful deletion and persistence |
| **Delete Non-Existent ID** | `404 Not Found`, `NOT_FOUND` error code | Handled error response for missing record |

### Section D: `GET /expenses/summary` (Analytics & Aggregates)
| Test Case Description | Expected Result / Status | Analytics Logic |
| :--- | :--- | :--- |
| **Empty Summary** | `200 OK`, total=0, count=0, highest=null | Zero-state handling |
| **Aggregate Calculations** | `200 OK`, accurate total, average, highest item | Aggregation math logic |
| **Filtered Summary** | `200 OK`, stats computed only for requested category | Category-aware summary math |
| **Monthly Trend** | `200 OK`, grouped items like `["Jun 2026", "Jul 2026"]` | Date grouping and monthly totals |

### Section E: 404 Route Handling
| Test Case Description | Expected Result / Status | Scope |
| :--- | :--- | :--- |
| **Unknown Route** | `404 Not Found`, `success: false` | Express fallthrough error middleware |

---

## 5. Running the Tests

### Backend Command
Run the test command inside the `backend/` directory:

```bash
cd backend
npm test
```

### Execution Flags Explained (`package.json`)
```json
"test": "jest --forceExit --runInBand"
```
* **`--forceExit`**: Forces Jest to exit after all tests complete, preventing lingering open handles (e.g., active logging output).
* **`--runInBand`**: Runs all tests sequentially in the current process rather than spawning a worker pool. This guarantees single-threaded access to the mock JSON storage file.

---

## 6. Sample Test Execution Output

```text
PASS tests/expenses.test.ts
  POST /expenses
    ✓ creates an expense and returns 201 with the created record (72 ms)
    ✓ trims whitespace from title and note (14 ms)
    ✓ returns 400 when title is missing (17 ms)
    ✓ returns 400 when amount is zero (8 ms)
    ✓ returns 400 when amount is negative (8 ms)
    ✓ returns 400 when category is invalid (7 ms)
    ✓ returns 400 when date format is invalid (7 ms)
    ✓ returns 400 when title exceeds 40 characters (8 ms)
    ✓ returns 400 when note exceeds 165 characters (8 ms)
  GET /expenses
    ✓ returns an empty array when no expenses exist (11 ms)
    ✓ returns all expenses sorted by date descending (44 ms)
    ✓ filters expenses by category (39 ms)
    ✓ returns 400 for an invalid category filter (10 ms)
  DELETE /expenses/:id
    ✓ deletes an existing expense and returns its id (26 ms)
    ✓ returns 404 for a non-existent expense (8 ms)
  GET /expenses/summary
    ✓ returns zero values when no expenses exist (7 ms)
    ✓ returns correct aggregate values (48 ms)
    ✓ returns summary filtered by category (29 ms)
    ✓ includes monthly trend data (35 ms)
  404 handling
    ✓ returns 404 for unknown routes (7 ms)

Test Suites: 1 passed, 1 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        2.441 s
```
