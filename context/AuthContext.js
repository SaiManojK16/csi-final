import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/apiService';

const AuthContext = createContext(null);

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

  // Load user from localStorage and verify token on mount
  useEffect(() => {
    const loadUser = async () => {
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('acceptly_token');
      const savedUser = localStorage.getItem('acceptly_user');

      if (token && savedUser) {
        try {
          apiService.setToken(token);
          // Verify token is still valid
          const response = await apiService.getCurrentUser();
          if (response.success) {
            setUser(response.user);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('acceptly_token');
            localStorage.removeItem('acceptly_user');
          }
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('acceptly_token');
          localStorage.removeItem('acceptly_user');
        }
      }
      setLoading(false);
    };

    loadUser();

    // Listen for user update events from other components
    const handleUserUpdate = async (event) => {
      if (event.detail) {
        setUser(event.detail);
        localStorage.setItem('acceptly_user', JSON.stringify(event.detail));
      } else {
        // Refresh from server
        try {
          const response = await apiService.getCurrentUser();
          if (response.success) {
            setUser(response.user);
            localStorage.setItem('acceptly_user', JSON.stringify(response.user));
          }
        } catch (error) {
          console.error('Error refreshing user:', error);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('userUpdated', handleUserUpdate);
      return () => window.removeEventListener('userUpdated', handleUserUpdate);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      
      if (response.success) {
        apiService.setToken(response.token);
        setUser(response.user);
        localStorage.setItem('acceptly_user', JSON.stringify(response.user));
        return { success: true, user: response.user };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await apiService.signup(username, email, password);
      
      if (response.success) {
        apiService.setToken(response.token);
        setUser(response.user);
        localStorage.setItem('acceptly_user', JSON.stringify(response.user));
        return { success: true, user: response.user };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: error.message || 'Signup failed' };
    }
  };

  const logout = () => {
    setUser(null);
    apiService.setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('acceptly_user');
      localStorage.removeItem('acceptly_token');
    }
  };

  const resetPassword = async (email) => {
    try {
      const response = await apiService.resetPassword(email);
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, message: error.message };
    }
  };

  const updateProgress = async (type, data) => {
    if (!user) return;
    
    // Update local state immediately for better UX
    const updatedUser = {
      ...user,
      progress: {
        ...user.progress,
        [type]: data
      }
    };
    
    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('acceptly_user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    updateProgress,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

