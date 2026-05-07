import React, { useRef, useState, useEffect } from "react";
import { useExperiences, useTheme } from "../../hooks";

const API_URL = import.meta.env.VITE_API_URL;

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

const Experience = () => {
	const { experiences, loading: expLoading, error: expError } = useExperiences();
	const [activeTab, setActiveTab] = useState('experience');
	const [educations, setEducations] = useState([]);
	const [eduLoading, setEduLoading] = useState(true);
	const [eduError, setEduError] = useState(null);
	const [sectionRef, isVisible] = useFadeIn();

	// Fetch education data from API
	useEffect(() => {
		const fetchEducations = async () => {
			try {
				setEduLoading(true);
				const response = await fetch(`${API_URL}/api/education`);
				const data = await response.json();
				if (data.success) {
					setEducations(data.data || []);
				}
			} catch (err) {
				console.error('Failed to fetch educations:', err);
				setEduError('Failed to load education data');
			} finally {
				setEduLoading(false);
			}
		};
		fetchEducations();
	}, []);

	// Sample experiences if none from API
	const defaultExperiences = [
		{
			_id: "1",
			role: "Senior AI Engineer",
			company: "NeuralLink",
			location: "San Francisco, CA",
			startDate: "2021",
			endDate: "PRESENT",
			duration: "3 YEARS ACTIVE",
			description: "Leading development of predictive models and real-time visualization dashboards. Architecting neural architectures that bridge complex data processing with intuitive user interfaces for high-stakes decision making.",
			tags: ["PyTorch", "Next.js", "D3.js", "AWS SageMaker"],
			icon: "⚛",
			isCurrent: true
		},
		{
			_id: "2",
			role: "Full-Stack Developer",
			company: "Quantize",
			location: "Remote",
			startDate: "2018",
			endDate: "2021",
			duration: "3 YEARS DURATION",
			description: "Rebuilding core mobile applications, increasing user retention by 45%. Specialized in scaling GraphQL APIs and optimizing React Native performance for a global fintech user base.",
			tags: ["React Native", "GraphQL", "Node.js"],
			icon: "{}",
			isCurrent: false
		},
		{
			_id: "3",
			role: "UI Designer",
			company: "PixelPath",
			location: "New York, NY",
			startDate: "2016",
			endDate: "2018",
			duration: "2 YEARS DURATION",
			description: "Establishing design systems for 20+ startups with a focus on dark-themed environments. Crafted intricate UI components that balance high information density with elegant, high-contrast aesthetics.",
			tags: ["Figma", "Design Systems", "Motion Design"],
			icon: "◉",
			isCurrent: false
		}
	];

	const displayExperiences = experiences?.length > 0 ? experiences : defaultExperiences;
	const displayEducations = educations?.length > 0 ? educations : [];
	const displayData = activeTab === 'experience' ? displayExperiences : displayEducations;
	const loading = activeTab === 'experience' ? expLoading : eduLoading;

	return (
		<section
			id="experience"
			ref={sectionRef}
			className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-1000 ease-out scroll-mt-20 bg-bg-primary ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
		>
			<div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 w-full py-6 md:py-4">
				{/* Header */}
				<div className="mb-4 text-center">
					<h2 className="text-xl md:text-2xl font-bold font-playfair mb-3 uppercase tracking-widest transition-colors duration-300 text-accent">
						{activeTab === 'experience' ? 'Career Journey' : 'Educational Background'}
					</h2>

					{/* Tab Toggle */}
					<div className="flex justify-center gap-3">
						<button
							onClick={() => setActiveTab('experience')}
							className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'experience'
								? 'bg-accent text-dark-primary shadow-soft'
								: 'bg-bg-secondary text-accent border border-border-theme hover:bg-bg-accent'
								}`}
						>
							EXPERIENCE
						</button>
						<button
							onClick={() => setActiveTab('education')}
							className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'education'
								? 'bg-accent text-dark-primary shadow-soft'
								: 'bg-bg-secondary text-accent border border-border-theme hover:bg-bg-accent'
								}`}
						>
							EDUCATION
						</button>
					</div>
				</div>

				{/* Cards List with Timeline */}
				<div className="relative">
					{/* Vertical Timeline Line */}
					<div className={`absolute left-8 md:left-10 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent/50 to-transparent`}></div>
					
					<div className="space-y-4 relative">
						{displayData.map((item, index) => (
							<div key={item._id || index} className="relative pl-16 md:pl-20">
								{/* Timeline Node */}
								<div className={`absolute left-6 md:left-8 top-8 w-4 h-4 rounded-full border-4 shadow-soft z-10 transition-colors duration-300 bg-accent border-bg-primary`}></div>
								<ExperienceItem exp={item} index={index} />
							</div>
						))}
					</div>
				</div>

			</div>
		</section>
	);
};

