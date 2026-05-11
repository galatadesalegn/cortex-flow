import { useState, useCallback } from 'react';

let notificationId = 0;

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'success', duration = 4000) => {
    const id = ++notificationId;
    const notification = {
      id,
      message,
      type,
      duration
    };
    
    setNotifications(prev => [...prev, notification]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Convenience methods
  const success = useCallback((message, duration) => {
    return showNotification(message, 'success', duration);
  }, [showNotification]);

  const error = useCallback((message, duration) => {
    return showNotification(message, 'error', duration);
  }, [showNotification]);

  const warning = useCallback((message, duration) => {
    return showNotification(message, 'warning', duration);
  }, [showNotification]);

  const info = useCallback((message, duration) => {
    return showNotification(message, 'info', duration);
  }, [showNotification]);

  return {
    notifications,
    showNotification,
    removeNotification,
    success,
    error,
    warning,
    info
  };
};

export default useNotification;
