import React, { useRef, useState, useEffect } from "react";
import { useTestimonials } from "../../hooks";

// Star Icon Component
const StarIcon = ({ filled }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"} 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={filled ? "text-[#1de9b6]" : "text-[#1de9b6]/30"}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Quote Icon
const QuoteIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
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
      className={`group relative bg-[#0c1210] rounded-xl border border-[#1de9b6]/10 hover:border-[#1de9b6]/30 transition-all duration-500 overflow-hidden ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1de9b6]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative p-6">
        {/* Header with stars and verified badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} filled={star <= (testimonial.rating || 5)} />
            ))}
          </div>
          {testimonial.verified && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1de9b6]/10 border border-[#1de9b6]/20 rounded-full">
              <VerifiedIcon />
              <span className="text-[10px] font-bold text-[#1de9b6] uppercase tracking-wider">Verified</span>
            </div>
          )}
        </div>

        {/* Quote */}
        <div className="mb-6">
          <QuoteIcon />
          <p className="text-gray-300 text-sm leading-relaxed mt-3 italic line-clamp-4">
            "{testimonial.content}"
          </p>
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
          {testimonial.avatar ? (
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-10 h-10 rounded-full object-cover border border-[#1de9b6]/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#1de9b6]/10 border border-[#1de9b6]/30 flex items-center justify-center">
              <span className="text-[#1de9b6] font-bold text-sm">
                {testimonial.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h4 className="text-white font-semibold text-sm">{testimonial.name}</h4>
            <p className="text-gray-500 text-xs">
              {testimonial.role} at {testimonial.company}
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
      className={`w-full py-20 px-6 md:px-12 lg:px-20 bg-[#0a0f0d] relative overflow-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1de9b6]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1de9b6]/3 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className={`text-2xl md:text-3xl font-bold text-[#1de9b6] font-playfair uppercase tracking-widest transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Testimonials
          </h2>
        </div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#1de9b6]/30 border-t-[#1de9b6] rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Failed to load testimonials</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTestimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={testimonial._id || index} 
                testimonial={testimonial} 
                index={index}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Testimonials;
