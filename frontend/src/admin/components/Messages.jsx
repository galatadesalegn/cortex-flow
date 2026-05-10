import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Mail,
  Plus,
  Search,
  Settings,
  MoreVertical,
  Edit2,
  Trash2,
  Save,
  X,
  Send,
  Paperclip,
  Bold,
  Italic,
  Link,
  FileText,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Star,
  User,
  ChevronRight,
  Filter,
  Archive,
  Star as StarIcon,
  Loader2
} from 'lucide-react';
import { messageService } from '../services';
import { toast } from 'sonner';
import { useTheme } from '../hooks';

const Messages = () => {
  const { isDark } = useTheme();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [status, setStatus] = useState('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);


  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await messageService.getAll();
      const apiMessages = response.data || response;
      // Map API data to component format
      const formattedMessages = apiMessages.map((msg, index) => ({
        _id: msg._id,
        id: msg._id,
        inquiryId: `#${String(10000 + index).slice(1)}`,
        subject: msg.subject || 'No Subject',
        priority: 'medium',
        sender: {
          name: msg.name,
          role: 'Contact Form',
          email: msg.email,
          avatar: null
        },
        date: new Date(msg.createdAt).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        content: msg.message,
        attachments: [],
        status: msg.read ? 'resolved' : 'new',
        sentiment: 'neutral',
        pastInquiries: 0,
        responseTime: '-',
        tags: [],
        isStarred: false,
        read: msg.read
      }));
      setMessages(formattedMessages);
      if (formattedMessages.length > 0 && !selectedMessage) {
        setSelectedMessage(formattedMessages[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const currentMessage = messages.find(m => m.id === selectedMessage) || messages[0];

  // Sync status with current message
  useEffect(() => {
    if (currentMessage) {
      setStatus(currentMessage.status || 'new');
    }
  }, [currentMessage]);

  // Memoize filtered messages to prevent recalculation on every render
  const filteredMessages = useMemo(() => {
    if (!searchQuery && activeFilter === 'all') {
      return messages;
    }
    return messages.filter(msg => {
      const matchesSearch = !searchQuery || 
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.sender.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'all' || 
                           (activeFilter === 'new' && msg.status === 'new') ||
                           (activeFilter === 'in-progress' && msg.status === 'in-progress') ||
                           (activeFilter === 'resolved' && msg.status === 'resolved') ||
                           (activeFilter === 'starred' && msg.isStarred);
      return matchesSearch && matchesFilter;
    });
  }, [messages, searchQuery, activeFilter]);

  // Handle status change with backend update
  const handleStatusChange = useCallback(async (newStatus) => {
    if (!currentMessage) return;
    
    try {
      await messageService.update(currentMessage.id, { status: newStatus });
      setStatus(newStatus);
      // Update local messages state
      setMessages(prev => prev.map(m => 
        m.id === currentMessage.id ? { ...m, status: newStatus } : m
      ));
      toast.success(`Status updated to ${newStatus.replace('-', ' ')}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  }, [currentMessage]);

  const handleFilterChange = useCallback((filterId) => {
    setActiveFilter(filterId);
  }, []);

  const handleMessageSelect = useCallback((messageId) => {
    setSelectedMessage(messageId);
  }, []);

  const [isMobileListVisible, setIsMobileListVisible] = useState(true);

  useEffect(() => {
    if (selectedMessage) {
      setIsMobileListVisible(false);
    }
  }, [selectedMessage]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return 'bg-blue-500';
      case 'in-progress': return 'bg-green-500';
      case 'resolved': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high':
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider ${
            isDark ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-50 text-red-600 border-red-100'
          }`}>
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider ${
            isDark ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-yellow-50 text-yellow-600 border-yellow-100'
          }`}>
            Medium
          </span>
        );
      default:
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider ${
            isDark ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' : 'bg-gray-50 text-gray-600 border-gray-100'
          }`}>
            Low
          </span>
        );
    }
  };

  // Delete message handler
  const handleDeleteMessage = async (id) => {
    try {
      await messageService.delete(id);
      toast.success('Message deleted successfully');
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast.error('Failed to delete message');
    }
  };

  // Send reply handler
  const [isSendingReply, setIsSendingReply] = useState(false);

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      toast.error('Please type a reply message');
      return;
    }

    if (!currentMessage) {
      toast.error('No message selected');
      return;
    }

    try {
      setIsSendingReply(true);
      await messageService.reply(currentMessage.id, {
        message: replyText,
        subject: `Re: ${currentMessage.subject}`
      });
      toast.success('Reply sent successfully');
      setReplyText('');
      // Mark message as resolved after replying
      setStatus('resolved');
    } catch (error) {
      console.error('Failed to send reply:', error);
      toast.error('Failed to send reply. Please try again.');
    } finally {
      setIsSendingReply(false);
    }
  };

  return (
    <div className="flex h-full lg:h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Left Sidebar - Message List */}
      <div className={`${isMobileListVisible ? 'flex' : 'hidden'} lg:flex w-full lg:w-80 border-r border-gray-800 flex-col h-full`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Mail size={20} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Nexus Admin</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Command Center</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1 mt-3">
            {[
              { id: 'all', label: 'All', count: messages.length },
              { id: 'new', label: 'New', count: messages.filter(m => m.status === 'new').length },
              { id: 'in-progress', label: 'Active', count: messages.filter(m => m.status === 'in-progress').length },
              { id: 'starred', label: 'Starred', count: messages.filter(m => m.isStarred).length }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 size={24} className="animate-spin mx-auto text-cyan-400 mb-2" />
              <p className="text-gray-400 text-sm">Loading messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-8 text-center">
              <Mail size={32} className="mx-auto text-gray-600 mb-2" />
              <p className="text-gray-400 text-sm">No messages found</p>
              <p className="text-gray-500 text-xs mt-1">
                {searchQuery ? 'Try adjusting your search' : 'Messages will appear here when submitted via contact form'}
              </p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <button
                key={message.id}
                onClick={() => setSelectedMessage(message.id)}
                className={`w-full p-4 text-left border-b border-gray-800 transition-colors hover:bg-gray-800/50 ${
                  selectedMessage === message.id ? 'bg-gray-800/80 border-l-2 border-l-cyan-500' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-medium text-white text-sm truncate">{message.sender.name}</span>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap">{message.date.split(',')[0]}</span>
                    </div>
                    <p className="text-sm text-gray-300 truncate mb-1">{message.subject}</p>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getStatusColor(message.status)}`}></span>
                      <span className="text-[10px] text-gray-500 capitalize">{message.status.replace('-', ' ')}</span>
                      {message.isStarred && <Star size={10} className="text-yellow-400 fill-yellow-400" />}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Bottom Nav */}
        <div className="p-4 border-t border-gray-800 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white transition-colors text-sm">
            <div className="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center">
              <span className="text-xs text-purple-400">S</span>
            </div>
            Security
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white transition-colors text-sm">
            <div className="w-5 h-5 rounded bg-orange-500/20 flex items-center justify-center">
              <span className="text-xs text-orange-400">?</span>
            </div>
            Support
          </button>
        </div>
      </div>

      {/* Main Content - Message Detail */}
      <div className={`${!isMobileListVisible ? 'flex' : 'hidden'} lg:flex flex-1 flex-col min-w-0 h-full`}>
        {/* Breadcrumb & Header */}
        <div className="px-4 md:px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2 text-sm mb-3">
            <button 
              onClick={() => setIsMobileListVisible(true)}
              className="lg:hidden p-1 -ml-1 text-gray-400 hover:text-white"
            >
              <ChevronRight size={18} className="rotate-180" />
            </button>
            <span className="text-gray-500">Messages</span>
            <ChevronRight size={14} className="text-gray-600" />
            <span className="text-cyan-400 font-medium">
              {currentMessage ? `Inquiry ${currentMessage.inquiryId}` : 'No message selected'}
            </span>
          </div>
          
          {currentMessage ? (
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl font-semibold text-white">{currentMessage.subject}</h1>
                {getPriorityBadge(currentMessage.priority)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors">
                <Archive size={16} />
              </button>
              <button
                onClick={() => handleDeleteMessage(currentMessage.id)}
                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={16} />
              </button>
              <button className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
          ) : (
            <div className="text-gray-400">Select a message to view details</div>
          )}
        </div>

        {/* Message Content */}
        {currentMessage ? (
        <div className="flex-1 overflow-y-auto p-6">
          {/* Sender Info */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                <User size={24} className="text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">{currentMessage.sender.name}</h3>
                <p className="text-sm text-gray-400">{currentMessage.sender.role}</p>
                <p className="text-xs text-gray-500">{currentMessage.sender.email}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-white">{currentMessage.date}</p>
            </div>
          </div>

          {/* Message Body */}
          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 mb-6">
            <div className="prose prose-invert max-w-none">
              {currentMessage.content.split('\n').map((line, i) => {
                if (line.startsWith('•')) {
                  return (
                    <li key={i} className="text-cyan-400 ml-4 mb-1">
                      {line.replace('• ', '')}
                    </li>
                  );
                }
                if (line.trim() === '') {
                  return <br key={i} />;
                }
                return <p key={i} className="text-gray-300 mb-3 leading-relaxed">{line}</p>;
              })}
            </div>

            {/* Attachments */}
            {currentMessage.attachments.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Attachments</p>
                <div className="flex flex-wrap gap-3">
                  {currentMessage.attachments.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <FileText size={20} className="text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size} • {file.type}</p>
                      </div>
                      <button className="p-2 rounded-lg bg-gray-700 text-gray-400 hover:text-white transition-colors ml-2">
                        <Download size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Reply */}
          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-white">Quick Reply</h3>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                  <Bold size={16} />
                </button>
                <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                  <Italic size={16} />
                </button>
                <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                  <Link size={16} />
                </button>
                <div className="w-px h-4 bg-gray-700 mx-1"></div>
                <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                  <Paperclip size={16} />
                </button>
              </div>
            </div>

            <textarea
              rows={4}
              placeholder={`Type your response to ${currentMessage.sender.name.split(' ')[0]}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none mb-4"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white text-xs font-medium transition-colors">
                  Save Draft
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white text-xs font-medium transition-colors">
                  Template
                </button>
              </div>
              <button
                onClick={handleSendReply}
                disabled={isSendingReply}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingReply ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reply
                    <Send size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center text-gray-400">
              <Mail size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-lg">No message selected</p>
              <p className="text-sm">Select a message from the list to view details</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-gray-800 p-6 overflow-y-auto">
        {/* Status Management */}
        <div className="mb-8">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Status Management</p>
          <div className="space-y-2">
            <button
              onClick={() => handleStatusChange('new')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                status === 'new' 
                  ? 'border-blue-500/50 bg-blue-500/10' 
                  : 'border-gray-800 bg-gray-800/30 hover:border-gray-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${status === 'new' ? 'bg-blue-400' : 'bg-gray-500'}`}></span>
              <span className={`text-sm ${status === 'new' ? 'text-white' : 'text-gray-400'}`}>New Inquiry</span>
              {status === 'new' && <CheckCircle size={14} className="ml-auto text-blue-400" />}
            </button>
            
            <button
              onClick={() => handleStatusChange('in-progress')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                status === 'in-progress' 
                  ? 'border-green-500/50 bg-green-500/10' 
                  : 'border-gray-800 bg-gray-800/30 hover:border-gray-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${status === 'in-progress' ? 'bg-green-400' : 'bg-gray-500'}`}></span>
              <span className={`text-sm ${status === 'in-progress' ? 'text-white' : 'text-gray-400'}`}>In Progress</span>
              {status === 'in-progress' && <CheckCircle size={14} className="ml-auto text-green-400" />}
            </button>
            
            <button
              onClick={() => handleStatusChange('resolved')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                status === 'resolved' 
                  ? 'border-gray-500/50 bg-gray-500/10' 
                  : 'border-gray-800 bg-gray-800/30 hover:border-gray-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${status === 'resolved' ? 'bg-gray-400' : 'bg-gray-500'}`}></span>
              <span className={`text-sm ${status === 'resolved' ? 'text-white' : 'text-gray-400'}`}>Replied / Resolved</span>
              {status === 'resolved' && <CheckCircle size={14} className="ml-auto text-gray-400" />}
            </button>
          </div>
        </div>

        {/* Client Insights */}
        {currentMessage && (
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Client Insights</p>

          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Sentiment</span>
              <span className={`text-sm font-medium ${
                currentMessage.sentiment === 'positive' ? 'text-green-400' :
                currentMessage.sentiment === 'negative' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {currentMessage.sentiment === 'positive' ? 'Positive' :
                 currentMessage.sentiment === 'negative' ? 'Negative' : 'Neutral'}
                {currentMessage.sentiment === 'positive' && <span className="ml-1">+</span>}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Past Inquiries</span>
              <span className="text-sm font-medium text-white">{currentMessage.pastInquiries}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Response Time</span>
              <span className="text-sm font-medium text-white">{currentMessage.responseTime}</span>
            </div>
          </div>
        </div>
        )}

        {/* Star Button */}
        {currentMessage && (
        <button
          className={`w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
            currentMessage.isStarred
              ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400'
              : 'border-gray-700 text-gray-400 hover:border-gray-600'
          }`}
        >
          <Star size={16} className={currentMessage.isStarred ? 'fill-yellow-400' : ''} />
          {currentMessage.isStarred ? 'Starred' : 'Star Conversation'}
        </button>
        )}
      </div>
    </div>
  );
};

export default Messages;
