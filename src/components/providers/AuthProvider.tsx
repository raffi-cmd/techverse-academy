'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserSession {
  id: string;
  email: string;
  name: string | null;
  role: string;
  image: string | null;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          return;
        }
      }
    } catch {
      // Fallback to client localStorage on static hosting
    }

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('devora_user');
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network failure on static export
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('devora_user');
    }
    setUser(null);
    window.location.href = '/techverse-academy/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, refresh: fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}