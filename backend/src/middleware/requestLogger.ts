import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  const ts = new Date().toISOString();
  console.info(`[${ts}] ${req.method} ${req.url}`);
  next();
}
