import React, { useRef, useState, useEffect } from "react";
import { useSkills, useProfile, useTheme } from "../../hooks";

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

	// Touch event support for mobile
	const handleTouchMove = (e) => {
		const el = ref.current;
		if (!el) return;
		const touch = e.touches[0];
		const rect = el.getBoundingClientRect();
		const x = touch.clientX - rect.left;
		const y = touch.clientY - rect.top;
		const cx = rect.width / 2;
		const cy = rect.height / 2;
		const px = (x - cx) / cx;
		const py = (y - cy) / cy;
		setStyle({
			transform: `perspective(800px) rotateX(${-py * 6}deg) rotateY(${px * 6}deg) scale(1.02)`,
			transition: "transform 0.1s ease-out",
		});
	};

	const handleTouchEnd = () => {
		setStyle({ transform: "none", transition: "transform 500ms" });
	};

	return (
		<div
			ref={ref}
			style={style}
			onMouseMove={handleMove}
			onMouseLeave={handleLeave}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			className={className}
		>
			{children}
		</div>
	);
}

const getIconForCategory = (category) => {
	const iconMap = {
		"Frontend Development": "📦",
		"Backend Development": "🗄️",
		"AI Automation": "🤖",
		"AI": "🤖",
		"Mobile App Dev": "📱",
		"Mobile": "📱",
		"UI/UX Design": "🎨",
		"Design": "🎨",
		"Tools & Deployment": "🛠️",
		"DevOps": "☁️",
		"Database": "🗄️",
		"Cloud": "☁️",
		"Security": "🔒",
		"Data": "📊",
		"Web": "🌐",
		"Scripting": "⌨️",
		"Automation": "⚡",
		"General": "💻",
		"Other": "⚙️",
		"frontend": "📦",
		"backend": "🗄️",
		"database": "🗄️",
		"devops": "☁️",
		"other": "⚙️",
	};
	// Check for partial matches
	for (const [key, icon] of Object.entries(iconMap)) {
		if (category?.toLowerCase().includes(key.toLowerCase())) {
			return icon;
		}
	}
	return "⚙️";
};

const Skills = () => {
	const { skills: apiSkills, loading, error } = useSkills();
	const { profile } = useProfile();
	const [sectionRef, isVisible] = useFadeIn();

	// Group skills by category
	const skillsByCategory = apiSkills.reduce((acc, skill) => {
		if (!acc[skill.category]) acc[skill.category] = [];
		acc[skill.category].push(skill);
		return acc;
	}, {});

	// Transform API skills - calculate average proficiency
	// If proficiency field is set, use it; otherwise convert level (1-5) to percentage (20-100%)
	let skillData = Object.entries(skillsByCategory).map(([category, skills]) => ({
		title: category,
		percent: Math.round(skills.reduce((sum, s) => sum + (s.proficiency || (s.level * 20)), 0) / skills.length),
		tags: skills.map(s => s.name),
		icon: getIconForCategory(category),
	}));

	// Apply custom order from profile if available
	if (profile?.skillCategoryOrder && profile.skillCategoryOrder.length > 0) {
		const orderedData = [];
		const remainingData = [...skillData];

		// Add categories in saved order
		profile.skillCategoryOrder.forEach(title => {
			const index = remainingData.findIndex(cat => cat.title === title);
			if (index !== -1) {
				orderedData.push(remainingData[index]);
				remainingData.splice(index, 1);
			}
		});

		// Add any remaining categories not in saved order
		orderedData.push(...remainingData);
		skillData = orderedData;
	}

	return (
		<section
			id="skills"
			ref={sectionRef}
			className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-1000 ease-out scroll-mt-20 bg-bg-primary ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
		>
			<div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 w-full py-6 md:py-8">
				{/* Header */}
				<div className="mb-8 text-center">
					<h2 className="text-2xl md:text-3xl font-bold font-playfair uppercase tracking-widest transition-colors duration-300 text-accent">
						Core Expertise
					</h2>
				</div>

				{loading && (
					<div className="flex flex-col items-center justify-center py-12">
						<div className="w-12 h-12 border-4 border-t-accent rounded-full animate-spin mb-4 border-border-theme" />
						<div className="text-sm transition-colors duration-300 text-theme-secondary">Synchronizing skill matrix...</div>
					</div>
				)}

				{error && (
					<div className="text-center py-8 text-red-400 text-sm font-bold">
						Synchronization failed. Please check connection.
					</div>
				)}

				{!loading && !error && apiSkills.length === 0 && (
					<div className="text-center py-12">
						<div className="text-xl mb-2 transition-colors duration-300 text-accent">Matrix Empty</div>
						<div className="text-sm transition-colors duration-300 text-theme-muted">Skills categorized in the admin panel will appear here.</div>
					</div>
				)}

				{!loading && !error && apiSkills.length > 0 && (
					<div className="flex flex-col gap-3 md:gap-4">
						{/* Skills Grid - Auto responsive */}
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
							{skillData.map((cat) => (
								<Card3D key={cat.title} className="h-full">
									<SkillCard {...cat} />
								</Card3D>
							))}
						</div>

						{/* Current Focus Section */}
						<Card3D className="w-full">
							<FocusCard focusStats={profile?.focusStats} />
						</Card3D>
					</div>
				)}
			</div>
		</section>
	);
};

