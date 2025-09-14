import React, { createContext, useContext, useState, useEffect } from 'react';
import { appData } from '../data/appData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('kmrl_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password, role) => {
    const foundUser = appData.users.find(
      u => u.username === username && 
           u.password === password && 
           u.role === role
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('kmrl_user', JSON.stringify(foundUser));
      return { success: true, user: foundUser };
    }

    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kmrl_user');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};