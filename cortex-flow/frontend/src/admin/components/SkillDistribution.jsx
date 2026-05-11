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
    <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 hover:border-blue-400 transition-all duration-300 hover:transform hover:scale-[1.01] h-full"
         style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
      <h2 className="text-lg font-semibold text-white mb-6">Skill Analysis</h2>
      <div className="h-56">
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
