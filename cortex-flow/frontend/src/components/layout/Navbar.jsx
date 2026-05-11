import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useProfile } from "../../hooks";
import { Menu, X } from "lucide-react";

// 3D Rotating Text Component
const Rotating3DText = ({ children, className }) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<span
			className={`inline-block transition-transform duration-500 ${className}`}
			style={{
				transform: isHovered
					? 'perspective(1000px) rotateY(360deg)'
					: 'perspective(1000px) rotateY(0deg)',
				transformStyle: 'preserve-3d'
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{children}
		</span>
	);
};

const Navbar = () => {
	const { profile } = useProfile();
	const [activeSection, setActiveSection] = useState("home");
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Track active section based on scroll position
	useEffect(() => {
		const handleScroll = () => {
			const sections = ["home", "about", "skills", "certificates", "projects", "testimonials", "contact"];
			const scrollPosition = window.scrollY + 100;

			for (const section of sections) {
				const element = document.getElementById(section);
				if (element) {
					const { offsetTop, offsetHeight } = element;
					if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
						setActiveSection(section);
						break;
					}
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToSection = (sectionId) => {
		const currentHash = window.location.hash.slice(1) || "home";
		const validSections = ["home", "about", "skills", "certificates", "projects", "testimonials", "contact"];
		const isHomePage = validSections.includes(currentHash) || currentHash === "";
		const isCaseStudy = currentHash.startsWith("project-single") || currentHash.startsWith("project");

		// If we're in case study or not on home page, navigate to home first with the section
		if (!isHomePage || isCaseStudy) {
			window.location.hash = `home#${sectionId}`;
			// Add a small delay to ensure the home page loads before scrolling
			setTimeout(() => {
				const element = document.getElementById(sectionId);
				if (element) {
					element.scrollIntoView({ behavior: "smooth" });
				}
			}, 100);
			return;
		}

		// On home page, scroll to the section
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	const navItems = [
		{ label: "Home", id: "home" },
		{ label: "About", id: "about" },
		{ label: "Experience", id: "experience" },
		{ label: "Skills", id: "skills" },
		{ label: "Certificates", id: "certificates" },
		{ label: "Projects", id: "projects" },
		{ label: "Testimonials", id: "testimonials" },
		{ label: "Contact", id: "contact" },
	];

	return (
		<nav className="w-full fixed top-0 left-0 z-50 shadow-soft border-b transition-all duration-500 bg-glass-bg backdrop-blur-md border-glass-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
				{/* Logo with 3D Rotation */}
				<div
					className="flex-shrink-0 text-3xl tracking-tight cursor-pointer font-script transition-colors duration-500 text-theme-primary"
					onClick={() => scrollToSection("home")}
				>
					<Rotating3DText className="hover:scale-105 font-bold">
						{profile?.name || "Galata .D"}
					</Rotating3DText>
				</div>

				{/* Navigation Links (Desktop) */}
				<div className="hidden md:flex space-x-8 ml-10 flex-1 justify-center">
					{navItems.map((item) => (
						<button
							key={item.id}
							onClick={() => scrollToSection(item.id)}
							className={`transition-all duration-300 relative font-cinzel text-xs tracking-widest uppercase font-medium text-theme-secondary hover:text-accent ${activeSection === item.id
									? "text-accent after:content-[''] after:block after:h-0.5 after:bg-accent after:w-full after:absolute after:-bottom-1 after:left-0"
									: ""
								}`}
						>
							{item.label}
						</button>
					))}
				</div>

				{/* Action Buttons & Mobile Toggle */}
				<div className="flex-shrink-0 flex items-center gap-3">
					<div className="hidden sm:flex items-center gap-3">
						<a
							href={profile?.upworkUrl || "https://www.upwork.com/"}
							target="_blank"
							rel="noopener noreferrer"
							className="bg-[#6fda44] hover:bg-[#5cb936] text-white font-semibold py-2 px-4 rounded-full shadow transition-colors duration-200 font-display text-xs tracking-wide"
						>
							Upwork
						</a>
						<button
							onClick={() => scrollToSection("contact")}
							className="font-bold py-2.5 px-6 rounded-xl shadow-[0_0_20px_rgba(29,233,182,0.3)] transition-all duration-300 font-display text-[11px] uppercase tracking-widest bg-[#1de9b6] text-[#0a1a14] hover:bg-[#14b98a] hover:shadow-[0_0_25px_rgba(29,233,182,0.5)] hover:-translate-y-0.5 active:translate-y-0"
						>
							Let's Talk
						</button>
					</div>

					{/* Mobile Menu Toggle */}
					<div className="flex items-center gap-2 md:hidden">
						<button
							className="p-2 rounded-lg transition-colors text-theme-primary hover:bg-bg-accent/50"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Navigation Drawer */}
			<div
				className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
			>
				{/* Backdrop */}
				<div 
					className="absolute inset-0 bg-black/60 backdrop-blur-sm"
					onClick={() => setIsMenuOpen(false)}
				/>
				
				{/* Drawer Content */}
				<div className="absolute right-0 top-0 h-full w-[280px] shadow-2xl flex flex-col p-8 transition-transform duration-500 bg-bg-primary border-l border-border-theme">
					<div className="flex items-center justify-between mb-12">
						<div className="text-2xl font-bold font-script text-theme-primary">
							{profile?.name || "Galata .D"}
						</div>
						<button 
							onClick={() => setIsMenuOpen(false)}
							className="p-2 rounded-lg text-theme-muted hover:text-theme-primary"
						>
							<X size={24} />
						</button>
					</div>

					<div className="flex flex-col space-y-6">
						{navItems.map((item) => (
							<button
								key={item.id}
								onClick={() => {
									scrollToSection(item.id);
									setIsMenuOpen(false);
								}}
								className={`text-left text-sm font-cinzel tracking-[0.2em] uppercase font-bold transition-all ${activeSection === item.id 
									? 'text-accent translate-x-2' 
									: 'text-theme-muted hover:text-accent'}`}
							>
								{item.label}
							</button>
						))}
					</div>

					<div className="mt-auto pt-8 border-t border-border-theme flex flex-col gap-4">
						<a
							href={profile?.upworkUrl || "https://www.upwork.com/"}
							target="_blank"
							rel="noopener noreferrer"
							className="w-full bg-[#6fda44] text-white text-center font-bold py-4 rounded-xl shadow-lg text-xs uppercase tracking-widest hover:bg-[#5cb936] transition-colors"
						>
							Hire on Upwork
						</a>
						<button
							onClick={() => {
								scrollToSection("contact");
								setIsMenuOpen(false);
							}}
							className="w-full text-center font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(29,233,182,0.3)] text-[11px] uppercase tracking-widest transition-all bg-[#1de9b6] text-[#0a1a14] hover:bg-[#14b98a] hover:shadow-[0_0_25px_rgba(29,233,182,0.5)] active:scale-[0.98]"
						>
							Let's Talk
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
