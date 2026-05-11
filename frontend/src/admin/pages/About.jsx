import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import ProfileImageUpload from '../components/ProfileImageUpload';
import CVUpload from '../components/CVUpload';
import HeroProfileEditor from '../components/HeroProfileEditor';
import { useProfile, useAuth } from '../hooks';

const About = () => {
  const { profile, loading, updateProfile, fetchProfile } = useProfile();
  const { user } = useAuth();
  const isViewer = user?.role === 'viewer';
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    subtitle: '',
    bio: '',
    heroDescription: '',
    location: '',
    email: '',
    image: '',
    resume: '',
    statusBadge: '',
    stats: [],
    experience: [],
  });

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        title: profile.title || '',
        subtitle: profile.subtitle || '',
        bio: profile.bio || '',
        heroDescription: profile.heroDescription || '',
        location: profile.location || '',
        email: profile.email || '',
        image: profile.image || profile.avatar || '',
        resume: profile.resume || '',
        statusBadge: profile.statusBadge || '',
        stats: profile.stats || [],
        experience: profile.experience || [],
      });
    }
  }, [profile]);

  const handleSave = async () => {
    const result = await updateProfile(formData);

    if (result.success) {
      toast.success('Profile saved successfully!');
      // Refetch to get fresh data
      await fetchProfile();
    } else {
      toast.error(result.error || 'Failed to save profile');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">About Section</h1>
          <p className="text-gray-500 mt-1">Manage your profile information and bio</p>
        </div>
        {!isViewer && (
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>

      {loading && !profile && (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column - Hero & Profile Only */}
        <HeroProfileEditor
          data={formData}
          onChange={handleChange}
        />

        {/* Right Column - Photo + CV */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Profile Photo</h2>
            <ProfileImageUpload
              image={formData.image}
              onChange={(url) => handleChange('image', url)}
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">CV / Resume</h2>
            <CVUpload
              resumeUrl={formData.resume}
              onChange={(url) => handleChange('resume', url)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
