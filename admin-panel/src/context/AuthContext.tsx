"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  id: string;
  name: string;
  role: string;
  branchId: string;
  branch?: any;
  permissions?: string[]; // Branch module permissions for STAFF users
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    // Initialize auth state from cookies
    const storedToken = Cookies.get('nsm_admin_token');
    const storedUserStr = Cookies.get('nsm_admin_user');
    
    if (storedToken && storedUserStr) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUserStr));
      } catch (e) {
        // Invalid cookie data
        Cookies.remove('nsm_admin_token');
        Cookies.remove('nsm_admin_user');
      }
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    Cookies.set('nsm_admin_token', newToken, { expires: 1 }); // expires in 1 day
    Cookies.set('nsm_admin_user', JSON.stringify(newUser), { expires: 1 });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    Cookies.remove('nsm_admin_token');
    Cookies.remove('nsm_admin_user');
    router.push('/'); // Redirect to login page
  };

  // Protect routes - if trying to access any page other than exactly "/" (login) and not authenticated
  useEffect(() => {
    if (!isMounted) return;
    
    // Very basic route protection logic. In Next.js App router, middleware is better, 
    // but doing it client-side is fine for a quick integration prototype.
    if (!token && pathname !== '/') {
      router.push('/'); // send back to login
    }
  }, [token, pathname, isMounted, router]);

  if (!isMounted) {
    return null; // Prevents hydration mismatch
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