function SkillCard({ title, percent, tags, icon }) {
	const ref = useRef(null);
	const [style, setStyle] = useState({});
	const [isHovered, setIsHovered] = useState(false);

	const onMove = (e) => {
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
			transition: "transform 0ms" 
		});
	};

	const onLeave = () => setStyle({ transform: "none", transition: "transform 500ms cubic-bezier(.2,.8,.2,1)" });

	return (
		<div
			ref={ref}
			style={style}
			onMouseMove={onMove}
			onMouseLeave={() => { onLeave(); setIsHovered(false); }}
			onMouseEnter={() => setIsHovered(true)}
			className={`rounded-xl p-3.5 flex flex-col border transition-all duration-300 bg-bg-card border-border-theme ${
				isHovered ? 'shadow-soft' : 'shadow-sm'
			}`}
		>
			{/* Header with Icon and Title */}
			<div className="flex items-start justify-between mb-2">
				<div className="flex items-center gap-2.5">
					<span className="text-xl transition-colors duration-300 text-accent">{icon}</span>
					<h3 className="font-black text-base tracking-tight transition-colors duration-300 text-theme-primary uppercase">{title}</h3>
				</div>
				<span className="font-bold text-base transition-colors duration-300 text-accent">{percent}%</span>
			</div>

			{/* Progress Bar */}
			<div className="w-full h-1 rounded-full mb-3 overflow-hidden transition-colors duration-300 bg-bg-secondary">
				<div
					className="h-full bg-gradient-to-r from-accent to-[#00b894] rounded-full transition-all duration-1000"
					style={{ width: percent + "%" }}
				/>
			</div>

			{/* Tags */}
			<div className="flex flex-wrap gap-1.5 mt-auto">
				{tags.map((tag) => (
					<span
						key={tag}
						className="px-3 py-1 rounded-lg text-[11px] font-black capitalize tracking-wider transition-all duration-300 bg-gradient-to-br from-[#1de9b6]/20 via-[#0a1a14]/95 to-[#0a1a14] text-[#1de9b6] border border-[#1de9b6]/40 shadow-sm cursor-default hover:scale-110 hover:shadow-[0_0_15px_rgba(29,233,182,0.4)] hover:-translate-y-0.5 active:scale-95"
					>
						{tag}
					</span>
				))}
			</div>
		</div>
	);
}

function FocusCard({ focusStats }) {
	const ref = useRef(null);
	const [style, setStyle] = useState({});
	const [isHovered, setIsHovered] = useState(false);

	const stats = focusStats || {
		subtitle: 'CURRENT FOCUS',
		title: 'Neural Interface Design',
		description: 'Pioneering the intersection of LLM reasoning and intuitive human interfaces. Currently researching autonomous agent orchestration within the browser environment.',
		stats: [
			{ value: '0.4ms', label: 'LATENCY' },
			{ value: '99.9%', label: 'PRECISION' }
		]
	};

	const onMove = (e) => {
		const el = ref.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const px = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
		const py = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
		setStyle({ transform: `perspective(800px) rotateX(${-py * 3}deg) rotateY(${px * 3}deg) scale(1.005)`, transition: "transform 0ms" });
	};

	const onLeave = () => setStyle({ transform: "none", transition: "transform 500ms" });

	return (
		<div
			ref={ref}
			style={style}
			onMouseMove={onMove}
			onMouseLeave={() => { onLeave(); setIsHovered(false); }}
			onMouseEnter={() => setIsHovered(true)}
			className={`mt-4 grid md:grid-cols-2 rounded-2xl overflow-hidden border transition-all duration-300 bg-bg-card border-border-theme ${isHovered ? 'shadow-soft' : ''}`}
		>
			<div className="p-6 md:p-8 flex flex-col justify-center">
				<div className="inline-flex items-center gap-2 mb-2">
					<span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
					<span className="text-[12px] font-bold text-accent tracking-widest uppercase">{stats.subtitle}</span>
				</div>
				<h3 className="text-2xl md:text-3xl font-bold text-theme-primary mb-3 leading-tight">{stats.title}</h3>
				<p className="text-slate-300 font-medium text-sm mb-6 leading-relaxed">{stats.description}</p>
				<div className="flex gap-8">
					{stats.stats?.map((stat, i) => (
						<div key={i}>
							<span className="block text-accent text-2xl font-bold">{stat.value}</span>
							<span className="text-theme-muted text-[10px] tracking-widest font-bold uppercase">{stat.label}</span>
						</div>
					))}
				</div>
			</div>

			<div className="bg-bg-secondary min-h-[220px] flex items-center justify-center relative overflow-hidden">
				{stats.image ? (
					<img src={stats.image} alt="Focus" className="absolute inset-0 w-full h-full object-cover" />
				) : (
					<>
						<div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-bg-secondary" />
						<div className="relative z-10">
							<div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent/20 to-bg-secondary flex items-center justify-center border border-accent/20 shadow-soft">
								<svg className="w-12 h-12 text-accent/40" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
								</svg>
							</div>
						</div>
					</>
				)}
				{/* Subtle Overlay to ensure text legibility if needed, though this is a separate col */}
				<div className="absolute inset-0 bg-gradient-to-l from-transparent to-bg-secondary/40 md:hidden" />
			</div>
		</div>
	);
}

export default Skills;