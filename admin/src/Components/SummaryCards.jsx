import { FolderOpen, Award, Code, MessageSquare, Loader2 } from 'lucide-react';
import { useProjects, useCertificates, useSkills, useMessages } from '../hooks';

const SummaryCards = () => {
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
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-[#12121a] border border-gray-800 rounded-xl p-5 hover:border-blue-400 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-400/60 hover:-translate-y-1 hover:rotate-0.5"
          style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        >
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-lg ${colorClasses[card.color]} border`}>
              <card.icon size={20} />
            </div>
            <span className="text-xs text-gray-500">{card.change}</span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-white">
              {card.loading ? (
                <Loader2 size={24} className="animate-spin text-blue-500" />
              ) : (
                card.value
              )}
            </p>
            <p className="text-sm text-gray-400 mt-1">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
