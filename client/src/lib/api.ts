import type { User } from '../interfaces/auth';

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
