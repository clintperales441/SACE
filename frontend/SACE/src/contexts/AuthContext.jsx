import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);

          // Validate token with backend
          try {
            const response = await authAPI.getUser(parsedUser.email);
            // If we get here, token is valid
            setUser(parsedUser);
            setIsAuthenticated(true);
          } catch (error) {
            // Token is invalid or expired, clear storage
            console.error('Token validation failed:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user: userDataResponse } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userDataResponse));

      setUser(userDataResponse);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const googleLogin = async (credentialResponse) => {
    try {
      const response = await authAPI.googleLogin(credentialResponse.credential);
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Google login failed'
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Get user role
   */
  const getRole = () => {
    return user?.role || null;
  };

  /**
   * Check if user has a specific role
   * @param {string} requiredRole - Required role to check
   * @returns {boolean}
   */
  const hasRole = (requiredRole) => {
    return user?.role === requiredRole;
  };

  /**
   * Get stored token
   */
  const token = localStorage.getItem('token');

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    googleLogin,
    logout,
    getRole,
    hasRole,
    token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
