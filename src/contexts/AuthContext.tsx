import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_BASE = 'http://localhost:3001/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  saveCapData: (dataType: string, data: unknown) => Promise<void>;
  loadCapData: () => Promise<Record<string, unknown>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('capzen_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('capzen_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed.' };
      }

      setUser(data.user);
      localStorage.setItem('capzen_user', JSON.stringify(data.user));
      return { success: true };
    } catch {
      return { success: false, error: 'Cannot connect to server. Make sure the backend is running.' };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Signup failed.' };
      }

      setUser(data.user);
      localStorage.setItem('capzen_user', JSON.stringify(data.user));
      return { success: true };
    } catch {
      return { success: false, error: 'Cannot connect to server. Make sure the backend is running.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('capzen_user');
  };

  const saveCapData = async (dataType: string, data: unknown) => {
    if (!user) return;
    try {
      await fetch(`${API_BASE}/data/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, dataType, data }),
      });
    } catch (err) {
      console.error('Failed to save cap table data:', err);
    }
  };

  const loadCapData = async (): Promise<Record<string, unknown>> => {
    if (!user) return {};
    try {
      const res = await fetch(`${API_BASE}/data/load/${user.id}`);
      if (!res.ok) return {};
      return await res.json();
    } catch {
      console.error('Failed to load cap table data');
      return {};
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout, saveCapData, loadCapData }}>
      {children}
    </AuthContext.Provider>
  );
};
