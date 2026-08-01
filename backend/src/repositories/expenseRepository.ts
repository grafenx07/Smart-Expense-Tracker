import fs from 'fs/promises';
import path from 'path';
import { STORAGE_PATH } from '../config/constants';
import { Expense, Category } from '../types';

/**
 * ExpenseRepository owns all I/O against the JSON storage file.
 * A sequential write queue prevents concurrent mutations from corrupting the file.
 * Writes are atomic: data is written to a tmp file then renamed over the target.
 */
class ExpenseRepository {
  private readonly storagePath: string;
  private readonly tmpPath: string;
  private writeQueue: Promise<void> = Promise.resolve();

  constructor(storagePath: string) {
    this.storagePath = storagePath;
    this.tmpPath = `${storagePath}.tmp`;
  }

  async findAll(category?: Category): Promise<Expense[]> {
    const expenses = await this.read();
    if (!category) return expenses;
    return expenses.filter((e) => e.category === category);
  }

  async findById(id: string): Promise<Expense | null> {
    const expenses = await this.read();
    return expenses.find((e) => e.id === id) ?? null;
  }

  async create(expense: Expense): Promise<Expense> {
    await this.enqueueWrite(async () => {
      const expenses = await this.read();
      expenses.push(expense);
      await this.atomicWrite(expenses);
    });
    return expense;
  }

  async deleteById(id: string): Promise<boolean> {
    let deleted = false;
    await this.enqueueWrite(async () => {
      const expenses = await this.read();
      const next = expenses.filter((e) => e.id !== id);
      deleted = next.length < expenses.length;
      if (deleted) {
        await this.atomicWrite(next);
      }
    });
    return deleted;
  }

  private async read(): Promise<Expense[]> {
    try {
      const raw = await fs.readFile(this.storagePath, 'utf-8');
      return JSON.parse(raw) as Expense[];
    } catch (err: unknown) {
      if (this.isNodeError(err) && err.code === 'ENOENT') {
        return [];
      }
      throw err;
    }
  }

  private async atomicWrite(expenses: Expense[]): Promise<void> {
    const dir = path.dirname(this.storagePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(this.tmpPath, JSON.stringify(expenses, null, 2), 'utf-8');
    await fs.rename(this.tmpPath, this.storagePath);
  }

  /**
   * Enqueues a write operation after all previously queued writes.
   * Errors are swallowed at the queue level so a failed write does not
   * permanently stall subsequent operations.
   */
  private enqueueWrite(fn: () => Promise<void>): Promise<void> {
    this.writeQueue = this.writeQueue.then(fn, fn);
    return this.writeQueue;
  }

  private isNodeError(err: unknown): err is NodeJS.ErrnoException {
    return err instanceof Error && 'code' in err;
  }
}

export const expenseRepository = new ExpenseRepository(STORAGE_PATH);
