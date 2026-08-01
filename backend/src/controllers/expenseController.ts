import { Request, Response, NextFunction } from 'express';
import { expenseService } from '../services/expenseService';
import { sendSuccess } from '../utils/responseHelper';

export async function listExpenses(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const expenses = await expenseService.listExpenses(category);
    sendSuccess(res, expenses);
  } catch (err) {
    next(err);
  }
}

export async function createExpense(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const expense = await expenseService.createExpense(req.body);
    sendSuccess(res, expense, 201);
  } catch (err) {
    next(err);
  }
}

export async function deleteExpense(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await expenseService.deleteExpense(req.params.id);
    sendSuccess(res, { id: req.params.id });
  } catch (err) {
    next(err);
  }
}

export async function getSummary(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const summary = await expenseService.getSummary(category);
    sendSuccess(res, summary);
  } catch (err) {
    next(err);
  }
}
