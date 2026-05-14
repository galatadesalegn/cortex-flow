import { useState, useEffect } from 'react';
import {
  Shield,
  Globe,
  Mail,
  Phone,
  Link2,
  ExternalLink,
  Link,
  Send,
  Plus,
  Save,
  X,
  UserPlus,
  UserMinus,
  Crown,
  Eye,
  Edit3,
  Trash2,
  CheckCircle,
  AlertCircle,
  Activity,
  Server,
  Clock,
  ChevronDown,
  MoreVertical,
  Lock,
  Unlock,
  Zap,
  Check,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../hooks';
import settingService from '../services/settingService';
import { profileService } from '../services/profileService';
import systemStatsService from '../services/systemStatsService.js';

const Settings = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [systemStats, setSystemStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Settings state - connected to profile API
  const [settings, setSettings] = useState({
    adminDisplayName: '',
    loginUsername: '',
    primaryEmail: '',
    directLine: '',
    socialLinks: {
      linkedin: '',
      github: '',
      telegram: '',
      twitter: ''
    },
    siteMetaTitle: '',
    metaDescription: '',
    indexingStatus: 'active'
  });

  // Add new platform modal state
  const [showAddPlatformModal, setShowAddPlatformModal] = useState(false);
  const [newPlatform, setNewPlatform] = useState({ name: '', url: '' });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Admins list from API
  const [admins, setAdmins] = useState([]);

  // Fetch admins on mount
  useEffect(() => {
    if (activeTab === 'admins') {
      fetchAdmins();
    }
  }, [activeTab]);

  // Fetch profile settings and system stats
  useEffect(() => {
    fetchProfileSettings();
    fetchSystemStats();
  }, []);
  
  const fetchSystemStats = async () => {
    try {
      setStatsLoading(true);
      const response = await systemStatsService.getStats();
      setSystemStats(response.data);
    } catch (error) {
      console.error('Failed to fetch system stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchProfileSettings = async () => {
    try {
      const response = await profileService.getProfile();
      const profile = response.data;
      if (profile) {
        setSettings(prev => ({
          ...prev,
          adminDisplayName: profile.name || '',
          loginUsername: profile.username || '',
          primaryEmail: profile.email || '',
          socialLinks: {
            linkedin: profile.linkedin || '',
            github: profile.github || '',
            telegram: profile.telegram || '',
            twitter: profile.twitter || ''
          },
          siteMetaTitle: profile.siteTitle || '',
          metaDescription: profile.bio || ''
        }));
      }
    } catch (error) {
      console.error('Failed to fetch profile settings:', error);
    }
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await settingService.getAllAdmins();
      setAdmins(response.data || []);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      toast.error('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  // Save general settings
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await profileService.updateProfile({
        name: settings.adminDisplayName,
        email: settings.primaryEmail,
        phone: settings.directLine,
        linkedin: settings.socialLinks.linkedin,
        github: settings.socialLinks.github,
        telegram: settings.socialLinks.telegram,
        twitter: settings.socialLinks.twitter,
        siteTitle: settings.siteMetaTitle,
        bio: settings.metaDescription
      });
      toast.success('Settings saved successfully');
      // Re-fetch profile in background (fire and forget)
      fetchProfileSettings().catch(err => console.error('Failed to re-fetch profile:', err));
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setSaving(true);
      await settingService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Failed to change password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error('Please enter your password to confirm deletion');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'https://galatadesalegn.onrender.com';
      
      const response = await fetch(`${API_URL}/api/users/account/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: deletePassword })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Your account has been deleted successfully');
        // Clear auth and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        toast.error(data.message || 'Failed to delete account');
        setSaving(false);
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast.error('Failed to delete account. Please try again.');
      setSaving(false);
    }
  };

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    username: '',
    role: 'editor',
    permissions: {
      dashboard: true,
      projects: true,
      experience: true,
      skills: true,
      certificates: true,
      services: true,
      messages: false,
      settings: false,
      manageAdmins: false
    }
  });

  // Create admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      setSaving(true);
      await settingService.createAdmin(newAdmin);
      toast.success('Admin created successfully');
      setShowAddAdminModal(false);
      setNewAdmin({
        name: '',
        email: '',
        username: '',
        role: 'editor',
        permissions: {
          dashboard: true,
          projects: true,
          experience: true,
          skills: true,
          certificates: true,
          services: true,
          messages: false,
          settings: false,
          manageAdmins: false
        }
      });
      fetchAdmins();
    } catch (error) {
      console.error('Failed to create admin:', error);
      toast.error(error.response?.data?.message || 'Failed to create admin');
    } finally {
      setSaving(false);
    }
  };

  // Update admin
  const handleUpdateAdmin = async () => {
    if (!editingAdmin) return;

    try {
      setSaving(true);
      await settingService.updateAdmin(editingAdmin._id, {
        name: editingAdmin.name,
        email: editingAdmin.email,
        role: editingAdmin.role,
        status: editingAdmin.status,
        permissions: editingAdmin.permissions
      });
      toast.success('Admin updated successfully');
      setEditingAdmin(null);
      fetchAdmins();
    } catch (error) {
      console.error('Failed to update admin:', error);
      toast.error(error.response?.data?.message || 'Failed to update admin');
    } finally {
      setSaving(false);
    }
  };

  // Delete admin
  const handleDeleteAdmin = async (id) => {
    toast('Are you sure you want to delete this admin?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await settingService.deleteAdmin(id);
            toast.success('Admin deleted successfully');
            fetchAdmins();
            if (editingAdmin?._id === id) {
              setEditingAdmin(null);
            }
          } catch (error) {
            console.error('Failed to delete admin:', error);
            toast.error('Failed to delete admin');
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  // Handle permission toggle with API
  const handlePermissionToggle = async (adminId, permission) => {
    const admin = admins.find(a => a._id === adminId);
    if (!admin || admin.role === 'super_admin') return;

    const newPermissions = {
      ...admin.permissions,
      [permission]: !admin.permissions[permission]
    };

    // Update local state first for responsiveness
    setAdmins(admins.map(a => {
      if (a._id === adminId) {
        return { ...a, permissions: newPermissions };
      }
      return a;
    }));

    // Update editing admin if open
    if (editingAdmin?._id === adminId) {
      setEditingAdmin({ ...editingAdmin, permissions: newPermissions });
    }
  };

  // Save permissions for editing admin
  const handleSavePermissions = async () => {
    if (!editingAdmin || editingAdmin.role === 'super_admin') return;

    try {
      setSaving(true);
      await settingService.updatePermissions(editingAdmin._id, editingAdmin.permissions);
      toast.success('Permissions saved successfully');
      fetchAdmins();
    } catch (error) {
      console.error('Failed to save permissions:', error);
      toast.error('Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  // Default system stats (fallback)
  const defaultSystemStats = [
    { title: 'API Status', value: '99.98%', subtext: '→ Stable', icon: Activity, color: 'green' },
    { title: 'Last Deploy', value: '2h 14m', subtext: 'AGO', icon: Clock, color: 'blue' },
    { title: 'Server Region', value: 'us-east-1', subtext: '', icon: Server, color: 'cyan' }
  ];

  const getRoleBadge = (role) => {
    switch(role) {
      case 'super_admin':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-xs font-medium border border-purple-500/30">
            <Crown size={12} />
            Super Admin
          </span>
        );
      case 'editor':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-medium border border-blue-500/30">
            <Edit3 size={12} />
            Editor
          </span>
        );
      case 'viewer':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded bg-gray-500/20 text-gray-400 text-xs font-medium border border-gray-500/30">
            <Eye size={12} />
            Viewer
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`p-4 md:p-6 min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0a0a0f]' : 'bg-bg-primary'}`}>
      {/* Header */}
      <div className="mb-8">
        <p className={`text-[10px] md:text-xs uppercase tracking-widest mb-1 transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>Obsidian Nexus / Command Center v2.1</p>
        <h1 className={`text-2xl md:text-3xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>System Settings</h1>
        <p className={`text-sm md:text-base transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>Configure your global portfolio parameters and administrative credentials.</p>
      </div>

      {/* Tabs */}
      <div className={`flex items-center gap-1 mb-8 border-b overflow-x-auto no-scrollbar whitespace-nowrap transition-colors duration-300 ${isDark ? 'border-gray-800' : 'border-border-theme'}`}>
        {[
          { id: 'general', label: 'General', icon: Shield },
          { id: 'admins', label: 'Admin Management', icon: UserPlus },
          { id: 'security', label: 'Security', icon: Lock }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 shrink-0 ${
              activeTab === tab.id 
                ? isDark ? 'text-cyan-400 border-cyan-400' : 'text-accent border-accent'
                : isDark ? 'text-gray-500 border-transparent hover:text-gray-300' : 'text-text-muted border-transparent hover:text-text-primary'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' ? (
        <>
          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Security Card */}
            <div className={`border rounded-xl p-6 transition-all duration-300 ${
              isDark ? 'bg-[#12121a] border-gray-800' : 'bg-bg-card border-border-theme shadow-soft'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                  <Shield size={20} className="text-blue-400" />
                </div>
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-text-primary'}`}>Security</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-[10px] uppercase tracking-wider mb-2 ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>Admin Display Name</label>
                  <input 
                    type="text"
                    value={settings.adminDisplayName}
                    onChange={(e) => setSettings({...settings, adminDisplayName: e.target.value})}
                    placeholder="Enter display name"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all ${
                      isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted focus:border-accent'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block text-[10px] uppercase tracking-wider mb-2 ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>Login Username</label>
                  <input 
                    type="text"
                    value={settings.loginUsername}
                    onChange={(e) => setSettings({...settings, loginUsername: e.target.value})}
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all ${
                      isDark ? 'bg-gray-800 border-gray-700 text-gray-300 focus:border-blue-500' : 'bg-bg-secondary border-border-theme text-text-secondary focus:border-accent'
                    }`}
                  />
                </div>
                
                <button 
                  onClick={() => setActiveTab('security')}
                  className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors mt-4"
                >
                  <Zap size={14} />
                  Update Password
                </button>
              </div>
            </div>

            {/* Contact Card */}
            <div className={`border rounded-xl p-6 transition-all duration-300 ${
              isDark ? 'bg-[#12121a] border-gray-800' : 'bg-bg-card border-border-theme shadow-soft'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'}`}>
                  <Mail size={20} className="text-cyan-400" />
                </div>
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-text-primary'}`}>Contact</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-[10px] uppercase tracking-wider mb-2 ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>Primary Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                      type="email"
                      value={settings.primaryEmail}
                      onChange={(e) => setSettings({...settings, primaryEmail: e.target.value})}
                      placeholder="@"
                      className={`w-full border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all ${
                        isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted focus:border-accent'
                      }`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-[10px] uppercase tracking-wider mb-2 ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>Direct Line</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                      type="text"
                      value={settings.directLine}
                      onChange={(e) => setSettings({...settings, directLine: e.target.value})}
                      placeholder="+X XXX XXX XXXX"
                      className={`w-full border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all ${
                        isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted focus:border-accent'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Matrix Card */}
            <div className={`border rounded-xl p-6 transition-all duration-300 ${
              isDark ? 'bg-[#12121a] border-gray-800' : 'bg-bg-card border-border-theme shadow-soft'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                  <Link2 size={20} className="text-purple-400" />
                </div>
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-text-primary'}`}>Social Matrix</h2>
              </div>
              
              <div className="space-y-4 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                {Object.entries(settings.socialLinks).map(([platform, url]) => (
                  <div key={platform}>
                    <label className={`block text-[10px] uppercase tracking-wider mb-2 ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>{platform}</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input 
                          type="text"
                          value={url}
                          onChange={(e) => {
                            const newLinks = { ...settings.socialLinks, [platform]: e.target.value };
                            setSettings({ ...settings, socialLinks: newLinks });
                          }}
                          placeholder={`https://${platform}.com/...`}
                          className={`w-full border rounded-lg pl-10 pr-4 py-2 text-xs focus:outline-none transition-all ${
                            isDark ? 'bg-gray-800 border-gray-700 text-gray-300 placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-secondary placeholder-text-muted'
                          }`}
                        />
                      </div>
                      <button 
                        onClick={() => {
                          const newLinks = { ...settings.socialLinks };
                          delete newLinks[platform];
                          setSettings({ ...settings, socialLinks: newLinks });
                        }}
                        className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 text-gray-500 hover:text-red-400' : 'bg-bg-secondary text-text-muted hover:text-red-500'}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => setShowAddPlatformModal(true)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-sm mt-4 ${
                    isDark ? 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-600' : 'border-border-theme text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                  }`}
                >
                  <Plus size={14} />
                  Add New Platform
                </button>
              </div>
            </div>

            {/* Add New Platform Modal */}
            {showAddPlatformModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Add New Platform</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-2">Platform Name</label>
                      <input
                        type="text"
                        value={newPlatform.name}
                        onChange={(e) => setNewPlatform({...newPlatform, name: e.target.value.toLowerCase()})}
                        placeholder="e.g., instagram, youtube, discord"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-2">Profile URL</label>
                      <input
                        type="text"
                        value={newPlatform.url}
                        onChange={(e) => setNewPlatform({...newPlatform, url: e.target.value})}
                        placeholder="https://..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => {
                          setShowAddPlatformModal(false);
                          setNewPlatform({ name: '', url: '' });
                        }}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (newPlatform.name && newPlatform.url) {
                            setSettings({
                              ...settings,
                              socialLinks: {
                                ...settings.socialLinks,
                                [newPlatform.name]: newPlatform.url
                              }
                            });
                            toast.success(`${newPlatform.name} added successfully`);
                            setShowAddPlatformModal(false);
                            setNewPlatform({ name: '', url: '' });
                          } else {
                            toast.error('Please fill in both fields');
                          }
                        }}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors text-sm font-medium"
                      >
                        Add Platform
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Buttons Card */}
            <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Save size={20} className="text-green-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Save Changes</h2>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={fetchProfileSettings}
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium"
                  disabled={saving}
                >
                  Discard Changes
                </button>
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="flex-1 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Save Config
                </button>
              </div>
            </div>
          </div>

          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statsLoading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-[#12121a] border border-gray-800 rounded-xl p-5"
                >
                  <div className="h-4 bg-gray-800 rounded w-24 animate-pulse mb-2"></div>
                  <div className="h-8 bg-gray-800 rounded w-32 animate-pulse"></div>
                </div>
              ))
            ) : (
              <>
                {/* API Status */}
                <div className="bg-[#12121a] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all duration-300">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">API Status</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-green-400">{systemStats?.apiStatus || '99.98%'}</span>
                    <span className="text-xs mb-1 text-green-400">{systemStats?.apiStatusSub || '→ Stable'}</span>
                  </div>
                </div>
                {/* Last Deploy */}
                <div className="bg-[#12121a] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all duration-300">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Last Deploy</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-blue-400">{systemStats?.lastDeploy || '2h 14m'}</span>
                    <span className="text-xs mb-1 text-gray-500">{systemStats?.lastDeploySub || 'AGO'}</span>
                  </div>
                </div>
                {/* Server Region */}
                <div className="bg-[#12121a] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all duration-300">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Server Region</p>
                  <span className="text-2xl font-bold text-cyan-400">{systemStats?.serverRegion || 'us-east-1'}</span>
                </div>
              </>
            )}
          </div>
        </>
      ) : activeTab === 'admins' ? (
        /* Admin Management Tab */
        <>
          {/* Admin List Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Admin Management</h2>
              <p className="text-gray-500 text-sm">Manage access permissions and administrative rights.</p>
            </div>
            <button 
              onClick={() => setShowAddAdminModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 transition-colors text-sm font-semibold"
            >
              <UserPlus size={18} />
              Add Admin
            </button>
          </div>

          {/* Admin List */}
          <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${
            isDark ? 'bg-[#12121a] border-gray-800' : 'bg-bg-card border-border-theme shadow-soft'
          }`}>
            {/* Table Header */}
            <div className={`grid grid-cols-12 gap-4 p-4 border-b text-xs font-medium uppercase tracking-wider ${
              isDark ? 'border-gray-800 bg-gray-800/30 text-gray-400' : 'border-border-theme bg-bg-secondary text-text-muted'
            }`}>
              <div className="col-span-3">Admin</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Last Active</div>
              <div className="col-span-2">Permissions</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Admin Rows */}
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 size={24} className="animate-spin mx-auto text-blue-500" />
                <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Loading admins...</p>
              </div>
            ) : admins.length === 0 ? (
              <div className="p-8 text-center">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>No admins found. Add your first admin above.</p>
              </div>
            ) : (
              admins.map((admin) => (
              <div key={admin._id} className={`grid grid-cols-12 gap-4 p-4 border-b transition-colors items-center ${
                isDark ? 'border-gray-800 hover:bg-gray-800/20' : 'border-border-theme hover:bg-bg-secondary'
              }`}>
                {/* Admin Info */}
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {admin.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-text-primary'}`}>{admin.name}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>{admin.email}</p>
                  </div>
                </div>

                {/* Role */}
                <div className="col-span-2">
                  {getRoleBadge(admin.role)}
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span className={`flex items-center gap-1.5 text-sm ${admin.status === 'active' ? 'text-green-500' : 'text-gray-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${admin.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                    {admin.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Last Active */}
                <div className={`col-span-2 text-sm ${isDark ? 'text-gray-400' : 'text-text-secondary'}`}>
                  {admin.lastActive}
                </div>

                {/* Permissions Summary */}
                <div className="col-span-2">
                  <div className="flex items-center gap-1 flex-wrap">
                    {Object.entries(admin.permissions)
                      .filter(([_, value]) => value)
                      .slice(0, 3)
                      .map(([key]) => (
                        <span key={key} className={`px-2 py-0.5 rounded text-[10px] border ${
                          isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-bg-secondary border-border-theme text-text-muted'
                        }`}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      ))}
                    {Object.values(admin.permissions).filter(Boolean).length > 3 && (
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>+{Object.values(admin.permissions).filter(Boolean).length - 3}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-end gap-1">
                  <button 
                    onClick={() => setEditingAdmin(admin)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark ? 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700' : 'bg-bg-secondary text-text-secondary hover:text-text-primary hover:bg-bg-accent'
                    }`}
                    title="Edit Permissions"
                  >
                    <Edit3 size={14} />
                  </button>
                  {admin.role !== 'super_admin' && (
                    <button
                      onClick={() => handleDeleteAdmin(admin._id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark ? 'bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'bg-bg-secondary text-text-secondary hover:text-red-600 hover:bg-red-50'
                      }`}
                      title="Remove Admin"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              ))
            )}
          </div>

          {/* Permissions Guide */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Crown size={16} className="text-purple-400" />
                <h3 className="text-sm font-semibold text-white">Super Admin</h3>
              </div>
              <p className="text-xs text-gray-400">Full access to all sections including admin management, settings, and system configuration.</p>
            </div>
            <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Edit3 size={16} className="text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Editor</h3>
              </div>
              <p className="text-xs text-gray-400">Can create, edit and manage content. No access to settings or admin management.</p>
            </div>
            <div className="bg-[#12121a] border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Eye size={16} className="text-gray-400" />
                <h3 className="text-sm font-semibold text-white">Viewer</h3>
              </div>
              <p className="text-xs text-gray-400">Read-only access to dashboard and analytics. Cannot modify any content.</p>
            </div>
          </div>
        </>
      ) : (
        /* Security Tab */
        <div className="max-w-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Security Settings</h2>
          
          <div className="space-y-6">
            {/* Password Change */}
            <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Change Password</h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                  Update Password
                </button>
              </form>
            </div>

            {/* Session Management */}
            <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Active Sessions</h3>
              <div className="space-y-3">
                {statsLoading ? (
                  <div className="p-3 rounded-lg bg-gray-800/50 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-700"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-700 rounded w-32"></div>
                        <div className="h-3 bg-gray-700 rounded w-48"></div>
                      </div>
                    </div>
                  </div>
                ) : systemStats?.activeSessions && systemStats.activeSessions.length > 0 ? (
                  systemStats.activeSessions.map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
                          <span className="text-xs text-blue-400">💻</span>
                        </div>
                        <div>
                          <p className="text-sm text-white">{session.browser} on {session.os}</p>
                          <p className="text-xs text-gray-500">{session.isCurrent ? 'Current session' : ''} • IP: {session.ip}</p>
                        </div>
                      </div>
                      <span className="text-xs text-green-400">Active</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
                        <span className="text-xs text-blue-400">💻</span>
                      </div>
                      <div>
                        <p className="text-sm text-white">Chrome on MacOS</p>
                        <p className="text-xs text-gray-500">Current session • IP: 192.168.1.1</p>
                      </div>
                    </div>
                    <span className="text-xs text-green-400">Active</span>
                  </div>
                )}
              </div>
            </div>

            {/* Delete Account */}
            <div className="bg-[#12121a] border border-red-900/50 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h3>
              <p className="text-xs text-gray-500 mb-4">
                Once you delete your account, there is no going back. This action cannot be undone.
              </p>
              <button
                onClick={() => setShowDeleteAccountModal(true)}
                className="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 border border-red-600/50 hover:bg-red-600/30 transition-colors text-sm flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Add New Admin</h2>
              <button 
                onClick={() => setShowAddAdminModal(false)}
                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Email</label>
                  <input 
                    type="email" 
                    placeholder="admin@example.com"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Username</label>
                  <input 
                    type="text" 
                    placeholder="john_doe"
                    value={newAdmin.username}
                    onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Role</label>
                <select 
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Permissions</label>
                <div className="grid grid-cols-2 gap-2 bg-gray-800/30 rounded-lg p-4">
                  {Object.entries(newAdmin.permissions).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={value}
                        onChange={() => setNewAdmin({
                          ...newAdmin,
                          permissions: {
                            ...newAdmin.permissions,
                            [key]: !value
                          }
                        })}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="text-sm text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-xs text-yellow-400">
                  <AlertCircle size={14} className="inline mr-1" />
                  An invitation email will be sent to the new admin with setup instructions.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-800">
              <button
                onClick={() => setShowAddAdminModal(false)}
                className="px-4 py-2.5 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <div className="flex-1"></div>
              <button
                onClick={handleCreateAdmin}
                disabled={saving}
                className="px-6 py-2.5 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                Add Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Admin Permissions Modal */}
      {editingAdmin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {editingAdmin.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{editingAdmin.name}</h2>
                  <p className="text-xs text-gray-500">{editingAdmin.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingAdmin(null)}
                className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Role</label>
              <select 
                value={editingAdmin.role}
                onChange={(e) => setEditingAdmin({...editingAdmin, role: e.target.value})}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="super_admin">Super Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-3">Permissions</label>
              <div className="grid grid-cols-2 gap-3 bg-gray-800/30 rounded-lg p-4">
                {Object.entries(editingAdmin.permissions).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={value}
                      onChange={() => handlePermissionToggle(editingAdmin.id, key)}
                      disabled={editingAdmin.role === 'super_admin'}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500 disabled:opacity-50"
                    />
                    <span className={`text-sm capitalize ${value ? 'text-white' : 'text-gray-500'}`}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
              {editingAdmin.role === 'super_admin' && (
                <p className="text-xs text-purple-400 mt-2">Super Admins have all permissions automatically enabled.</p>
              )}
            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-800">
              <button
                onClick={() => setEditingAdmin(null)}
                className="px-4 py-2.5 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <div className="flex-1"></div>
              <button
                onClick={handleUpdateAdmin}
                disabled={saving}
                className="px-6 py-2.5 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121a] border border-red-900/50 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle size={20} className="text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Delete Account</h2>
                <p className="text-xs text-gray-500">This action cannot be undone</p>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-300">
                <strong>Warning:</strong> All your data will be permanently deleted. This includes your profile, settings, and admin access.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                Enter your password to confirm
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Your current password"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteAccountModal(false);
                  setDeletePassword('');
                }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={saving || !deletePassword}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
