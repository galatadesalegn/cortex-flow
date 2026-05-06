import { useState, useEffect, useRef } from 'react';
import {
  Award,
  Plus,
  Search,
  Settings,
  BarChart3,
  History,
  Shield,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Verified,
  Clock,
  Hash,
  Calendar,
  Building2,
  Trash2,
  ExternalLink,
  Filter,
  ArrowUpDown,
  Link,
  QrCode,
  Edit2,
  X,
  Save,
  Copy,
  GripVertical
} from 'lucide-react';
import { Reorder } from 'framer-motion';
import { certificateService } from '../services/certificateService.js';
import { uploadService } from '../services/uploadService.js';
import { toast } from 'sonner';

const Certificates = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewCertModal, setShowNewCertModal] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('custom'); // 'custom', 'name', 'date', 'id'
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    date: '',
    link: '',
    image: '',
    category: 'Other',
    certificateId: '',
    order: 0
  });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch certificates on mount
  useEffect(() => {
    fetchCertificates();
  }, []);

  // Populate form data when editing
  useEffect(() => {
    if (editingCert) {
      setFormData({
        name: editingCert.name || '',
        issuer: editingCert.issuer || '',
        date: editingCert.date ? editingCert.date.split('T')[0] : '',
        link: editingCert.link || '',
        image: editingCert.image || '',
        category: editingCert.category || 'Other',
        certificateId: editingCert.certificateId || '',
        order: editingCert.order || 0
      });
      setImagePreview(editingCert.image || null);
    } else if (showNewCertModal) {
      // Find current category from filter
      const currentCategory = categoryOptions.find(cat =>
        cat.toLowerCase().replace(/[^a-z]/g, '') === selectedFilter
      ) || 'Other';

      setFormData({
        name: '',
        issuer: '',
        date: '',
        link: '',
        image: '',
        category: currentCategory,
        certificateId: '',
        order: certificates.length > 0 ? Math.max(...certificates.map(c => c.order || 0)) + 1 : 0
      });
      setImagePreview(null);
    }
  }, [editingCert, showNewCertModal, selectedFilter, certificates]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await certificateService.getAll();
      setCertificates(response.data || []);
    } catch (err) {
      console.error('Failed to fetch certificates:', err);
      setError('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  // Stats data - dynamic from certificates
  const stats = [
    {
      title: 'TOTAL CERTIFICATES',
      value: certificates.length.toString(),
      subtitle: 'In database',
      icon: Award,
      color: 'blue',
      borderColor: 'border-blue-500/50'
    },
    {
      title: 'VERIFIED',
      value: certificates.filter(c => c.image).length.toString(),
      subtitle: 'With images',
      icon: Verified,
      color: 'cyan',
      borderColor: 'border-cyan-500/50'
    },
    {
      title: 'RECENT',
      value: certificates.filter(c => {
        const date = new Date(c.date);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return date > monthAgo;
      }).length.toString(),
      subtitle: 'Last 30 days',
      icon: Clock,
      color: 'purple',
      borderColor: 'border-purple-500/50'
    },
    {
      title: 'UNIQUE ISSUERS',
      value: [...new Set(certificates.map(c => c.issuer))].length.toString(),
      subtitle: 'Different organizations',
      icon: Building2,
      color: 'orange',
      borderColor: 'border-orange-500/50'
    }
  ];

  // Format date to "Oct 2005" style
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Category options
  const categoryOptions = ['Web', 'Mobile', 'AI/ML', 'UI/UX', 'Cloud', 'Data Science', 'DevOps', 'Cybersecurity', 'Other'];

  // Filter tabs - dynamic based on category
  const filterTabs = [
    { id: 'all', label: 'All Entries', count: certificates.length },
    ...categoryOptions.map(cat => ({
      id: cat.toLowerCase().replace(/[^a-z]/g, ''),
      label: cat,
      count: certificates.filter(c => c.category === cat).length
    }))
  ];

  // Filter certificates based on selected filter and search query
  const filteredCertificates = certificates
    .filter(cert => {
      const matchesSearch = cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedFilter === 'all') return true;
      return cert.category?.toLowerCase().replace(/[^a-z]/g, '') === selectedFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'date-new': return new Date(b.date) - new Date(a.date);
        case 'date-old': return new Date(a.date) - new Date(b.date);
        case 'issuer': return a.issuer.localeCompare(b.issuer);
        case 'id': return (a.certificateId || '').localeCompare(b.certificateId || '');
        default: return (a.order || 0) - (b.order || 0);
      }
    });

  const applySortAsDefault = async () => {
    if (!window.confirm('This will overwrite your manual custom order with the current sort. Continue?')) return;

    try {
      const orders = filteredCertificates.map((cert, index) => ({
        id: cert._id,
        order: index
      }));

      await certificateService.reorder(orders);
      setSortBy('custom');
      fetchCertificates();
      toast.success('Sort order applied permanently');
    } catch (err) {
      toast.error('Failed to apply sort');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'legacy': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleDeleteCertificate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;

    try {
      await certificateService.delete(id);
      setCertificates(prev => prev.filter(cert => cert._id !== id));
    } catch (err) {
      console.error('Failed to delete certificate:', err);
      alert('Failed to delete certificate');
    }
  };

  const handleCreateCertificate = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.issuer || !formData.date) {
      toast.error('Please fill in all required fields (Name, Issuer, Date)');
      return;
    }

    try {
      const response = await certificateService.create(formData);
      setCertificates(prev => [...prev, response.data]);
      setShowNewCertModal(false);
      setFormData({ name: '', issuer: '', date: '', link: '', image: '', category: 'Other', certificateId: '' });
      setImagePreview(null);
      toast.success('Certificate created successfully!');
    } catch (err) {
      console.error('Failed to create certificate:', err);
      toast.error('Failed to create certificate: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateCertificate = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.issuer || !formData.date) {
      toast.error('Please fill in all required fields (Name, Issuer, Date)');
      return;
    }

    try {
      const response = await certificateService.update(editingCert._id, formData);
      setCertificates(prev => prev.map(cert =>
        cert._id === editingCert._id ? response.data : cert
      ));
      setEditingCert(null);
      setFormData({ name: '', issuer: '', date: '', link: '', image: '', category: 'Other', certificateId: '' });
      setImagePreview(null);
      toast.success('Certificate updated successfully!');
    } catch (err) {
      console.error('Failed to update certificate:', err);
      toast.error('Failed to update certificate: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReorder = (newOrder) => {
    // Reordering is only allowed in 'all' view without active search and ONLY in custom sort mode
    if (selectedFilter !== 'all' || searchQuery || sortBy !== 'custom') {
      return; // Reorder.Group handles the visual side, but we don't update state
    }
    setCertificates(newOrder);
  };

  const saveNewOrder = async () => {
    try {
      const orders = certificates.map((cert, index) => ({
        id: cert._id,
        order: index
      }));

      await certificateService.reorder(orders);
      toast.success('Display order saved successfully');
    } catch (err) {
      console.error('Failed to save order:', err);
      toast.error('Failed to save order');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);

      // Upload to server
      const result = await uploadService.uploadImage(file);

      if (result.success) {
        setFormData(prev => ({ ...prev, image: result.data.url }));
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      toast.error('Upload failed: ' + (error.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateQRCode = (link) => {
    if (!link) return null;
    // Using a free QR code API
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(link)}`;
  };

  const handleCopyLink = (link) => {
    if (!link) {
      toast.error('No link to copy');
      return;
    }
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  const handleDownloadImage = (image, name) => {
    if (!image) {
      toast.error('No image to download');
      return;
    }
    const link = document.createElement('a');
    link.href = image;
    link.download = `${name || 'certificate'}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image download started!');
  };

  const handleShowQRCode = (link) => {
    if (!link) {
      toast.error('No link to generate QR code');
      return;
    }
    const qrUrl = generateQRCode(link);
    window.open(qrUrl, '_blank');
  };

  return (
    <div className="p-6 bg-[#0a0a0f] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs text-cyan-400 font-medium tracking-wider mb-1">ADMIN COMMAND CENTER</p>
          <h1 className="text-2xl font-bold text-white">Certificate Manager</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 w-64"
            />
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-2 bg-gray-800/30 border border-gray-800 rounded-lg px-3 py-1.5">
            <Filter size={14} className="text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-gray-300 focus:outline-none cursor-pointer pr-1"
            >
              <option value="custom">Custom Order</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="date-new">Date (Newest)</option>
              <option value="date-old">Date (Oldest)</option>
              <option value="issuer">Sort by Issuer</option>
              <option value="id">Sort by ID</option>
            </select>
          </div>

          {sortBy !== 'custom' && (
            <button
              onClick={applySortAsDefault}
              className="px-3 py-2 rounded-lg bg-gray-800 text-[10px] text-gray-400 hover:text-[#1de9b6] border border-gray-700 transition-all font-black uppercase tracking-tighter"
              title="Save this order as the new custom order"
            >
              Apply as Default
            </button>
          )}
          <button className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white transition-colors">
            <Settings size={18} />
          </button>
          {sortBy === 'custom' && (
            <button
              onClick={saveNewOrder}
              className="px-4 py-2 rounded-lg bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30 transition-colors border border-cyan-500/30 flex items-center gap-2 text-sm font-bold"
            >
              <Save size={16} />
              Save New Order
            </button>
          )}
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
            Deploy Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-gray-800">
        {[
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'history', label: 'History', icon: History },
          { id: 'verify', label: 'Verify', icon: Shield }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id
              ? 'text-cyan-400 border-cyan-400'
              : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-[#12121a] border ${stat.borderColor} rounded-xl p-5 hover:border-opacity-80 transition-all duration-300 hover:transform hover:scale-[1.01] hover:shadow-2xl hover:shadow-${stat.color}-400/20 hover:-translate-y-1`}
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">{stat.title}</span>
              <stat.icon size={18} className={`text-${stat.color}-400`} />
            </div>
            <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
            <div className={`text-xs text-${stat.color}-400`}>{stat.subtitle}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 mr-2">Filter by:</span>
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedFilter === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 mr-2">Sort by</span>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white transition-all text-sm">
            Date Issued (Recent)
            <ArrowUpDown size={14} />
          </button>
        </div>
      </div>

      {/* Certificates Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading certificates...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchCertificates}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={filteredCertificates}
          onReorder={handleReorder}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8"
        >
          {filteredCertificates.map(cert => (
            <Reorder.Item
              key={cert._id}
              value={cert}
              className="bg-[#12121a] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-300 group relative"
            >
              {/* Drag Handle */}
              <div className="absolute top-3 left-3 z-20 p-1.5 rounded-md bg-black/40 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                <GripVertical size={14} className="text-gray-400" />
              </div>

              {/* Certificate Image */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                {/* Status Badge */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${cert.image ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                  {cert.image ? 'verified' : 'pending'}
                </div>

                {/* Placeholder Certificate Visual */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-3/4 border border-gray-700 rounded-lg bg-gray-800/50 flex items-center justify-center">
                    <Award size={48} className="text-gray-600" />
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {cert.link && (
                    <button
                      onClick={() => window.open(cert.link, '_blank')}
                      className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                      title="View Certificate"
                    >
                      <ExternalLink size={16} />
                    </button>
                  )}
                  {cert.link && (
                    <button
                      onClick={() => handleCopyLink(cert.link)}
                      className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                      title="Copy Link"
                    >
                      <Copy size={16} />
                    </button>
                  )}
                  {cert.link && (
                    <button
                      onClick={() => handleShowQRCode(cert.link)}
                      className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                      title="Show QR Code"
                    >
                      <QrCode size={16} />
                    </button>
                  )}
                  {cert.image && (
                    <button
                      onClick={() => handleDownloadImage(cert.image, cert.name)}
                      className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                      title="Download Image"
                    >
                      <Save size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => setEditingCert(cert)}
                    className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    title="Edit Certificate"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCertificate(cert._id)}
                    className="p-2 rounded-lg bg-red-600/80 text-white hover:bg-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Certificate Info */}
              <div className="p-4">
                {/* Certificate ID - Show custom ID if available, otherwise MongoDB ID */}
                <div className="flex items-center gap-1 text-[10px] text-gray-600 mb-2">
                  <Hash size={10} />
                  <span className="font-mono">{cert.certificateId || cert._id.slice(-8)}</span>
                </div>

                {/* Category Badge */}
                <div className="mb-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${cert.category === 'Web' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    cert.category === 'Mobile' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      cert.category === 'AI/ML' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        cert.category === 'UI/UX' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' :
                          cert.category === 'Cloud' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                            cert.category === 'Data Science' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              cert.category === 'DevOps' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                cert.category === 'Cybersecurity' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                  'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                    {cert.category || 'Other'}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white mb-1 truncate">{cert.name}</h3>
                <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                  <Building2 size={12} />
                  {cert.issuer}
                </p>

                {/* Link and QR Row */}
                <div className="flex items-center gap-2 mb-3">
                  {cert.link ? (
                    <button
                      onClick={() => window.open(cert.link, '_blank')}
                      className="flex-1 flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-2 py-1.5 rounded"
                    >
                      <Link size={12} />
                      <span className="truncate">View Link</span>
                    </button>
                  ) : (
                    <div className="flex-1 flex items-center gap-1 text-xs text-gray-500 bg-gray-800/50 px-2 py-1.5 rounded">
                      <Link size={12} />
                      <span>No Link</span>
                    </div>
                  )}
                  {cert.link && (
                    <button
                      onClick={() => handleCopyLink(cert.link)}
                      className="p-1.5 rounded bg-gray-800 text-gray-400 hover:text-white transition-colors"
                      title="Copy Link"
                    >
                      <Copy size={14} />
                    </button>
                  )}
                  {cert.link && (
                    <button
                      onClick={() => handleShowQRCode(cert.link)}
                      className="p-1.5 rounded bg-gray-800 text-gray-400 hover:text-white transition-colors"
                      title="Show QR Code"
                    >
                      <QrCode size={14} />
                    </button>
                  )}
                  {cert.image && (
                    <button
                      onClick={() => handleDownloadImage(cert.image, cert.name)}
                      className="p-1.5 rounded bg-gray-800 text-gray-400 hover:text-white transition-colors"
                      title="Download Image"
                    >
                      <Save size={14} />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    Issued {formatDate(cert.date)}
                  </div>
                  <button className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                    <Hash size={12} />
                    VIEW HASH
                  </button>
                </div>
              </div>
            </Reorder.Item>
          ))}

          {/* Add New Entry Card */}
          <button
            onClick={() => setShowNewCertModal(true)}
            className="border-2 border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-cyan-500/50 hover:bg-gray-800/20 transition-all min-h-[280px] group"
          >
            <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
              <Plus size={28} className="text-gray-500 group-hover:text-cyan-400" />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 font-medium mb-1">Add New Entry</p>
              <p className="text-xs text-gray-600 text-center max-w-[200px]">
                Upload a digital certificate or manual verification hash
              </p>
            </div>
          </button>
        </Reorder.Group>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="text-white">{filteredCertificates.length}</span> of {certificates.length} certificates in the Nexus
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
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === page
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

      {/* Add/Edit Certificate Modal */}
      {(showNewCertModal || editingCert) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
                {editingCert ? 'Edit Certificate' : 'Add New Certificate'}
              </h2>
              <button
                onClick={() => {
                  setShowNewCertModal(false);
                  setEditingCert(null);
                  setFormData({ name: '', issuer: '', date: '', link: '', image: '', category: 'Other', certificateId: '' });
                  setImagePreview(null);
                }}
                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={editingCert ? handleUpdateCertificate : handleCreateCertificate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Certificate Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., AWS Solutions Architect"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Issuer <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Amazon Web Services"
                    value={formData.issuer}
                    onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    {categoryOptions.map(cat => (
                      <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
                    ))}
                  </select>
                </div>



                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Hash size={12} />
                    Certificate ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., CERT-2024-001"
                    value={formData.certificateId}
                    onChange={(e) => setFormData(prev => ({ ...prev, certificateId: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Custom ID for your certificate (optional)</p>
                </div>
              </div>

              {/* Right Column - Link, Image, QR */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Link size={12} />
                    Certificate Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/cert"
                    value={formData.link}
                    onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <QrCode size={12} />
                    QR Code Preview
                  </label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center bg-gray-800/30">
                    {formData.link && generateQRCode(formData.link) ? (
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={generateQRCode(formData.link)}
                          alt="QR Code"
                          className="w-32 h-32 rounded-lg bg-white"
                        />
                        <p className="text-xs text-gray-400">QR code for certificate link</p>
                      </div>
                    ) : (
                      <div className="py-4">
                        <QrCode size={48} className="text-gray-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Add a link to generate QR code</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Certificate Image</label>
                  <div
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-cyan-500/50 transition-colors cursor-pointer"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    {imagePreview || formData.image ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-800">
                          <img
                            src={imagePreview || formData.image}
                            alt="Certificate"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <X size={12} /> Remove Image
                        </button>
                      </div>
                    ) : (
                      <div className="py-4">
                        {uploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                            <p className="text-xs text-gray-400">Uploading...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Award size={32} className="text-gray-600" />
                            <p className="text-xs text-gray-500">Click to upload image</p>
                            <p className="text-[10px] text-gray-600">PNG, JPG up to 5MB</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-800">
              <button
                type="button"
                onClick={() => {
                  setShowNewCertModal(false);
                  setEditingCert(null);
                  setFormData({ name: '', issuer: '', date: '', link: '', image: '', category: 'Other', certificateId: '' });
                  setImagePreview(null);
                }}
                className="px-4 py-2.5 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <div className="flex-1"></div>
              {editingCert && (
                <button className="px-4 py-2.5 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600/20 transition-colors text-sm font-medium border border-red-600/20 flex items-center gap-2">
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
              <button
                onClick={editingCert ? handleUpdateCertificate : handleCreateCertificate}
                className="px-6 py-2.5 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Save size={16} />
                {editingCert ? 'Save Changes' : 'Add Certificate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
