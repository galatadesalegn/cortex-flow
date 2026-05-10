import React, { useRef, useState, useEffect, useCallback, useMemo, memo } from "react";
import { useProfile, useServices } from "../../hooks";
import { useTheme } from "../../contexts/ThemeContext";
import { Monitor, Smartphone, Brain, Palette } from 'lucide-react';

// ============================================
// PERFORMANCE OPTIMIZED ABOUT SECTION
// ============================================

// Optimized 3D tilt hook with requestAnimationFrame throttling
const use3DTilt = (maxRotate = 6, maxTranslate = 12) => {
  const ref = useRef(null);
  const [style, setStyle] = useState({});
  const rafRef = useRef(null);
  const lastMoveRef = useRef({ x: 0, y: 0 });

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
      
      // Skip if position hasn't changed significantly
      if (Math.abs(x - lastMoveRef.current.x) < 2 && Math.abs(y - lastMoveRef.current.y) < 2) {
        rafRef.current = null;
        return;
      }
      
      lastMoveRef.current = { x, y };
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const px = (x - cx) / cx;
      const py = (y - cy) / cy;
      
      setStyle({
        transform: `perspective(800px) rotateX(${-py * maxRotate}deg) rotateY(${px * maxRotate}deg) translateX(${px * maxTranslate}px) scale(1.02)`,
        transition: "transform 0ms",
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
      transform: "none", 
      transition: "transform 500ms cubic-bezier(.2,.8,.2,1)" 
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return { ref, style, onMove, onLeave };
};

// Optimized fade-in with IntersectionObserver
const useFadeIn = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

// Optimized Terminal Status - Simplified and Static for Performance
const TerminalStatus = memo(() => {
  return (
    <div className="w-full rounded-lg border overflow-hidden font-mono text-xs transition-colors duration-300 bg-[#0f172a] border-slate-700 shadow-md">
      <div className="px-3 py-2 border-b flex items-center justify-between bg-[#1e293b]/50 border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-[10px] uppercase tracking-wider text-slate-400">system_status.sh</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/60 bg-gradient-to-br from-emerald-500/30 via-slate-900/95 to-slate-900 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Active</span>
        </div>
      </div>
      <div className="p-3">
        <div className="text-slate-400 leading-relaxed mt-2">$ systemctl status portfolio</div>
        <div className="text-emerald-400 leading-relaxed font-bold">● portfolio.service - Full-Stack Developer Profile</div>
        <div className="text-slate-300 leading-relaxed">   Loaded: loaded</div>
        <div className="text-emerald-500 leading-relaxed">   Active: active (running)</div>
        <div className="text-emerald-500 font-bold leading-relaxed">   Status: SYSTEM OPERATIONAL ✓</div>
        <div className="text-slate-400 leading-relaxed mt-2">$ check_services --all</div>
        <div className="text-emerald-500 leading-relaxed">✓ MongoDB Cluster    [CONNECTED]</div>
        <div className="text-emerald-500 leading-relaxed">✓ React Frontend     [OPTIMIZED]</div>
        <div className="text-emerald-500 leading-relaxed">✓ Node.js Backend    [RUNNING]</div>
      </div>
    </div>
  );
});

TerminalStatus.displayName = 'TerminalStatus';

const ProfileSkeleton = memo(() => (
  <div className="flex flex-col items-center animate-pulse">
    <div className="w-full max-w-[240px] aspect-square rounded-xl bg-accent/10 mb-4" />
    <div className="w-32 h-6 bg-accent/10 rounded mb-2" />
    <div className="w-48 h-3 bg-accent/5 rounded mb-4" />
    <div className="w-full h-16 bg-accent/5 rounded mb-4" />
    <div className="flex gap-3 w-full">
      <div className="flex-1 h-10 bg-accent/10 rounded" />
      <div className="flex-1 h-10 bg-accent/10 rounded" />
    </div>
  </div>
));

ProfileSkeleton.displayName = 'ProfileSkeleton';

const ProfileCard = memo(({ profile, loading }) => {
  const { ref, style, onMove, onLeave } = use3DTilt(4, 8);
  const [hovered, setHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMove = useCallback((e) => {
    onMove(e);
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, [onMove]);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    onLeave();
    setHovered(false);
  }, [onLeave]);

  if (loading) {
    return (
      <div className="relative rounded-xl p-3 md:p-4 flex flex-col items-center border h-full transition-colors duration-300 bg-[#0a1a14] border-border-theme">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{
        ...style,
        background: hovered
          ? `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(29,233,182,0.1) 0%, transparent 50%), linear-gradient(135deg, #0d1411 0%, #0a1a14 100%)`
          : 'linear-gradient(135deg, #0d1411 0%, #0a1a14 100%)'
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`relative rounded-xl p-5 md:p-6 flex flex-col items-center transition-all duration-500 h-full ${
        hovered ? 'shadow-[0_0_30px_rgba(29,233,182,0.15)]' : ''
      }`}
    >
      <div className="w-full max-w-[240px] aspect-square rounded-xl overflow-hidden mb-5 relative group border shadow-inner transition-colors duration-300 bg-[#12221b] border-green-400/30">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-accent/10 animate-pulse" />
        )}
        <img
          src={profile?.avatar || profile?.image || "https://api.dicebear.com/7.x/adventurer/svg?seed=galata"}
          alt={profile?.name || "Profile"}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = "https://api.dicebear.com/7.x/adventurer/svg?seed=galata";
          }}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t pointer-events-none transition-colors duration-300 from-[#12221b] to-transparent" />
      </div>

      <div className="text-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold mb-1 font-playfair tracking-tight transition-colors duration-300 text-accent">
          {profile?.name || "Galata Desalegn"}
        </h2>
        <h3 className="text-[11px] md:text-sm font-black tracking-[0.12em] uppercase font-outfit leading-snug transition-colors duration-300 text-theme-secondary">
          {profile?.subtitle || "FULL-STACK DEVELOPER & AI AUTOMATION ENGINEER"}
        </h3>
      </div>

      <p className="text-center mb-6 leading-relaxed font-outfit text-base px-2 max-w-xs transition-colors duration-300 text-slate-300 font-medium">
        {profile?.bio || "I am an AI engineer and Full-stack web developer. I work with the MERN stack, AI-based Web automation, and modern UI/UX Design."}
      </p>

      <div className="flex gap-3 w-full mb-6">
        <a
          href={profile?.resume || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center font-bold py-2.5 px-3 rounded-lg border text-[11px] uppercase tracking-[0.15em] hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200 bg-[#1de9b6] text-[#0a1a14] border-transparent hover:bg-[#14b98a]"
        >
          Download CV
        </a>
        <a
          href="#contact"
          className="flex-1 text-center font-bold py-2.5 px-3 rounded-lg border text-[11px] uppercase tracking-[0.15em] hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200 bg-[#12221b] text-accent border-border-theme hover:border-accent"
        >
          Collaborate
        </a>
      </div>

      <TerminalStatus />
    </div>
  );
});

ProfileCard.displayName = 'ProfileCard';

const ServiceCard = memo(({ icon: Icon, title, description }) => {
  const { ref, style, onMove, onLeave } = use3DTilt(3, 5);
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMove = useCallback((e) => {
    onMove(e);
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, [onMove]);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    onLeave();
    setHovered(false);
  }, [onLeave]);

  return (
    <div
      ref={ref}
      style={{
        ...style,
        background: hovered
          ? `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(29,233,182,0.1) 0%, transparent 50%), linear-gradient(135deg, #0d1411 0%, #0a1a14 100%)`
          : 'linear-gradient(135deg, #0d1411 0%, #0a1a14 100%)'
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`rounded-xl p-5 md:p-6 flex flex-col justify-center transition-all duration-500 group w-full ${
        hovered ? 'shadow-[0_0_30px_rgba(29,233,182,0.15)]' : ''
      }`}
    >
      <div className="w-12 h-12 rounded-xl border flex items-center justify-center transition-all mb-4 bg-[#12221b] border-border-theme text-accent group-hover:border-accent">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="font-bold text-lg md:text-xl font-outfit mb-2 transition-colors duration-300 text-slate-200">{title}</h4>
      <p className="text-base leading-relaxed font-outfit transition-colors duration-300 text-slate-300 font-medium">{description}</p>
    </div>
  );
});

ServiceCard.displayName = 'ServiceCard';

// Helper to get Lucide icon by name
const getIcon = (iconName) => {
  const icons = {
    'Monitor': Monitor,
    'Smartphone': Smartphone,
    'Brain': Brain,
    'Palette': Palette,
  };
  return icons[iconName] || Monitor;
};

const About = () => {
  const { profile, loading } = useProfile();
  const { services: apiServices, loading: servicesLoading } = useServices();
  const [sectionRef, isVisible] = useFadeIn();
  const { isDark } = useTheme();

  // Transform backend services to frontend format
  const servicesData = useMemo(() => {
    if (!apiServices || apiServices.length === 0) {
      // Fallback to default data if no services from backend
      return [
        {
          title: "Full-Stack Development",
          description: "Architecting robust end-to-end applications with modular patterns, scalable APIs, and modern frameworks.",
          icon: Monitor
        },
        {
          title: "Mobile Development",
          description: "Crafting high-performance native experiences for iOS and Android with React Native and modern mobile frameworks.",
          icon: Smartphone
        },
        {
          title: "AI Automation",
          description: "Implementing neural networks, machine learning models, and LLM agents to automate workflows and enhance efficiency.",
          icon: Brain
        },
        {
          title: "UI/UX Design",
          description: "Designing intuitive interfaces that prioritize user clarity, accessibility, and precision for optimal digital experiences.",
          icon: Palette
        },
      ];
    }

    return apiServices
      .filter(s => s.status === 'active')
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(service => ({
        title: service.title,
        description: service.description,
        icon: getIcon(service.lucideIcon || 'Monitor')
      }));
  }, [apiServices]);

  const sectionClass = useMemo(() => 
    `min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-700 ease-out scroll-mt-20 bg-[#0a1a14] ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
    }`,
    [isVisible]
  );

  return (
    <section id="about" ref={sectionRef} className={sectionClass}>
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 relative z-10 w-full py-8 md:py-12">
        <div className="relative mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center uppercase tracking-[0.2em] transition-colors duration-300 text-accent">About Me</h2>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-accent/50" />
            <div className="w-2 h-2 rounded-full shadow-[0_0_10px_rgba(29,233,182,0.5)] bg-accent" />
            <div className="w-24 h-0.5 bg-accent/30" />
            <div className="w-2 h-2 rounded-full shadow-[0_0_10px_rgba(29,233,182,0.5)] bg-accent" />
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-accent/50" />
          </div>
        </div>

        <div className="relative">
          {/* Vertical Connection Line */}
          <div className="hidden md:block absolute left-[41.667%] top-0 bottom-0 w-px bg-gradient-to-b from-accent/80 via-accent/20 to-transparent shadow-[0_0_10px_rgba(29,233,182,0.3)]" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-fr relative">
            <div className="md:col-span-5 flex flex-col h-full">
              <ProfileCard profile={profile} loading={loading} />
            </div>

            <div className="relative md:col-span-7 flex flex-col h-full">
              {/* Connection Node */}
              <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 z-20 transition-colors duration-300 bg-[#0a1a14] border-accent shadow-[0_0_15px_rgba(29,233,182,0.4)]">
                <div className="absolute inset-1.5 rounded-full bg-accent animate-pulse" />
              </div>
              
              <div className="flex flex-col gap-4 w-full">
                {servicesData.map((service) => (
                  <ServiceCard
                    key={service.title}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
