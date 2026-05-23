import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services';
import { useInactivityLogout } from '../hooks/useInactivityLogout';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Logout function
  const logout = useCallback(() => {
    authService.clearAuth();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  // Use inactivity logout hook
  useInactivityLogout(logout, isAuthenticated);

  // Check auth status on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { token, user: storedUser } = authService.getStoredAuth();
        console.log('🔐 AuthContext: Checking auth, token exists:', !!token);

        if (token && storedUser) {
          // Verify token is still valid by fetching current user
          const response = await authService.getMe();
          console.log('🔐 AuthContext: getMe response:', response);
          if (response.success) {
            setUser(response.user);
            setIsAuthenticated(true);
            console.log('🔐 AuthContext: Auth verified, user set');
          } else {
            throw new Error('Invalid token');
          }
        }
      } catch (err) {
        console.error('🔐 AuthContext: Auth check failed:', err.message);
        // Clear invalid auth data
        authService.clearAuth();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        console.log('🔐 AuthContext: Auth check complete, isAuthenticated:', isAuthenticated);
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

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Permission check helper
  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return user.permissions?.[permission] || false;
  }, [user]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
