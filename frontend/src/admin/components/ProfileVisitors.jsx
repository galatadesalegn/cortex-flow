import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../hooks';

const ProfileVisitors = () => {
  const { isDark } = useTheme();
  const data = [
    { month: 'May', visitors: 120 },
    { month: 'Jun', visitors: 200 },
    { month: 'Jul', visitors: 150 },
    { month: 'Aug', visitors: 280 },
    { month: 'Sep', visitors: 220 },
    { month: 'Oct', visitors: 350 },
    { month: 'Nov', visitors: 420 },
  ];

  return (
    <div className={`border rounded-xl p-6 transition-all duration-300 hover:transform hover:scale-[1.01] ${
      isDark ? 'bg-[#12121a] border-gray-800 hover:border-blue-400' : 'bg-[#FFFFFF] border-[#DDDDDD] hover:border-accent shadow-sm hover:shadow-md'
    }`}
         style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg font-semibold transition-colors duration-300 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>Profile Visitors</h2>
        <select className={`rounded-lg px-3 py-1.5 text-sm focus:outline-none transition-colors duration-300 ${
          isDark ? 'bg-gray-800/50 border border-gray-700 text-gray-400' : 'bg-[#F5F5F7] border border-[#DDDDDD] text-[#555555]'
        }`}>
          <option>Last 7 months</option>
          <option>Last 30 days</option>
          <option>Last year</option>
        </select>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#DDD"} />
            <XAxis dataKey="month" stroke={isDark ? "#666" : "#888"} tick={{ fill: isDark ? '#999' : '#666' }} />
            <YAxis stroke={isDark ? "#666" : "#888"} tick={{ fill: isDark ? '#999' : '#666' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1a1a24' : '#FFFFFF',
                border: `1px solid ${isDark ? '#333' : '#DDD'}`,
                borderRadius: '8px',
                color: isDark ? '#FFF' : '#1A1A1A'
              }}
              itemStyle={{ color: isDark ? '#fff' : '#1A1A1A' }}
            />
            <Bar dataKey="visitors" fill={isDark ? "#3b82f6" : "#1de9b6"} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProfileVisitors;
