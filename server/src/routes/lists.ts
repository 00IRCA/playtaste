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

router.post('/', requireAuth, async (req, res) => {
  const user = res.locals.user as User;
  const { name, description, isPublic } = req.body as {
    name: string;
    description?: string;
    isPublic?: boolean;
  };

  if (!name || typeof name !== 'string' || name.trim() === '') {
    res.status(400).json({ error: 'name is required' });
    return;
  }

  const inserted = await db
    .insert(lists)
    .values({
      userId: user.userId,
      name: name.trim(),
      description: description?.trim() ?? null,
      isPublic: isPublic ?? true,
    })
    .returning();

  res.status(201).json(inserted[0]);
});

export default router;
