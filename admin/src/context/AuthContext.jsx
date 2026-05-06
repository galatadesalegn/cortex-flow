import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check auth status on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { token, user: storedUser } = authService.getStoredAuth();
        
        if (token && storedUser) {
          // Verify token is still valid by fetching current user
          const response = await authService.getMe();
          if (response.success) {
            setUser(response.user);
            setIsAuthenticated(true);
          } else {
            throw new Error('Invalid token');
          }
        }
      } catch (err) {
        // Clear invalid auth data
        authService.clearAuth();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await authService.login(email, password);
      
      if (response.success) {
        authService.setAuth(response.token, response.user);
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    authService.clearAuth();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
