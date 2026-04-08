import type { RequestHandler } from 'express';
import { validateSession } from '../auth/sessions.js';

export const validateSessionMiddleware: RequestHandler = async (req, res, next) => {
  const sessionId = req.cookies?.session_id as string | undefined;
  if (!sessionId) {
    res.locals.user = null;
    return next();
  }

  const user = await validateSession(sessionId);
  if (!user) {
    res.clearCookie('session_id');
    res.locals.user = null;
    return next();
  }

  res.locals.user = user;
  next();
};

export const requireAuth: RequestHandler = async (req, res, next) => {
  const sessionId = req.cookies?.session_id as string | undefined;
  if (!sessionId) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const user = await validateSession(sessionId);
  if (!user) {
    res.clearCookie('session_id');
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  res.locals.user = user;
  next();
};
