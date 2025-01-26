import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Settings, X, Check, MessageSquare, UserPlus, Trash2, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { messageService } from '../services';
import { useTheme } from '../hooks';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // ... rest stays the same
  
  return (
    <header className={`h-16 border-b flex items-center justify-between px-4 md:px-6 transition-all duration-300 ${
      isDark ? 'border-gray-800 bg-[#0a0a0f]' : 'border-border-theme bg-bg-primary shadow-sm'
    }`}>
      <div className="flex items-center gap-3 md:gap-4 flex-1">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className={`lg:hidden p-2 transition-colors duration-300 ${isDark ? 'text-gray-400 hover:text-white' : 'text-text-secondary hover:text-text-primary'}`}
        >
          <Menu size={24} />
        </button>

        <div className={`relative flex-1 max-w-md ${showSearch ? 'fixed inset-0 z-50 p-4 flex items-center md:relative md:inset-auto md:p-0 md:bg-transparent' : 'hidden md:block'} ${
          showSearch && (isDark ? 'bg-[#0a0a0f]' : 'bg-bg-card')
        }`}>
          <Search className="absolute left-3 md:left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search analytics or projects..."
            className={`w-full border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 transition-all duration-300 ${
              isDark 
                ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500' 
                : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted focus:border-accent focus:ring-accent'
            }`}
          />
          {showSearch && (
            <button 
              onClick={() => setShowSearch(false)}
              className={`ml-2 p-2 md:hidden transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-text-secondary'}`}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Mobile Search Toggle */}
        <button 
          onClick={() => setShowSearch(true)}
          className={`md:hidden p-2 transition-colors duration-300 ${isDark ? 'text-gray-400 hover:text-white' : 'text-text-secondary hover:text-text-primary'}`}
        >
          <Search size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-4" ref={dropdownRef}>
        {/* Settings Button */}
        <button
          onClick={() => navigate('/admin/dashboard/settings')}
          className={`p-2 rounded-lg transition-colors duration-300 ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-bg-secondary'}`}
          title="Settings"
        >
          <Settings className={isDark ? 'text-gray-400' : 'text-text-secondary'} size={20} />
        </button>

        {/* Notification Button with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg transition-colors duration-300 ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-bg-secondary'}`}
          >
            <Bell className={isDark ? 'text-gray-400' : 'text-text-secondary'} size={20} />
            {unreadCount > 0 && (
              <span className={`absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full text-[10px] font-bold text-white shadow-lg border-2 ${isDark ? 'border-[#0a0a0f]' : 'border-bg-primary'}`}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className={`absolute right-0 top-full mt-2 w-80 border rounded-xl shadow-2xl z-50 overflow-hidden transition-all duration-300 ${
              isDark ? 'bg-[#12121a] border-gray-800' : 'bg-bg-card border-border-theme'
            }`}>
              <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-gray-800' : 'border-border-theme'}`}>
                <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-text-primary'}`}>Notifications</h3>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className={`text-xs flex items-center gap-1 transition-colors duration-300 ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-text-muted hover:text-text-secondary'}`}
                  >
                    <Trash2 size={12} />
                    Clear all
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <Bell className={`mx-auto mb-2 ${isDark ? 'text-gray-600' : 'text-text-muted'}`} size={24} />
                    <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>No new notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b transition-colors duration-300 ${
                        isDark ? 'border-gray-800 hover:bg-gray-800/50' : 'border-border-theme hover:bg-bg-secondary'
                      } ${notification.read ? 'opacity-60' : ''}`}
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
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-text-primary'}`}>{notification.title}</p>
                          <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-text-secondary'}`}>{notification.message}</p>
                          <p className={`text-xs mt-1 ${isDark ? 'text-gray-600' : 'text-text-muted'}`}>{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className={`transition-colors duration-300 ${isDark ? 'text-gray-500 hover:text-green-400' : 'text-text-muted hover:text-green-600'}`}
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
                <div className={`p-3 border-t ${isDark ? 'border-gray-800 bg-gray-800/30' : 'border-border-theme bg-bg-secondary/30'}`}>
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
