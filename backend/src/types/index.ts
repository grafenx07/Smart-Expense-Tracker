export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Utilities',
  'Health',
  'Entertainment',
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string;
  note?: string;
  createdAt: string;
}

export interface CreateExpenseDto {
  title: string;
  amount: number;
  category: Category;
  date: string;
  note?: string;
}

export interface MonthlyTrend {
  month: string;
  total: number;
}

export interface CategoryBreakdown {
  name: Category;
  total: number;
}

export interface ExpenseSummary {
  total: number;
  average: number;
  count: number;
  highest: Pick<Expense, 'id' | 'title' | 'amount'> | null;
  highestCategory: CategoryBreakdown | null;
  byCategory: Partial<Record<Category, number>>;
  monthlyTrend: MonthlyTrend[];
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
