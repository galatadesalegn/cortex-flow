import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Save, Send, Image as ImageIcon, Link2, Tag, Calendar, Globe, Code, ExternalLink, Upload, X, Target, Shield, Layers, Plus, Loader2 } from 'lucide-react';
import { projectService } from '../services';
import { toast } from 'sonner';

const ProjectEdit = ({ project, onBack, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    image: project?.image || '',
    githubLink: project?.githubLink || '',
    liveDemo: project?.liveDemo || '',
    techStack: project?.techStack || [],
    mission: project?.mission || '',
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

  // Fetch full project data (including large images) only on edit mode
  useEffect(() => {
    const fetchFullProject = async () => {
      try {
        setLoading(true);
        const result = await projectService.getById(project._id || project.id);
        if (result.success) {
          const p = result.data;
          setFormData({
            title: p.title || '',
            description: p.description || '',
            image: p.image || '',
            githubLink: p.githubLink || '',
            liveDemo: p.liveDemo || '',
            techStack: p.techStack || [],
            mission: p.mission || '',
            challenge: p.challenge || '',
            pillars: p.pillars || [],
            galleryImages: p.galleryImages || [],
            category: p.category || 'Web App',
            featured: p.featured || false,
            duration: p.duration || '',
            collaborationType: p.collaborationType || 'Solo',
            videoUrl: p.videoUrl || '',
            videoFile: null
          });
        }
      } catch (err) {
        console.error('Failed to fetch full project data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (project?._id || project?.id) {
      fetchFullProject();
    }
  }, [project]);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      handleChange('image', event.target.result);
      toast.success('Image uploaded successfully');
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Video size should be less than 50MB');
        return;
      }
      
      try {
        setLoading(true);
        const result = await uploadService.uploadImage(file);
        if (result.success) {
          setFormData(prev => ({ ...prev, videoUrl: result.data.url }));
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
    }
  };

  const handleGalleryImageUpload = (index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const newGallery = [...formData.galleryImages];
        newGallery[index] = reader.result;
        setFormData(prev => ({ ...prev, galleryImages: newGallery }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addGalleryImage = () => {
    if (formData.galleryImages.length < 4) {
      setFormData(prev => ({ ...prev, galleryImages: [...prev.galleryImages, null] }));
    }
  };

  const removeGalleryImage = (index) => {
    const newGallery = formData.galleryImages.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, galleryImages: newGallery }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }

    try {
      setLoading(true);
      const projectId = project._id || project.id;
      const result = await projectService.update(projectId, formData);

      if (result.success) {
        toast.success('Project updated successfully!');
        onSave?.();
      } else {
        toast.error(result.error || 'Failed to update project');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Error updating project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#0a0a0f] min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6 border-t border-white/5">
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <button
            onClick={onBack}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-all border border-gray-700/50 disabled:opacity-50 backdrop-blur-sm"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            <ArrowLeft size={16} />
            <span className="text-sm font-semibold tracking-wide">Back</span>
          </button>
          <div>
            <p className="text-xs text-[#1de9b6] font-bold tracking-[0.2em] mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>PROJECT EDITOR</p>
            <h1 className="text-3xl font-black text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{formData.title || 'Edit Project'}</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1de9b6] to-[#00d4aa] text-[#0a0a0a] hover:shadow-[0_0_20px_rgba(29,233,182,0.4)] transition-all disabled:opacity-50 font-bold tracking-wide"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span className="text-sm">{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Project Identity */}
          <div className="bg-gradient-to-br from-[#12121a] to-[#0d1818] border border-[#1de9b6]/10 rounded-2xl p-8 hover:border-[#1de9b6]/20 transition-all duration-500 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <div className="w-1 h-6 bg-gradient-to-b from-[#1de9b6] to-[#00d4aa] rounded-full"></div>
              Project Identity
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Project Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g. Quantum Flow Dashboard"
                  className="w-full bg-gray-800/30 border border-gray-700/50 rounded-xl px-5 py-3.5 text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#1de9b6]/50 focus:ring-1 focus:ring-[#1de9b6]/20 transition-all backdrop-blur-sm"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe the project..."
                  rows={5}
                  className="w-full bg-gray-800/30 border border-gray-700/50 rounded-xl px-5 py-3.5 text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#1de9b6]/50 focus:ring-1 focus:ring-[#1de9b6]/20 transition-all resize-none backdrop-blur-sm"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full bg-gray-800/30 border border-gray-700/50 rounded-xl px-5 py-3.5 text-base text-white focus:outline-none focus:border-[#1de9b6]/50 focus:ring-1 focus:ring-[#1de9b6]/20 transition-all backdrop-blur-sm"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    <option value="Web App">Web App</option>
                    <option value="Mobile">Mobile</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleChange('duration', e.target.value)}
                    placeholder="e.g. 3 months"
                    className="w-full bg-gray-800/30 border border-gray-700/50 rounded-xl px-5 py-3.5 text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#1de9b6]/50 focus:ring-1 focus:ring-[#1de9b6]/20 transition-all backdrop-blur-sm"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Collaboration Type
                  </label>
                  <select
                    value={formData.collaborationType}
                    onChange={(e) => handleChange('collaborationType', e.target.value)}
                    className="w-full bg-gray-800/30 border border-gray-700/50 rounded-xl px-5 py-3.5 text-base text-white focus:outline-none focus:border-[#1de9b6]/50 focus:ring-1 focus:ring-[#1de9b6]/20 transition-all backdrop-blur-sm"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    <option value="Solo">Solo</option>
                    <option value="Team">Team</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Video URL
                  </label>
                  <input
                    type="text"
                    value={formData.videoUrl}
                    onChange={(e) => handleChange('videoUrl', e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="w-full bg-gray-800/30 border border-gray-700/50 rounded-xl px-5 py-3.5 text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#1de9b6]/50 focus:ring-1 focus:ring-[#1de9b6]/20 transition-all backdrop-blur-sm"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Tech Stack
                </label>
                <input
                  type="text"
                  value={formData.techStack.join(', ')}
                  onChange={(e) => handleChange('techStack', e.target.value.split(',').map(t => t.trim()))}
                  placeholder="React, Node.js, MongoDB"
                  className="w-full bg-gray-800/30 border border-gray-700/50 rounded-xl px-5 py-3.5 text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#1de9b6]/50 focus:ring-1 focus:ring-[#1de9b6]/20 transition-all backdrop-blur-sm"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
            </div>
          </div>

          {/* Visual Assets */}
          <div className="bg-gradient-to-br from-[#12121a] to-[#181818] border border-[#1de9b6]/10 rounded-2xl p-8 hover:border-[#1de9b6]/20 transition-all duration-500 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3 tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <div className="w-1 h-6 bg-gradient-to-b from-[#1de9b6] to-[#00d4aa] rounded-full"></div>
              Visual Assets
            </h2>

            <div className="space-y-8">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Project Thumbnail
                </label>
                <div
                  className="border-2 border-dashed border-gray-700/50 rounded-xl p-8 text-center hover:border-[#1de9b6]/50 hover:bg-gray-800/20 transition-all duration-300 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Upload size={32} className="mx-auto text-gray-500 mb-3" />
                  <p className="text-sm text-gray-400 mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Gallery Images
                </label>
                <div className="grid grid-cols-4 gap-4">
                  {formData.galleryImages.map((img, index) => (
                    <div key={index} className="aspect-square bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden relative group hover:border-[#1de9b6]/30 transition-all duration-300">
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
                          <div className="w-full h-full flex items-center justify-center hover:bg-gray-800">
                            <Upload size={20} className="text-gray-500" />
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
                      className="aspect-square bg-gray-800/30 rounded-lg border-2 border-dashed border-gray-700 flex items-center justify-center hover:border-blue-500/50 hover:bg-gray-800/20 transition-all"
                    >
                      <Plus size={20} className="text-gray-500" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
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
                    className="block border-2 border-dashed border-gray-700/50 rounded-xl p-6 text-center hover:border-[#1de9b6]/50 hover:bg-gray-800/20 transition-all duration-500 cursor-pointer relative overflow-hidden group"
                  >
                    {loading ? (
                      <div className="flex flex-col items-center py-4">
                        <Loader2 className="animate-spin text-[#1de9b6] mb-2" size={32} />
                        <p className="text-sm text-[#1de9b6] font-medium">Uploading video...</p>
                      </div>
                    ) : formData.videoUrl ? (
                      <div className="space-y-4">
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-[#1de9b6]/20 shadow-lg">
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
                        <div className="flex items-center justify-center gap-2 text-[#1de9b6] text-xs font-bold uppercase tracking-widest">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#1de9b6] animate-pulse"></div>
                          Video Asset Connected
                        </div>
                        <p className="text-[10px] text-gray-500 italic">Click to replace current video</p>
                      </div>
                    ) : (
                      <div className="py-4">
                        <div className="w-12 h-12 rounded-full bg-[#1de9b6]/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Upload className="text-[#1de9b6]" size={24} />
                        </div>
                        <p className="text-sm text-gray-300 font-semibold mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>Click to upload project video</p>
                        <p className="text-xs text-gray-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>MP4, WebM, OGG up to 50MB</p>
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
          <div className="bg-gradient-to-br from-[#12121a] to-[#181818] border border-[#1de9b6]/10 rounded-2xl p-8 hover:border-[#1de9b6]/20 transition-all duration-500 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3 tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <div className="w-1 h-6 bg-gradient-to-b from-[#1de9b6] to-[#00d4aa] rounded-full"></div>
              External Links
            </h2>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Globe size={20} className="text-[#1de9b6]" />
                <input
                  type="text"
                  placeholder="Live Demo URL"
                  value={formData.liveDemo}
                  onChange={(e) => handleChange('liveDemo', e.target.value)}
                  className="flex-1 bg-gray-800/30 border border-gray-700/50 rounded-xl px-5 py-3.5 text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#1de9b6]/50 focus:ring-1 focus:ring-[#1de9b6]/20 transition-all backdrop-blur-sm"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
              <div className="flex items-center gap-4">
                <Code size={20} className="text-[#1de9b6]" />
                <input
                  type="text"
                  placeholder="GitHub Repository"
                  value={formData.githubLink}
                  onChange={(e) => handleChange('githubLink', e.target.value)}
                  className="flex-1 bg-gray-800/30 border border-gray-700/50 rounded-xl px-5 py-3.5 text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#1de9b6]/50 focus:ring-1 focus:ring-[#1de9b6]/20 transition-all backdrop-blur-sm"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                />
              </div>
            </div>
          </div>

          {/* Case Study */}
          <div className="bg-gradient-to-br from-[#12121a] to-[#181818] border border-[#1de9b6]/10 rounded-2xl p-8 hover:border-[#1de9b6]/20 transition-all duration-500 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3 tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <div className="w-1 h-6 bg-gradient-to-b from-[#1de9b6] to-[#00d4aa] rounded-full"></div>
              Case Study
            </h2>

            <div className="space-y-8">
              {/* The Mission */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Target size={18} className="text-[#1de9b6]" />
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    The Mission
                  </label>
                </div>
                <textarea
                  value={formData.mission}
                  onChange={(e) => handleChange('mission', e.target.value)}
                  placeholder="What was the primary goal or objective of this project? Describe the problem you set out to solve..."
                  rows={4}
                  className="w-full bg-gray-800/30 border border-gray-700/50 rounded-xl px-5 py-4 text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#1de9b6]/50 focus:ring-1 focus:ring-[#1de9b6]/20 transition-all resize-none backdrop-blur-sm"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                />
              </div>

              {/* The Challenge */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Shield size={18} className="text-[#1de9b6]" />
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    The Challenge
                  </label>
                </div>
                <textarea
                  value={formData.challenge}
                  onChange={(e) => handleChange('challenge', e.target.value)}
                  placeholder="What challenges did you face and how did you overcome them?"
                  rows={4}
                  className="w-full bg-gray-800/30 border border-gray-700/50 rounded-xl px-5 py-4 text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#1de9b6]/50 focus:ring-1 focus:ring-[#1de9b6]/20 transition-all resize-none backdrop-blur-sm"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
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