const ExperienceItem = ({ exp, index }) => {
	const [isHovered, setIsHovered] = useState(false);
	const cardRef = useRef(null);
	const [cardStyle, setCardStyle] = useState({});
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

	const handleMove = (e) => {
		const el = cardRef.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const cx = rect.width / 2;
		const cy = rect.height / 2;
		const px = (x - cx) / cx;
		const py = (y - cy) / cy;
		setMousePos({ x, y });
		setCardStyle({
			transform: `perspective(1000px) rotateX(${-py * 8}deg) rotateY(${px * 8}deg) scale(1.02)`,
			transition: "transform 0.15s ease-out"
		});
	};

	const handleLeave = () => {
		setCardStyle({
			transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
			transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
		});
		setIsHovered(false);
	};

	const calculateDuration = (start, end) => {
		if (!start || !end) return "";
		const startStr = String(start);
		const endStr = String(end).toUpperCase();

		// Extract 4 digit years
		const startMatch = startStr.match(/\d{4}/);
		const startYear = startMatch ? parseInt(startMatch[0], 10) : NaN;

		let endYear = NaN;
		if (endStr.includes('PRESENT') || endStr.includes('CURRENT') || endStr.includes('NOW')) {
			endYear = new Date().getFullYear();
		} else {
			const endMatch = endStr.match(/\d{4}/);
			if (endMatch) endYear = parseInt(endMatch[0], 10);
		}

		if (!isNaN(startYear) && !isNaN(endYear)) {
			const diff = endYear - startYear;
			if (diff === 0) return "1 YR OR LESS";
			if (diff === 1) return "1 YEAR";
			return `${diff} YEARS`;
		}
		return "";
	};

	return (
		<div className="w-full" style={{ perspective: "1000px" }}>
			<div
				ref={cardRef}
				style={{
					...cardStyle,
					background: isHovered
						? `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(29,233,182,0.15) 0%, transparent 50%), linear-gradient(135deg, #0d1411 0%, #0a1a14 100%)`
						: 'linear-gradient(135deg, #0d1411 0%, #0a1a14 100%)'
				}}
				onMouseMove={handleMove}
				onMouseLeave={handleLeave}
				onMouseEnter={() => setIsHovered(true)}
				className={`relative rounded-xl p-5 md:p-6 transition-all duration-500 w-full cursor-pointer overflow-hidden ${isHovered
					? 'shadow-[0_0_30px_rgba(29,233,182,0.15)]'
					: ''
					}`}
			>
				{/* Decorative corner accent */}
				<div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
				
				<div className="flex flex-col md:flex-row justify-between items-start gap-4 relative z-10">
					<div className="flex gap-5 md:gap-6 items-start flex-1 w-full">
						{/* Logo with enhanced styling - Smaller */}
						{exp.logo ? (
							<div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border shadow-md transition-colors duration-300 border-border-theme bg-bg-secondary">
								<img src={exp.logo} alt={exp.company} className="w-full h-full object-contain p-1.5" />
							</div>
						) : (
							<div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0 border shadow-md transition-colors duration-300 border-border-theme bg-bg-secondary/50">
								<span className="text-xl md:text-2xl transition-colors duration-300 text-accent">{exp.icon || '💼'}</span>
							</div>
						)}

						{/* Content */}
						<div className="flex-1 w-full pt-1">
							<div className="flex flex-wrap items-center gap-3 mb-2">
								<h3 className="font-bold text-lg md:text-xl tracking-tight transition-colors duration-300 text-theme-primary" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{exp.role}</h3>
								{exp.isCurrent && (
									<span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border transition-colors duration-300 bg-accent/10 text-accent border-accent/20">
										Current
									</span>
								)}
							</div>

							<div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
								<p className="text-base font-bold tracking-wide transition-colors duration-300 text-accent" style={{ fontFamily: "'Outfit', sans-serif" }}>
									{exp.company}
								</p>
								{exp.location && (
									<div className="flex items-center gap-1.5 text-sm transition-colors duration-300 text-theme-secondary" style={{ fontFamily: "'Outfit', sans-serif" }}>
										<svg className="w-4 h-4 transition-colors duration-300 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
										</svg>
										{exp.location}
									</div>
								)}
							</div>

							<p className="text-base leading-relaxed max-w-4xl mb-4 transition-colors duration-300 text-slate-300 font-medium" style={{ fontFamily: "'Outfit', sans-serif" }}>
								{exp.description}
							</p>

							{/* Tags with enhanced styling */}
							{exp.tags && exp.tags.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{exp.tags.map((tag, i) => (
										<Tag key={i} tag={tag} />
									))}
								</div>
							)}
						</div>
					</div>

					{/* Date Badge - Enhanced */}
					<div className="flex flex-col items-start md:items-end gap-3 self-start w-full md:w-auto mt-2 md:mt-0">
						<div className="flex items-center gap-2 border rounded-xl px-4 py-2 whitespace-nowrap shadow-lg transition-colors duration-300 bg-bg-card border-border-theme">
							<svg className="w-4 h-4 transition-colors duration-300 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<span className="text-xs font-black tracking-widest uppercase transition-colors duration-300 text-accent">
								{exp.startDate} — {exp.endDate}
							</span>
						</div>
						
						{exp.startDate && exp.endDate && (
							<span className="text-[10px] font-bold tracking-[0.2em] px-3 py-1 rounded-lg transition-colors duration-300 bg-bg-secondary text-theme-muted">
								{calculateDuration(exp.startDate, exp.endDate)}
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

const Tag = ({ tag }) => {
	return (
		<span className="px-3 py-1 rounded-lg text-[11px] font-black capitalize tracking-wider transition-all duration-300 bg-gradient-to-br from-[#1de9b6]/20 via-[#0a1a14]/95 to-[#0a1a14] text-[#1de9b6] border border-[#1de9b6]/40 shadow-sm cursor-default hover:scale-110 hover:shadow-[0_0_15px_rgba(29,233,182,0.4)] hover:-translate-y-0.5 active:scale-95">
			{tag}
		</span>
	);
};

export default Experience;
