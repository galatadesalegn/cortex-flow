import React, { useEffect, useState, useRef } from "react";
import Button from "../common/Button";
import { useProfile } from "../../hooks";
import { useTheme } from "../../contexts/ThemeContext";
import { fixImageUrl } from "../../utils/imageHelper.js";

// Hook for scroll-triggered animations
const useScrollAnimation = (threshold = 0.1) => {
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
		name: "Fu",
		subtitle: "Full-Stack Developer & AI Engineer",
		bio: "I’m a full-stack developer focused on building modern web and mobile applications with clean design, strong performance, and real-world impact. I have a growing passion for artificial intelligence and enjoy integrating smart features into applications to create more efficient and user-friendly digital experiences.",
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
			className="min-h-screen flex items-center justify-center pt-8 relative overflow-hidden scroll-mt-20 bg-bg-primary transition-colors duration-500"
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
						<span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-accent text-xs font-black tracking-widest border border-[#1de9b6]/60 bg-gradient-to-br from-[#1de9b6]/30 via-[#0a1a14]/95 to-[#0a1a14] shadow-[0_0_20px_rgba(29,233,182,0.2)] backdrop-blur-md transition-all duration-500">
							<span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
							{displayProfile.statusBadge || "SYSTEM STATUS: ACTIVE"}
						</span>
					</div>

					{/* Main Heading - Dramatic breakaway/join animation */}
					<h1
						ref={headerRef}
						className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-2 tracking-tight leading-tight transition-colors duration-500 ${headerVisible ? 'opacity-100' : 'opacity-0'} text-theme-primary`}
						style={{ fontFamily: "'Space Grotesk', sans-serif" }}
					>
						<BreakawayText text="Hello, I'm" delay={headerVisible ? 100 : 0} style={{ fontFamily: "'Outfit', sans-serif" }} />
						<br />
						<BreakawayText 
							text={displayProfile?.name || "Developer"} 
							delay={headerVisible ? 800 : 0} 
							className="text-accent font-extrabold"
							style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}
						/>
					</h1>

					{/* Animated Subtitle - Slide up with delay */}
					<div
						ref={subtitleRef}
						className={`mb-6 w-full transform transition-all duration-700 ease-out delay-200 ${subtitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
							}`}
					>
						<h2 className="text-xl md:text-2xl lg:text-3xl font-semibold flex items-center whitespace-nowrap tracking-wide transition-colors duration-500 text-theme-secondary"
							style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '0.05em' }}
						>
							<span className="text-accent mr-2">{displayText}</span>
							<span className="animate-pulse text-accent">|</span>
						</h2>
					</div>

					{/* Description - Slide up with delay */}
					<p
						ref={descRef}
						className={`text-base md:text-lg max-w-2xl mb-10 font-outfit transform transition-all duration-700 ease-out delay-400 leading-relaxed ${descVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
							} text-slate-300 font-medium transition-all duration-300`}
					>
						I’m a full-stack developer focused on building modern web and mobile applications with clean design, strong performance, and real-world impact.
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
							className="group relative px-6 py-2.5 text-sm font-bold rounded-xl border transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0.5 bg-bg-card text-accent border-border-theme shadow-soft hover:shadow-lg hover:border-accent"
						>
							View Capabilities
						</button>
						<button
							onClick={() => {
								const element = document.getElementById("contact");
								if (element) element.scrollIntoView({ behavior: "smooth" });
							}}
							className="group relative px-6 py-2.5 text-[#0a1a14] text-sm font-bold rounded-xl transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0.5 bg-[#1de9b6] shadow-[0_0_20px_rgba(29,233,182,0.3)] hover:shadow-[0_0_25px_rgba(29,233,182,0.5)]"
						>
							Let's Talk
						</button>
					</div>
					{/* Stats - Staggered slide-up animation with scramble effect */}
					<div
						ref={statsRef}
						className={`grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8 mt-12 pt-8 border-t transition-colors duration-500 border-border-theme`}
					>
						{[
							{ value: "100%", label: "CLIENT SATISFACTION" },
							{ value: "50+", label: "PROJECTS DELIVERED" },
							{ value: "4+", label: "YEARS EXPERIENCE" }
						].map((stat, index) => (
							<div
								key={index}
								className={`text-center transform transition-all duration-700 ease-out ${statsVisible
									? 'opacity-100 translate-y-0'
									: 'opacity-0 translate-y-12'
									} ${index === 2 ? 'col-span-2 sm:col-span-1' : ''}`}
								style={{ transitionDelay: `${500 + index * 150}ms` }}
							>
								<div className="text-2xl md:text-3xl font-bold text-accent font-display hover:scale-110 transition-transform duration-300 cursor-default">
									<ScrambleText
										text={stat.value}
										isVisible={statsVisible}
										delay={500 + index * 150}
									/>
								</div>
								<div className="text-xs md:text-sm uppercase tracking-wider mt-2 transition-colors duration-500 text-theme-muted">
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

						{/* Main Profile Circle */}
						<div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_80px_rgba(74,222,128,0.4)] transition-all duration-500 bg-bg-secondary">
							{displayProfile.avatar || displayProfile.image ? (
								<img
									src={fixImageUrl(displayProfile.avatar || displayProfile.image)}
									alt={displayProfile.name}
									className="w-full h-full object-cover"
									onError={(e) => {
										e.target.src = "https://api.dicebear.com/7.x/adventurer/svg?seed=default";
									}}
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center font-display text-5xl transition-colors duration-500 bg-bg-secondary text-theme-secondary">
									{displayProfile.name?.charAt(0) || 'D'}
								</div>
							)}
							{/* Bottom fade to blend into background */}
							<div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t pointer-events-none from-bg-secondary to-transparent"></div>
						</div>

						{/* Floating Badge: Top Right - Skilled */}
						<div className="absolute -top-4 right-0 md:-right-6 z-20 animate-float">
							<div className="backdrop-blur-lg border border-[#1de9b6]/40 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-[0_0_20px_rgba(29,233,182,0.15)] transition-all duration-500 bg-gradient-to-br from-[#1de9b6]/20 via-[#0a1a14]/95 to-[#0a1a14]">
								<div className="w-8 h-8 rounded-lg bg-[#1de9b6]/20 flex items-center justify-center border border-[#1de9b6]/30">
									<span className="text-accent text-sm">🧠</span>
								</div>
								<div>
									<p className="text-[#1de9b6] text-[10px] font-bold tracking-widest uppercase">Status</p>
									<p className="text-xs font-black transition-colors duration-300 text-white uppercase tracking-tight">Skilled</p>
								</div>
							</div>
						</div>

						{/* Floating Badge: Middle Left - Professional */}
						<div className="absolute top-1/3 -left-6 md:-left-16 z-20 animate-float-delayed">
							<div className="backdrop-blur-lg border border-[#1de9b6]/40 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-[0_0_20px_rgba(29,233,182,0.15)] transition-all duration-500 bg-gradient-to-br from-[#1de9b6]/20 via-[#0a1a14]/95 to-[#0a1a14]">
								<div className="w-8 h-8 rounded-lg bg-[#1de9b6]/20 flex items-center justify-center border border-[#1de9b6]/30">
									<span className="text-accent text-sm">💼</span>
								</div>
								<div>
									<p className="text-[#1de9b6] text-[10px] font-bold tracking-widest uppercase">Skillset</p>
									<p className="text-xs font-black transition-colors duration-300 text-white uppercase tracking-tight">Professional</p>
								</div>
							</div>
						</div>

						{/* Floating Badge: Bottom Center - Top Rated */}
						<div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 animate-float">
							<div className="backdrop-blur-lg border border-[#1de9b6]/40 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-[0_0_20px_rgba(29,233,182,0.15)] transition-all duration-500 bg-gradient-to-br from-[#1de9b6]/20 via-[#0a1a14]/95 to-[#0a1a14]">
								<div className="w-8 h-8 rounded-lg bg-[#1de9b6]/20 flex items-center justify-center border border-[#1de9b6]/30">
									<span className="text-accent text-sm">🚀</span>
								</div>
								<div>
									<p className="text-[#1de9b6] text-[10px] font-bold tracking-widest uppercase">Aspiration</p>
									<p className="text-xs font-black transition-colors duration-300 text-white uppercase tracking-tight">Expert</p>
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
