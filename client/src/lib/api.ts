import type { User } from '../interfaces/auth';
import type { Game } from '../interfaces/game';
import type { List } from '../interfaces/list';

export const BASE_URL = import.meta.env.VITE_API_URL ?? '';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { credentials: 'include', ...options });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const auth = {
  me: (options?: RequestInit) => apiFetch<User>('/api/auth/me', options),
  logout: () => apiFetch<void>('/api/auth/logout', { method: 'POST' }),
};

export const lists = {
  getAll: () => apiFetch<List[]>('/api/lists'),
  create: (body: { name: string; description?: string; isPublic?: boolean }) =>
    apiFetch<List>('/api/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
};

export const games = {
  search: (q: string, limit = 20) =>
    apiFetch<Game[]>(`/api/games/search?q=${encodeURIComponent(q)}&limit=${limit}`),
  get: (id: number) => apiFetch<Game>(`/api/games/${id}`),
};
