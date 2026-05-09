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

// Single Testimonial Card - Horizontal Layout
const TestimonialCard = ({ testimonial, index }) => {
  const [ref, isVisible] = useFadeIn(0.1);
  
  return (
    <div
      ref={ref}
      className={`group relative rounded-xl border transition-all duration-500 overflow-hidden bg-gradient-to-br from-[#0d1411] to-[#0a1a14] border-emerald-500/10 hover:border-[#1de9b6]/30 shadow-sm hover:shadow-soft ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1de9b6]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content - Single Horizontal Line */}
      <div className="relative p-4 md:p-5 flex items-center gap-4">
        {/* Avatar */}
        {testimonial.avatar ? (
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover border-2 flex-shrink-0 transition-colors duration-300 border-emerald-500/20 group-hover:border-[#1de9b6]/60"
          />
        ) : (
          <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-colors duration-300 bg-[#1de9b6]/10 border-emerald-500/20 group-hover:border-[#1de9b6]/60">
            <span className="font-bold text-sm transition-colors duration-300 text-[#1de9b6]">
              {testimonial.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Name, Role, Company */}
        <div className="flex-shrink-0 min-w-0">
          <h4 className="text-sm font-bold transition-colors duration-300 text-white tracking-tight group-hover:text-[#1de9b6] truncate">{testimonial.name}</h4>
          <p className="text-[10px] font-medium uppercase tracking-wider transition-colors duration-300 text-slate-500 truncate">
            {testimonial.role} @ {testimonial.company}
          </p>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-white/10 flex-shrink-0" />

        {/* Stars */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon key={star} filled={star <= (testimonial.rating || 5)} />
          ))}
        </div>

        {/* Verified Badge */}
        {testimonial.verified && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold bg-[#1de9b6]/10 text-[#1de9b6] backdrop-blur-sm border border-[#1de9b6]/20 flex-shrink-0">
            <VerifiedIcon />
            <span>Verified</span>
          </div>
        )}
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
      className={`transition-all duration-1000 bg-bg-primary scroll-mt-20 pb-8 ${
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
          <div className="flex flex-col gap-3 max-w-4xl mx-auto">
            {displayTestimonials.map((testimonial, index) => (
              <Card3D key={testimonial._id}>
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
