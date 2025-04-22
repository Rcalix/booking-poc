import api from './api';
import { User } from '../types';

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    localStorage.removeItem('jwt_token');
    sessionStorage.removeItem('user');
    
    await api.post('/auth/logout');
    
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });

  } catch (error) {
    console.error('Error logging out:', error);
  } finally {
    window.location.href = '/';
  }
};

export const saveToken = (token: string): void => {
  localStorage.setItem('jwt_token', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('jwt_token');
};

export const login = (): void => {
  window.location.href = 'http://localhost:3001/api/auth/login';
};

