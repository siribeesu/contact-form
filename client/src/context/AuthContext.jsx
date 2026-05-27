// src/context/AuthContext.jsx
// Manages admin authentication state

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Check localStorage on mount

  // On mount, restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('shecan_token');
    const savedAdmin = localStorage.getItem('shecan_admin');
    if (savedToken && savedAdmin) {
      setToken(savedToken);
      setAdmin(JSON.parse(savedAdmin));
    }
    setLoading(false);
  }, []);

  // Login: save token and admin info
  const login = (tokenValue, adminData) => {
    setToken(tokenValue);
    setAdmin(adminData);
    localStorage.setItem('shecan_token', tokenValue);
    localStorage.setItem('shecan_admin', JSON.stringify(adminData));
  };

  // Logout: clear everything
  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('shecan_token');
    localStorage.removeItem('shecan_admin');
  };

  const isAuthenticated = !!token && !!admin;

  return (
    <AuthContext.Provider value={{ admin, token, loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
