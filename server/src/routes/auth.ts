import { Router } from 'express';
import { Google, generateCodeVerifier, generateState } from 'arctic';
import { eq, or } from 'drizzle-orm';
import { env } from '../env.js';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { createSession, deleteSession, validateSession } from '../auth/sessions.js';

const router = Router();

const google = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  `${env.BASE_URL}/api/auth/google/callback`,
);

const COOKIE_OPTS = {
  httpOnly: true,
  secure: env.BASE_URL.startsWith('https'),
  sameSite: 'lax',
} as const;

router.get('/google', (_req, res) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, ['openid', 'email', 'profile']);

  res.cookie('oauth_state', state, { ...COOKIE_OPTS, maxAge: 10 * 60 * 1000 });
  res.cookie('oauth_code_verifier', codeVerifier, { ...COOKIE_OPTS, maxAge: 10 * 60 * 1000 });
  res.redirect(url.toString());
});

router.get('/google/callback', async (req, res) => {
  const { code, state } = req.query as { code?: string; state?: string };
  const storedState = req.cookies?.oauth_state as string | undefined;
  const storedVerifier = req.cookies?.oauth_code_verifier as string | undefined;

  if (!code || !state || !storedState || !storedVerifier || state !== storedState) {
    res.status(400).json({ error: 'Invalid OAuth state' });
    return;
  }

  res.clearCookie('oauth_state');
  res.clearCookie('oauth_code_verifier');

  const tokens = await google.validateAuthorizationCode(code, storedVerifier);
  const accessToken = tokens.accessToken();

  const googleRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const googleUser = (await googleRes.json()) as {
    id: string;
    email: string;
    name: string;
    picture: string;
  };

  const existing = await db
    .select()
    .from(users)
    .where(or(eq(users.googleId, googleUser.id), eq(users.email, googleUser.email)))
    .limit(1);

  let userId: number;

  if (existing.length > 0) {
    const user = existing[0];
    await db
      .update(users)
      .set({ googleId: googleUser.id, displayName: googleUser.name, avatarUrl: googleUser.picture })
      .where(eq(users.id, user.id));
    userId = user.id;
  } else {
    const inserted = await db
      .insert(users)
      .values({
        email: googleUser.email,
        googleId: googleUser.id,
        displayName: googleUser.name,
        avatarUrl: googleUser.picture,
      })
      .returning({ id: users.id });
    userId = inserted[0].id;
  }

  const sessionId = await createSession(userId);
  res.cookie('session_id', sessionId, { ...COOKIE_OPTS, maxAge: 30 * 24 * 60 * 60 * 1000 });
  res.redirect(env.CLIENT_URL);
});

router.post('/logout', async (req, res) => {
  const sessionId = req.cookies?.session_id as string | undefined;
  if (sessionId) {
    await deleteSession(sessionId);
    res.clearCookie('session_id');
  }
  res.sendStatus(200);
});

router.get('/me', async (req, res) => {
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

  res.json(user);
});

export default router;
