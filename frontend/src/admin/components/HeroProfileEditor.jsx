import { Sparkles, User, Type, Activity, BarChart3, Briefcase } from 'lucide-react';

const HeroProfileEditor = ({ data, onChange }) => {
  const { statusBadge, name, subtitle, title, stats } = data;

  const updateStat = (index, field, value) => {
    const newStats = [...(stats || [])];
    newStats[index] = { ...newStats[index], [field]: value };
    onChange('stats', newStats);
  };

  return (
    <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-[1.01] hover:shadow-2xl hover:shadow-cyan-400/60 hover:-translate-y-1"
         style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={20} className="text-cyan-400" />
        <h2 className="text-lg font-semibold text-white">Hero & Profile</h2>
      </div>

      <div className="space-y-5">
        {/* Status Badge */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-green-400" />
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Status Badge
            </label>
          </div>
          <input
            type="text"
            value={statusBadge || ''}
            onChange={(e) => onChange('statusBadge', e.target.value)}
            placeholder="e.g. SYSTEM STATUS: ACTIVE"
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
          />
        </div>

        {/* Name - Single Input */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-blue-400" />
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Full Name
            </label>
          </div>
          <input
            type="text"
            value={name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Your full name"
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
          />
        </div>

        {/* Subtitle - MOVED UP */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Type size={16} className="text-purple-400" />
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Subtitle (Animated)
            </label>
          </div>
          <input
            type="text"
            value={subtitle || ''}
            onChange={(e) => onChange('subtitle', e.target.value)}
            placeholder="e.g. Building modern web applications"
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
          />
        </div>

        {/* Professional Title - MOVED DOWN */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase size={16} className="text-orange-400" />
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Professional Title
            </label>
          </div>
          <input
            type="text"
            value={title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="e.g. Full-Stack Developer"
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
          />
        </div>

        {/* Bio */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Type size={16} className="text-green-400" />
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Bio / Description
            </label>
          </div>
          <textarea
            value={data.bio || ''}
            onChange={(e) => onChange('bio', e.target.value)}
            placeholder="Write a short bio about yourself..."
            rows={4}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none"
          />
        </div>

        {/* Stats */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={16} className="text-orange-400" />
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Stats
            </label>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(stats || []).map((stat, index) => (
              <div key={index} className="bg-gray-800/30 border border-gray-700 rounded-lg p-3">
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStat(index, 'value', e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-lg font-bold text-cyan-400 text-center mb-1 focus:ring-0"
                />
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(index, 'label', e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-[10px] text-gray-500 text-center uppercase tracking-wider focus:ring-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroProfileEditor;
