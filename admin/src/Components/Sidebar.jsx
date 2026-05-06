import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Briefcase, Award, Code, MessageSquare, FileText, Settings, ChevronRight, LogOut, Quote } from 'lucide-react';
import { useAuth } from '../hooks';

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { id: 'dashboard', path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: 'about', path: '/about', icon: User, label: 'About' },
    { id: 'projects', path: '/projects', icon: Briefcase, label: 'Projects' },
    { id: 'certificates', path: '/certificates', icon: Award, label: 'Certificates' },
    { id: 'skills', path: '/skills', icon: Code, label: 'Skills' },
    { id: 'services', path: '/services', icon: FileText, label: 'Services' },
    { id: 'testimonials', path: '/testimonials', icon: Quote, label: 'Testimonials' },
    { id: 'messages', path: '/messages', icon: MessageSquare, label: 'Messages' },
    { id: 'settings', path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="w-64 bg-[#0a0a0f] border-r border-gray-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Galata.D</h1>
        <p className="text-xs text-gray-500 mt-1">ADMIN PANEL COMMAND CENTER</p>
      </div>

      <nav className="flex-1 p-4 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
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

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
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
  );
};

export default Sidebar;
