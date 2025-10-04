"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type User = { id?: string; name?: string; email?: string; phone?: string; role?: string; photo?: string } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(() => typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  useEffect(() => {
    // try to hydrate user from token
    if (token) {
      fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then((data) => {
          if (data && data.user) setUser(data.user);
        }).catch(() => {});
    }
  }, [token]);

  const login = (tok: string, u: User) => {
    try { localStorage.setItem('token', tok); } catch (e) {}
    try { localStorage.setItem('current_user_email', u?.email || u?.phone || 'guest'); } catch (e) {}
    setToken(tok);
    setUser(u);
  };

  const logout = () => {
    try { localStorage.removeItem('token'); } catch (e) {}
    setToken(null);
    setUser(null);
    try { localStorage.removeItem('current_user_email'); } catch (e) {}
  };

  const refresh = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data && data.user) setUser(data.user);
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refresh }}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
