import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { useProject } from "../../hooks";
import Button from "../common/Button";
import { useTheme } from "../../contexts/ThemeContext";

// ============================================
// PERFORMANCE OPTIMIZED PROJECT SINGLE
// ============================================

const TiltCard = memo(({ children, className, intensity = 8 }) => {
  const ref = useRef(null);
  const rafRef = useRef(null);
  const lastMoveRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
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
      
      if (Math.abs(x - lastMoveRef.current.x) < 2 && Math.abs(y - lastMoveRef.current.y) < 2) {
        rafRef.current = null;
        return;
      }
      
      lastMoveRef.current = { x, y };
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const px = (x - cx) / cx;
      const py = (y - cy) / cy;
      
      el.style.transform = `perspective(1000px) rotateX(${-py * intensity}deg) rotateY(${px * intensity}deg) scale(1.02)`;
      el.style.transition = 'transform 0.1s ease-out';
      rafRef.current = null;
    });
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    el.style.transition = 'transform 0.5s cubic-bezier(.2,.8,.2,1)';
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={ref} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave} 
      className={className}
    >
      {children}
    </div>
  );
});

TiltCard.displayName = 'TiltCard';

const ExternalLinkIcon = memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
));

const GithubIcon = memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
));

ExternalLinkIcon.displayName = 'ExternalLinkIcon';
GithubIcon.displayName = 'GithubIcon';

const LazyImage = memo(({ src, alt, className, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className={`absolute inset-0 animate-pulse flex items-center justify-center ${isDark ? 'bg-[#1de9b6]/5' : 'bg-gray-100'}`}>
          <div className="w-8 h-8 border-2 border-[#1de9b6]/20 border-t-[#1de9b6] rounded-full animate-spin" />
        </div>
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          className={`w-full h-full object-cover transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
        />
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

const ProjectSkeleton = memo(() => {
  const { isDark } = useTheme();
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
      <div className={`w-full max-w-5xl aspect-video rounded-3xl animate-pulse mb-8 relative overflow-hidden border ${isDark ? 'bg-[#1de9b6]/5 border-[#1de9b6]/10' : 'bg-gray-100 border-gray-200'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1de9b6]/5 to-transparent animate-shimmer" />
      </div>
      <div className="w-full max-w-5xl space-y-6">
        <div className={`h-12 w-2/3 rounded-xl animate-pulse ${isDark ? 'bg-[#1de9b6]/10' : 'bg-gray-200'}`} />
        <div className="grid md:grid-cols-3 gap-4">
          <div className={`h-24 rounded-xl animate-pulse ${isDark ? 'bg-[#1de9b6]/5' : 'bg-gray-100'}`} />
          <div className={`h-24 rounded-xl animate-pulse ${isDark ? 'bg-[#1de9b6]/5' : 'bg-gray-100'}`} />
          <div className={`h-24 rounded-xl animate-pulse ${isDark ? 'bg-[#1de9b6]/5' : 'bg-gray-100'}`} />
        </div>
      </div>
      <div className="mt-12 text-[#1de9b6] font-black tracking-[0.3em] animate-pulse text-xs uppercase">Initializing Neural Case Study...</div>
    </div>
  );
});

ProjectSkeleton.displayName = 'ProjectSkeleton';

const ProjectError = memo(() => {
  const { isDark } = useTheme();
  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
      <div className={`text-center max-w-md p-8 rounded-3xl border shadow-2xl transition-colors duration-500 ${isDark ? 'bg-[#101c18] border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]' : 'bg-white border-red-100 shadow-[0_0_50px_rgba(239,68,68,0.05)]'}`}>
        <div className="text-5xl mb-6">🛰️</div>
        <h2 className={`text-2xl font-black mb-2 uppercase tracking-tighter transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Orbitron', sans-serif" }}>Signal Lost</h2>
        <p className={`mb-8 font-medium transition-colors duration-500 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>The requested data packet could not be retrieved from the main-frame.</p>
        <button 
          onClick={() => window.location.hash = "home#projects"}
          className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-bold transition-all uppercase tracking-widest text-xs"
        >
          Return to Base
        </button>
      </div>
    </div>
  );
});

ProjectError.displayName = 'ProjectError';

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
  'redux': 'https://cdn.simpleicons.org/redux/764ABC',
  'firebase': 'https://cdn.simpleicons.org/firebase/FFCA28',
  'aws': 'https://cdn.simpleicons.org/amazonaws/232F3E',
  'docker': 'https://cdn.simpleicons.org/docker/2496ED',
};

