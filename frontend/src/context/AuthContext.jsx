import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  login as apiLogin,
  logout as apiLogout,
  saveAuthData,
  getCurrentUser
} from '../services/authService';

const AuthContext = createContext(null);

/**
 * AuthProvider — Centralized authentication state management
 * 
 * Wraps the app to provide reactive auth state to all components.
 * Replaces the old pattern of direct localStorage reads + window.location.reload().
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(false);

  // Cross-tab sync: listen for localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Login — calls the API, stores user data, updates context state
   * @param {Object} credentials - { email, password }
   * @returns {Object} - The user object from the API response
   */
  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const data = await apiLogin(credentials);
      const userData = data.user;
      saveAuthData(userData);
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout — calls the backend to clear HttpOnly cookie, clears localStorage, resets state
   */
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await apiLogout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth hook — access auth state and actions from any component
 * 
 * Usage:
 *   const { user, login, logout, isAuthenticated, isAdmin } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
