import React, { useEffect, useState, useRef } from "react";
import Button from "../common/Button";
import { useProfile } from "../../hooks";
import { useTheme } from "../../contexts/ThemeContext";

// Hook for scroll-triggered animations
const useScrollAnimation = (threshold = 0.1) => {
	const ref = useRef(null);
	const [isVisible, setIsVisible] = useState(false);
    const { isDark } = useTheme();

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

// Scramble Text Effect Component - Continuous loop
const ScrambleText = ({ text = "", isVisible, className, delay = 0, intervalDelay = 3000 }) => {
	const [displayText, setDisplayText] = useState(text);
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

	useEffect(() => {
		if (!isVisible || !text) return;

		const scrambleOnce = () => {
			let iteration = 0;
			const finalText = text;
			const totalIterations = finalText.length * 3;

			const interval = setInterval(() => {
				setDisplayText(
					finalText
						.split('')
						.map((char, index) => {
							if (char === ' ' || char === '+' || char === '%' || char === '.') return char;
							if (iteration > index * 3) return char;
							return chars[Math.floor(Math.random() * chars.length)];
						})
						.join('')
				);

				iteration += 1;

				if (iteration > totalIterations) {
					clearInterval(interval);
					setDisplayText(finalText);
				}
			}, 30);
		};

		// Initial scramble after delay
		const initialTimer = setTimeout(() => {
			scrambleOnce();

			// Loop every intervalDelay milliseconds
			const loopInterval = setInterval(() => {
				scrambleOnce();
			}, intervalDelay);

			return () => clearInterval(loopInterval);
		}, delay);

		return () => clearTimeout(initialTimer);
	}, [isVisible, text, delay, intervalDelay]);

	return <span className={className}>{displayText}</span>;
};

// Text breakaway/join animation component
const BreakawayText = ({ text = "", className, delay = 0, style = {} }) => {
	const [isVisible, setIsVisible] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		const timer = setTimeout(() => setIsVisible(true), delay);
		return () => clearTimeout(timer);
	}, [delay]);

	// Generate random direction for each letter
	const getRandomDirection = (index) => {
		const directions = [
			{ x: -100, y: -100, rotate: -45 }, // top-left
			{ x: 100, y: -100, rotate: 45 },   // top-right
			{ x: -100, y: 100, rotate: -45 },  // bottom-left
			{ x: 100, y: 100, rotate: 45 },    // bottom-right
			{ x: -150, y: 0, rotate: -30 },     // left
			{ x: 150, y: 0, rotate: 30 },       // right
			{ x: 0, y: -150, rotate: 0 },       // top
			{ x: 0, y: 150, rotate: 0 },         // bottom
		];
		return directions[index % directions.length];
	};

	return (
		<span ref={ref} className="inline-flex flex-wrap" style={style}>
			{text.split('').map((char, index) => {
				const dir = getRandomDirection(index);
				const isSpace = char === ' ';

				return (
					<span
						key={index}
						className={`inline-block transition-all duration-1000 ease-out ${className}`}
						style={{
							transform: isVisible
								? 'translate(0, 0) rotate(0deg)'
								: `translate(${dir.x}px, ${dir.y}px) rotate(${dir.rotate}deg)`,
							opacity: isVisible ? 1 : 0,
							transitionDelay: `${index * 80}ms`,
							marginRight: isSpace ? '0.3em' : '0',
						}}
					>
						{isSpace ? '\u00A0' : char}
					</span>
				);
			})}
		</span>
	);
};

