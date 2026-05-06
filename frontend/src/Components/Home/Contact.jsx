import React, { useState, useRef, useEffect } from "react";
import { useProfile } from "../../hooks";
import { publicService } from "../../services";

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
			transform: `perspective(800px) rotateX(${-py * 4}deg) rotateY(${px * 4}deg) scale(1.02)`,
			transition: "transform 0ms",
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

const Contact = () => {
	const { profile } = useProfile();
	const [sectionRef, isVisible] = useFadeIn();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const [status, setStatus] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setStatus("sending");
		setIsSubmitting(true);
		setError("");

		try {
			await publicService.sendMessage({
				name: formData.name,
				email: formData.email,
				subject: formData.subject || "Contact Form Inquiry",
				message: formData.message,
			});
			setStatus("success");
			setFormData({ name: "", email: "", subject: "", message: "" });
		} catch (err) {
			console.error("Failed to send message:", err);
			setError(err.response?.data?.message || "Failed to send message. Please try again.");
			setStatus("error");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section
			id="contact"
			ref={sectionRef}
			className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-primary relative overflow-hidden transition-all duration-1000 ease-out scroll-mt-20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
				}`}
		>
			<div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 w-full py-4 md:py-6">
				{/* Header - Enhanced */}
				<div className="mb-12 text-center">
					<div className="inline-flex items-center gap-3 mb-4">
						<div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#1de9b6]/50"></div>
						<div className="w-2 h-2 rounded-full bg-[#1de9b6]"></div>
						<div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#1de9b6]/50"></div>
					</div>
					<h2 className="text-3xl md:text-4xl font-black text-[#1de9b6] uppercase tracking-[0.2em]" style={{ fontFamily: "'Orbitron', 'Space Grotesk', sans-serif" }}>
						CONTACT ME
					</h2>
					<div className="mt-4 flex items-center justify-center gap-2">
						<div className="w-1.5 h-1.5 rounded-full bg-[#1de9b6]/40"></div>
						<div className="w-1.5 h-1.5 rounded-full bg-[#1de9b6]/60"></div>
						<div className="w-1.5 h-1.5 rounded-full bg-[#1de9b6]/40"></div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
					{/* Left Side - Info */}
					<div className="lg:col-span-5 space-y-6">
						<div>
							<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1de9b6]/10 text-[#1de9b6] text-xs font-bold border border-[#1de9b6]/20 uppercase tracking-[0.1em] mb-6">
								<span className="relative flex h-2 w-2">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1de9b6] opacity-75"></span>
									<span className="relative inline-flex rounded-full h-2 w-2 bg-[#1de9b6]"></span>
								</span>
								Live Status: Active
							</div>

							<h3 className="text-3xl md:text-4xl font-playfair font-semibold text-white mb-6 leading-tight tracking-tight">
								Let's Build the <br />
								<span className="text-[#1de9b6]">Future Together.</span>
							</h3>
						</div>

						{/* Contact Info Cards - Enhanced Design */}
						<div className="grid grid-cols-2 gap-4">
							{/* Email Card */}
							<Card3D className="group relative bg-gradient-to-br from-[#0c1a14] to-[#0a1510] p-5 rounded-xl border border-[#1de9b6]/20 hover:border-[#1de9b6]/50 transition-all overflow-hidden">
								<div className="absolute top-0 right-0 w-20 h-20 bg-[#1de9b6]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#1de9b6]/10 transition-all"></div>
								<div className="relative z-10">
									<div className="w-10 h-10 rounded-lg bg-[#1de9b6]/10 border border-[#1de9b6]/20 flex items-center justify-center text-[#1de9b6] mb-3 group-hover:scale-110 transition-transform">
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
									</div>
									<h4 className="text-[#1de9b6]/60 text-[10px] font-bold uppercase tracking-[0.25em] mb-2">Electronic Mail</h4>
									<p className="text-white text-sm font-medium truncate" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{profile?.email || 'reach@example.com'}</p>
								</div>
							</Card3D>
							
							{/* Location Card */}
							<Card3D className="group relative bg-gradient-to-br from-[#0c1a14] to-[#0a1510] p-5 rounded-xl border border-[#1de9b6]/20 hover:border-[#1de9b6]/50 transition-all overflow-hidden">
								<div className="absolute top-0 right-0 w-20 h-20 bg-[#1de9b6]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#1de9b6]/10 transition-all"></div>
								<div className="relative z-10">
									<div className="w-10 h-10 rounded-lg bg-[#1de9b6]/10 border border-[#1de9b6]/20 flex items-center justify-center text-[#1de9b6] mb-3 group-hover:scale-110 transition-transform">
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
									</div>
									<h4 className="text-[#1de9b6]/60 text-[10px] font-bold uppercase tracking-[0.25em] mb-2">Global Base</h4>
									<p className="text-white text-sm font-medium truncate" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{profile?.location || 'Remote / Worldwide'}</p>
								</div>
							</Card3D>
						</div>

						{/* Social Links - Enhanced Design */}
						<div className="p-5 rounded-xl bg-gradient-to-br from-[#0c1a14]/50 to-transparent border border-[#1de9b6]/10">
							<h4 className="text-[#1de9b6]/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-center">Connect With Me</h4>
							<div className="flex items-center justify-center gap-4">
								<a 
									href={profile?.github || '#'} 
									target="_blank" 
									rel="noopener noreferrer" 
									className="group flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#1de9b6]/40 hover:bg-[#1de9b6]/10 transition-all duration-300"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 group-hover:text-[#1de9b6] transition-colors"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
									<span className="text-gray-300 text-xs font-semibold group-hover:text-white transition-colors">GitHub</span>
								</a>
								
								<div className="w-[1px] h-6 bg-white/10"></div>
								
								<a 
									href={profile?.linkedin || '#'} 
									target="_blank" 
									rel="noopener noreferrer" 
									className="group flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#1de9b6]/40 hover:bg-[#1de9b6]/10 transition-all duration-300"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 group-hover:text-[#1de9b6] transition-colors"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
									<span className="text-gray-300 text-xs font-semibold group-hover:text-white transition-colors">LinkedIn</span>
								</a>
							</div>
						</div>
					</div>

					{/* Right Side - Form */}
					<div className="lg:col-span-7">
						<Card3D className="bg-[#101c18]/80 backdrop-blur-xl p-8 rounded-2xl border border-[#1de9b6]/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
							{/* Subtle internal glow */}
							<div className="absolute -top-24 -right-24 w-48 h-48 bg-[#1de9b6]/5 rounded-full blur-[80px] group-hover:bg-[#1de9b6]/10 transition-colors duration-700" />

							<form onSubmit={handleSubmit} className="space-y-6 relative z-10">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<label className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Full Name</label>
										<input
											type="text"
											name="name"
											value={formData.name}
											onChange={handleChange}
											required
											className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-4 focus:outline-none focus:border-[#1de9b6]/40 focus:bg-white/[0.05] transition-all text-white text-sm placeholder:text-gray-700"
											placeholder="Who are you?"
										/>
									</div>
									<div className="space-y-2">
										<label className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Email Address</label>
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={handleChange}
											required
											className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-4 focus:outline-none focus:border-[#1de9b6]/40 focus:bg-white/[0.05] transition-all text-white text-sm placeholder:text-gray-700"
											placeholder="Where can I reach you?"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<label className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Subject of interest</label>
									<input
										type="text"
										name="subject"
										value={formData.subject}
										onChange={handleChange}
										className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-4 focus:outline-none focus:border-[#1de9b6]/40 focus:bg-white/[0.05] transition-all text-white text-sm placeholder:text-gray-700"
										placeholder="What's on your mind?"
									/>
								</div>

								<div className="space-y-2">
									<label className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] ml-1">Your Message</label>
									<textarea
										name="message"
										value={formData.message}
										onChange={handleChange}
										required
										rows="4"
										className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-4 focus:outline-none focus:border-[#1de9b6]/40 focus:bg-white/[0.05] transition-all text-white text-base placeholder:text-gray-700 resize-none"
										placeholder="Describe your vision or project details..."
									/>
								</div>

								<div className="relative group/btn">
									<div className="absolute inset-0 bg-[#1de9b6] rounded-xl blur-lg opacity-20 group-hover/btn:opacity-40 transition-opacity" />
									<button
										type="submit"
										disabled={isSubmitting}
										className="relative w-full bg-[#1de9b6] text-[#0a1a14] font-bold text-base py-4 rounded-xl hover:bg-[#1de9b6]/90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-[0.2em] shadow-xl"
									>
										{isSubmitting ? (
											<>
												<div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
												<span>Transmitting...</span>
											</>
										) : (
											<>
												<span>Send Message</span>
												<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
											</>
										)}
									</button>
								</div>

								{status === "success" && (
									<div className="text-[#1de9b6] text-xs font-bold text-center animate-pulse uppercase tracking-widest mt-4">
										✓ Message Transmission Successful
									</div>
								)}

								{status === "error" && (
									<div className="text-red-400 text-xs font-bold text-center uppercase tracking-widest mt-4">
										⚠ Sync Error: {error}
									</div>
								)}
							</form>
						</Card3D>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Contact;