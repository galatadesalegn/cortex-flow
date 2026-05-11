import { FolderOpen, Award, Code, MessageSquare, Loader2 } from 'lucide-react';
import { useProjects, useCertificates, useSkills, useMessages, useTheme } from '../hooks';

const SummaryCards = () => {
  const { isDark } = useTheme();
  // Fetch real data from API
  const { projects, loading: projectsLoading } = useProjects();
  const { certificates, loading: certificatesLoading } = useCertificates();
  const { skills, loading: skillsLoading } = useSkills();
  const { messages, loading: messagesLoading } = useMessages();

  // Calculate unread messages
  const unreadMessages = messages?.filter(m => !m.read)?.length || 0;

  const cards = [
    {
      icon: FolderOpen,
      label: 'TOTAL PROJECTS',
      value: projects?.length || 0,
      change: 'Active',
      color: 'blue',
      loading: projectsLoading,
    },
    {
      icon: Award,
      label: 'CERTIFICATES',
      value: certificates?.length || 0,
      change: 'Active',
      color: 'green',
      loading: certificatesLoading,
    },
    {
      icon: Code,
      label: 'TOTAL SKILLS',
      value: skills?.length || 0,
      change: 'Mastered',
      color: 'purple',
      loading: skillsLoading,
    },
    {
      icon: MessageSquare,
      label: 'NEW MESSAGES',
      value: unreadMessages,
      change: unreadMessages > 0 ? 'Priority' : 'No new',
      color: unreadMessages > 0 ? 'orange' : 'green',
      loading: messagesLoading,
    },
  ];

  const colorClasses = {
    blue: isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100',
    green: isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-100',
    purple: isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-600 border-purple-100',
    orange: isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-600 border-orange-100',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`border rounded-xl p-6 transition-all duration-300 hover:transform hover:scale-[1.02] hover:-translate-y-1 ${
            isDark 
              ? 'bg-[#12121a] border-gray-800 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-400/60' 
              : 'bg-bg-card border-border-theme hover:border-accent shadow-soft hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-lg ${colorClasses[card.color]} border`}>
              <card.icon size={20} />
            </div>
            <span className={`text-xs transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>{card.change}</span>
          </div>
          <div className="mt-4">
            <p className={`text-2xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>
              {card.loading ? (
                <Loader2 size={24} className="animate-spin text-blue-500" />
              ) : (
                card.value
              )}
            </p>
            <p className={`text-sm mt-1 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-text-secondary'}`}>{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
