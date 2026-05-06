import { useState } from 'react';
import { ArrowLeft, Save, Send, Image as ImageIcon, Link2, Tag, Globe, Code, ExternalLink, Upload, X, Eye, AlertCircle, Loader2, Layers, Plus, Bold, Italic, List, Link } from 'lucide-react';
import { projectService } from '../services';
import { toast } from 'sonner';

const ProjectCreate = ({ onBack, onSave }) => {
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
  const [mission, setMission] = useState('');
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
        mission: mission?.trim() || null,
        challenge: challenge?.trim() || null,
        pillars: pillars.filter(p => p.title && p.description),
        galleryImages: galleryImages.filter(img => img && typeof img === 'string' && img.startsWith('data:')),
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
    <div className="p-6 bg-[#0a0a0f] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all border border-gray-700 disabled:opacity-50"
          >
            <ArrowLeft size={16} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div>
            <p className="text-xs text-blue-400 font-medium tracking-wider mb-1">PROJECT EDITOR</p>
            <h1 className="text-2xl font-bold text-white">New Project</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all border border-gray-700">
            <Save size={16} />
            <span className="text-sm font-medium">Save Draft</span>
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-50"
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
          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Globe size={18} className="text-blue-400" />
              Project Identity
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g. Quantum Flow Dashboard"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe the project..."
                  rows={5}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Globe size={18} className="text-blue-400" />
              Project Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
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
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  placeholder="e.g. 3 months, 6 weeks"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Collaboration Type
                </label>
                <select
                  value={formData.collaborationType}
                  onChange={(e) => handleChange('collaborationType', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="Solo">Solo Project</option>
                  <option value="Team">Team Project</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Video URL
                </label>
                <input
                  type="text"
                  value={formData.videoUrl}
                  onChange={(e) => handleChange('videoUrl', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ExternalLink size={18} className="text-blue-400" />
              Project Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  GitHub Repository
                </label>
                <div className="relative">
                  <Code className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    value={formData.githubLink}
                    onChange={(e) => handleChange('githubLink', e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Live Demo
                </label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    value={formData.liveDemo}
                    onChange={(e) => handleChange('liveDemo', e.target.value)}
                    placeholder="https://demo.com"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
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
                className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={addTech}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Gallery Images */}
          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
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
            <div className="grid grid-cols-2 gap-4">
              {galleryImages.map((img, index) => (
                <div key={index} className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    id={`gallery-${index}`}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const newGallery = [...galleryImages];
                          newGallery[index] = reader.result;
                          setGalleryImages(newGallery);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor={`gallery-${index}`}
                    className={`block border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-blue-500/50 transition-colors cursor-pointer ${
                      typeof img === 'string' && img.startsWith('data:') ? 'border-solid border-blue-500/50' : ''
                    }`}
                  >
                    {typeof img === 'string' && img.startsWith('data:') ? (
                      <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-24 object-cover rounded" />
                    ) : (
                      <>
                        <Upload className="mx-auto text-gray-500 mb-2" size={24} />
                        <p className="text-xs text-gray-500">Click to upload</p>
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
          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Tag size={18} className="text-blue-400" />
              Case Study
            </h2>
            
            {/* Mission Field */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                Mission Statement
              </label>
              <textarea
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                placeholder="Describe the mission and core purpose of this project..."
                rows={3}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            {/* Challenge Field */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                Challenge & Solution
              </label>
              <textarea
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="Describe the challenges faced and how you solved them..."
                rows={3}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            {/* Pillars */}
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Project Pillars</h3>
            <div className="space-y-4">
              {pillars.map((pillar, index) => (
                <div key={index} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
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
                      className="flex-1 bg-transparent text-white font-medium focus:outline-none"
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
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              ))}
              <button
                onClick={() => setPillars([...pillars, { icon: '✨', title: 'New Pillar', description: '' }])}
                className="w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-500 hover:border-blue-500/50 hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
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
          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ImageIcon size={18} className="text-blue-400" />
              Thumbnail
            </h2>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      handleChange('image', reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
                id="thumbnail-upload"
              />
              <label
                htmlFor="thumbnail-upload"
                className="block border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer"
              >
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Thumbnail preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <Upload className="mx-auto text-gray-500 mb-3" size={32} />
                    <p className="text-sm text-gray-400 mb-2">Drop image here</p>
                    <p className="text-xs text-gray-500">or click to browse</p>
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
          <div className="bg-[#12121a] border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
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
                className="block border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer"
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
                    <Upload className="mx-auto text-gray-500 mb-3" size={32} />
                    <p className="text-sm text-gray-400 mb-2">Drop video here</p>
                    <p className="text-xs text-gray-500">or click to browse (Max 50MB)</p>
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
