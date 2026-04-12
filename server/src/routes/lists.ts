import { Router } from 'express';
import { and, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { lists, listGames } from '../db/schema.js';
import { requireAuth, validateSessionMiddleware } from '../middleware/auth.js';
import { igdbQuery } from '../igdb/client.js';
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

router.get('/:id', validateSessionMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'Invalid list id' });
    return;
  }

  const [list] = await db.select().from(lists).where(eq(lists.id, id));
  if (!list) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  const requestingUser = res.locals.user as User | null;
  if (!list.isPublic && requestingUser?.userId !== list.userId) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  const gameRows = await db.select().from(listGames).where(eq(listGames.listId, id));

  let games: unknown[] = [];
  if (gameRows.length > 0) {
    const ids = gameRows.map((r) => r.igdbGameId).join(',');
    games = await igdbQuery(
      'games',
      `fields id, name, cover.url; where id = (${ids}); limit ${gameRows.length};`,
    );
  }

  res.json({ ...list, games });
});

router.post('/:id/games', requireAuth, async (req, res) => {
  const user = res.locals.user as User;
  const listId = Number(req.params.id);
  if (!Number.isInteger(listId) || listId <= 0) {
    res.status(400).json({ error: 'Invalid list id' });
    return;
  }

  const { igdbGameId } = req.body as { igdbGameId: number };
  if (!Number.isInteger(igdbGameId) || igdbGameId <= 0) {
    res.status(400).json({ error: 'igdbGameId is required' });
    return;
  }

  const [list] = await db.select().from(lists).where(eq(lists.id, listId));
  if (!list || list.userId !== user.userId) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  const existing = await db
    .select()
    .from(listGames)
    .where(and(eq(listGames.listId, listId), eq(listGames.igdbGameId, igdbGameId)));

  if (existing.length > 0) {
    res.status(409).json({ error: 'Game already in list' });
    return;
  }

  const [inserted] = await db.insert(listGames).values({ listId, igdbGameId }).returning();
  res.status(201).json(inserted);
});

router.delete('/:id/games/:igdbGameId', requireAuth, async (req, res) => {
  const user = res.locals.user as User;
  const listId = Number(req.params.id);
  const igdbGameId = Number(req.params.igdbGameId);

  if (
    !Number.isInteger(listId) ||
    listId <= 0 ||
    !Number.isInteger(igdbGameId) ||
    igdbGameId <= 0
  ) {
    res.status(400).json({ error: 'Invalid parameters' });
    return;
  }

  const [list] = await db.select().from(lists).where(eq(lists.id, listId));
  if (!list || list.userId !== user.userId) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  await db
    .delete(listGames)
    .where(and(eq(listGames.listId, listId), eq(listGames.igdbGameId, igdbGameId)));

  res.status(204).end();
});

export default router;
