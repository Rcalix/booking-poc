"use client";

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  googleCalendarConnected: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      
      const response = await api.get('/auth/me');
      
      if (response.data.isAuthenticated) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const refreshAuth = useCallback(async () => {
    await checkAuth();
  }, []);

  const login = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/login`;
  };

  const logout = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/logout`;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      login, 
      logout,
      refreshAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default useAuth;