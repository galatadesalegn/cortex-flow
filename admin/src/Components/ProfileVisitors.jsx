import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProfileVisitors = () => {
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
    <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 hover:border-blue-400 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-400/60 hover:-translate-y-1 hover:rotate-0.5"
         style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Profile Visitors</h2>
        <select className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-400 focus:outline-none">
          <option>Last 7 months</option>
          <option>Last 30 days</option>
          <option>Last year</option>
        </select>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="month" stroke="#666" tick={{ fill: '#999' }} />
            <YAxis stroke="#666" tick={{ fill: '#999' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a24',
                border: '1px solid #333',
                borderRadius: '8px',
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="visitors" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProfileVisitors;
