import { MapPin, Briefcase, Mail } from 'lucide-react';
import { useTheme } from '../hooks';

const ProfileInfo = ({ data, onChange }) => {
  const { isDark } = useTheme();
  const { name, location, title, email } = data;

  return (
    <div className={`border rounded-xl p-6 transition-all duration-300 hover:transform hover:scale-[1.01] hover:-translate-y-1 ${
      isDark ? 'bg-[#12121a] border-gray-800 hover:border-gray-700 hover:shadow-2xl hover:shadow-blue-400/60' : 'bg-[#FFFFFF] border-[#DDDDDD] hover:border-accent shadow-sm hover:shadow-md'
    }`}
         style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
      <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>Profile Info</h3>
      
      <div className="space-y-4">
        <div>
          <label className={`block text-xs font-medium uppercase tracking-wider mb-2 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-[#888888]'}`}>
            Full Name
          </label>
          <input
            type="text"
            value={name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 transition-all duration-300 ${
              isDark 
                ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500' 
                : 'bg-[#F5F5F7] border-[#DDDDDD] text-[#1A1A1A] placeholder-[#AAAAAA] focus:border-accent focus:ring-accent'
            }`}
          />
        </div>

        <div>
          <label className={`block text-xs font-medium uppercase tracking-wider mb-2 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-[#888888]'}`}>
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              value={location || ''}
              onChange={(e) => onChange('location', e.target.value)}
              className={`w-full border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500' 
                  : 'bg-[#F5F5F7] border-[#DDDDDD] text-[#1A1A1A] placeholder-[#AAAAAA] focus:border-accent focus:ring-accent'
              }`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-xs font-medium uppercase tracking-wider mb-2 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-[#888888]'}`}>
            Professional Role / Title
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              value={title || ''}
              onChange={(e) => onChange('title', e.target.value)}
              className={`w-full border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500' 
                  : 'bg-[#F5F5F7] border-[#DDDDDD] text-[#1A1A1A] placeholder-[#AAAAAA] focus:border-accent focus:ring-accent'
              }`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-xs font-medium uppercase tracking-wider mb-2 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-[#888888]'}`}>
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="email"
              value={email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              className={`w-full border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500' 
                  : 'bg-[#F5F5F7] border-[#DDDDDD] text-[#1A1A1A] placeholder-[#AAAAAA] focus:border-accent focus:ring-accent'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
