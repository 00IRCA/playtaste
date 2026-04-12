import type { User } from '../interfaces/auth';
import type { Game } from '../interfaces/game';
import type { List } from '../interfaces/list';
import type { ListWithGames } from '../interfaces/listWithGames';

export const BASE_URL = import.meta.env.VITE_API_URL ?? '';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { credentials: 'include', ...options });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export const auth = {
  me: (options?: RequestInit) => apiFetch<User>('/api/auth/me', options),
  logout: () => apiFetch<void>('/api/auth/logout', { method: 'POST' }),
};

export const lists = {
  getAll: () => apiFetch<List[]>('/api/lists'),
  getById: (id: number) => apiFetch<ListWithGames>(`/api/lists/${id}`),
  create: (body: { name: string; description?: string; isPublic?: boolean }) =>
    apiFetch<List>('/api/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  addGame: (listId: number, igdbGameId: number) =>
    apiFetch<void>(`/api/lists/${listId}/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ igdbGameId }),
    }),
  removeGame: (listId: number, igdbGameId: number) =>
    apiFetch<void>(`/api/lists/${listId}/games/${igdbGameId}`, { method: 'DELETE' }),
};

export const games = {
  search: (q: string, limit = 20) =>
    apiFetch<Game[]>(`/api/games/search?q=${encodeURIComponent(q)}&limit=${limit}`),
  get: (id: number) => apiFetch<Game>(`/api/games/${id}`),
};
