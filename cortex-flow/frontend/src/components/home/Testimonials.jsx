import React, { useRef, useState, useEffect } from "react";
import { useTestimonials, useTheme } from "../../hooks";

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

// Star Icon Component
const StarIcon = ({ filled }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"} 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={filled ? "text-accent" : "text-accent/30"}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Quote Icon
const QuoteIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="text-[#1de9b6]/40"
  >
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21c0 1 0 1 1 1z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
  </svg>
);

// Verified Badge Icon
const VerifiedIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="12" 
    height="12" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
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

// Single Testimonial Card
const TestimonialCard = ({ testimonial, index }) => {
  const [ref, isVisible] = useFadeIn(0.1);
  
  return (
    <div
      ref={ref}
      className={`group relative rounded-xl border transition-all duration-500 overflow-hidden bg-gradient-to-br from-[#0d1411] to-[#0a1a14] border-emerald-500/10 hover:border-[#1de9b6]/30 shadow-sm hover:shadow-soft h-full ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1de9b6]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative p-7 md:p-8 flex flex-col h-full">
        {/* Header with stars and verified badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} filled={star <= (testimonial.rating || 5)} />
            ))}
          </div>
          {testimonial.verified && (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded text-[11px] font-bold bg-[#1de9b6]/10 text-[#1de9b6] backdrop-blur-sm border border-[#1de9b6]/20">
              <VerifiedIcon />
              <span>Verified</span>
            </div>
          )}
        </div>

        {/* Quote */}
        <div className="mb-8 flex-grow">
          <QuoteIcon />
          <p className="text-sm md:text-base font-medium leading-relaxed mt-4 transition-colors duration-300 text-slate-200">
            "{testimonial.content}"
          </p>
        </div>

        {/* Author */}
        <div className="mt-auto pt-6 border-t border-white/5 transition-colors duration-300 flex items-center gap-4">
          {testimonial.avatar ? (
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover border-2 transition-colors duration-300 border-emerald-500/20 group-hover:border-[#1de9b6]/60"
            />
          ) : (
            <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-[#1de9b6]/10 border-emerald-500/20 group-hover:border-[#1de9b6]/60">
              <span className="font-bold text-sm transition-colors duration-300 text-[#1de9b6]">
                {testimonial.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h4 className="text-base font-black transition-colors duration-300 text-white tracking-tight group-hover:text-[#1de9b6]">{testimonial.name}</h4>
            <p className="text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 text-slate-500 mt-0.5">
              {testimonial.role} @ {testimonial.company}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Testimonials Component
const Testimonials = () => {
  const [sectionRef, isVisible] = useFadeIn(0.1);
  const { testimonials, loading, error } = useTestimonials();

  // Default testimonials if none from API
  const defaultTestimonials = [
    {
      _id: '1',
      name: 'Sarah Chen',
      role: 'CTO',
      company: 'NeuralLink',
      content: 'The architectural precision delivered during our LLM deployment was unparalleled. A visionary approach to scalable AI infrastructure.',
      rating: 5,
      verified: true,
    },
    {
      _id: '2',
      name: 'Marcus Vane',
      role: 'Lead Product',
      company: 'OpenAI',
      content: 'Seamlessly bridged the gap between theoretical neural models and production-ready enterprise solutions. Pure technical brilliance.',
      rating: 5,
      verified: true,
    },
    {
      _id: '3',
      name: 'Dr. Elena Kostic',
      role: 'Director of AI',
      company: 'Anthropic',
      content: 'Redefined our computational limits with an elegant AI orchestration layer. The gold standard for solutions architecture.',
      rating: 5,
      verified: true,
    },
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className={`transition-all duration-1000 bg-bg-primary scroll-mt-20 pb-4 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-8 md:py-10 relative z-10">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-playfair uppercase tracking-widest transition-colors duration-300 text-accent">
            Testimonials
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-2 rounded-full animate-spin border-accent/20 border-t-accent" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-400 font-bold uppercase tracking-widest">
            Synchronization Failed
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {displayTestimonials.map((testimonial, index) => (
              <Card3D key={testimonial._id} className="h-full">
                <TestimonialCard testimonial={testimonial} index={index} />
              </Card3D>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
