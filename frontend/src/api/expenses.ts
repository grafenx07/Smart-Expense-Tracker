import client from './client';
import { Expense, ExpenseSummary, Category, ApiSuccess } from '@/types';

interface CreateExpensePayload {
  title: string;
  amount: number;
  category: Category;
  date: string;
  note?: string;
}

export async function fetchExpenses(category?: Category): Promise<Expense[]> {
  const params = category ? { category } : {};
  const { data } = await client.get<ApiSuccess<Expense[]>>('/', { params });
  return data.data;
}

export async function fetchSummary(category?: Category): Promise<ExpenseSummary> {
  const params = category ? { category } : {};
  const { data } = await client.get<ApiSuccess<ExpenseSummary>>('/summary', { params });
  return data.data;
}

export async function createExpense(payload: CreateExpensePayload): Promise<Expense> {
  const { data } = await client.post<ApiSuccess<Expense>>('/', payload);
  return data.data;
}

export async function deleteExpense(id: string): Promise<void> {
  await client.delete(`/${id}`);
}
