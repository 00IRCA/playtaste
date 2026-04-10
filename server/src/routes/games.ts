import { Router } from 'express';
import { igdbQuery } from '../igdb/client.js';

const router = Router();

const GAME_FIELDS =
  'fields id, name, summary, rating, first_release_date, cover.url, genres.name, platforms.name;';

// GET /api/games/search?q=zelda&limit=20
router.get('/search', async (req, res) => {
  const q = String(req.query.q ?? '').trim();
  const limit = Math.min(Number(req.query.limit ?? 20), 50);

  if (!q) {
    res.status(400).json({ error: 'Missing query parameter: q' });
    return;
  }

  const games = await igdbQuery('games', `${GAME_FIELDS} search "${q}"; limit ${limit};`);

  res.json(games);
});

// GET /api/games/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'Invalid game id' });
    return;
  }

  const games = await igdbQuery<unknown[]>('games', `${GAME_FIELDS} where id = ${id}; limit 1;`);

  if (!games.length) {
    res.status(404).json({ error: 'Game not found' });
    return;
  }

  res.json(games[0]);
});

export default router;
