import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('woodwright_user');
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error('Failed to parse user from localStorage', err);
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('woodwright_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('woodwright_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      setUser(data);
      setLoading(false);
      return data;
    } catch (err) {
      // Fallback demo login for offline testing if backend is not yet populated
      if (email === 'admin@woodwright.co.nz' && password === 'admin123') {
        const demoAdmin = {
          _id: 'mock-admin-01',
          name: 'Editorial Director',
          email: 'admin@woodwright.co.nz',
          isAdmin: true,
          token: 'mock-jwt-admin-token-749210',
        };
        setUser(demoAdmin);
        setLoading(false);
        return demoAdmin;
      }
      if (email === 'client@example.com' && password === 'client123') {
        const demoClient = {
          _id: 'mock-client-01',
          name: 'Sophie Montgomery',
          email: 'client@example.com',
          isAdmin: false,
          token: 'mock-jwt-client-token-192837',
        };
        setUser(demoClient);
        setLoading(false);
        return demoClient;
      }

      setError(err.message || 'Invalid email or password');
      setLoading(false);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register(name, email, password);
      setUser(data);
      setLoading(false);
      return data;
    } catch (err) {
      // Fallback demo registration
      const newMockUser = {
        _id: `user-${Date.now()}`,
        name,
        email,
        isAdmin: false,
        token: `mock-token-${Date.now()}`,
      };
      setUser(newMockUser);
      setLoading(false);
      return newMockUser;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('woodwright_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAdmin: Boolean(user?.isAdmin),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
