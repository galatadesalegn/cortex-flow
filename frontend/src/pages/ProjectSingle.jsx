import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { useLocation } from "react-router-dom";
import { useProject } from "../hooks";
import { useTheme } from "../contexts/ThemeContext";
import { ArrowLeft, Play, LayoutGrid, Cpu, Zap, Info, Target, Layers, Calendar, Code, ExternalLink } from "lucide-react";
import { fixImageUrl } from "../utils/imageHelper.js";

// SVG Icons
const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
);

const TECH_LOGOS = {
  'react': 'https://cdn.simpleicons.org/react/61DAFB',
  'next.js': 'https://cdn.simpleicons.org/nextdotjs/white',
  'node.js': 'https://cdn.simpleicons.org/nodedotjs/339933',
  'express': 'https://cdn.simpleicons.org/express/white',
  'mongodb': 'https://cdn.simpleicons.org/mongodb/47A248',
  'tailwind css': 'https://cdn.simpleicons.org/tailwindcss/06B6D4',
  'rest api': 'https://cdn.simpleicons.org/json/white',
  'javascript': 'https://cdn.simpleicons.org/javascript/F7DF1E',
  'typescript': 'https://cdn.simpleicons.org/typescript/3178C6',
  'python': 'https://cdn.simpleicons.org/python/3776AB',
  'django': 'https://cdn.simpleicons.org/django/092E20',
  'firebase': 'https://cdn.simpleicons.org/firebase/FFCA28',
  'docker': 'https://cdn.simpleicons.org/docker/2496ED',
  'aws': 'https://cdn.simpleicons.org/amazonaws/232F3E',
  'github': 'https://cdn.simpleicons.org/github/white',
  'ai': 'https://cdn.simpleicons.org/openai/412991',
};

const use3DTilt = (maxRotate = 10, maxTranslate = 5) => {
  const ref = useRef(null);
  const [style, setStyle] = useState({});
  const rafRef = useRef(null);

  const onMove = useCallback((e) => {
    if (rafRef.current) return;
    
    rafRef.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) {
        rafRef.current = null;
        return;
      }
      
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const px = (x - cx) / cx;
      const py = (y - cy) / cy;
      
      setStyle({
        transform: `perspective(1000px) rotateX(${-py * maxRotate}deg) rotateY(${px * maxRotate}deg) translateZ(10px)`,
        transition: "transform 0.1s ease-out",
      });
      
      rafRef.current = null;
    });
  }, [maxRotate, maxTranslate]);

  const onLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setStyle({ 
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)", 
      transition: "transform 0.5s ease-out" 
    });
  }, []);

  return { ref, style, onMove, onLeave };
};

