import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useProjects, useCertificates, useSkills, useMessages } from '../hooks';
import { Loader2 } from 'lucide-react';

const PortfolioOverviewChart = () => {
  const { projects, loading: projectsLoading } = useProjects();
  const { certificates, loading: certificatesLoading } = useCertificates();
  const { skills, loading: skillsLoading } = useSkills();
  const { messages, loading: messagesLoading } = useMessages();

  const loading = projectsLoading || certificatesLoading || skillsLoading || messagesLoading;

  const data = [
    { name: 'Projects', value: projects?.length || 0, color: '#3b82f6' },
    { name: 'Certificates', value: certificates?.length || 0, color: '#10b981' },
    { name: 'Skills', value: skills?.length || 0, color: '#a855f7' },
    { name: 'Messages', value: messages?.length || 0, color: '#f59e0b' },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
    return (
      <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 hover:border-blue-400 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-400/60 hover:-translate-y-1"
         style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Content Distribution</h2>
        <span className="text-xs text-gray-500 uppercase tracking-wider">Total Items: {total}</span>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a24',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff'
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-gray-400 text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-gray-400">{item.name}: </span>
            <span className="text-xs font-bold text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioOverviewChart;
