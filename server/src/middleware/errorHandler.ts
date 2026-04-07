import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  const status: number = typeof err.status === 'number' ? err.status : 500;
  const message: string = typeof err.message === 'string' ? err.message : 'Internal Server Error';
  res.status(status).json({ error: message });
};
