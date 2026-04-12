import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { lists } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';
import type { User } from '../interfaces/user.js';

const router = Router();

router.get('/', requireAuth, async (_req, res) => {
  const user = res.locals.user as User;
  const rows = await db.select().from(lists).where(eq(lists.userId, user.userId));
  res.json(rows);
});

export default router;
