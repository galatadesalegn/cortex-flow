import { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Settings,
  Monitor,
  Smartphone,
  Bot,
  Palette,
  Edit2,
  Trash2,
  Save,
  X,
  GripVertical,
  Hash,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Clock,
  Tag,
  Loader2
} from 'lucide-react';
import serviceService from '../services/serviceService';
import { toast } from 'sonner';

const Services = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Form data state
  const [formData, setFormData] = useState({
    icon: '🖥️',
    lucideIcon: 'Monitor',
    title: '',
    subtitle: '',
    description: '',
    tags: [],
    status: 'active',
    order: 0
  });

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await serviceService.getAll();
      setServices(response.data || []);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  // Reset form when opening modal
  const handleOpenAdd = () => {
    setFormData({
      icon: '🖥️',
      lucideIcon: 'Monitor',
      title: '',
      subtitle: '',
      description: '',
      tags: [],
      status: 'active',
      order: services.length + 1
    });
    setNewTag('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (service) => {
    setEditingService(service);
    setFormData({
      icon: service.icon || '�️',
      lucideIcon: service.lucideIcon || 'Monitor',
      title: service.title || '',
      subtitle: service.subtitle || '',
      description: service.description || '',
      tags: service.tags || [],
      status: service.status || 'active',
      order: service.order || 0
    });
    setNewTag('');
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingService(null);
    setNewTag('');
  };

  // Create service
  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      await serviceService.create(formData);
      toast.success('Service created successfully');
      handleCloseModal();
      fetchServices();
    } catch (error) {
      console.error('Failed to create service:', error);
      toast.error('Failed to create service');
    } finally {
      setSaving(false);
    }
  };

  // Update service
  const handleUpdateService = async (e) => {
    e.preventDefault();
    if (!editingService) return;

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      await serviceService.update(editingService._id, formData);
      toast.success('Service updated successfully');
      handleCloseModal();
      fetchServices();
    } catch (error) {
      console.error('Failed to update service:', error);
      toast.error('Failed to update service');
    } finally {
      setSaving(false);
    }
  };

  // Delete service
  const handleDeleteService = async (id) => {
    toast('Are you sure you want to delete this service?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await serviceService.delete(id);
            toast.success('Service deleted successfully');
            fetchServices();
            if (editingService?._id === id) {
              handleCloseModal();
            }
          } catch (error) {
            console.error('Failed to delete service:', error);
            toast.error('Failed to delete service');
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  // Handle tag operations
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (formData.tags.includes(newTag.trim())) {
      toast.error('Tag already exists');
      return;
    }
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()]
    }));
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Icon options
  const iconOptions = ['🖥️', '📱', '🤖', '🎨', '⚡', '🔒', '📊', '🌐'];
  const lucideIconOptions = [
    { value: 'Monitor', label: 'Monitor' },
    { value: 'Smartphone', label: 'Smartphone' },
    { value: 'Bot', label: 'Bot' },
    { value: 'Palette', label: 'Palette' },
    { value: 'Zap', label: 'Zap' },
    { value: 'Lock', label: 'Lock' },
    { value: 'BarChart', label: 'BarChart' },
    { value: 'Globe', label: 'Globe' }
  ];

  // Dynamic stats
  const activeCount = services.filter(s => s.status === 'active').length;
  const totalTags = services.reduce((acc, s) => acc + (s.tags?.length || 0), 0);
  const uniqueTags = new Set(services.flatMap(s => s.tags || [])).size;

  const stats = [
    { title: 'Active Services', value: activeCount.toString(), icon: Briefcase, color: 'cyan' },
    { title: 'Tech Stack', value: uniqueTags.toString(), icon: Tag, color: 'blue' },
    { title: 'Total Services', value: services.length.toString(), icon: Clock, color: 'purple' },
    { title: 'Total Tags', value: totalTags.toString(), icon: Monitor, color: 'green' }
  ];

  const iconMap = {
    Monitor,
    Smartphone,
    Bot,
    Palette
  };

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 bg-[#0a0a0f] min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">MAIN / SERVICES_MATRIX</p>
          <h1 className="text-3xl font-bold text-white mb-2">Services Management</h1>
          <p className="text-gray-500 max-w-xl">Manage and customize your service offerings. These services are displayed in the About section of your portfolio to showcase your capabilities.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 w-64"
            />
          </div>
          <button className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Filter by:</span>
          <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium">All</button>
          <button className="px-3 py-1.5 rounded-lg bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors text-xs font-medium">Active</button>
          <button className="px-3 py-1.5 rounded-lg bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors text-xs font-medium">Draft</button>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 transition-colors text-sm font-semibold"
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-[#12121a] border border-gray-800 rounded-xl p-4 flex items-center gap-3 hover:border-gray-700 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
              <stat.icon size={18} className={`text-${stat.color}-400`} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">{stat.title}</p>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Services List */}
      <div className="space-y-4 mb-8">
        {filteredServices.map((service, index) => {
          const IconComponent = iconMap[service.lucideIcon] || Monitor;
          return (
            <div
              key={service.id}
              className="bg-[#12121a] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{service.icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{service.title}</h3>
                      <p className="text-sm text-cyan-400 mb-2">{service.subtitle}</p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenEdit(service)}
                        className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteService(service._id)}
                        className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" 
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-3 leading-relaxed">{service.description}</p>

                  {/* Tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {service.tags.map((tag, i) => (
                      <span 
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="text-white">{filteredServices.length}</span> of {services.length} services
        </p>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50"
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} />
          </button>
          {[1, 2, 3].map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="w-10 h-10 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors flex items-center justify-center">
            <MoreHorizontal size={16} />
          </button>
          <button 
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Add/Edit Service Modal */}
      {(showAddModal || editingService) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <form onSubmit={editingService ? handleUpdateService : handleCreateService}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h2>
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Icon Selection */}
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Icon</label>
                  <div className="grid grid-cols-4 gap-2">
                    {iconOptions.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, icon: emoji }))}
                        className={`p-3 rounded-lg border transition-colors text-2xl ${
                          formData.icon === emoji
                            ? 'border-cyan-500 bg-cyan-500/10'
                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lucide Icon Selection */}
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Lucide Icon</label>
                  <select
                    value={formData.lucideIcon}
                    onChange={(e) => setFormData(prev => ({ ...prev, lucideIcon: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    {lucideIconOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                      Title <span className="text-red-400">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g., Full-Stack"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Subtitle</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Web Development"
                      value={formData.subtitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="Describe your service..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
                    required
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Tech Stack / Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, i) => (
                      <span 
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20"
                      >
                        {tag}
                        <button 
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-white"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    />
                    <button 
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Status</label>
                  <div className="flex gap-2">
                    {['active', 'draft', 'archived'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, status }))}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                          formData.status === status
                            ? 'bg-cyan-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-800">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <div className="flex-1"></div>
                {editingService && (
                  <button 
                    type="button"
                    onClick={() => handleDeleteService(editingService._id)}
                    className="px-4 py-2.5 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600/20 transition-colors text-sm font-medium border border-red-600/20 flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}
                <button 
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {editingService ? 'Save Changes' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