const TechCard = memo(({ name }) => {
  const { ref, style, onMove, onLeave } = use3DTilt(15, 5);
  const logo = TECH_LOGOS[name.toLowerCase()] || `https://cdn.simpleicons.org/${name.toLowerCase().replace('.', '').replace(' ', '')}/white`;

  return (
    <div
      ref={ref}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative px-4 py-2.5 bg-gradient-to-br from-[#0d1411] to-[#0a1a14] rounded-lg border border-emerald-500/20 hover:border-[#1de9b6]/50 transition-all duration-300 cursor-default shadow-md overflow-hidden flex items-center gap-3 min-w-[120px]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1de9b6]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-7 h-7 rounded bg-[#12221b] border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
        <img src={logo} alt={name} className="w-4 h-4 object-contain" onError={(e) => e.target.style.display = 'none'} />
      </div>
      <span className="text-[9px] font-black text-slate-400 group-hover:text-[#1de9b6] uppercase tracking-widest relative z-10 transition-colors">{name}</span>
    </div>
  );
});

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
  const hash = location.hash || window.location.hash;
  const { isDark } = useTheme();

  // Helper to get embed URL for YouTube/Vimeo
  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    if (url.includes('vimeo.com/')) {
      return url.replace('vimeo.com/', 'player.vimeo.com/video/');
    }
    return url;
  };

  const projectId = useMemo(() => {
    const searchPart = hash.includes('?') ? hash.split('?')[1] : '';
    const params = new URLSearchParams(searchPart);
    return params.get("id");
  }, [hash]);

  const { project, loading, error } = useProject(projectId);

  const projectData = useMemo(() => {
    if (!project) return null;
    return {
      title: project.title || 'Untitled Project',
      category: project.category || 'AI DEPLOYMENT ARCHITECTURE',
      description: project.description || 'A modern full-stack web application system combining e-commerce functionality, AI-powered features, and advanced UI/UX design. The project focuses on building scalable, responsive, and intelligent digital platforms where users can browse products, interact with smart recommendations, and experience smooth, modern interfaces. It integrates frontend design, backend APIs, database systems, and AI-based enhancements to create a complete production-ready application.',
      image: fixImageUrl(project.image),
      mission: project.mission || '',
      challenge: project.challenge || 'Complex System Integration Combining frontend, backend, database, and AI logic into one smooth system was difficult. Used modular architecture with separated API layers and reusable frontend components to maintain clean structure and scalability.',
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

  useEffect(() => {
    // Add Google Font import dynamically
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Yeseva+One&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] font-outfit">
        {/* Skeleton Header */}
        <div className="w-full aspect-[21/4] md:aspect-[32/5] bg-[#1a1a1a] animate-pulse" />
        <main className="w-full max-w-[1200px] mx-auto px-6 pt-10 pb-20">
          <div className="h-8 w-48 bg-[#1a1a1a] rounded animate-pulse mb-12" />
          <div className="h-16 w-3/4 bg-[#1a1a1a] rounded animate-pulse mb-24" />
          <div className="grid lg:grid-cols-2 gap-20 mb-32">
            <div className="space-y-6">
              <div className="h-4 w-full bg-[#1a1a1a] rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-[#1a1a1a] rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-[#1a1a1a] rounded animate-pulse" />
            </div>
            <div className="h-64 bg-[#1a1a1a] rounded-xl animate-pulse" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !projectData) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6">
        <h2 className="text-xl font-bold text-theme-secondary mb-4 tracking-tighter uppercase">Data Stream Interrupted</h2>
        <button onClick={() => window.location.hash = "home"} className="text-accent text-xs font-black uppercase tracking-[0.3em] hover:opacity-70 transition-opacity">Reconnect</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-outfit selection:bg-accent selection:text-white overflow-x-hidden text-slate-100">
      {/* 00. Top Thumbnail (End-to-End) */}
      <div className="w-full aspect-[21/4] md:aspect-[32/5] relative overflow-hidden bg-black shadow-[0_0_50px_rgba(29,233,182,0.15)]">
        <button
          onClick={() => window.location.hash = "home#projects"}
          className="absolute top-6 left-6 z-50 group flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-[#1de9b6] hover:border-[#1de9b6]/30 transition-all duration-300"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Projects</span>
        </button>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1de9b6]/10 via-transparent to-transparent z-10 pointer-events-none" />
        <div className="absolute -top-[20%] -left-[10%] w-[40%] h-[140%] bg-[#1de9b6]/10 blur-[120px] rounded-full z-10 pointer-events-none animate-pulse" />
        <div className="absolute -top-[20%] -right-[10%] w-[40%] h-[140%] bg-[#1de9b6]/5 blur-[120px] rounded-full z-10 pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
        <LazyImage src={projectData.image} alt={projectData.title} className="w-full h-full object-cover opacity-90 transition-opacity duration-700 hover:opacity-100" />
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] z-10 pointer-events-none" />
      </div>

      <main className="w-full max-w-[1200px] mx-auto px-6 pt-10 pb-20">
        {/* 01. Hero Section */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-px bg-slate-800" />
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-500">Case Study</span>
            <div className="w-8 h-px bg-slate-800" />
          </div>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black leading-tight tracking-tight mb-12 text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {projectData.title.split(' ').map((word, i) => (
              <span key={i} className={word.toLowerCase().includes('ai') || word.toLowerCase().includes('powered') ? 'text-[#1de9b6]' : 'text-white'}>
                {word}{' '}
              </span>
            ))}
          </h1>
        </section>

        {/* 02. Description & Challenges Grid */}
        <section className="grid lg:grid-cols-2 gap-20 mb-32">
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-[#1de9b6] rounded-sm" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">Description</h3>
            </div>
            <p className="text-base leading-relaxed text-slate-400 font-medium max-w-xl">
              {projectData.description}
            </p>
            
            <div className="pt-10">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-6">Proprietary Tech Stack</h4>
              <div className="flex flex-wrap gap-3">
                {Array.from(new Set(projectData.tech)).map((item, idx) => (
                  <TechCard key={idx} name={item} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-[#1de9b6] rounded-sm" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">Challenges</h3>
            </div>
            <div className="p-10 bg-[#1a1a1a] rounded-xl border border-white/5">
              <p className="text-slate-300 text-base leading-relaxed font-medium mb-10 italic">
                {projectData.challenge.split('\n')[0]}
              </p>
              <ul className="space-y-5">
                {(projectData.challenge.includes('\n') ? projectData.challenge.split('\n').slice(1) : ['System scalability and load balancing', 'Real-time data synchronization', 'Advanced AI model integration']).map((point, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-[#1de9b6]" />
                    <span className="text-slate-400 text-sm font-medium tracking-tight">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 03. Technical Grid - Dynamic Pillars from Admin Panel */}
        <section className="grid md:grid-cols-3 gap-6 mb-32">
          {projectData.pillars.map((pillar, idx) => (
            <div key={idx} className="bg-[#1a1a1a] p-10 space-y-8 rounded-xl border border-white/5">
              <div className="space-y-1">
                <h3 className="text-[#1de9b6] text-[11px] font-black uppercase tracking-[0.4em]">{pillar.title}</h3>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">{pillar.subtitle || 'Project Details'}</p>
              </div>
              <ul className="space-y-4">
                {(pillar.items || pillar.description?.split('\n') || [pillar.description]).map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-slate-400 text-[13px] font-medium leading-relaxed">
                    <span className="text-[#1de9b6] mt-0.5 text-xs">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* 04. Bottom Showcase */}
        <section className="grid lg:grid-cols-[1.2fr_1fr] gap-16 items-start">
          <div className="relative group space-y-4">
            <div className="aspect-video rounded-xl overflow-hidden relative z-10 bg-black shadow-2xl border border-white/5">
              {projectData.videoUrl ? (
                (() => {
                  const isVideoFile = projectData.videoUrl.includes('/uploads/') || 
                                    projectData.videoUrl.match(/\.(mp4|webm|ogg)$/i);
                  const embedUrl = getEmbedUrl(projectData.videoUrl);
                  
                  if (isVideoFile) {
                    // Direct video file upload
                    return (
                      <video
                        src={projectData.videoUrl}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                        title="Project Video"
                      >
                        Your browser does not support the video tag.
                      </video>
                    );
                  } else if (embedUrl && embedUrl !== projectData.videoUrl) {
                    // YouTube/Vimeo embed
                    return (
                      <iframe
                        src={embedUrl}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Project Video"
                      ></iframe>
                    );
                  } else {
                    // Fallback to image if video URL is invalid
                    return (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                            <div className="w-8 h-8 rounded-full bg-white/30" />
                          </div>
                        </div>
                        <LazyImage src={projectData.image} alt="" className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-1000" />
                      </>
                    );
                  }
                })()
              ) : (
                <>
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                      <div className="w-8 h-8 rounded-full bg-white/30" />
                    </div>
                  </div>
                  <LazyImage src={projectData.image} alt="" className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-1000" />
                </>
              )}
            </div>

            
            {projectData.videoUrl && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-[#1de9b6]/90 backdrop-blur-sm text-black text-[8px] font-black uppercase tracking-widest rounded z-20 shadow-xl pointer-events-none">
                Live Stream
              </div>
            )}
          </div>

          
          {/* Gallery Section - Large Images */}
          {projectData.gallery && projectData.gallery.length > 0 && (
            <div className="lg:col-span-2 mt-16 space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-0.5 bg-[#1de9b6]" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Project Gallery</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

          <div className="space-y-10">
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
        </section>
      </main>
    </div>
  );
};

export default ProjectSingle;
