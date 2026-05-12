import { useState } from 'react';
import { ArrowLeft, Save, Send, Image as ImageIcon, Link2, Tag, Globe, Code, ExternalLink, Upload, X, Eye, AlertCircle, Loader2, Layers, Plus, Bold, Italic, List, Link } from 'lucide-react';
import { projectService, uploadService } from '../services';
import { toast } from 'sonner';
import { useTheme } from '../hooks';

const ProjectCreate = ({ onBack, onSave }) => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    githubLink: '',
    liveDemo: '',
    category: '',
    duration: '',
    collaborationType: 'Solo',
    videoUrl: '',
    videoFile: null
  });
  const [techStack, setTechStack] = useState([]);
  const [newTech, setNewTech] = useState('');
  const [galleryImages, setGalleryImages] = useState([1, 2]);
  const [challenge, setChallenge] = useState('');
  const [pillars, setPillars] = useState([
    { icon: '🎯', title: 'Mission', description: 'The core purpose and goal of this project.' },
    { icon: '🛠️', title: 'Architecture', description: 'Well-structured codebase with modern patterns.' },
    { icon: '⚡', title: 'Performance', description: 'Optimized for speed and efficiency.' }
  ]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTech = () => {
    if (newTech.trim() && !techStack.includes(newTech.trim())) {
      setTechStack([...techStack, newTech.trim()]);
      setNewTech('');
    }
  };

  const removeTech = (tech) => {
    setTechStack(techStack.filter(t => t !== tech));
  };

  const addGalleryImage = () => {
    if (galleryImages.length < 4) {
      setGalleryImages([...galleryImages, galleryImages.length + 1]);
    }
  };

  const removeGalleryImage = (index) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (!validVideoTypes.includes(file.type)) {
        toast.error('Only MP4, WebM, and OGG video formats are supported');
        return;
      }
      
      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Video size should be less than 50MB');
        return;
      }
      
      try {
        setLoading(true);
        toast('Uploading video...', { icon: '⏳' });
        
        const result = await uploadService.uploadImage(file);
        if (result.success) {
          setFormData(prev => ({ ...prev, videoUrl: result.data.url }));
          toast.success('Video uploaded successfully!');
          console.log('Video uploaded:', result.data);
        } else {
          toast.error(result.error || 'Failed to upload video');
        }
      } catch (error) {
        console.error('Video upload error:', error);
        toast.error('Error uploading video. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }

    try {
      setLoading(true);
      
      // Build submission data - only include fields that have values
      const dataToSubmit = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: formData.image || null,
        githubLink: formData.githubLink?.trim() || null,
        liveDemo: formData.liveDemo?.trim() || null,
        techStack,
        challenge: challenge?.trim() || null,
        pillars: pillars.filter(p => p.title && p.description),
        galleryImages: galleryImages.filter(img => img && typeof img === 'string' && (img.startsWith('data:') || img.startsWith('http') || img.startsWith('https'))),
        category: formData.category?.trim() || 'Other',
        duration: formData.duration?.trim() || null,
        collaborationType: formData.collaborationType || 'Solo',
        videoUrl: formData.videoUrl?.trim() || null
      };
      
      const result = await projectService.create(dataToSubmit);
      
      if (result.success) {
        toast.success('Project created successfully!');
        onSave?.();
      } else {
        toast.error(result.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Project creation error:', error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create project';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0a0a0f]' : 'bg-bg-primary'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border disabled:opacity-50 ${
              isDark ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-bg-secondary text-text-secondary border-border-theme hover:bg-bg-accent'
            }`}
          >
            <ArrowLeft size={16} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div>
            <p className="text-xs text-blue-400 font-medium tracking-wider mb-1 uppercase">Project Editor</p>
            <h1 className={`text-2xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>New Project</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border ${
            isDark ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-bg-secondary text-text-secondary border-border-theme hover:bg-bg-accent'
          }`}>
            <Save size={16} />
            <span className="text-sm font-medium">Save Draft</span>
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            <span className="text-sm font-medium">{loading ? 'Publishing...' : 'Publish Changes'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Identity */}
          <div className={`border rounded-xl p-6 transition-all duration-300 ${
            isDark ? 'bg-[#12121a] border-gray-800' : 'bg-bg-card border-border-theme shadow-soft'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>
              <Globe size={18} className="text-blue-400" />
              Project Identity
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g. Quantum Flow Dashboard"
                  className={`w-full border rounded-lg px-4 py-3 text-sm transition-colors focus:outline-none focus:border-blue-500 ${
                    isDark ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe the project..."
                  rows={5}
                  className={`w-full border rounded-lg px-4 py-3 text-sm transition-colors focus:outline-none focus:border-blue-500 resize-none ${
                    isDark ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className={`border rounded-xl p-6 transition-all duration-300 ${
            isDark ? 'bg-[#12121a] border-gray-800' : 'bg-bg-card border-border-theme shadow-soft'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>
              <Globe size={18} className="text-blue-400" />
              Project Details
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 text-sm transition-colors focus:outline-none focus:border-blue-500 ${
                      isDark ? 'bg-gray-800/50 border-gray-700 text-white' : 'bg-bg-secondary border-border-theme text-text-primary'
                    }`}
                  >
                    <option value="">Select category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Apps">Mobile Apps</option>
                    <option value="AI Automation">AI Automation</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleChange('duration', e.target.value)}
                    placeholder="e.g. 3 months, 6 weeks"
                    className={`w-full border rounded-lg px-4 py-3 text-sm transition-colors focus:outline-none focus:border-blue-500 ${
                      isDark ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted'
                    }`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                    Collaboration Type
                  </label>
                  <select
                    value={formData.collaborationType}
                    onChange={(e) => handleChange('collaborationType', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 text-sm transition-colors focus:outline-none focus:border-blue-500 ${
                      isDark ? 'bg-gray-800/50 border-gray-700 text-white' : 'bg-bg-secondary border-border-theme text-text-primary'
                    }`}
                  >
                    <option value="Solo">Solo Project</option>
                    <option value="Team">Team Project</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                    Video URL
                  </label>
                  <input
                    type="text"
                    value={formData.videoUrl}
                    onChange={(e) => handleChange('videoUrl', e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className={`w-full border rounded-lg px-4 py-3 text-sm transition-colors focus:outline-none focus:border-blue-500 ${
                      isDark ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className={`border rounded-xl p-6 transition-all duration-300 ${
            isDark ? 'bg-[#12121a] border-gray-800' : 'bg-bg-card border-border-theme shadow-soft'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>
              <ExternalLink size={18} className="text-blue-400" />
              Project Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                  GitHub Repository
                </label>
                <div className="relative">
                  <Code className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input
                    type="text"
                    value={formData.githubLink}
                    onChange={(e) => handleChange('githubLink', e.target.value)}
                    placeholder="https://github.com/..."
                    className={`w-full border rounded-lg pl-10 pr-4 py-3 text-sm transition-colors focus:outline-none focus:border-blue-500 ${
                      isDark ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                  Live Demo
                </label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                  <input
                    type="text"
                    value={formData.liveDemo}
                    onChange={(e) => handleChange('liveDemo', e.target.value)}
                    placeholder="https://demo.com"
                    className={`w-full border rounded-lg pl-10 pr-4 py-3 text-sm transition-colors focus:outline-none focus:border-blue-500 ${
                      isDark ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className={`border rounded-xl p-6 transition-all duration-300 ${
            isDark ? 'bg-[#12121a] border-gray-800' : 'bg-bg-card border-border-theme shadow-soft'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>
              <Layers size={18} className="text-blue-400" />
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30"
                >
                  {tech}
                  <button
                    onClick={() => removeTech(tech)}
                    className="hover:text-blue-300"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                placeholder="Add technology..."
                className={`flex-1 border rounded-lg px-4 py-2 text-sm transition-colors focus:outline-none focus:border-blue-500 ${
                  isDark ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted'
                }`}
              />
              <button
                onClick={addTech}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Gallery Images */}
          <div className={`border rounded-xl p-6 transition-all duration-300 ${
            isDark ? 'bg-[#12121a] border-gray-800' : 'bg-bg-card border-border-theme shadow-soft'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold flex items-center gap-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>
                <ImageIcon size={18} className="text-blue-400" />
                Gallery Images
              </h2>
              {galleryImages.length < 4 && (
                <button
                  onClick={addGalleryImage}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <Plus size={14} />
                  Add Image
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((img, index) => (
                <div key={index} className="relative">
                  <input
                      type="file"
                      accept="image/*"
                      id={`gallery-${index}`}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            setLoading(true);
                            const result = await uploadService.uploadImage(file);
                            if (result.success) {
                              const newGallery = [...galleryImages];
                              newGallery[index] = result.data.url;
                              setGalleryImages(newGallery);
                              toast.success('Gallery image uploaded');
                            } else {
                              toast.error('Upload failed');
                            }
                          } catch (err) {
                            toast.error('Error uploading image');
                          } finally {
                            setLoading(false);
                          }
                        }
                      }}
                      className="hidden"
                    />
                  <label
                    htmlFor={`gallery-${index}`}
                    className={`block border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                      isDark ? 'border-gray-700 hover:border-blue-500/50' : 'border-border-theme hover:border-accent/50'
                    } ${
                      typeof img === 'string' && (img.startsWith('data:') || img.startsWith('http')) ? 'border-solid border-blue-500/50' : ''
                    }`}
                  >
                    {typeof img === 'string' && (img.startsWith('data:') || img.startsWith('http')) ? (
                      <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-24 object-cover rounded" />
                    ) : (
                      <>
                        <Upload className={`mx-auto mb-2 ${isDark ? 'text-gray-500' : 'text-text-muted'}`} size={24} />
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>Click to upload</p>
                      </>
                    )}
                  </label>
                  {galleryImages.length > 1 && (
                    <button
                      onClick={() => removeGalleryImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Case Study / Pillars */}
          <div className={`border rounded-xl p-6 transition-all duration-300 ${
            isDark ? 'bg-[#12121a] border-gray-800' : 'bg-bg-card border-border-theme shadow-soft'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>
              <Tag size={18} className="text-blue-400" />
              Case Study
            </h2>
            
            {/* Challenge Field */}
            <div className="mb-6">
              <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>
                Challenge & Solution
              </label>
              <textarea
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="Describe the challenges faced and how you solved them..."
                rows={3}
                className={`w-full border rounded-lg px-4 py-3 text-sm transition-colors focus:outline-none focus:border-blue-500 resize-none ${
                  isDark ? 'bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-500' : 'bg-bg-secondary border-border-theme text-text-primary placeholder-text-muted'
                }`}
              />
            </div>

            {/* Pillars */}
            <h3 className={`text-sm font-medium uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-text-muted'}`}>Project Pillars</h3>
            <div className="space-y-4">
              {pillars.map((pillar, index) => (
                <div key={index} className={`rounded-lg p-4 border transition-colors duration-300 ${
                  isDark ? 'bg-gray-800/30 border-gray-700/50' : 'bg-bg-secondary border-border-theme'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{pillar.icon}</span>
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => {
                        const newPillars = [...pillars];
                        newPillars[index].title = e.target.value;
                        setPillars(newPillars);
                      }}
                      className={`flex-1 bg-transparent font-medium focus:outline-none ${isDark ? 'text-white' : 'text-text-primary'}`}
                    />
                  </div>
                  <textarea
                    value={pillar.description}
                    onChange={(e) => {
                      const newPillars = [...pillars];
                      newPillars[index].description = e.target.value;
                      setPillars(newPillars);
                    }}
                    rows={2}
                    className={`w-full border rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:border-blue-500 resize-none ${
                      isDark ? 'bg-gray-800/50 border-gray-700 text-gray-300' : 'bg-bg-primary border-border-theme text-text-secondary'
                    }`}
                  />
                </div>
              ))}
              <button
                onClick={() => setPillars([...pillars, { icon: '✨', title: 'New Pillar', description: '' }])}
                className={`w-full py-3 border-2 border-dashed rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isDark ? 'border-gray-700 text-gray-500 hover:border-blue-500/50 hover:text-blue-400' : 'border-border-theme text-text-muted hover:border-accent/50 hover:text-accent'
                }`}
              >
                <Plus size={18} />
                Add Pillar
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Thumbnail Upload */}
          <div className={`border rounded-xl p-6 transition-all duration-300 ${
            isDark ? 'bg-[#12121a] border-gray-800' : 'bg-bg-card border-border-theme shadow-soft'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>
              <ImageIcon size={18} className="text-blue-400" />
              Thumbnail
            </h2>
            <div className="relative">
              <label
                htmlFor="thumbnail-upload"
                className={`block border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  isDark ? 'border-gray-700 hover:border-blue-500/50' : 'border-border-theme hover:border-accent/50'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        setLoading(true);
                        const result = await uploadService.uploadImage(file);
                        if (result.success) {
                          handleChange('image', result.data.url);
                          toast.success('Thumbnail uploaded');
                        } else {
                          toast.error('Upload failed');
                        }
                      } catch (err) {
                        toast.error('Error uploading image');
                      } finally {
                        setLoading(false);
                      }
                    }
                  }}
                  className="hidden"
                  id="thumbnail-upload"
                />
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Thumbnail preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <Upload className={`mx-auto mb-3 ${isDark ? 'text-gray-500' : 'text-text-muted'}`} size={32} />
                    <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-text-secondary'}`}>Drop image here</p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>or click to browse</p>
                  </>
                )}
              </label>
              {formData.image && (
                <button
                  onClick={() => handleChange('image', '')}
                  className="absolute top-2 right-2 p-1 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Video Upload */}
          <div className={`border rounded-xl p-6 transition-all duration-300 ${
            isDark ? 'bg-[#12121a] border-gray-800' : 'bg-bg-card border-border-theme shadow-soft'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-text-primary'}`}>
              <Upload size={18} className="text-blue-400" />
              Video Upload
            </h2>
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
                className={`block border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  isDark ? 'border-gray-700 hover:border-blue-500/50' : 'border-border-theme hover:border-accent/50'
                }`}
              >
                {loading ? (
                  <div className="flex flex-col items-center py-4">
                    <Loader2 className="animate-spin text-blue-400 mb-2" size={32} />
                    <p className="text-sm text-blue-400 font-medium">Uploading video...</p>
                  </div>
                ) : formData.videoUrl ? (
                  <div>
                    {formData.videoUrl.includes('youtube.com') || formData.videoUrl.includes('youtu.be') ? (
                      <iframe
                        src={formData.videoUrl.replace('watch?v=', 'embed/')}
                        className="w-full h-48 rounded-lg mb-2"
                        title="Project Video"
                      />
                    ) : (
                      <video
                        src={formData.videoUrl}
                        className="w-full h-48 object-cover rounded-lg mb-2"
                        controls
                      />
                    )}
                    <p className="text-sm text-green-400">Video uploaded successfully</p>
                  </div>
                ) : (
                  <>
                    <Upload className={`mx-auto mb-3 ${isDark ? 'text-gray-500' : 'text-text-muted'}`} size={32} />
                    <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-text-secondary'}`}>Drop video here</p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-text-muted'}`}>or click to browse (Max 50MB)</p>
                  </>
                )}
              </label>
              {formData.videoUrl && !loading && (
                <button
                  onClick={() => handleChange('videoUrl', '')}
                  className="absolute top-2 right-2 p-1 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-blue-400" />
              Quick Tips
            </h2>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Use a clear, concise title
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Describe key features and tech stack
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Add live demo and GitHub links
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreate;
