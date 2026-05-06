const SkillDistribution = () => {
  const skills = [
    { name: 'Cloud Architecture', percentage: 94, color: 'blue' },
    { name: 'React / Next.js', percentage: 88, color: 'purple' },
    { name: 'Distributed Systems', percentage: 72, color: 'green' },
    { name: 'Cybersecurity', percentage: 65, color: 'orange' },
  ];

  const colorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
  };

  return (
    <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 hover:border-purple-400 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-400/60 hover:-translate-y-1 hover:-rotate-0.5"
         style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Skill Distribution</h2>
        <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
          View Tech Stack Detail
        </a>
      </div>
      <div className="space-y-5">
        {skills.map((skill, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">{skill.name}</span>
              <span className="text-sm font-medium text-white">{skill.percentage}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${colorClasses[skill.color]} rounded-full transition-all duration-500`}
                style={{ width: `${skill.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillDistribution;
