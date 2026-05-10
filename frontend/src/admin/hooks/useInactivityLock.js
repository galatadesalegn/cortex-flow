import { useState, useEffect, useCallback, useRef } from 'react';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useInactivityLock = (isEnabled = true) => {
  const [isLocked, setIsLocked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(INACTIVITY_TIMEOUT);
  const lastActivityRef = useRef(Date.now());
  const timerRef = useRef(null);

  const lock = useCallback(() => {
    setIsLocked(true);
    setTimeRemaining(INACTIVITY_TIMEOUT);
  }, []);

  const unlock = useCallback(() => {
    setIsLocked(false);
    lastActivityRef.current = Date.now();
    setTimeRemaining(INACTIVITY_TIMEOUT);
  }, []);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setTimeRemaining(INACTIVITY_TIMEOUT);
  }, []);

  useEffect(() => {
    if (!isEnabled || isLocked) return;

    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;
      const remaining = Math.max(0, INACTIVITY_TIMEOUT - timeSinceLastActivity);
      
      setTimeRemaining(remaining);

      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
        lock();
      }
    };

    // Check every second
    timerRef.current = setInterval(checkInactivity, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isEnabled, isLocked, lock]);

  useEffect(() => {
    if (!isEnabled || isLocked) return;

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

    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      // Remove event listeners
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [isEnabled, isLocked, resetTimer]);

  return {
    isLocked,
    lock,
    unlock,
    timeRemaining,
    resetTimer
  };
};

export default useInactivityLock;
