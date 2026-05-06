import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Settings, X, Check, MessageSquare, UserPlus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { messageService } from '../services';

const Header = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Fetch unread messages as notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await messageService.getAll();
        const messages = response.data || [];
        const unreadMessages = messages.filter(m => !m.isRead);

        // Convert messages to notifications
        const messageNotifications = unreadMessages.slice(0, 5).map(msg => ({
          id: msg._id,
          type: 'message',
          title: 'New Message',
          message: `From ${msg.name || 'Anonymous'}: ${msg.message?.substring(0, 50)}${msg.message?.length > 50 ? '...' : ''}`,
          time: new Date(msg.createdAt).toLocaleDateString(),
          read: false,
        }));

        setNotifications(messageNotifications);
        setUnreadCount(unreadMessages.length);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <header className="h-16 border-b border-gray-800 bg-[#0a0a0f] flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search analytics or projects..."
            className="w-80 bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4" ref={dropdownRef}>
        {/* Settings Button */}
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
          title="Settings"
        >
          <Settings className="text-gray-400" size={20} />
        </button>

        {/* Notification Button with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
          >
            <Bell className="text-gray-400" size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[#12121a] border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    Clear all
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <Bell className="mx-auto text-gray-600 mb-2" size={24} />
                    <p className="text-sm text-gray-500">No new notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${
                        notification.read ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notification.type === 'message' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                        }`}>
                          {notification.type === 'message' ? (
                            <MessageSquare size={14} className="text-blue-400" />
                          ) : (
                            <UserPlus size={14} className="text-purple-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">{notification.title}</p>
                          <p className="text-xs text-gray-400 truncate">{notification.message}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-gray-500 hover:text-green-400"
                            title="Mark as read"
                          >
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-800 bg-gray-800/30">
                  <a
                    href="/messages"
                    className="block text-center text-xs text-blue-400 hover:text-blue-300"
                  >
                    View all messages
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
