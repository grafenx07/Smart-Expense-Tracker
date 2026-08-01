import { Request, Response, NextFunction } from 'express';
import { AppError } from '../services/expenseService';
import { sendError } from '../utils/responseHelper';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.code, err.message);
    return;
  }

  console.error('[Unhandled error]', err);
  sendError(res, 500, 'INTERNAL_ERROR', 'An unexpected error occurred.');
}
