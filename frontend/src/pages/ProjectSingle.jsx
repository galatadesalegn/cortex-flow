import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { useLocation } from "react-router-dom";
import { useProject } from "../hooks";
import { useTheme } from "../contexts/ThemeContext";
import { ArrowLeft, Play, LayoutGrid, Cpu, Zap, Info, Target, Layers, Calendar, Code, ExternalLink } from "lucide-react";
import { fixImageUrl } from "../utils/imageHelper.js";

const LazyImage = memo(({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-bg-secondary ${className}`}>
        <div className="w-12 h-12 rounded-full border border-border-theme flex items-center justify-center">
          <Info size={24} className="text-theme-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className} ${!isLoaded ? 'animate-pulse bg-bg-secondary' : ''}`}>
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
      />
    </div>
  );
});

const ProjectSingle = () => {
  const location = useLocation();
  const { isDark } = useTheme();
  
  const getProjectId = useCallback(() => {
    const hash = location.hash;
    const params = new URLSearchParams(hash.slice(1));
    return params.get("id");
  }, [location]);

  const projectId = getProjectId();
  const { project, loading, error } = useProject(projectId);

  const projectData = useMemo(() => {
    if (!project) return null;
    return {
      title: project.title || 'Untitled Project',
      category: project.category || 'AI DEPLOYMENT ARCHITECTURE',
      description: project.description || '...',
      image: fixImageUrl(project.image),
      mission: project.mission || '',
      challenge: project.challenge || '',
      tech: project.techStack || [],
      pillars: project.pillars || [],
      gallery: (project.galleryImages || []).map(img => fixImageUrl(img)),
      videoUrl: project.videoUrl || null,
      duration: project.duration || null,
      collaborationType: project.collaborationType || null,
      liveUrl: project.liveDemo || null,
      githubUrl: project.githubLink || null,
    };
  }, [project]);

  const handleBack = useCallback(() => {
    window.history.back();
  }, []);

  const handleScroll = useCallback((e) => {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'mission', label: 'Mission', icon: Target },
    { id: 'challenge', label: 'Challenge', icon: Zap },
    { id: 'tech', label: 'Tech Stack', icon: Cpu },
    { id: 'pillars', label: 'Pillars', icon: Layers },
    { id: 'gallery', label: 'Gallery', icon: Code },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sections = ['overview', 'mission', 'challenge', 'tech', 'pillars', 'gallery'];
      
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isInView = rect.top <= scrollY + 100 && rect.bottom >= scrollY - 100;
          
          if (isInView && activeSection === sectionId) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0d1411] to-[#0a1a14] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`p-2 rounded-lg transition-all ${
                      activeSection === item.id
                        ? 'bg-[#1de9b6] text-black'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    <item.icon size={16} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0d1411] to-[#0a1a14] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
          <p className="text-white/80 mb-8">The requested project could not be found.</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-[#1de9b6] text-black rounded-lg hover:bg-[#1de9b6]/90 transition-all"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0d1411] to-[#0a1a14] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Video */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-8">
              <div className="relative overflow-hidden rounded-xl border border-white/10">
                <div className="aspect-video relative overflow-hidden">
                  {projectData.videoUrl ? (
                    <>
                      {projectData.videoUrl.includes('youtube.com') || projectData.videoUrl.includes('youtu.be') ? (
                        <iframe
                          src={projectData.videoUrl}
                          title="Project Video"
                          className="w-full h-full rounded-xl"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={projectData.videoUrl}
                          controls
                          className="w-full h-full rounded-xl"
                          poster={projectData.image}
                        />
                      )}
                    </>
                  ) : (
                    <LazyImage src={projectData.image} alt={projectData.title} className="w-full h-full" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white/80 rounded-full" />
                      <div className="w-2 h-2 bg-white/60 rounded-full" />
                      <div className="w-2 h-2 bg-white/40 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white/80 rounded-full" />
                      <div className="w-2 h-2 bg-white/60 rounded-full" />
                      <div className="w-2 h-2 bg-white/40 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {projectData.videoUrl && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-[#1de9b6]/90 backdrop-blur-sm text-black text-[8px] font-black uppercase tracking-widest rounded z-20 shadow-xl pointer-events-none">
                Live Stream
              </div>
            )}
          </div>

          {/* Gallery Section - One Line Wide */}
          {projectData.gallery && projectData.gallery.length > 0 && (
            <div className="lg:col-span-3 mt-16 space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-0.5 bg-[#1de9b6]" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Project Gallery</h3>
              </div>
              <div className="flex gap-6 overflow-hidden">
                {projectData.gallery.map((img, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-xl border border-white/10 hover:border-[#1de9b6]/30 transition-all duration-500">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={img} 
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                        crossOrigin="anonymous"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 bg-[#1de9b6]/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <span className="text-black text-xs font-bold">+</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white/80 rounded-full" />
                        <div className="w-2 h-2 bg-white/60 rounded-full" />
                        <div className="w-2 h-2 bg-white/40 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Details */}
          <div className="lg:col-span-3 space-y-10">
            <div className="space-y-4">
              <h4 className="text-[#1de9b6] text-[10px] font-bold uppercase tracking-[0.4em]">Featured Project</h4>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {projectData.title}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="p-6 bg-gradient-to-br from-[#0d1411] to-[#0a1a14] rounded-xl border border-emerald-500/10 hover:border-[#1de9b6]/30 transition-all group">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2 group-hover:text-[#1de9b6]/50 transition-colors">Project Type</p>
                <p className="text-sm font-black text-slate-200 uppercase tracking-tight">{projectData.category}</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-[#0d1411] to-[#0a1a14] rounded-xl border border-emerald-500/10 hover:border-[#1de9b6]/30 transition-all group">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2 group-hover:text-[#1de9b6]/50 transition-colors">Role</p>
                <p className="text-sm font-black text-slate-200 uppercase tracking-tight">{projectData.collaborationType || 'Solo'}</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-[#0d1411] to-[#0a1a14] rounded-xl border border-emerald-500/10 hover:border-[#1de9b6]/30 transition-all group">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2 group-hover:text-[#1de9b6]/50 transition-colors">Duration</p>
                <p className="text-sm font-black text-slate-200 uppercase tracking-tight">{projectData.duration || '2 Weeks'}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a 
                href={projectData.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-6 py-2.5 bg-[#1de9b6] text-[#0a0a0a] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_20px_rgba(29,233,182,0.15)] flex items-center gap-2"
              >
                <span>Live Demo</span>
                <ExternalLink size={14} strokeWidth={3} />
              </a>
              
              <a 
                href={projectData.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-6 py-2.5 bg-transparent text-white border border-white/20 rounded-full text-[10px] font-bold hover:bg-white hover:text-[#0a0a0a] hover:border-white transition-all flex items-center gap-2 group"
              >
                <div className="group-hover:scale-110 transition-transform">
                  <GithubIcon />
                </div>
                <span>Github Repository</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProjectSingle;
