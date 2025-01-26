import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Briefcase, Award, Code, MessageSquare, FileText, Settings, ChevronRight, LogOut, Quote, X } from 'lucide-react';
import { useAuth, useTheme } from '../hooks';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { isDark } = useTheme();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'About', icon: User, path: '/admin/dashboard/about' },
    { label: 'Projects', icon: Briefcase, path: '/admin/dashboard/projects' },
    { label: 'Certificates', icon: Award, path: '/admin/dashboard/certificates' },
    { label: 'Skills', icon: Code, path: '/admin/dashboard/skills' },
    { label: 'Services', icon: FileText, path: '/admin/dashboard/services' },
    { label: 'Testimonials', icon: Quote, path: '/admin/dashboard/testimonials' },
    { label: 'Messages', icon: MessageSquare, path: '/admin/dashboard/messages' },
    { label: 'Settings', icon: Settings, path: '/admin/dashboard/settings' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 w-64 border-r flex flex-col h-screen z-[70] transition-all duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${
        isDark ? 'bg-[#0a0a0f] border-gray-800' : 'bg-bg-card border-border-theme shadow-md'
      }`}>
        <div className={`p-6 border-b flex items-center justify-between transition-colors duration-300 ${isDark ? 'border-gray-800' : 'border-border-theme'}`}>
          <div>
            <h1 className={`text-xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-theme-primary'}`}>Galata.D</h1>
            <p className={`text-xs mt-1 transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-theme-muted'}`}>ADMIN PANEL COMMAND CENTER</p>
          </div>
          <button 
            onClick={onClose}
            className={`lg:hidden p-2 transition-colors duration-300 ${isDark ? 'text-gray-400 hover:text-white' : 'text-theme-secondary hover:text-theme-primary'}`}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  onClick={() => onClose()}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? isDark ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : 'bg-accent/10 text-accent border border-accent/20'
                        : isDark ? 'text-gray-400 hover:bg-gray-800/50 hover:text-white' : 'text-theme-secondary hover:bg-bg-secondary hover:text-theme-primary'
                    }`
                  }
                >
                  <item.icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {location.pathname === item.path && <ChevronRight size={16} className="ml-auto" />}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={`p-4 border-t transition-colors duration-300 ${isDark ? 'border-gray-800' : 'border-border-theme'}`}>
          <div className={`flex items-center gap-3 p-3 rounded-lg mb-3 transition-colors duration-300 ${isDark ? 'bg-gray-800/30' : 'bg-bg-secondary'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate transition-colors duration-300 ${isDark ? 'text-white' : 'text-theme-primary'}`}>
                {user?.email || 'Admin'}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600/20 transition-all border border-red-600/20"
          >
            <LogOut size={16} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
