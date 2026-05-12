import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Save, Send, Image as ImageIcon, Link2, Tag, Calendar, Globe, Code, ExternalLink, Upload, X, Target, Shield, Layers, Plus, Loader2 } from 'lucide-react';
import { projectService, uploadService } from '../services';
import { toast } from 'sonner';
import { useTheme } from '../hooks';

const ProjectEdit = ({ project, onBack, onSave, readOnly = false }) => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    image: project?.image || '',
    githubLink: project?.githubLink || '',
    liveDemo: project?.liveDemo || '',
    techStack: project?.techStack || [],
    challenge: project?.challenge || '',
    pillars: project?.pillars || [],
    galleryImages: project?.galleryImages || [],
    category: project?.category || 'Web App',
    featured: project?.featured || false,
    duration: project?.duration || '',
    collaborationType: project?.collaborationType || 'Solo',
    videoUrl: project?.videoUrl || '',
    videoFile: null
  });

  // ... useEffect stays the same

  const fileInputRef = useRef(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setLoading(true);
      const result = await uploadService.uploadImage(file);
      if (result.success) {
        handleChange('image', result.data.url);
        toast.success('Image uploaded successfully');
      } else {
        toast.error(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Error uploading image');
    } finally {
      setLoading(false);
    }
  };

  const handleGalleryImageUpload = async (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setLoading(true);
      const result = await uploadService.uploadImage(file);
      if (result.success) {
        const newGallery = [...formData.galleryImages];
        newGallery[index] = result.data.url;
        handleChange('galleryImages', newGallery);
        toast.success('Gallery image uploaded');
      } else {
        toast.error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Gallery upload error:', error);
      toast.error('Error uploading gallery image');
    } finally {
      setLoading(false);
    }
  };

  const addGalleryImage = () => {
    if (formData.galleryImages.length < 4) {
      handleChange('galleryImages', [...formData.galleryImages, '']);
    }
  };

  const removeGalleryImage = (index) => {
    const newGallery = formData.galleryImages.filter((_, i) => i !== index);
    handleChange('galleryImages', newGallery);
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error('Video size should be less than 50MB');
      return;
    }

    try {
      setLoading(true);
      const result = await uploadService.uploadImage(file);
      if (result.success) {
        handleChange('videoUrl', result.data.url);
        toast.success('Video uploaded successfully');
      } else {
        toast.error(result.error || 'Failed to upload video');
      }
    } catch (error) {
      console.error('Video upload error:', error);
      toast.error('Error uploading video');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }

    try {
      setLoading(true);
      
      // Build submission data - preserve all existing data
      const dataToSubmit = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: formData.image || project?.image || null, // Preserve original if no new image
        githubLink: formData.githubLink?.trim() || null,
        liveDemo: formData.liveDemo?.trim() || null,
        techStack: formData.techStack,
        challenge: formData.challenge?.trim() || null,
        pillars: formData.pillars.filter(p => p.title && p.description),
        galleryImages: formData.galleryImages.filter(img => img && typeof img === 'string' && (img.startsWith('data:') || img.startsWith('http') || img.startsWith('https'))),
        category: formData.category?.trim() || project?.category || 'Other', // Preserve original category
        duration: formData.duration?.trim() || project?.duration || null,
        collaborationType: formData.collaborationType || project?.collaborationType || 'Solo', // Preserve original collaboration type
        videoUrl: formData.videoUrl?.trim() || project?.videoUrl || null, // Preserve original video if no new video
        featured: formData.featured !== undefined ? formData.featured : project?.featured || false // Preserve original featured status
      };

      const result = await projectService.update(project._id, dataToSubmit);

      if (result.success) {
        toast.success('Project updated successfully!');
        onSave?.();
      } else {
        toast.error(result.error || 'Failed to update project');
      }
    } catch (error) {
      console.error('Project update error:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to update project';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0a0a0f]' : 'bg-bg-primary'}`}>
      {/* Header */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6 border-t ${isDark ? 'border-white/5' : 'border-border-theme/10'}`}>
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all border disabled:opacity-50 backdrop-blur-sm ${isDark ? 'bg-gray-800/50 text-gray-300 border-gray-700/50 hover:bg-gray-700/50' : 'bg-bg-secondary text-text-secondary border-border-theme hover:bg-bg-accent shadow-sm'
                }`}
            >
              <ArrowLeft size={16} />
              <span className="text-sm font-semibold tracking-wide">Back</span>
            </button>
            <div>
              <p className="text-xs text-blue-400 font-bold tracking-[0.2em] mb-1 uppercase">Project Editor</p>
              <h1 className={`text-3xl font-black tracking-tight transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>{formData.title || 'Edit Project'}</h1>
            </div>
          </div>
          {!readOnly && (
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-50 font-bold tracking-wide shadow-lg shadow-blue-600/20"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span className="text-sm">{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        {/* Left Column - Main Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Project Identity */}
          <div className={`border rounded-2xl p-8 transition-all duration-300 ${isDark ? 'bg-[#12121a] border-gray-800 shadow-xl' : 'bg-bg-card border-border-theme shadow-soft'
            }`}>
            <h2 className={`text-xl font-bold mb-6 flex items-center gap-3 tracking-wide transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              Project Identity
            </h2>
            <div className="space-y-6">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-[0.15em] mb-3 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                  Project Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g. Quantum Flow Dashboard"
                  className={`w-full border rounded-xl px-5 py-3.5 text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 backdrop-blur-sm ${isDark ? 'bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted'
                    }`}
                />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-[0.15em] mb-3 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe the project..."
                  rows={5}
                  className={`w-full border rounded-xl px-5 py-3.5 text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none backdrop-blur-sm ${isDark ? 'bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted'
                    }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-[0.15em] mb-3 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className={`w-full border rounded-xl px-5 py-3.5 text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 backdrop-blur-sm ${isDark ? 'bg-gray-800/30 border-gray-700/50 text-white' : 'bg-bg-secondary border-border-theme text-text-primary'
                      }`}
                  >
                    <option value="Web App">Web App</option>
                    <option value="Mobile">Mobile</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-[0.15em] mb-3 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleChange('duration', e.target.value)}
                    placeholder="e.g. 3 months"
                    className={`w-full border rounded-xl px-5 py-3.5 text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 backdrop-blur-sm ${isDark ? 'bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted'
                      }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-[0.15em] mb-3 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                    Collaboration Type
                  </label>
                  <select
                    value={formData.collaborationType}
                    onChange={(e) => handleChange('collaborationType', e.target.value)}
                    className={`w-full border rounded-xl px-5 py-3.5 text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 backdrop-blur-sm ${isDark ? 'bg-gray-800/30 border-gray-700/50 text-white' : 'bg-bg-secondary border-border-theme text-text-primary'
                      }`}
                  >
                    <option value="Solo">Solo</option>
                    <option value="Team">Team</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-[0.15em] mb-3 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                    Video URL
                  </label>
                  <input
                    type="text"
                    value={formData.videoUrl}
                    onChange={(e) => handleChange('videoUrl', e.target.value)}
                    placeholder="https://youtube.com/..."
                    className={`w-full border rounded-xl px-5 py-3.5 text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 backdrop-blur-sm ${isDark ? 'bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted'
                      }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-[0.15em] mb-3 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                  Tech Stack
                </label>
                <input
                  type="text"
                  value={formData.techStack.join(', ')}
                  onChange={(e) => handleChange('techStack', e.target.value.split(',').map(t => t.trim()))}
                  placeholder="React, Node.js, MongoDB"
                  className={`w-full border rounded-xl px-5 py-3.5 text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 backdrop-blur-sm ${isDark ? 'bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted'
                    }`}
                />
              </div>
            </div>
          </div>

          {/* Visual Assets */}
          <div className={`border rounded-2xl p-8 transition-all duration-300 ${isDark ? 'bg-[#12121a] border-gray-800 shadow-xl' : 'bg-bg-card border-border-theme shadow-soft'
            }`}>
            <h2 className={`text-xl font-bold mb-8 flex items-center gap-3 tracking-wide transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              Visual Assets
            </h2>

            <div className="space-y-8">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-[0.15em] mb-3 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                  Project Thumbnail
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${isDark ? 'border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-800/20' : 'border-border-theme hover:border-accent/50 hover:bg-bg-secondary'
                    }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Upload size={32} className={`mx-auto mb-3 ${isDark ? 'text-gray-500' : 'text-text-muted'}`} />
                  <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-text-secondary'}`}>Click to upload or drag and drop</p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-[0.15em] mb-3 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                  Gallery Images
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.galleryImages.map((img, index) => (
                    <div key={index} className={`aspect-square rounded-xl border overflow-hidden relative group transition-all duration-300 ${isDark ? 'bg-gray-800/30 border-gray-700/50 hover:border-blue-500/30' : 'bg-bg-secondary border-border-theme hover:border-accent/30 shadow-sm'
                      }`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleGalleryImageUpload(index, e)}
                        className="hidden"
                        id={`gallery-${index}`}
                      />
                      <label
                        htmlFor={`gallery-${index}`}
                        className="block w-full h-full cursor-pointer"
                      >
                        {img ? (
                          <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-bg-accent'}`}>
                            <Upload size={20} className={isDark ? 'text-gray-500' : 'text-text-muted'} />
                          </div>
                        )}
                      </label>
                      {formData.galleryImages.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); removeGalleryImage(index); }}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <X size={12} className="text-white" />
                        </button>
                      )}
                    </div>
                  ))}
                  {formData.galleryImages.length < 4 && (
                    <button
                      type="button"
                      onClick={addGalleryImage}
                      className={`aspect-square rounded-lg border-2 border-dashed flex items-center justify-center transition-all ${isDark ? 'bg-gray-800/30 border-gray-700 hover:border-blue-500/50 hover:bg-gray-800/20' : 'bg-bg-secondary border-border-theme hover:border-accent/50 hover:bg-bg-accent shadow-sm'
                        }`}
                    >
                      <Plus size={20} className={isDark ? 'text-gray-500' : 'text-text-muted'} />
                    </button>
                  )}
                </div>
              </div>

              {/* Pillars */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-[0.15em] mb-3 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                  Project Pillars
                </label>
                <div className="space-y-4">
                  {formData.pillars.map((pillar, index) => (
                    <div key={index} className={`rounded-lg p-4 border transition-colors duration-300 ${
                      isDark ? 'bg-gray-800/30 border-gray-700/50' : 'bg-bg-secondary border-border-theme'
                    }`}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{pillar.icon}</span>
                        <input
                          type="text"
                          value={pillar.title}
                          onChange={(e) => {
                            const newPillars = [...formData.pillars];
                            newPillars[index].title = e.target.value;
                            setFormData(prev => ({ ...prev, pillars: newPillars }));
                          }}
                          className={`flex-1 bg-transparent font-medium focus:outline-none ${isDark ? 'text-white' : 'text-text-primary'}`}
                        />
                      </div>
                      <textarea
                        value={pillar.description}
                        onChange={(e) => {
                          const newPillars = [...formData.pillars];
                          newPillars[index].description = e.target.value;
                          setFormData(prev => ({ ...prev, pillars: newPillars }));
                        }}
                        rows={2}
                        className={`w-full border rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:border-blue-500 resize-none ${
                          isDark ? 'bg-gray-800/50 border-gray-700 text-gray-300' : 'bg-bg-primary border-border-theme text-text-secondary'
                        }`}
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      pillars: [...prev.pillars, { icon: '✨', title: 'New Pillar', description: '' }] 
                    }))}
                    className={`w-full py-3 border-2 border-dashed rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      isDark ? 'border-gray-700 text-gray-500 hover:border-blue-500/50 hover:text-blue-400' : 'border-border-theme text-text-muted hover:border-accent/50 hover:text-accent'
                    }`}
                  >
                    <Plus size={16} />
                    <span>Add Pillar</span>
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-[0.15em] mb-3 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                  Video Upload
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className={`block border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                      isDark ? 'border-gray-700 hover:border-blue-500/50' : 'border-border-theme hover:border-accent/50'
                    } ${
                      typeof img === 'string' && (img.startsWith('data:') || img.startsWith('http')) ? 'border-solid border-blue-500/50' : ''
                    }`}
                  >
                    {loading ? (
                      <div className="flex flex-col items-center py-4">
                        <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
                        <p className="text-sm text-blue-500 font-medium">Uploading video...</p>
                      </div>
                    ) : formData.videoUrl ? (
                      <div className="space-y-4">
                        <div className={`relative aspect-video rounded-lg overflow-hidden border shadow-lg ${isDark ? 'border-blue-500/20' : 'border-border-theme'}`}>
                          {formData.videoUrl.includes('youtube.com') || formData.videoUrl.includes('youtu.be') ? (
                            <iframe
                              src={formData.videoUrl.replace('watch?v=', 'embed/')}
                              className="w-full h-full"
                              title="Project Video"
                            />
                          ) : (
                            <video
                              src={formData.videoUrl}
                              className="w-full h-full object-cover"
                              controls
                            />
                          )}
                        </div>
                        <div className="flex items-center justify-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-widest">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                          Video Asset Connected
                        </div>
                        <p className={`text-[10px] italic ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>Click to replace current video</p>
                      </div>
                    ) : (
                      <div className="py-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Upload className="text-blue-500" size={24} />
                        </div>
                        <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-text-secondary'}`}>Click to upload project video</p>
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>MP4, WebM, OGG up to 50MB</p>
                      </div>
                    )}
                  </label>
                  {formData.videoUrl && !loading && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleChange('videoUrl', '');
                      }}
                      className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 border border-red-500/20 transition-all z-10"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className={`border rounded-2xl p-8 transition-all duration-300 ${isDark ? 'bg-[#12121a] border-gray-800 shadow-xl' : 'bg-bg-card border-border-theme shadow-soft'
            }`}>
            <h2 className={`text-xl font-bold mb-8 flex items-center gap-3 tracking-wide transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              External Links
            </h2>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <Globe size={20} className="text-blue-500" />
                  <span className={`sm:hidden text-xs font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Live Demo</span>
                </div>
                <input
                  type="text"
                  placeholder="Live Demo URL"
                  value={formData.liveDemo}
                  onChange={(e) => handleChange('liveDemo', e.target.value)}
                  className={`flex-1 border rounded-xl px-5 py-3.5 text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 backdrop-blur-sm ${isDark ? 'bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted'
                    }`}
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <Code size={20} className="text-blue-500" />
                  <span className={`sm:hidden text-xs font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>GitHub</span>
                </div>
                <input
                  type="text"
                  placeholder="GitHub Repository"
                  value={formData.githubLink}
                  onChange={(e) => handleChange('githubLink', e.target.value)}
                  className={`flex-1 border rounded-xl px-5 py-3.5 text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 backdrop-blur-sm ${isDark ? 'bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted'
                    }`}
                />
              </div>
            </div>
          </div>

          {/* Case Study */}
          <div className={`border rounded-2xl p-8 transition-all duration-300 ${isDark ? 'bg-[#12121a] border-gray-800 shadow-xl' : 'bg-bg-card border-border-theme shadow-soft'
            }`}>
            <h2 className={`text-xl font-bold mb-8 flex items-center gap-3 tracking-wide transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              Case Study
            </h2>

            <div className="space-y-8">
              {/* The Challenge */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Shield size={18} className="text-blue-500" />
                  <label className={`text-xs font-bold uppercase tracking-[0.15em] ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                    The Challenge
                  </label>
                </div>
                <textarea
                  value={formData.challenge}
                  onChange={(e) => handleChange('challenge', e.target.value)}
                  placeholder="What challenges did you face and how did you overcome them?"
                  rows={4}
                  className={`w-full border rounded-xl px-5 py-4 text-base transition-all focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none backdrop-blur-sm ${isDark ? 'bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted'
                    }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectEdit;
