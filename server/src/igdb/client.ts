import { env } from '../env.js';

interface TwitchToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const params = new URLSearchParams({
    client_id: env.IGDB_CLIENT_ID,
    client_secret: env.IGDB_CLIENT_SECRET,
    grant_type: 'client_credentials',
  });

  const res = await fetch(`https://id.twitch.tv/oauth2/token?${params}`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Twitch token: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as TwitchToken;
  cachedToken = data.access_token;
  // Refresh 60 seconds before expiry
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

export async function igdbQuery<T>(endpoint: string, body: string): Promise<T> {
  const token = await getAccessToken();

  const res = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
    method: 'POST',
    headers: {
      'Client-ID': env.IGDB_CLIENT_ID,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body,
  });

  if (!res.ok) {
    throw new Error(`IGDB error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}
