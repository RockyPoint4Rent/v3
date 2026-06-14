import { useState, useEffect } from 'react';
import { setAdminToken } from '../lib/adminApi';

const STORAGE_KEY = 'admin_session_token';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

export type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

export function useAdminAuth() {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setAuthState('unauthenticated');
      return;
    }
    fetch(`${SUPABASE_URL}/functions/v1/admin-auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: stored }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.valid) {
          setAdminToken(stored);
          setEmail(data.email);
          setAuthState('authenticated');
        } else {
          localStorage.removeItem(STORAGE_KEY);
          setAuthState('unauthenticated');
        }
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setAuthState('unauthenticated');
      });
  }, []);

const signIn = async (emailInput: string, password: string): Promise<Error | null> => {
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/admin-auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        return new Error(data.error || 'Invalid credentials');
      }
      localStorage.setItem(STORAGE_KEY, data.token);
      setAdminToken(data.token);
      setEmail(data.email);
      setAuthState('authenticated');
      return null;
    } catch {
      return new Error('Network error. Please try again.');
    }
  };

  const signOut = async () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      fetch(`${SUPABASE_URL}/functions/v1/admin-auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: stored }),
      }).catch(() => {});
      localStorage.removeItem(STORAGE_KEY);
    }
    setAdminToken(null);
    setEmail(null);
    setAuthState('unauthenticated');
  };

  return { user: email ? { email } : null, authState, signIn, signOut };
}
