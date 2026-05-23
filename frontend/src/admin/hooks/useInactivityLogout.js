import { useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

/**
 * Production-grade hook for automatic session termination.
 * Features: setTimeout-based timing, cross-tab sync, event debouncing, and memory safety.
 */
export const useInactivityLogout = (logout, isAuthenticated, timeoutMs = 600000, warningMs = 540000) => {
  const logoutTimerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  const clearTimers = useCallback(() => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
  }, []);

  const startTimers = useCallback(() => {
    clearTimers();

    // 1. Warning Timer (9 mins by default)
    warningTimerRef.current = setTimeout(() => {
      toast.warning('Inactivity Warning', {
        id: 'inactivity-warning', // Prevent duplicates
        description: 'Your session will expire in 1 minute due to inactivity.',
        duration: Infinity, // Keep until logout or user action
        action: {
          label: 'Stay Logged In',
          onClick: () => {
            resetTimer();
            toast.dismiss('inactivity-warning');
          }
        }
      });
    }, warningMs);

    // 2. Logout Timer (10 mins by default)
    logoutTimerRef.current = setTimeout(() => {
      clearTimers();
      toast.dismiss('inactivity-warning');
      logout();
      toast.info('Session Expired', {
        description: 'You have been logged out for security.',
        duration: 5000
      });
    }, timeoutMs);
  }, [logout, timeoutMs, warningMs, clearTimers]);

  const resetTimer = useCallback(() => {
    const now = Date.now();
    // Throttle resets to once every 2 seconds for performance
    if (now - lastActivityRef.current < 2000) return;
    
    lastActivityRef.current = now;
    if (isAuthenticated) {
      startTimers();
    }
  }, [isAuthenticated, startTimers]);

  // Handle cross-tab logout synchronization
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Sync logout if token is removed in another tab
      if (e.key === 'logout_event' || (e.key === 'token' && !e.newValue)) {
        logout();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [logout]);

  // Manage timers and event listeners
  useEffect(() => {
    if (!isAuthenticated) {
      clearTimers();
      return;
    }

    const activityEvents = [
      'mousedown', 'mousemove', 'keypress', 
      'scroll', 'touchstart', 'wheel'
    ];

    // Initialize timers
    startTimers();

    // Attach listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      clearTimers();
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated, resetTimer, startTimers, clearTimers]);
};

export default useInactivityLogout;
