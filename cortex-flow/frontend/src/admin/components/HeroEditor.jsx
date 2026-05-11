import { Sparkles, User, Type, Activity, BarChart3 } from 'lucide-react';
import { useTheme } from '../hooks';

const HeroEditor = ({ data, onChange }) => {
  const { isDark } = useTheme();
  const { statusBadge, name, subtitle, stats } = data;

  const updateStat = (index, field, value) => {
    const newStats = [...(stats || [])];
    newStats[index] = { ...newStats[index], [field]: value };
    onChange('stats', newStats);
  };

  return (
    <div className={`border rounded-xl p-6 transition-all duration-300 hover:transform hover:scale-[1.01] hover:-translate-y-1 ${
      isDark ? 'bg-[#12121a] border-gray-800 hover:border-gray-700 hover:shadow-2xl hover:shadow-cyan-400/60' : 'bg-bg-card border-border-theme hover:border-accent shadow-soft hover:shadow-md'
    }`}
         style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={20} className={isDark ? 'text-cyan-400' : 'text-accent'} />
        <h2 className={`text-lg font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>Hero Section</h2>
      </div>

      <div className="space-y-5">
        {/* Status Badge */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-green-400" />
            <label className={`text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
              Status Badge
            </label>
          </div>
          <input
            type="text"
            value={statusBadge || ''}
            onChange={(e) => onChange('statusBadge', e.target.value)}
            className={`w-full border rounded-lg px-4 py-2.5 text-sm transition-all focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              isDark ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted'
            }`}
          />
        </div>

        {/* Name */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-blue-400" />
            <label className={`text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
              Name
            </label>
          </div>
          <input
            type="text"
            value={name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            className={`w-full border rounded-lg px-4 py-2.5 text-sm transition-all focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              isDark ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted'
            }`}
          />
        </div>

        {/* Subtitle */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Type size={16} className="text-purple-400" />
            <label className={`text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
              Subtitle (Animated)
            </label>
          </div>
          <input
            type="text"
            value={data.subtitle || ''}
            onChange={(e) => onChange('subtitle', e.target.value)}
            className={`w-full border rounded-lg px-4 py-2.5 text-sm transition-all focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              isDark ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted'
            }`}
          />
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-cyan-400" />
            <label className={`text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
              Description
            </label>
          </div>
          <textarea
            value={data.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            rows={3}
            className={`w-full border rounded-lg px-4 py-2.5 text-sm transition-all focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none ${
              isDark ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted'
            }`}
          />
        </div>

        {/* Stats */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={16} className="text-orange-400" />
            <label className={`text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
              Stats
            </label>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(stats || []).map((stat, index) => (
              <div key={index} className={`border rounded-lg p-3 transition-colors duration-300 ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-bg-secondary border-border-theme shadow-sm'}`}>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStat(index, 'value', e.target.value)}
                  className={`w-full bg-transparent border-none outline-none text-lg font-bold text-center mb-1 focus:ring-0 ${isDark ? 'text-cyan-400' : 'text-accent'}`}
                />
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(index, 'label', e.target.value)}
                  className={`w-full bg-transparent border-none outline-none text-[10px] text-center uppercase tracking-wider focus:ring-0 ${isDark ? 'text-gray-500' : 'text-text-muted'}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroEditor;
