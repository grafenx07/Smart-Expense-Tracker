import { expenseRepository } from '../repositories/expenseRepository';
import { createExpenseSchema, CreateExpenseInput } from '../validators/expenseValidator';
import {
  Expense,
  Category,
  ExpenseSummary,
  MonthlyTrend,
  CategoryBreakdown,
} from '../types';
import { generateId } from '../utils/idGenerator';
import { toMonthKey, monthKeyToLabel } from '../utils/dateUtils';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * All business logic for expenses lives in this service.
 * Controllers delegate to this class and remain thin.
 */
class ExpenseService {
  async listExpenses(category?: string): Promise<Expense[]> {
    const validCategory = this.parseOptionalCategory(category);
    const expenses = await expenseRepository.findAll(validCategory);
    return expenses.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  async createExpense(raw: unknown): Promise<Expense> {
    const result = createExpenseSchema.safeParse(raw);
    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join(' ');
      throw new AppError(400, 'VALIDATION_ERROR', message);
    }
    const dto: CreateExpenseInput = result.data;
    const expense: Expense = {
      id: generateId(),
      title: dto.title,
      amount: dto.amount,
      category: dto.category,
      date: dto.date,
      ...(dto.note !== undefined && { note: dto.note }),
      createdAt: new Date().toISOString(),
    };
    return expenseRepository.create(expense);
  }

  async deleteExpense(id: string): Promise<void> {
    const deleted = await expenseRepository.deleteById(id);
    if (!deleted) {
      throw new AppError(404, 'NOT_FOUND', `Expense with id '${id}' was not found.`);
    }
  }

  async getSummary(category?: string): Promise<ExpenseSummary> {
    const validCategory = this.parseOptionalCategory(category);
    const expenses = await expenseRepository.findAll(validCategory);

    if (expenses.length === 0) {
      return this.buildEmptySummary();
    }

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const average = total / expenses.length;

    const highest = expenses.reduce((max, e) => (e.amount > max.amount ? e : max), expenses[0]);

    const byCategory = this.groupByCategory(expenses);

    const highestCategoryEntry = Object.entries(byCategory).sort(
      ([, a], [, b]) => b - a,
    )[0];

    const highestCategory: CategoryBreakdown | null = highestCategoryEntry
      ? { name: highestCategoryEntry[0] as Category, total: highestCategoryEntry[1] }
      : null;

    const monthlyTrend = this.buildMonthlyTrend(expenses);

    return {
      total: Math.round(total * 100) / 100,
      average: Math.round(average * 100) / 100,
      count: expenses.length,
      highest: { id: highest.id, title: highest.title, amount: highest.amount },
      highestCategory,
      byCategory,
      monthlyTrend,
    };
  }

  private groupByCategory(expenses: Expense[]): Partial<Record<Category, number>> {
    return expenses.reduce<Partial<Record<Category, number>>>((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount;
      return acc;
    }, {});
  }

  private buildMonthlyTrend(expenses: Expense[]): MonthlyTrend[] {
    const buckets = new Map<string, number>();
    for (const expense of expenses) {
      const key = toMonthKey(expense.date);
      buckets.set(key, (buckets.get(key) ?? 0) + expense.amount);
    }
    return Array.from(buckets.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, total]) => ({
        month: monthKeyToLabel(key),
        total: Math.round(total * 100) / 100,
      }));
  }

  private buildEmptySummary(): ExpenseSummary {
    return {
      total: 0,
      average: 0,
      count: 0,
      highest: null,
      highestCategory: null,
      byCategory: {},
      monthlyTrend: [],
    };
  }

  private parseOptionalCategory(category?: string): Category | undefined {
    if (!category) return undefined;
    const result = createExpenseSchema.shape.category.safeParse(category);
    if (!result.success) {
      throw new AppError(400, 'INVALID_CATEGORY', `'${category}' is not a valid category.`);
    }
    return result.data;
  }
}

export const expenseService = new ExpenseService();
