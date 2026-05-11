import React from "react";
import { useProfile } from "../../hooks";

const Footer = () => {
	const { profile } = useProfile();
	const currentYear = new Date().getFullYear();

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const socialLinks = [
		...(profile?.github ? [{ name: "GitHub", icon: (
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
		), url: profile.github }] : []),
		...(profile?.linkedin ? [{ name: "LinkedIn", icon: (
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
		), url: profile.linkedin }] : []),
		...(profile?.twitter ? [{ name: "Twitter", icon: (
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
		), url: profile.twitter }] : []),
		...(profile?.telegram ? [{ name: "Telegram", icon: (
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.891 8.146l-1.781 8.412c-.133.593-.484.738-.981.458l-2.715-2.001-1.31 1.263c-.145.145-.266.266-.546.266l.195-2.759 5.022-4.537c.218-.194-.048-.302-.337-.11l-6.207 3.907-2.674-.836c-.581-.182-.593-.581.121-.86l10.453-4.03c.484-.182.906.11.759.83z"/></svg>
		), url: profile.telegram }] : []),
	];

	const navLinks = [
		{ name: "Home", href: "#home" },
		{ name: "About", href: "#about" },
		{ name: "Skills", href: "#skills" },
		{ name: "Projects", href: "#projects" },
		{ name: "Contact", href: "#contact" },
	];

	return (
		<footer className="w-full relative z-10 border-t border-border-theme shadow-soft bg-glass-bg backdrop-blur-xl">
			<div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8">
				{/* Top Section: Compact Grid */}
				<div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
					{/* Brand Anchor */}
					<div className="md:col-span-4 flex flex-col gap-2">
						<div className="text-lg font-bold tracking-tighter text-accent">
							{profile?.name || "Portfolio"}
						</div>
					</div>

					{/* Technical Nodes - Compact */}
					<div className="md:col-span-5 flex flex-wrap gap-3">
						<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-secondary/50 border border-border-theme">
							<div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
							<span className="text-xs uppercase tracking-wider text-accent">Active</span>
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
									className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-theme hover:border-accent/40 transition-all group"
								>
									<span className="text-theme-muted group-hover:text-accent transition-colors text-lg">
										{link.icon}
									</span>
								</a>
							))}
						</div>
						<button
							onClick={scrollToTop}
							className="flex items-center gap-3 py-2.5 px-6 bg-gradient-to-br from-[#0d1411] to-[#0a1a14] rounded-xl border border-emerald-500/10 hover:border-[#1de9b6]/30 transition-all group"
						>
							<span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-[#1de9b6] transition-colors">Back to Top</span>
							<span className="text-xs group-hover:-translate-y-1 transition-transform">⬆️</span>
						</button>
					</div>
				</div>

				{/* Footer Bottom - Combined */}
				<div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-border-theme/50 pt-6">
					<div className="flex flex-wrap items-center gap-x-6 gap-y-2">
						{navLinks.map((link) => (
							<a
								key={link.name}
								href={link.href}
								className="text-xs tracking-wider uppercase text-theme-muted hover:text-accent transition-colors"
							>
								{link.name}
							</a>
						))}
					</div>
					<div className="text-xs tracking-wider uppercase text-theme-muted">
						© {currentYear} — All Systems Operational
					</div>
				</div>
			</div>

			{/* Decorative UI Element: Scanning Line */}
			<div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-30"></div>
		</footer>
	);
};

export default Footer;