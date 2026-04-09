import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/api';
import type { User } from '../interfaces/auth';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    auth
      .me({ signal: controller.signal })
      .then(setUser)
      .catch((err: unknown) => {
        if (err instanceof Error && err.name !== 'AbortError') setUser(null);
      })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, []);

  async function logout() {
    await auth.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
