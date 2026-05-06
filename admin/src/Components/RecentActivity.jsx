import { MoreVertical, Download, Plus, Loader2 } from 'lucide-react';
import { useProjects, useMessages, useCertificates, useSkills } from '../hooks';
import { useEffect, useState } from 'react';

const RecentActivity = () => {
  const { projects, loading: projectsLoading } = useProjects();
  const { messages, loading: messagesLoading } = useMessages();
  const { certificates, loading: certificatesLoading } = useCertificates();
  const { skills, loading: skillsLoading } = useSkills();
  
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate activities from real data
    const generatedActivities = [];
    
    // Add recent projects
    if (projects?.length > 0) {
      projects.slice(0, 3).forEach((project, index) => {
        generatedActivities.push({
          context: project.title || 'Untitled Project',
          action: 'Project Created',
          status: 'Active',
          timestamp: project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Recently',
          statusColor: 'blue',
          type: 'project',
        });
      });
    }
    
    // Add unread messages
    if (messages?.length > 0) {
      const unreadMessages = messages.filter(m => !m.read).slice(0, 2);
      unreadMessages.forEach((message) => {
        generatedActivities.push({
          context: message.name || 'Anonymous',
          action: 'New Message',
          status: 'New',
          timestamp: message.createdAt ? new Date(message.createdAt).toLocaleDateString() : 'Recently',
          statusColor: 'green',
          type: 'message',
        });
      });
    }
    
    // Add recent certificates
    if (certificates?.length > 0) {
      certificates.slice(0, 2).forEach((cert) => {
        generatedActivities.push({
          context: cert.title || 'Certificate',
          action: 'Certificate Added',
          status: 'Active',
          timestamp: cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'Recently',
          statusColor: 'purple',
          type: 'certificate',
        });
      });
    }
    
    // Add recent skills
    if (skills?.length > 0) {
      skills.slice(0, 2).forEach((skill) => {
        generatedActivities.push({
          context: skill.name || 'Skill',
          action: 'Skill Added',
          status: 'Active',
          timestamp: 'Recently',
          statusColor: 'orange',
          type: 'skill',
        });
      });
    }
    
    // If no activities, add a placeholder
    if (generatedActivities.length === 0) {
      generatedActivities.push({
        context: 'System',
        action: 'No recent activity',
        status: 'Info',
        timestamp: 'Now',
        statusColor: 'blue',
        type: 'system',
      });
    }
    
    setActivities(generatedActivities);
    setLoading(false);
  }, [projects, messages, certificates, skills]);

  const statusColors = {
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  };

  return (
    <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 hover:border-green-400 transition-all duration-300 hover:transform hover:scale-[1.01] hover:shadow-2xl hover:shadow-green-400/60 hover:-translate-y-1 hover:rotate-0.5"
         style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <Download size={16} />
          Export Logs
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                Context
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                Action / Event
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                Status
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                Timestamp
              </th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading || projectsLoading || messagesLoading || certificatesLoading || skillsLoading ? (
              <tr>
                <td colSpan="5" className="py-8 text-center">
                  <Loader2 size={24} className="text-blue-500 animate-spin mx-auto" />
                  <p className="text-sm text-gray-400 mt-2">Loading activity...</p>
                </td>
              </tr>
            ) : (
              activities.map((activity, index) => (
                <tr key={index} className="hover:bg-gray-800/30 transition-colors">
                  <td className="py-4">
                    <span className="text-sm font-medium text-white">{activity.context}</span>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-gray-400">{activity.action}</span>
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[activity.statusColor]}`}
                    >
                      {activity.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-gray-500">{activity.timestamp}</span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors">
                      <MoreVertical size={16} className="text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center transition-all hover:scale-105">
        <Plus size={24} />
      </button>
    </div>
  );
};

export default RecentActivity;
