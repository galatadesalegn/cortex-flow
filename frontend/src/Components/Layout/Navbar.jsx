import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";

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
	const [activeSection, setActiveSection] = useState("home");
	const { theme, toggleTheme, isDark } = useTheme();

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
		<nav className={`w-full fixed top-0 left-0 z-50 shadow-lg border-b transition-colors duration-500 ${isDark ? 'bg-[#101413] border-white/10' : 'bg-white border-gray-200'}`}>
			<div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
				{/* Logo with 3D Rotation */}
				<div
					className={`flex-shrink-0 text-3xl tracking-tight cursor-pointer font-script transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-900'}`}
					onClick={() => scrollToSection("home")}
				>
					<Rotating3DText className="hover:scale-105 font-bold">
						Galata .D
					</Rotating3DText>
				</div>

				{/* Navigation Links */}
				<div className="hidden md:flex space-x-8 ml-10 flex-1 justify-center">
					{navItems.map((item) => (
						<button
							key={item.id}
							onClick={() => scrollToSection(item.id)}
							className={`transition-all duration-300 relative font-cinzel text-xs tracking-widest uppercase font-medium ${isDark ? 'text-gray-200 hover:text-[#1de9b6]' : 'text-gray-600 hover:text-[#1de9b6]'} ${activeSection === item.id
									? "text-[#1de9b6] after:content-[''] after:block after:h-0.5 after:bg-[#1de9b6] after:w-full after:absolute after:-bottom-1 after:left-0"
									: ""
								}`}
						>
							{item.label}
						</button>
					))}
				</div>

				{/* Action Buttons */}
				<div className="flex-shrink-0 flex items-center gap-3">
					<a
						href="https://www.upwork.com/"
						target="_blank"
						rel="noopener noreferrer"
						className="bg-[#6fda44] hover:bg-[#5cb936] text-white font-semibold py-2 px-4 rounded-full shadow transition-colors duration-200 font-display text-xs tracking-wide"
					>
						Upwork
					</a>
					<button
						onClick={() => scrollToSection("contact")}
						className={`font-semibold py-2 px-4 rounded-full shadow transition-colors duration-200 font-display text-xs tracking-wide ${isDark ? 'bg-accent text-dark-primary hover:bg-accent-hover' : 'bg-accent text-white hover:bg-accent-hover'}`}
					>
						Let's Talk
					</button>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
