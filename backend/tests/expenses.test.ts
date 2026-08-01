import request from 'supertest';
import fs from 'fs/promises';
import path from 'path';
import app from '../src/app';

const TEST_STORAGE = path.resolve(__dirname, 'fixtures', 'test-expenses.json');

jest.mock('../src/config/constants', () => ({
  PORT: 3001,
  STORAGE_PATH: path.resolve(__dirname, 'fixtures', 'test-expenses.json'),
  CORS_ORIGINS: ['http://localhost:5173'],
  MAX_EXPENSE_AMOUNT: 10_000_000,
}));

const VALID_EXPENSE = {
  title: 'Test Coffee',
  amount: 200,
  category: 'Food',
  date: '2026-07-15',
  note: 'Integration test',
};

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
    // ignore if already cleaned up
  }
});

describe('POST /expenses', () => {
  it('creates an expense and returns 201 with the created record', async () => {
    const res = await request(app).post('/expenses').send(VALID_EXPENSE);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      title: 'Test Coffee',
      amount: 200,
      category: 'Food',
      date: '2026-07-15',
    });
    expect(typeof res.body.data.id).toBe('string');
    expect(res.body.data.id.length).toBeGreaterThan(0);
  });

  it('trims whitespace from title and note', async () => {
    const res = await request(app)
      .post('/expenses')
      .send({ ...VALID_EXPENSE, title: '  Trimmed  ', note: '  space note  ' });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Trimmed');
    expect(res.body.data.note).toBe('space note');
  });

  it('returns 400 when title is missing', async () => {
    const body = {
      amount: VALID_EXPENSE.amount,
      category: VALID_EXPENSE.category,
      date: VALID_EXPENSE.date,
      note: VALID_EXPENSE.note,
    };
    const res = await request(app).post('/expenses').send(body);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when amount is zero', async () => {
    const res = await request(app)
      .post('/expenses')
      .send({ ...VALID_EXPENSE, amount: 0 });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when amount is negative', async () => {
    const res = await request(app)
      .post('/expenses')
      .send({ ...VALID_EXPENSE, amount: -50 });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when category is invalid', async () => {
    const res = await request(app)
      .post('/expenses')
      .send({ ...VALID_EXPENSE, category: 'InvalidCategory' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when date format is invalid', async () => {
    const res = await request(app)
      .post('/expenses')
      .send({ ...VALID_EXPENSE, date: '15-07-2026' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when title exceeds 40 characters', async () => {
    const res = await request(app)
      .post('/expenses')
      .send({ ...VALID_EXPENSE, title: 'A'.repeat(41) });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when note exceeds 165 characters', async () => {
    const res = await request(app)
      .post('/expenses')
      .send({ ...VALID_EXPENSE, note: 'N'.repeat(166) });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('GET /expenses', () => {
  it('returns an empty array when no expenses exist', async () => {
    const res = await request(app).get('/expenses');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it('returns all expenses sorted by date descending', async () => {
    await request(app).post('/expenses').send({ ...VALID_EXPENSE, date: '2026-07-10' });
    await request(app).post('/expenses').send({ ...VALID_EXPENSE, date: '2026-07-20' });
    await request(app).post('/expenses').send({ ...VALID_EXPENSE, date: '2026-07-15' });

    const res = await request(app).get('/expenses');
    expect(res.status).toBe(200);
    const dates = res.body.data.map((e: { date: string }) => e.date);
    expect(dates).toEqual(['2026-07-20', '2026-07-15', '2026-07-10']);
  });

  it('filters expenses by category', async () => {
    await request(app).post('/expenses').send({ ...VALID_EXPENSE, category: 'Food' });
    await request(app)
      .post('/expenses')
      .send({ ...VALID_EXPENSE, category: 'Transport' });

    const res = await request(app).get('/expenses?category=Food');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].category).toBe('Food');
  });

  it('returns 400 for an invalid category filter', async () => {
    const res = await request(app).get('/expenses?category=Unknown');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_CATEGORY');
  });
});

describe('DELETE /expenses/:id', () => {
  it('deletes an existing expense and returns its id', async () => {
    const create = await request(app).post('/expenses').send(VALID_EXPENSE);
    const { id } = create.body.data as { id: string };

    const res = await request(app).delete(`/expenses/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(id);

    const list = await request(app).get('/expenses');
    expect(list.body.data).toHaveLength(0);
  });

  it('returns 404 for a non-existent expense', async () => {
    const res = await request(app).delete('/expenses/nonexistent-id');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});

describe('GET /expenses/summary', () => {
  it('returns zero values when no expenses exist', async () => {
    const res = await request(app).get('/expenses/summary');
    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(0);
    expect(res.body.data.count).toBe(0);
    expect(res.body.data.highest).toBeNull();
  });

  it('returns correct aggregate values', async () => {
    await request(app)
      .post('/expenses')
      .send({ ...VALID_EXPENSE, amount: 100, category: 'Food' });
    await request(app)
      .post('/expenses')
      .send({ ...VALID_EXPENSE, amount: 300, category: 'Transport' });

    const res = await request(app).get('/expenses/summary');
    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(400);
    expect(res.body.data.average).toBe(200);
    expect(res.body.data.count).toBe(2);
    expect(res.body.data.highest.amount).toBe(300);
  });

  it('returns summary filtered by category', async () => {
    await request(app)
      .post('/expenses')
      .send({ ...VALID_EXPENSE, amount: 100, category: 'Food' });
    await request(app)
      .post('/expenses')
      .send({ ...VALID_EXPENSE, amount: 500, category: 'Health' });

    const res = await request(app).get('/expenses/summary?category=Food');
    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(100);
    expect(res.body.data.count).toBe(1);
  });

  it('includes monthly trend data', async () => {
    await request(app)
      .post('/expenses')
      .send({ ...VALID_EXPENSE, amount: 200, date: '2026-06-10' });
    await request(app)
      .post('/expenses')
      .send({ ...VALID_EXPENSE, amount: 300, date: '2026-07-15' });

    const res = await request(app).get('/expenses/summary');
    expect(res.status).toBe(200);
    const months = res.body.data.monthlyTrend.map((m: { month: string }) => m.month);
    expect(months).toContain('Jun 2026');
    expect(months).toContain('Jul 2026');
  });
});

describe('404 handling', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