const InfoCard = memo(({ label, value, isTitle = false }) => {
  const { isDark } = useTheme();
  return (
    <div className={`relative group/info overflow-hidden rounded-xl border transition-all duration-500 hover:border-[#1de9b6]/40 hover:bg-[#1de9b6]/5 hover:-translate-y-1 ${isTitle ? 'p-10' : 'p-8'} ${isDark ? 'border-white/5 bg-[#101c18]/30' : 'border-gray-100 bg-gray-50'}`}>
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#1de9b6]/30 to-transparent translate-x-[-100%] group-hover/info:translate-x-[100%] transition-transform duration-1000" />
      <div className="relative z-10 flex flex-col gap-4">
        <span className="text-[#1de9b6] font-black uppercase tracking-[0.5em] opacity-100 group-hover/info:scale-105 transition-transform origin-left text-sm md:text-base" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          {label}
        </span>
        <span className={`font-bold tracking-tight transition-colors uppercase text-lg md:text-xl ${isDark ? 'text-white group-hover/info:text-white' : 'text-gray-900 group-hover/info:text-gray-900'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {value}
        </span>
      </div>
    </div>
  );
});

InfoCard.displayName = 'InfoCard';

const ProjectSingle = () => {
  const hash = window.location.hash;
  const params = useMemo(() => new URLSearchParams(hash.split("?")[1] || ""), [hash]);
  const projectId = params.get("id");
  const { isDark } = useTheme();

  const { project, loading, error } = useProject(projectId);

  const projectData = useMemo(() => {
    if (!project) return null;
    return {
      id: project._id,
      title: project.title,
      description: project.description,
      tech: project.techStack || [],
      image: project.image,
      liveUrl: project.liveDemo || '#',
      githubUrl: project.githubLink || '#',
      category: project.category || 'Luxury E-Commerce',
      featured: project.featured || false,
      galleryImages: project.galleryImages || [],
      mission: project.mission || null,
      challenge: project.challenge || null,
      pillars: project.pillars || [],
      duration: project.duration || null,
      collaborationType: project.collaborationType || 'Solo',
      client: project.client || 'Aether Collective',
      videoUrl: project.videoUrl || null,
    };
  }, [project]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [projectId]);

  if (loading) {
    return <ProjectSkeleton />;
  }

  if (error || !projectData) {
    return <ProjectError />;
  }

  const mission = projectData.mission || "To build a smart, scalable, and visually modern e-commerce platform that enhances user experience through clean UI design and AI-powered features such as intelligent recommendations, automation, and personalized interactions.";
  const challenge = projectData.challenge || "Complex System Integration Combining frontend, backend, database, and AI logic into one smooth system was difficult. Used modular architecture with separated API layers and reusable frontend components to maintain clean structure and scalability.";

  return (
    <section className={`min-h-screen transition-colors duration-500 overflow-x-hidden font-outfit selection:bg-[#1de9b6] selection:text-black ${isDark ? 'bg-[#0a0a0a] text-gray-200' : 'bg-white text-gray-800'}`}>
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className={`absolute top-[-10%] -left-[10%] w-[40%] h-[40%] rounded-full transition-colors duration-500 ${isDark ? 'bg-[#1de9b6]/20' : 'bg-[#1de9b6]/10'}`} />
        <div className={`absolute bottom-[-10%] -right-[10%] w-[40%] h-[40%] rounded-full transition-colors duration-500 ${isDark ? 'bg-blue-500/10' : 'bg-blue-500/5'}`} />
      </div>

      <button
        onClick={() => window.location.hash = "home#projects"}
        className={`fixed top-8 left-8 z-50 flex items-center gap-3 px-6 py-3 backdrop-blur-xl border rounded-2xl transition-all group shadow-2xl overflow-hidden ${isDark ? 'bg-[#0a0a0a]/60 border-[#1de9b6]/20 text-gray-400 hover:text-[#1de9b6] hover:border-[#1de9b6]/60' : 'bg-white/80 border-gray-200 text-gray-600 hover:text-[#1de9b6] hover:border-[#1de9b6]/40'}`}
      >
        <div className="absolute inset-0 bg-[#1de9b6]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        <span className="relative z-10 transform group-hover:-translate-x-1 transition-transform font-bold">←</span>
        <span className="relative z-10 text-xs font-black uppercase tracking-widest">Back to Matrix</span>
      </button>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-40 pb-12">
        <div className="grid lg:grid-cols-12 gap-10 items-start mb-16">
          <div className="lg:col-span-7">
            <span className="text-[9px] text-[#1de9b6] font-black uppercase tracking-[0.4em] mb-5 block">
              PROJECT OF — Web App
            </span>
            <h1 className={`text-2xl md:text-3xl lg:text-4xl font-black leading-tight tracking-tighter uppercase mb-6 transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Full-Stack AI-Powered E-commerce Web Applications.
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pl-10">
            <div className={`relative p-8 rounded-2xl border shadow-[0_0_40px_rgba(29,233,182,0.05)] group/mission overflow-hidden transition-all duration-500 ${isDark ? 'bg-gradient-to-br from-[#101c18] to-transparent border-[#1de9b6]/20' : 'bg-gradient-to-br from-gray-50 to-white border-gray-100 shadow-xl'}`}>
              {/* Animated Accent */}
              <div className="absolute top-0 left-0 w-[2px] h-full bg-[#1de9b6] group-hover:h-0 transition-all duration-700" />
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#1de9b6] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[9px] text-[#1de9b6] font-black uppercase tracking-[0.4em] opacity-80" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    Neural Study Assistant
                  </span>
                  <div className={`h-[1px] flex-1 transition-colors duration-500 ${isDark ? 'bg-[#1de9b6]/20' : 'bg-gray-200'}`} />
                </div>
                <p className={`text-sm md:text-base leading-relaxed font-medium italic tracking-tight transition-colors duration-500 ${isDark ? 'text-gray-200' : 'text-gray-700'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  "{mission}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image and Project Info Section */}
        <div className="grid lg:grid-cols-12 gap-8 mb-20 items-stretch">
          {/* Project Info Card - Now on the Left */}
          <div className="lg:col-span-3 order-1">
            <div className={`relative group/info overflow-hidden rounded-xl border p-8 h-full flex flex-col justify-between transition-all duration-500 hover:border-[#1de9b6]/40 hover:bg-[#1de9b6]/5 hover:-translate-y-1 ${isDark ? 'bg-[#101c18]/30 border-white/5' : 'bg-gray-50 border-gray-100 shadow-sm'}`}>
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#1de9b6]/30 to-transparent translate-x-[-100%] group-hover/info:translate-x-[100%] transition-transform duration-1000" />
              
              <div className="space-y-6">
                  {/* Project Status with Standout Internal Frame */}
                  <div className={`relative group/status p-[1px] rounded-xl transition-all duration-500 ${isDark ? 'bg-white/5 hover:bg-[#1de9b6]/30' : 'bg-gray-200 hover:bg-[#1de9b6]/20'}`}>
                    <div className={`backdrop-blur-xl rounded-lg p-6 border transition-all duration-500 overflow-hidden relative ${isDark ? 'bg-[#0a0a0a]/80 border-white/10 group-hover/status:border-[#1de9b6]/50' : 'bg-white/90 border-gray-100 group-hover/status:border-[#1de9b6]/30'}`}>
                      {/* Technical Corner Accents */}
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#1de9b6]/0 group-hover/status:border-[#1de9b6]/60 transition-all duration-500" />
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#1de9b6]/0 group-hover/status:border-[#1de9b6]/60 transition-all duration-500" />
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#1de9b6]/0 group-hover/status:border-[#1de9b6]/60 transition-all duration-500" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#1de9b6]/0 group-hover/status:border-[#1de9b6]/60 transition-all duration-500" />

                      {/* Standout Internal Scanning Light */}
                      <div className="absolute inset-0 opacity-0 group-hover/status:opacity-100 transition-opacity duration-500">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#1de9b6] to-transparent -translate-x-full animate-[scan_2s_linear_infinite]" />
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#1de9b6]/30 to-transparent translate-x-full animate-[scan_2s_linear_infinite_reverse]" />
                      </div>
                      
                      <span className="text-[10px] text-[#1de9b6] font-black uppercase tracking-[0.5em] opacity-70 group-hover/status:opacity-100 transition-opacity block mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        Project Status
                      </span>
                      <h3 className={`font-light text-lg md:text-xl tracking-[0.2em] italic lowercase transition-colors duration-500 ${isDark ? 'text-white group-hover/status:text-[#1de9b6]' : 'text-gray-900 group-hover/status:text-[#1de9b6]'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {projectData.collaborationType}
                      </h3>
                    </div>
                  </div>

                  {/* Development Cycle with Standout Internal Frame */}
                  <div className={`relative group/cycle p-[1px] rounded-xl transition-all duration-500 ${isDark ? 'bg-white/5 hover:bg-[#1de9b6]/30' : 'bg-gray-200 hover:bg-[#1de9b6]/20'}`}>
                    <div className={`backdrop-blur-xl rounded-lg p-6 border transition-all duration-500 overflow-hidden relative ${isDark ? 'bg-[#0a0a0a]/80 border-white/10 group-hover/cycle:border-[#1de9b6]/50' : 'bg-white/90 border-gray-100 group-hover/cycle:border-[#1de9b6]/30'}`}>
                      {/* Technical Corner Accents */}
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#1de9b6]/0 group-hover/cycle:border-[#1de9b6]/60 transition-all duration-500" />
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#1de9b6]/0 group-hover/cycle:border-[#1de9b6]/60 transition-all duration-500" />
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#1de9b6]/0 group-hover/cycle:border-[#1de9b6]/60 transition-all duration-500" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#1de9b6]/0 group-hover/cycle:border-[#1de9b6]/60 transition-all duration-500" />

                      {/* Standout Internal Scanning Light */}
                      <div className="absolute inset-0 opacity-0 group-hover/cycle:opacity-100 transition-opacity duration-500">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#1de9b6] to-transparent -translate-x-full animate-[scan_2s_linear_infinite]" />
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#1de9b6]/30 to-transparent translate-x-full animate-[scan_2s_linear_infinite_reverse]" />
                      </div>
                      
                      <span className="text-[10px] text-[#1de9b6] font-black uppercase tracking-[0.5em] opacity-70 group-hover/cycle:opacity-100 transition-opacity block mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        Development Cycle
                      </span>
                      <h3 className={`font-light text-lg md:text-xl tracking-[0.2em] italic lowercase transition-colors duration-500 ${isDark ? 'text-white group-hover/cycle:text-[#1de9b6]' : 'text-gray-900 group-hover/cycle:text-[#1de9b6]'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {projectData.duration || '2 Weeks'}
                      </h3>
                    </div>
                  </div>
                </div>

               <div className="pt-8 border-t border-white/5 opacity-0">
                 <span className="text-[7px] text-gray-700 font-black uppercase tracking-[0.5em]">System Archive 001-A</span>
               </div>
            </div>
          </div>

          {/* Main Hero Image - Moved Right */}
          <div className="lg:col-span-9 group relative order-2">
            <div className={`w-full aspect-[16/7] rounded-sm overflow-hidden border relative transition-colors duration-500 ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
              <div className="absolute inset-0 bg-[#1de9b6]/5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <LazyImage 
                src={projectData.image} 
                alt={projectData.title} 
                className="w-full h-full transition-all duration-1000 scale-102 group-hover:scale-100" 
              />
            </div>
          </div>
        </div>

        {/* Meta Info Bar - The "Monolith" Frame (Tech Only) */}
        <div className={`p-1 rounded-2xl mb-24 shadow-2xl transition-all duration-500 ${isDark ? 'bg-gradient-to-r from-white/5 via-white/10 to-white/5' : 'bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100'}`}>
          <div className={`p-4 rounded-xl border transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100'}`}>
            <div className={`relative group/info overflow-hidden rounded-xl border p-10 h-full transition-all duration-500 hover:border-[#1de9b6]/40 hover:bg-[#1de9b6]/5 ${isDark ? 'bg-[#101c18]/30 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#1de9b6]/30 to-transparent translate-x-[-100%] group-hover/info:translate-x-[100%] transition-transform duration-1000" />
              <span className="text-sm md:text-base text-[#1de9b6] font-black uppercase tracking-[0.5em] opacity-100 block mb-8" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                Tech Integration
              </span>
              <div className="flex flex-wrap gap-4">
                {projectData.tech.map((item, idx) => {
                  const logoUrl = TECH_LOGOS[item.toLowerCase()];
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-center gap-3 px-5 py-3 rounded-xl border text-xs font-medium tracking-widest uppercase hover:border-[#1de9b6] hover:text-[#1de9b6] hover:scale-110 transition-all duration-300 cursor-default shadow-[0_10px_30px_rgba(0,0,0,0.4)] group/tag ${isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-700'}`}
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {logoUrl && (
                        <img 
                          src={logoUrl} 
                          alt={item} 
                          className={`w-4 h-4 object-contain transition-all ${isDark ? 'filter group-hover/tag:brightness-110' : 'filter grayscale group-hover/tag:grayscale-0'}`} 
                        />
                      )}
                      <span>{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Section */}
        <div className="grid lg:grid-cols-12 gap-12 mb-36">
          <div className="lg:col-span-4">
            <h2 className={`text-3xl font-black italic tracking-tighter transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Orbitron', sans-serif" }}>The Challenge</h2>
          </div>
          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-6">
              <h3 className={`text-2xl md:text-3xl font-black tracking-tight leading-[1.1] uppercase transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Orbitron', sans-serif" }}>
                Fragmentation between <span className="text-[#1de9b6]">physical excellence</span> and digital noise.
              </h3>
              <p className={`text-base md:text-lg leading-relaxed font-medium tracking-tight transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {challenge}
              </p>
            </div>
            
            {projectData.galleryImages[0] && (
              <div className="space-y-3">
                <div className={`w-full aspect-video overflow-hidden rounded-sm transition-all duration-700 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <LazyImage src={projectData.galleryImages[0]} alt="Process" className="w-full h-full object-cover" />
                </div>
                <span className={`text-[7px] uppercase tracking-[0.4em] transition-colors duration-500 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Fig 0.1 — Mapping digital friction against brand parameters</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Architecture Section (Black Section) */}
      <div className={`w-full py-24 border-y transition-colors duration-500 ${isDark ? 'bg-black border-white/5' : 'bg-gray-50 border-gray-100'}`}>
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-16">
            <h2 className={`text-4xl md:text-5xl font-black tracking-tighter italic transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Orbitron', sans-serif" }}>Architecture</h2>
            <span className={`text-[9px] font-black uppercase tracking-[0.4em] transition-colors duration-500 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Grid / Hierarchy</span>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 01 / Mission */}
            <div className="space-y-8 group">
              <div className={`aspect-square border overflow-hidden rounded-sm transition-all duration-700 relative ${isDark ? 'bg-[#0c0f0e] border-white/5' : 'bg-white border-gray-200'}`}>
                <LazyImage src={projectData.galleryImages[1] || projectData.image} alt="Mission" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#1de9b6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="space-y-4">
                <h4 className="text-[#1de9b6] font-black text-sm uppercase tracking-[0.4em]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  01 / Mission
                </h4>
                <p className={`text-sm md:text-base leading-relaxed font-medium tracking-tight transition-colors duration-500 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  To deliver a next-generation e-commerce experience powered by AI, clean design, and seamless performance.
                </p>
              </div>
            </div>

            {/* 02 / Architecture */}
            <div className="space-y-8 group">
              <div className={`aspect-square border overflow-hidden rounded-sm transition-all duration-700 relative ${isDark ? 'bg-[#0c0f0e] border-white/5' : 'bg-white border-gray-200'}`}>
                <LazyImage src={projectData.galleryImages[2] || projectData.image} alt="Architecture" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#1de9b6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="space-y-4">
                <h4 className="text-[#1de9b6] font-black text-sm uppercase tracking-[0.4em]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  02 / Architecture
                </h4>
                <p className={`text-sm md:text-base leading-relaxed font-medium tracking-tight whitespace-pre-line transition-colors duration-500 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Modular full-stack architecture:
                  • Frontend: React/Next.js
                  • Backend: REST API Auth
                  • Database: MongoDB Scalable
                  • AI Layer: Intelligent Logic
                </p>
              </div>
            </div>

            {/* 03 / Performance */}
            <div className="space-y-8 group">
              <div className={`aspect-square border overflow-hidden rounded-sm transition-all duration-700 relative ${isDark ? 'bg-[#0c0f0e] border-white/5' : 'bg-white border-gray-200'}`}>
                <LazyImage src={projectData.galleryImages[3] || projectData.image} alt="Performance" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#1de9b6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="space-y-4">
                <h4 className="text-[#1de9b6] font-black text-sm uppercase tracking-[0.4em]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  03 / Performance
                </h4>
                <p className={`text-sm md:text-base leading-relaxed font-medium tracking-tight transition-colors duration-500 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Optimized API requests, Lazy loading for images, Minimal re-renders in UI, and a Fast response time backend structure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video / Motion Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-36">
        <div className={`relative aspect-video rounded-sm overflow-hidden border group shadow-2xl transition-all duration-500 ${isDark ? 'bg-[#0c0f0e] border-white/5' : 'bg-white border-gray-200'}`}>
          {projectData.videoUrl ? (
            projectData.videoUrl.includes('youtube.com') || projectData.videoUrl.includes('youtu.be') ? (
              <iframe
                src={projectData.videoUrl.includes('watch?v=') 
                  ? projectData.videoUrl.replace('watch?v=', 'embed/') 
                  : projectData.videoUrl}
                title="Motion Study"
                className="w-full h-full transition-all duration-1000"
                allowFullScreen
              />
            ) : (
              <video
                src={projectData.videoUrl}
                className="w-full h-full object-cover transition-all duration-1000"
                controls
                muted
                autoPlay
                loop
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-12 h-12 border border-[#1de9b6]/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-[#1de9b6] border-b-[6px] border-b-transparent ml-1" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Simplified Footer */}
      <footer className={`w-full py-20 border-t transition-colors duration-500 ${isDark ? 'bg-black border-white/5' : 'bg-gray-50 border-gray-100'}`}>
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex justify-center">
          <div className={`h-[1px] w-24 transition-colors duration-500 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
        </div>
      </footer>
    </section>
  );
};

export default ProjectSingle;
