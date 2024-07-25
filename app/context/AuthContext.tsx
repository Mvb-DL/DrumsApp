"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';

interface User {
  id: number;
  surname: string;
  name: string;
  email: string;
  role: string;
}


interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const cookies = parseCookies();
    const storedUser = cookies.user ? JSON.parse(cookies.user) : null;

    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (user: User) => {
    setCookie(null, 'user', JSON.stringify(user), { path: '/' });
    setUser(user);
  };

  const logout = () => {
    destroyCookie(null, 'user');
    destroyCookie(null, 'token'); // Assuming the server sets and removes the token cookie
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
