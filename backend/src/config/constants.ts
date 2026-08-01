import path from 'path';

export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

export const STORAGE_PATH = path.resolve(__dirname, '..', 'storage', 'expenses.json');

export const CORS_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];

export const MAX_EXPENSE_AMOUNT = 10_000_000;