const Hero = () => {
	const { profile } = useProfile();
	const [displayText, setDisplayText] = useState("");
	const [subtitleText, setSubtitleText] = useState("Full-Stack Developer & AI Automation Engineer");
	const [isLoaded, setIsLoaded] = useState(false);
	const timeoutRef = useRef(null);
	const currentRef = useRef(0);
	const isDeletingRef = useRef(false);
	const { isDark } = useTheme();

	// Trigger load animation after mount
	useEffect(() => {
		const timer = setTimeout(() => setIsLoaded(true), 100);
		return () => clearTimeout(timer);
	}, []);

	// Set subtitle once when profile loads, don't change after
	useEffect(() => {
		if (profile?.subtitle) {
			setSubtitleText(profile.subtitle);
		}
	}, [profile?.subtitle]);

	useEffect(() => {
		// Reset animation when subtitle changes
		currentRef.current = 0;
		isDeletingRef.current = false;
		setDisplayText("");

		const animate = () => {
			if (!isDeletingRef.current) {
				setDisplayText(subtitleText.slice(0, currentRef.current + 1));
				currentRef.current++;
				if (currentRef.current === subtitleText.length) {
					timeoutRef.current = setTimeout(() => {
						isDeletingRef.current = true;
						animate();
					}, 2000);
					return;
				}
				timeoutRef.current = setTimeout(animate, 40);
			} else {
				setDisplayText(subtitleText.slice(0, currentRef.current - 1));
				currentRef.current--;
				if (currentRef.current === 0) {
					isDeletingRef.current = false;
				}
				timeoutRef.current = setTimeout(animate, 20);
			}
		};

		timeoutRef.current = setTimeout(animate, 500);
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [subtitleText]);

	// Default values for when profile is loading or not available
	const defaultProfile = {
		name: "Developer",
		subtitle: "Full-Stack Developer & AI Automation Engineer",
		title: "Building innovative web solutions with modern technologies",
		statusBadge: "SYSTEM STATUS: ACTIVE",
		stats: [
			{ value: "2+", label: "Years Experience" },
			{ value: "10+", label: "Projects Completed" },
			{ value: "5+", label: "Technologies" }
		]
	};

	const displayProfile = profile || defaultProfile;

	// Animation refs for scroll-triggered elements
	const [headerRef, headerVisible] = useScrollAnimation();
	const [subtitleRef, subtitleVisible] = useScrollAnimation();
	const [descRef, descVisible] = useScrollAnimation();
	const [buttonsRef, buttonsVisible] = useScrollAnimation();
	const [statsRef, statsVisible] = useScrollAnimation();

	return (
		<section
			id="home"
			className={`min-h-screen flex items-center justify-center pt-8 relative overflow-hidden scroll-mt-20 transition-colors duration-500 ${isDark ? 'bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-primary' : 'bg-gradient-to-br from-white via-gray-50 to-white'}`}
		>
			<div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-16 md:gap-40 items-center w-full relative z-10">
				{/* Content */}
				<div className={`order-2 md:order-1 w-full min-w-0 transition-all duration-1000 ease-out transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
					{/* Status Badge - Slide up */}
					<div
						ref={headerRef}
						className={`mb-8 transform transition-all duration-700 ease-out ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
							}`}
					>
						<span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[#1de9b6] text-sm font-medium tracking-widest border backdrop-blur-sm transition-all duration-500 ${isDark ? 'bg-[#1de9b6]/10 border-[#1de9b6]/30' : 'bg-[#1de9b6]/5 border-[#1de9b6]/20'}`}>
							<span className="w-1.5 h-1.5 rounded-full bg-[#1de9b6] animate-pulse"></span>
							{displayProfile.statusBadge || "SYSTEM STATUS: ACTIVE"}
						</span>
					</div>

					{/* Main Heading - Dramatic breakaway/join animation */}
					<h1
						ref={headerRef}
						className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-2 tracking-tight leading-tight transition-colors duration-500 ${headerVisible ? 'opacity-100' : 'opacity-0'} ${isDark ? 'text-white' : 'text-gray-900'}`}
						style={{ fontFamily: "'Space Grotesk', sans-serif" }}
					>
						<BreakawayText text="Hello, I'm" delay={headerVisible ? 100 : 0} style={{ fontFamily: "'Outfit', sans-serif" }} />
						<br />
						<BreakawayText 
							text={displayProfile?.name || "Developer"} 
							delay={headerVisible ? 800 : 0} 
							className="text-[#1de9b6] font-extrabold"
							style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}
						/>
					</h1>

					{/* Animated Subtitle - Slide up with delay */}
					<div
						ref={subtitleRef}
						className={`h-10 md:h-12 mb-2 w-full transform transition-all duration-700 ease-out delay-200 ${subtitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
							}`}
					>
						<h2 className={`text-xl md:text-2xl lg:text-3xl font-semibold flex items-center whitespace-nowrap tracking-wide transition-colors duration-500 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
							style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '0.05em' }}
						>
							<span className="text-[#1de9b6] whitespace-nowrap">{displayText}</span>
							<span className="animate-pulse text-[#1de9b6]">|</span>
						</h2>
					</div>

					{/* Description - Slide up with delay */}
					<p
						ref={descRef}
						className={`text-base md:text-lg max-w-xl mb-10 font-outfit transform transition-all duration-700 ease-out delay-400 leading-relaxed transition-colors duration-500 ${isDark ? 'text-gray-400' : 'text-gray-500'} ${descVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
							}`}
					>
						{displayProfile?.title || "Building innovative web solutions with modern technologies."}
					</p>
					{/* Buttons - Slide up with delay */}
					<div
						ref={buttonsRef}
						className={`flex flex-wrap gap-3 transform transition-all duration-700 ease-out delay-400 ${buttonsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
							}`}
					>
						<button
							onClick={() => {
								const element = document.getElementById("projects");
								if (element) element.scrollIntoView({ behavior: "smooth" });
							}}
							className={`group relative px-4 py-2 text-[#0a1a14] text-sm font-bold rounded-xl transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0.5 ${isDark ? 'bg-[#1de9b6] shadow-[3px_3px_6px_rgba(0,0,0,0.3),-3px_-3px_6px_rgba(255,255,255,0.1)] hover:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.15),0_0_20px_rgba(29,233,182,0.4)]' : 'bg-[#1de9b6] shadow-[3px_3px_6px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_8px_rgba(0,0,0,0.15)]'}`}
						>
							View Capabilities
						</button>
						<button
							onClick={() => {
								const element = document.getElementById("contact");
								if (element) element.scrollIntoView({ behavior: "smooth" });
							}}
							className={`group relative px-4 py-2 text-sm font-bold rounded-xl border transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0.5 ${isDark ? 'bg-[#0a1a14] text-[#1de9b6] border-[#1de9b6]/30 shadow-[3px_3px_6px_rgba(0,0,0,0.3),-3px_-3px_6px_rgba(255,255,255,0.05)] hover:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(255,255,255,0.08),0_0_20px_rgba(29,233,182,0.3)] hover:border-[#1de9b6]/60' : 'bg-white text-[#1de9b6] border-[#1de9b6]/30 shadow-[3px_3px_6px_rgba(0,0,0,0.05)] hover:shadow-[4px_4px_8px_rgba(0,0,0,0.1)]'}`}
						>
							Contact Me
						</button>
					</div>
					{/* Stats - Staggered slide-up animation with scramble effect */}
					<div
						ref={statsRef}
						className={`flex gap-6 md:gap-8 mt-12 pt-8 border-t transition-colors duration-500 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}
					>
						{[
							{ value: "100%", label: "CLIENT SATISFACTION" },
							{ value: "50+", label: "PROJECTS DELIVERED" },
							{ value: "4+", label: "YEARS EXPERIENCE" }
						].map((stat, index) => (
							<div
								key={index}
								className={`text-center flex-1 transform transition-all duration-700 ease-out ${statsVisible
									? 'opacity-100 translate-y-0'
									: 'opacity-0 translate-y-12'
									}`}
								style={{ transitionDelay: `${500 + index * 150}ms` }}
							>
								<div className="text-2xl md:text-3xl font-bold text-[#1de9b6] font-display hover:scale-110 transition-transform duration-300 cursor-default">
									<ScrambleText
										text={stat.value}
										isVisible={statsVisible}
										delay={500 + index * 150}
									/>
								</div>
								<div className={`text-xs md:text-sm uppercase tracking-wider mt-2 transition-colors duration-500 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
									<ScrambleText
										text={stat.label}
										isVisible={statsVisible}
										delay={800 + index * 150}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Profile Image - Clean Circle with Floating Badges */}
				<div className={`order-1 md:order-2 flex justify-center w-full transition-all duration-1000 delay-300 ease-out transform md:translate-x-12 ${isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}>
					<div className="relative w-72 h-72 md:w-96 md:h-96">

						{/* Subtle Concentric Background Rings */}
						<div className="absolute inset-[-20%] rounded-full border border-[#1de9b6]/10"></div>
						<div className="absolute inset-[-35%] rounded-full border border-[#1de9b6]/5"></div>
						<div className="absolute inset-[-50%] rounded-full border border-[#1de9b6]/[0.03]"></div>

						{/* Main Profile Circle */}
						<div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#1de9b6]/30 shadow-[0_0_60px_rgba(29,233,182,0.15)] bg-[#0a1a14]">
							{displayProfile.avatar || displayProfile.image ? (
								<img
									src={displayProfile.avatar || displayProfile.image}
									alt={displayProfile.name}
									className="w-full h-full object-cover"
									onError={(e) => {
										e.target.src = "https://api.dicebear.com/7.x/adventurer/svg?seed=default";
									}}
								/>
							) : (
								<div className="w-full h-full bg-[#0a1a14] flex items-center justify-center text-gray-500 font-display text-5xl">
									{displayProfile.name?.charAt(0) || 'D'}
								</div>
							)}
							{/* Bottom fade to blend into background */}
							<div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#101413] to-transparent pointer-events-none"></div>
						</div>

						{/* Floating Badge: Top Right - Skilled */}
						<div className="absolute -top-4 right-0 md:-right-6 z-20 animate-float">
							<div className="bg-[#13241c]/90 backdrop-blur-lg border border-[#1de9b6]/20 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-lg">
								<div className="w-8 h-8 rounded-lg bg-[#1de9b6]/20 flex items-center justify-center">
									<span className="text-[#1de9b6] text-sm">🧠</span>
								</div>
								<div>
									<p className="text-[#1de9b6] text-[10px] font-semibold tracking-wide">Status</p>
									<p className="text-white text-xs font-bold">Skilled</p>
								</div>
							</div>
						</div>

						{/* Floating Badge: Middle Left - Professional */}
						<div className="absolute top-1/3 -left-6 md:-left-16 z-20 animate-float-delayed">
							<div className="bg-[#13241c]/90 backdrop-blur-lg border border-[#1de9b6]/20 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-lg">
								<div className="w-8 h-8 rounded-lg bg-[#1de9b6]/20 flex items-center justify-center">
									<span className="text-[#1de9b6] text-sm">💼</span>
								</div>
								<div>
									<p className="text-[#1de9b6] text-[10px] font-semibold tracking-wide">Skillset</p>
									<p className="text-white text-xs font-bold">Professional</p>
								</div>
							</div>
						</div>

						{/* Floating Badge: Bottom Center - Top Rated */}
						<div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 animate-float">
							<div className="bg-[#13241c]/90 backdrop-blur-lg border border-[#1de9b6]/20 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-lg">
								<div className="w-8 h-8 rounded-lg bg-[#1de9b6]/20 flex items-center justify-center">
									<span className="text-[#1de9b6] text-sm">🚀</span>
								</div>
								<div>
									<p className="text-[#1de9b6] text-[10px] font-semibold tracking-wide">Aspiration</p>
									<p className="text-white text-xs font-bold">Top Rated</p>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
