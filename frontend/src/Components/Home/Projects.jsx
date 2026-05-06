import React, { useState, useRef, useMemo, useEffect } from "react";
import { useProjects } from "../../hooks";

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
    window.location.hash = `project-single?id=${project.id}`;
  };

  return (
    <section id="projects" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-primary scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-4 md:py-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1de9b6] font-playfair uppercase tracking-widest">
            Selected Works
          </h2>
        </div>

        {/* Featured Project Section - Compacted */}
        {firstFeatured && (
          <div className="mb-8">
            <div className="relative overflow-hidden rounded-2xl bg-[#101c18] border border-[#1de9b6]/10 shadow-[0_0_40px_rgba(29,233,182,0.1)]">
              <div className="flex flex-col lg:flex-row">
                {/* Left - Visualization (Compacted) */}
                <div className="lg:w-[45%] p-4 lg:p-6 flex items-center justify-center min-h-[200px] relative bg-[#0a1a14]/50">
                  <div className="relative w-full max-w-[280px]">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-[#1de9b6]/30 flex items-center justify-center bg-[#1de9b6]/5">
                      <div className="w-8 h-8 rounded-full bg-[#1de9b6]/20 flex items-center justify-center text-[#1de9b6]">
                        <LayersIcon />
                      </div>
                    </div>
                    {/* Status badge */}
                    <div className="absolute -top-4 -left-4 px-2.5 py-1.5 bg-[#101c18] border border-[#1de9b6]/20 rounded text-[11px] text-gray-400 flex items-center gap-1.5 font-bold tracking-tighter">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1de9b6] animate-pulse"></div>
                      PROCESSING DATA
                    </div>
                    <svg className="absolute inset-0 w-full h-full min-h-[160px]">
                      <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="#1de9b6" strokeOpacity="0.1" strokeDasharray="4 4" />
                      <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="#1de9b6" strokeOpacity="0.1" strokeDasharray="4 4" />
                      <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="#1de9b6" strokeOpacity="0.1" strokeDasharray="4 4" />
                    </svg>
                  </div>
                </div>

                {/* Right - Content */}
                <div className="lg:w-[55%] p-5 lg:p-7 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-[#1de9b6]/10">
                  <span className="inline-block px-2.5 py-1 bg-[#1de9b6]/10 text-[#1de9b6] text-[12px] font-bold rounded mb-3 w-fit tracking-tighter">
                    LATEST DEPLOYMENT
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 font-display">{firstFeatured.title}</h3>
                  <p className="text-gray-400 text-sm md:text-base mb-5 leading-relaxed line-clamp-2">
                    {firstFeatured.description}
                  </p>

                  <div className="flex gap-8 mb-6">
                    <div>
                      <div className="text-[#1de9b6] text-xl font-bold">99.9%</div>
                      <div className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Latency</div>
                    </div>
                    <div>
                      <div className="text-[#1de9b6] text-xl font-bold">12k+</div>
                      <div className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Active Nodes</div>
                    </div>
                  </div>

                  <div className="flex">
                    <button
                      onClick={() => handleViewCaseStudy(firstFeatured)}
                      className="w-full relative overflow-hidden rounded-xl py-4 text-sm font-bold transition-all flex items-center justify-center gap-2 group"
                    >
                      {/* Background Image */}
                      {firstFeatured.image && (
                        <div className="absolute inset-0 z-0">
                          <img
                            src={firstFeatured.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-[#0a0a0a]/60 group-hover:bg-[#0a0a0a]/50 transition-all"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-[#1de9b6]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      )}
                      {/* Content */}
                      <span className="relative z-10 text-[#1de9b6] group-hover:text-white transition-colors flex items-center gap-2 border border-[#1de9b6]/50 px-6 py-2 rounded-full bg-[#0a0a0a]/80 backdrop-blur-sm">
                        View Case Study
                        <ExternalLinkIcon />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs - Compact */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${selectedFilter === cat
                ? 'bg-[#1de9b6] text-[#0a1a14] shadow-[0_0_15px_rgba(29,233,182,0.3)]'
                : 'bg-[#1a1a1a] border border-white/5 text-gray-500 hover:border-[#1de9b6]/30 hover:text-white'
                }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Loading/Error/Grid */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-2 border-[#1de9b6]/20 border-t-[#1de9b6] rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-400 text-sm">
            Sync failed. Retrying...
          </div>
        )}

        {!loading && !error && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredProjects.slice(0, 6).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewCaseStudy={() => handleViewCaseStudy(project)}
                onMouseEnter={() => prefetchProject(project.id)}
              />
            ))}
          </div>
        )}

        {!loading && !error && filteredProjects.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">
            No projects found in this matrix.
          </div>
        )}
      </div>
    </section>
  );
};

// Project Card with View Case Study
const ProjectCard = ({ project, onViewCaseStudy, onMouseEnter }) => {
  return (
    <div
      onMouseEnter={onMouseEnter}
      className="group relative overflow-hidden rounded-xl bg-[#101c18] border border-[#1de9b6]/10 hover:border-[#1de9b6]/40 transition-all duration-300 w-full max-w-[340px] mx-auto flex flex-col h-full"
    >
      {/* Category Badge - Minimal */}
      <div className="absolute top-3 left-3 z-10">
        <span className="px-2.5 py-1 bg-[#1de9b6]/10 text-[#1de9b6] text-[11px] font-bold rounded border border-[#1de9b6]/20 uppercase tracking-tighter">
          {project.category || 'DEVOPS'}
        </span>
      </div>

      {/* Project Image - Compact */}
      <div className="h-28 overflow-hidden bg-[#0a1a14] relative">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#1de9b6]/20">
            <LayersIcon />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101c18] to-transparent pointer-events-none" />
      </div>

      {/* Content - Tight */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#1de9b6] transition-colors leading-tight">
          {project.title}
        </h3>
        <p className="text-gray-400 text-[13px] mb-4 line-clamp-2 leading-snug">{project.description}</p>

        {/* Stats - Compact icons */}
        <div className="flex items-center gap-4 mb-4 text-[11px] text-gray-500 font-bold uppercase tracking-tighter">
          <span className="flex items-center gap-1.5">
            <StarIcon />
            {project.stats.stars}
          </span>
          <span className="flex items-center gap-1.5">
            <ZapIcon />
            {project.stats.latency}
          </span>
        </div>

        {/* Actions - Single Case Study Button with Image Background */}
        <div className="mt-auto">
          <button
            onClick={onViewCaseStudy}
            className="w-full relative overflow-hidden rounded-lg py-3 text-xs font-bold transition-all flex items-center justify-center gap-2 group"
          >
            {/* Background Image */}
            {project.image && (
              <div className="absolute inset-0 z-0">
                <img
                  src={project.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#0a0a0a]/70 group-hover:bg-[#0a0a0a]/60 transition-all"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1de9b6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            )}
            {/* Content */}
            <span className="relative z-10 text-[#1de9b6] group-hover:text-white transition-colors flex items-center gap-2 border border-[#1de9b6]/50 px-4 py-1.5 rounded-full bg-[#0a0a0a]/80 backdrop-blur-sm">
              View Case Study
              <ExternalLinkIcon />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Projects;