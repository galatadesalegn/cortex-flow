import { useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

/**
 * Hook to automatically log out users after a period of inactivity.
 * 
 * @param {Function} logout - The logout function from AuthContext
 * @param {boolean} isAuthenticated - Current authentication status
 * @param {number} timeoutMs - Inactivity timeout in milliseconds (default: 10 mins)
 * @param {number} warningMs - Warning timeout in milliseconds (default: 9 mins)
 */
export const useInactivityLogout = (logout, isAuthenticated, timeoutMs = 600000, warningMs = 540000) => {
  const lastActivityRef = useRef(Date.now());
  const logoutTimerRef = useRef(null);
  const warningShownRef = useRef(false);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningShownRef.current = false;
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      if (logoutTimerRef.current) clearInterval(logoutTimerRef.current);
      return;
    }

    const checkInactivity = () => {
      const now = Date.now();
      const elapsed = now - lastActivityRef.current;

      // Show warning at 9 minutes (or warningMs)
      if (elapsed >= warningMs && elapsed < timeoutMs && !warningShownRef.current) {
        warningShownRef.current = true;
        toast.warning('Inactivity Warning', {
          description: 'You will be logged out in 1 minute due to inactivity.',
          duration: 10000,
          action: {
            label: 'Stay Logged In',
            onClick: () => resetTimer()
          }
        });
      }

      // Logout at 10 minutes (or timeoutMs)
      if (elapsed >= timeoutMs) {
        if (logoutTimerRef.current) clearInterval(logoutTimerRef.current);
        logout();
        toast.info('Session Expired', {
          description: 'You have been logged out due to 10 minutes of inactivity.',
          duration: 5000
        });
      }
    };

    // Check inactivity every 5 seconds for better performance
    logoutTimerRef.current = setInterval(checkInactivity, 5000);

    return () => {
      if (logoutTimerRef.current) clearInterval(logoutTimerRef.current);
    };
  }, [isAuthenticated, logout, timeoutMs, warningMs, resetTimer]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'keydown',
      'wheel'
    ];

    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners with passive: true for performance
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated, resetTimer]);
};

export default useInactivityLogout;
