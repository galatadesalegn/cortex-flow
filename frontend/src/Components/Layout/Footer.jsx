import React from "react";
import { useProfile } from "../../hooks";

const Footer = () => {
	const { profile } = useProfile();
	const currentYear = new Date().getFullYear();

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const socialLinks = [
		...(profile?.github ? [{ name: "GitHub", icon: "💻", url: profile.github }] : []),
		...(profile?.linkedin ? [{ name: "LinkedIn", icon: "🔗", url: profile.linkedin }] : []),
		...(profile?.twitter ? [{ name: "Twitter", icon: "🐦", url: profile.twitter }] : []),
	];

	const navLinks = [
		{ name: "Home", href: "#home" },
		{ name: "About", href: "#about" },
		{ name: "Skills", href: "#skills" },
		{ name: "Projects", href: "#projects" },
		{ name: "Contact", href: "#contact" },
	];

	return (
		<footer className="w-full relative z-10 border-t border-white/10 shadow-[0_-5px_20px_rgba(16,185,129,0.05)] bg-[#0A0F0D]/70 backdrop-blur-xl">
			<div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8">
				{/* Top Section: Compact Grid */}
				<div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
					{/* Brand Anchor */}
					<div className="md:col-span-4 flex flex-col gap-2">
						<div className="text-lg font-bold tracking-tighter text-[#1de9b6]">
							{profile?.name || "Portfolio"}
						</div>
					</div>

					{/* Technical Nodes - Compact */}
					<div className="md:col-span-5 flex flex-wrap gap-3">
						<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
							<div className="w-2 h-2 rounded-full bg-[#1de9b6] animate-pulse"></div>
							<span className="text-xs uppercase tracking-wider text-[#1de9b6]">Active</span>
						</div>
					</div>

					{/* Actions / Socials */}
					<div className="md:col-span-3 flex flex-col md:items-end gap-3">
						<div className="flex gap-2">
							{socialLinks.map((link) => (
								<a
									key={link.name}
									href={link.url}
									target="_blank"
									rel="noopener noreferrer"
									className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 hover:border-[#1de9b6]/40 transition-all group"
								>
									<span className="text-gray-400 group-hover:text-[#1de9b6] transition-colors text-lg">
										{link.icon}
									</span>
								</a>
							))}
						</div>
						<button
							onClick={scrollToTop}
							className="flex items-center gap-2 py-2 px-4 rounded-lg bg-white/5 border border-emerald-500/20 hover:border-emerald-500/50 transition-all"
						>
							<span className="text-xs uppercase tracking-widest text-emerald-400">Back to Top</span>
							<span className="text-emerald-500">⬆️</span>
						</button>
					</div>
				</div>

				{/* Footer Bottom - Combined */}
				<div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/5 pt-6">
					<div className="flex flex-wrap items-center gap-x-6 gap-y-2">
						{navLinks.map((link) => (
							<a
								key={link.name}
								href={link.href}
								className="text-xs tracking-wider uppercase text-gray-500 hover:text-emerald-400 transition-colors"
							>
								{link.name}
							</a>
						))}
					</div>
					<div className="text-xs tracking-wider uppercase text-gray-500">
						© {currentYear} — All Systems Operational
					</div>
				</div>
			</div>

			{/* Decorative UI Element: Scanning Line */}
			<div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-30"></div>
		</footer>
	);
};

export default Footer;