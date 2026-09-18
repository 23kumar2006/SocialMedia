import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('socialsphere_token');
    const storedUser = localStorage.getItem('socialsphere_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored auth user:', err);
        localStorage.removeItem('socialsphere_token');
        localStorage.removeItem('socialsphere_user');
      }
    }
    setLoading(false);

    // Listen for 401 unauthorized events
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  // Login handler
  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('socialsphere_token', authToken);
    localStorage.setItem('socialsphere_user', JSON.stringify(userData));
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('socialsphere_token');
    localStorage.removeItem('socialsphere_user');
    window.location.href = '/login';
  }, []);

  // Update current user profile in state & storage
  const updateUser = useCallback((updatedData) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedData };
      localStorage.setItem('socialsphere_user', JSON.stringify(nextUser));
      return nextUser;
    });
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    isModerator: user?.role === 'moderator' || user?.role === 'admin',
    isOrganization: user?.role === 'organization',
    isCreator: user?.role === 'creator',
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
