import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  loginWithGoogle: (credential: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ user: User }>('/auth/me')
      .then((result) => setUser(result.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async loginWithGoogle(credential) {
        const result = await api<{ user: User; token: string; csrf: string }>('/auth/google', {
          method: 'POST',
          body: JSON.stringify({ credential }),
        });
        sessionStorage.setItem('psuwit_token',result.token); sessionStorage.setItem('psuwit_csrf',result.csrf); setUser(result.user);
      },
      async loginDemo() {
        const result = await api<{ user: User; token: string; csrf: string }>('/auth/demo', { method: 'POST' });
        sessionStorage.setItem('psuwit_token',result.token); sessionStorage.setItem('psuwit_csrf',result.csrf); setUser(result.user);
      },
      async logout() {
        await api('/auth/logout', { method: 'POST' }).catch(()=>undefined);
        sessionStorage.removeItem('psuwit_token'); sessionStorage.removeItem('psuwit_csrf');
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
