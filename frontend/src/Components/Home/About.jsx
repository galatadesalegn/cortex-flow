import React, { useRef, useState, useEffect, useCallback, useMemo, memo } from "react";
import { useProfile } from "../../hooks";
import { useTheme } from "../../contexts/ThemeContext";

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

// Optimized Terminal Status - Single animation loop
const TerminalStatus = memo(() => {
  const [visibleLines, setVisibleLines] = useState(0);
  const rafRef = useRef(null);

  const commands = useMemo(() => [
    { text: "$ systemctl status portfolio", color: "text-gray-400" },
    { text: "● portfolio.service - Full-Stack Developer Profile", color: "text-[#1de9b6]" },
    { text: "   Loaded: loaded", color: "text-gray-300" },
    { text: "   Active: active (running)", color: "text-green-400" },
    { text: "   Status: SYSTEM OPERATIONAL ✓", color: "text-green-400 font-bold" },
    { text: "", color: "" },
    { text: "$ check_services --all", color: "text-gray-400" },
    { text: "✓ MongoDB Cluster    [CONNECTED]", color: "text-green-400" },
    { text: "✓ React Frontend     [OPTIMIZED]", color: "text-green-400" },
    { text: "✓ Node.js Backend    [RUNNING]", color: "text-green-400" },
    { text: "✓ AI/ML Modules      [ACTIVE]", color: "text-green-400" },
    { text: "✓ API Gateway        [STABLE]", color: "text-green-400" },
    { text: "", color: "" },
    { text: "$ uptime", color: "text-gray-400" },
    { text: "5+ years of continuous development", color: "text-[#1de9b6]" },
  ], []);

  useEffect(() => {
    let lineIndex = 0;
    let lastTime = performance.now();
    const delay = 150;

    const animate = (currentTime) => {
      if (lineIndex >= commands.length) return;
      
      if (currentTime - lastTime >= delay) {
        lineIndex++;
        setVisibleLines(lineIndex);
        lastTime = currentTime;
      }
      
      if (lineIndex < commands.length) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const startTimeout = setTimeout(() => {
      rafRef.current = requestAnimationFrame(animate);
    }, 300);

    return () => {
      clearTimeout(startTimeout);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [commands]);

  return (
    <div className="w-full bg-[#0a1a14] rounded-lg border border-[#1de9b6]/20 overflow-hidden font-mono text-xs">
      <div className="bg-[#1de9b6]/10 px-3 py-2 border-b border-[#1de9b6]/20 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-[#1de9b6]/60 text-[10px] uppercase tracking-wider">system_status.sh</span>
      </div>
      <div className="p-3 min-h-[160px] max-h-[160px] overflow-hidden">
        {commands.slice(0, visibleLines).map((line, index) => (
          <div 
            key={index} 
            className={`${line.color} leading-relaxed ${line.text.startsWith('$') ? 'mt-2' : ''}`}
          >
            {line.text}
          </div>
        ))}
        {visibleLines < commands.length && (
          <div className="animate-pulse text-[#1de9b6]">_</div>
        )}
      </div>
    </div>
  );
});

TerminalStatus.displayName = 'TerminalStatus';

const ProfileSkeleton = memo(() => (
  <div className="flex flex-col items-center animate-pulse">
    <div className="w-full max-w-[190px] aspect-[425/426] rounded-xl bg-[#1de9b6]/10 mb-4" />
    <div className="w-32 h-6 bg-[#1de9b6]/10 rounded mb-2" />
    <div className="w-48 h-3 bg-[#1de9b6]/5 rounded mb-4" />
    <div className="w-full h-16 bg-[#1de9b6]/5 rounded mb-4" />
    <div className="flex gap-3 w-full">
      <div className="flex-1 h-10 bg-[#1de9b6]/10 rounded" />
      <div className="flex-1 h-10 bg-[#1de9b6]/10 rounded" />
    </div>
  </div>
));

ProfileSkeleton.displayName = 'ProfileSkeleton';

const ProfileCard = memo(({ profile, loading }) => {
  const { ref, style, onMove, onLeave } = use3DTilt(4, 8);
  const [hovered, setHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    onLeave();
    setHovered(false);
  }, [onLeave]);

  if (loading) {
    return (
      <div className="relative bg-[#101c18] rounded-xl p-3 md:p-4 flex flex-col items-center border border-[#1de9b6]/10 h-full">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`relative bg-[#101c18] rounded-xl p-3 md:p-4 flex flex-col items-center border transition-all duration-300 h-full ${hovered ? 'shadow-[0_0_30px_rgba(29,233,182,0.2)] border-[#1de9b6]/40 bg-[#14261f]' : 'border-[#1de9b6]/10'}`}
    >
      <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0a1a14] border-2 border-[#1de9b6]/50 z-20">
        <div className="absolute inset-1 rounded-full bg-[#1de9b6] shadow-[0_0_10px_rgba(29,233,182,0.5)]" />
      </div>

      <div className="w-full max-w-[190px] aspect-[425/426] rounded-xl overflow-hidden mb-4 bg-[#0a1512] relative group border border-[#1de9b6]/10 shadow-inner">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#1de9b6]/10 animate-pulse" />
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
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#101c18] to-transparent pointer-events-none" />
      </div>

      <div className="text-center mb-3">
        <h2 className="text-xl md:text-2xl font-bold text-[#1de9b6] mb-1 font-playfair tracking-tight">
          {profile?.name || "Galata Desalegn"}
        </h2>
        <h3 className="text-[#1de9b6]/80 text-[11px] md:text-sm font-black tracking-[0.12em] uppercase font-outfit leading-snug">
          {profile?.subtitle || "FULL-STACK DEVELOPER & AI AUTOMATION ENGINEER"}
        </h3>
      </div>

      <p className="text-gray-400 text-center mb-4 leading-relaxed font-outfit text-base px-2 max-w-xs">
        {profile?.bio || "I am an AI engineer and Full-stack web developer. I work with the MERN stack, AI-based Web automation, and modern UI/UX Design."}
      </p>

      <div className="flex gap-3 w-full mb-2">
        <a
          href={profile?.resume || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-[#0a1a14] text-[#1de9b6] font-bold py-2 px-3 rounded-lg border border-[#1de9b6]/30 text-[10px] uppercase tracking-widest hover:shadow-[4px_4px_8px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 hover:border-[#1de9b6]/50 transition-all duration-200"
        >
          Download CV
        </a>
        <a
          href="#contact"
          className="flex-1 text-center bg-[#1de9b6] text-[#0a1a14] font-bold py-2 px-3 rounded-lg text-[10px] uppercase tracking-widest hover:shadow-[4px_4px_8px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-200"
        >
          Collaborate
        </a>
      </div>

      <TerminalStatus />
    </div>
  );
});

ProfileCard.displayName = 'ProfileCard';

const ServiceCard = memo(({ icon, title, description, color }) => {
  const { ref, style, onMove, onLeave } = use3DTilt(3, 5);
  const c = color || { text: "text-[#1de9b6]", bg: "bg-[#1de9b6]/10", border: "border-[#1de9b6]/20", hoverBg: "group-hover:bg-[#1de9b6]/20" };
  
  return (
    <div
      ref={ref}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="bg-[#101c18] rounded-xl p-4 md:p-5 flex flex-col justify-center border border-[#1de9b6]/10 hover:border-[#1de9b6]/30 transition-all group w-full"
    >
      <div className={`w-11 h-11 rounded-lg border flex items-center justify-center transition-all mb-3 ${c.bg} ${c.border} ${c.text} ${c.hoverBg}`}>
        {React.cloneElement(icon, { className: "w-6 h-6" })}
      </div>
      <h4 className="font-bold text-white text-lg md:text-xl font-outfit mb-2">{title}</h4>
      <p className="text-gray-400 text-sm md:text-base leading-relaxed font-outfit">{description}</p>
    </div>
  );
});

ServiceCard.displayName = 'ServiceCard';

const SERVICES_DATA = [
  {
    title: "Full-Stack Development",
    description: "Architecting robust end-to-end applications with modular patterns, scalable APIs, and modern frameworks.",
    color: { text: "text-[#1de9b6]", bg: "bg-[#1de9b6]/10", border: "border-[#1de9b6]/20", hoverBg: "group-hover:bg-[#1de9b6]/20" },
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  },
  {
    title: "Mobile Development",
    description: "Crafting high-performance native experiences for iOS and Android with React Native and modern mobile frameworks.",
    color: { text: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", hoverBg: "group-hover:bg-blue-400/20" },
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
  },
  {
    title: "AI Automation",
    description: "Implementing neural networks, machine learning models, and LLM agents to automate workflows and enhance efficiency.",
    color: { text: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", hoverBg: "group-hover:bg-purple-400/20" },
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
  },
  {
    title: "UI/UX Design",
    description: "Designing intuitive interfaces that prioritize user clarity, accessibility, and precision for optimal digital experiences.",
    color: { text: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/20", hoverBg: "group-hover:bg-pink-400/20" },
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
  },
];

const About = () => {
  const { profile, loading } = useProfile();
  const [sectionRef, isVisible] = useFadeIn();

  const sectionClass = useMemo(() => 
    `min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-primary relative overflow-hidden transition-all duration-500 ease-out scroll-mt-20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`,
    [isVisible]
  );

  return (
    <section id="about" ref={sectionRef} className={sectionClass}>
      <div className="max-w-[1100px] mx-auto px-8 relative z-10 w-full py-8 md:py-12">
        <div className="relative mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1de9b6] text-center uppercase tracking-[0.2em]">About Me</h2>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-[#1de9b6]/50" />
            <div className="w-2 h-2 rounded-full bg-[#1de9b6] shadow-[0_0_10px_rgba(29,233,182,0.5)]" />
            <div className="w-24 h-0.5 bg-[#1de9b6]/30" />
            <div className="w-2 h-2 rounded-full bg-[#1de9b6] shadow-[0_0_10px_rgba(29,233,182,0.5)]" />
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-[#1de9b6]/50" />
          </div>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-[41.667%] top-0 bottom-0 w-px bg-gradient-to-b from-[#1de9b6]/50 via-[#1de9b6]/20 to-transparent" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-fr relative">
            <div className="md:col-span-5 flex flex-col h-full">
              <ProfileCard profile={profile} loading={loading} />
            </div>

            <div className="relative md:col-span-7 flex flex-col h-full">
              <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0a1a14] border-2 border-[#1de9b6]/50 z-20">
                <div className="absolute inset-1 rounded-full bg-[#1de9b6] shadow-[0_0_10px_rgba(29,233,182,0.5)]" />
              </div>
              
              <div className="flex flex-col gap-4 w-full">
                {SERVICES_DATA.map((service) => (
                  <ServiceCard
                    key={service.title}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                    color={service.color}
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
