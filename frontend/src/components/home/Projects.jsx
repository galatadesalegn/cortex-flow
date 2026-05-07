import React, { useState, useRef, useEffect, useMemo } from "react";
import { useProjects } from "../../hooks";
import { fixImageUrl } from "../../utils/imageHelper.js";

// 3D Card Component
function Card3D({ children, className = "" }) {
	const ref = useRef(null);
	const [style, setStyle] = useState({});

	const handleMove = (e) => {
		const el = ref.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const cx = rect.width / 2;
		const cy = rect.height / 2;
		const px = (x - cx) / cx;
		const py = (y - cy) / cy;
		setStyle({
			transform: `perspective(800px) rotateX(${-py * 6}deg) rotateY(${px * 6}deg) scale(1.02)`,
			transition: "transform 0.1s ease-out",
		});
	};

	const handleLeave = () => {
		setStyle({ transform: "none", transition: "transform 500ms" });
	};

	return (
		<div
			ref={ref}
			style={style}
			onMouseMove={handleMove}
			onMouseLeave={handleLeave}
			className={className}
		>
			{children}
		</div>
	);
}

// SVG Icons
const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
);
const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
);
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);
const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
);
const LayersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
);

// Fade-in animation hook
const useFadeIn = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

const Projects = () => {
  const [sectionRef, isVisible] = useFadeIn();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { projects: apiProjects, loading, error } = useProjects();

  // Transform API projects
  const projects = useMemo(() => apiProjects.map(p => ({
    id: p._id,
    title: p.title,
    description: p.description,
    tech: p.techStack || [],
    featured: p.featured || false,
    image: p.image,
    category: p.category || 'Web Development',
    liveUrl: p.liveDemo || '#',
    githubUrl: p.githubLink || '#',
    stats: {
      stars: Math.floor(Math.random() * 2000) + 500,
      rating: (Math.random() * 2 + 3).toFixed(1),
      latency: ['Low Latency', 'Fast Load', 'Optimized'][Math.floor(Math.random() * 3)],
    }
  })), [apiProjects]);

  // Get featured projects
  const featuredProjects = useMemo(() => projects.filter((p) => p.featured), [projects]);
  const firstFeatured = featuredProjects[0];

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (selectedFilter === "all") return projects;
    return projects.filter(p => p.category?.toLowerCase().includes(selectedFilter.toLowerCase()));
  }, [projects, selectedFilter]);

  // Filter categories
  const categories = ["all", "Web Development", "Mobile Apps", "AI Automation", "UI/UX Design"];

  const handleViewCaseStudy = (project) => {
    window.location.href = `#/project-single?id=${project.id}`;
  };

  return (
    <section id="projects" className="min-h-screen flex items-center justify-center transition-all duration-500 scroll-mt-20 bg-bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-4 md:py-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair uppercase tracking-widest transition-colors duration-300 text-accent">
            Selected Works
          </h2>
        </div>

        {/* Featured Project Section - Compacted */}
        {firstFeatured && (
          <div className="mb-8">
            <Card3D className="relative overflow-hidden rounded-2xl border shadow-soft transition-colors duration-500 bg-bg-card border-border-theme">
              <div className="flex flex-col lg:flex-row">
                {/* Left - Visualization (Compacted) */}
                <div className="lg:w-[45%] p-4 lg:p-6 flex items-center justify-center min-h-[200px] relative transition-colors duration-500 bg-bg-secondary/50">
                  <div className="relative w-full max-w-[280px]">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border flex items-center justify-center transition-colors duration-500 border-border-theme bg-accent/5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 bg-accent/20 text-accent">
                        <LayersIcon />
                      </div>
                    </div>
                    {/* Status badge */}
                    <div className="absolute -top-4 -left-4 px-2.5 py-1.5 rounded text-[11px] flex items-center gap-1.5 font-bold tracking-tighter transition-colors duration-500 bg-bg-card text-theme-secondary shadow-soft">
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-accent"></div>
                      PROCESSING DATA
                    </div>
                    <svg className="absolute inset-0 w-full h-full min-h-[160px]">
                      <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="var(--accent)" strokeOpacity="0.1" strokeDasharray="4 4" />
                      <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="var(--accent)" strokeOpacity="0.1" strokeDasharray="4 4" />
                      <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="var(--accent)" strokeOpacity="0.1" strokeDasharray="4 4" />
                    </svg>
                  </div>
                </div>

                {/* Right - Content */}
                <div className="lg:w-[55%] p-5 lg:p-7 flex flex-col justify-center transition-colors duration-500">
                  <span className="inline-block px-2.5 py-1 text-[12px] font-bold rounded mb-3 w-fit tracking-tighter transition-colors duration-500 bg-accent/10 text-accent">
                    LATEST DEPLOYMENT
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 font-display transition-colors duration-500 text-theme-primary">{firstFeatured.title}</h3>
                  <p className="text-sm md:text-base mb-5 leading-relaxed line-clamp-2 transition-colors duration-500 text-slate-300 font-medium">
                    {firstFeatured.description}
                  </p>

                  <div className="flex gap-8 mb-6">
                    <div>
                      <div className="text-xl font-bold transition-colors duration-500 text-accent">99.9%</div>
                      <div className="text-[10px] uppercase tracking-widest font-bold transition-colors duration-500 text-theme-muted">Latency</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold transition-colors duration-500 text-accent">12k+</div>
                      <div className="text-[10px] uppercase tracking-widest font-bold transition-colors duration-500 text-theme-muted">Active Nodes</div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => handleViewCaseStudy(firstFeatured)}
                      className="px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 bg-accent/5 text-accent border border-border-theme hover:bg-bg-accent/10 shadow-inner"
                    >
                      <span>View Case Study</span>
                      <ExternalLinkIcon />
                    </button>
                  </div>
                </div>
              </div>
            </Card3D>
          </div>
        )}

        {/* Filter Tabs - Compact */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${selectedFilter === cat
                ? 'bg-accent text-dark-primary shadow-soft'
                : 'bg-bg-card text-theme-secondary hover:bg-bg-accent'
                }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Loading/Error/Grid */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-2 rounded-full animate-spin transition-colors duration-500 border-accent/20 border-t-accent" />
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-400 text-sm font-bold">
            Sync failed. Retrying...
          </div>
        )}

        {!loading && !error && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <Card3D key={project.id} className="h-full">
                <ProjectCard project={project} onClick={() => handleViewCaseStudy(project)} />
              </Card3D>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const ProjectCard = ({ project, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-xl border overflow-hidden transition-all duration-300 cursor-pointer bg-bg-card border-border-theme flex flex-col h-full ${
        isHovered ? 'shadow-soft' : 'shadow-sm'
      }`}
    >
      {/* Visual Header */}
      <div className="relative h-40 overflow-hidden bg-bg-secondary">
        {project.image ? (
          <img
            src={fixImageUrl(project.image)}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20">
            <LayersIcon />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent opacity-60"></div>
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent/10 text-accent backdrop-blur-sm">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-black mb-1 group-hover:text-accent transition-colors text-theme-primary uppercase tracking-tight">{project.title}</h3>
        <p className="text-xs mb-4 line-clamp-2 leading-relaxed text-slate-300 font-medium">
          {project.description}
        </p>

        {/* Footer info */}
        <div className="mt-auto pt-4 flex flex-col gap-4">
          <div className="flex justify-center">
            <div className="px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all bg-accent/5 text-accent border border-border-theme flex items-center gap-2 group-hover:border-accent/30">
              View Case Study
              <ExternalLinkIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;