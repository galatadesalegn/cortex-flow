import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { useProfile, useTheme } from "../../hooks";
import { publicService } from "../../services";
import { toast } from "sonner";

const use3DTilt = (maxRotate = 6, maxTranslate = 12) => {
	const ref = useRef(null);
	const [style, setStyle] = useState({});
	const rafRef = useRef(null);
	const lastMoveRef = useRef({ x: 0, y: 0 });

	const onMove = useCallback((e) => {
		if (rafRef.current) return;

		rafRef.current = requestAnimationFrame(() => {
			const el = ref.current;
			if (!el) {
				rafRef.current = null;
				return;
			}

			const rect = el.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			// Skip if position hasn't changed significantly
			if (Math.abs(x - lastMoveRef.current.x) < 2 && Math.abs(y - lastMoveRef.current.y) < 2) {
				rafRef.current = null;
				return;
			}

			lastMoveRef.current = { x, y };
			const cx = rect.width / 2;
			const cy = rect.height / 2;
			const px = (x - cx) / cx;
			const py = (y - cy) / cy;

			setStyle({
				transform: `perspective(800px) rotateX(${-py * maxRotate}deg) rotateY(${px * maxRotate}deg) translateX(${px * maxTranslate}px) scale(1.02)`,
				transition: "transform 0ms",
			});

			rafRef.current = null;
		});
	}, [maxRotate, maxTranslate]);

	const onLeave = useCallback(() => {
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}
		setStyle({
			transform: "none",
			transition: "transform 500ms cubic-bezier(.2,.8,.2,1)"
		});
	}, []);

	// Touch event support for mobile
	const onTouchMove = useCallback((e) => {
		if (rafRef.current) return;

		rafRef.current = requestAnimationFrame(() => {
			const el = ref.current;
			if (!el) {
				rafRef.current = null;
				return;
			}

			const touch = e.touches[0];
			const rect = el.getBoundingClientRect();
			const x = touch.clientX - rect.left;
			const y = touch.clientY - rect.top;

			// Skip if position hasn't changed significantly
			if (Math.abs(x - lastMoveRef.current.x) < 2 && Math.abs(y - lastMoveRef.current.y) < 2) {
				rafRef.current = null;
				return;
			}

			lastMoveRef.current = { x, y };
			const cx = rect.width / 2;
			const cy = rect.height / 2;
			const px = (x - cx) / cx;
			const py = (y - cy) / cy;

			setStyle({
				transform: `perspective(800px) rotateX(${-py * maxRotate}deg) rotateY(${px * maxRotate}deg) translateX(${px * maxTranslate}px) scale(1.02)`,
				transition: "transform 0ms",
			});

			rafRef.current = null;
		});
	}, [maxRotate, maxTranslate]);

	const onTouchEnd = useCallback(() => {
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}
		setStyle({
			transform: "none",
			transition: "transform 500ms cubic-bezier(.2,.8,.2,1)"
		});
	}, []);

	useEffect(() => {
		return () => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, []);

	return { ref, style, onMove, onLeave, onTouchMove, onTouchEnd };
};

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

const ContactInfoCard = memo(({ icon, label, value, tilt, className = "" }) => {
	const [hovered, setHovered] = useState(false);
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

	const handleMove = useCallback((e) => {
		tilt.onMove(e);
		const rect = tilt.ref.current?.getBoundingClientRect();
		if (rect) {
			setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
		}
	}, [tilt]);

	const handleTouchMove = useCallback((e) => {
		tilt.onTouchMove(e);
		const rect = tilt.ref.current?.getBoundingClientRect();
		if (rect && e.touches[0]) {
			setMousePos({ x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top });
		}
	}, [tilt]);

	const handleMouseEnter = useCallback(() => setHovered(true), []);
	const handleMouseLeave = useCallback(() => {
		tilt.onLeave();
		setHovered(false);
	}, [tilt]);

	const handleTouchEnd = useCallback(() => {
		tilt.onTouchEnd();
		setHovered(false);
	}, [tilt]);

	return (
		<div
			ref={tilt.ref}
			style={{
				...tilt.style,
				background: hovered
					? `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(29,233,182,0.1) 0%, transparent 50%), linear-gradient(135deg, #0d1411 0%, #0a1a14 100%)`
					: 'linear-gradient(135deg, #0d1411 0%, #0a1a14 100%)'
			}}
			onMouseMove={handleMove}
			onMouseLeave={handleMouseLeave}
			onMouseEnter={handleMouseEnter}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			className={`group relative p-4 rounded-xl border transition-all duration-500 overflow-hidden border-emerald-500/10 hover:border-[#1de9b6]/30 ${hovered ? 'shadow-[0_0_30px_rgba(29,233,182,0.15)]' : ''
				} ${className}`}
		>
			<div className="relative z-10">
				<div className="w-8 h-8 rounded-lg border flex items-center justify-center mb-3 transition-all bg-[#12221b] border-emerald-500/20 text-emerald-400 group-hover:border-emerald-500/50 group-hover:scale-110">
					{React.cloneElement(icon, { size: 16 })}
				</div>
				<h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-1 transition-colors duration-300 text-[#1de9b6] group-hover:text-white">{label}</h4>
				<p className="text-sm font-medium tracking-tight transition-colors duration-300 text-slate-300 truncate group-hover:text-white">{value}</p>
			</div>
		</div>
	);
});

ContactInfoCard.displayName = 'ContactInfoCard';

const Contact = () => {
	const { profile } = useProfile();
	const [sectionRef, isVisible] = useFadeIn();

	// 3D Tilt hooks for cards
	const emailTilt = use3DTilt(10, 5);
	const locationTilt = use3DTilt(10, 5);
	const phoneTilt = use3DTilt(10, 5);
	const formTilt = use3DTilt(5, 2);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const [status, setStatus] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const [formHovered, setFormHovered] = useState(false);
	const [formMousePos, setFormMousePos] = useState({ x: 0, y: 0 });

	const handleFormMove = useCallback((e) => {
		formTilt.onMove(e);
		const rect = formTilt.ref.current?.getBoundingClientRect();
		if (rect) {
			setFormMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
		}
	}, [formTilt]);

	const handleFormTouchMove = useCallback((e) => {
		formTilt.onTouchMove(e);
		const rect = formTilt.ref.current?.getBoundingClientRect();
		if (rect && e.touches[0]) {
			setFormMousePos({ x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top });
		}
	}, [formTilt]);

	const handleFormMouseEnter = useCallback(() => setFormHovered(true), []);
	const handleFormMouseLeave = useCallback(() => {
		formTilt.onLeave();
		setFormHovered(false);
	}, [formTilt]);

	const handleFormTouchEnd = useCallback(() => {
		formTilt.onTouchEnd();
		setFormHovered(false);
	}, [formTilt]);

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
			
			// Clear success status after 5 seconds
			setTimeout(() => {
				setStatus("");
			}, 5000);
		} catch (err) {
			console.error("Failed to send message:", err);
			const errorMessage = err.response?.data?.message || "Failed to send message. Please try again.";
			setError(errorMessage);
			setStatus("error");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section
			id="contact"
			ref={sectionRef}
			className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-1000 ease-out scroll-mt-20 bg-bg-primary ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
		>
			<div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 w-full py-4 md:py-6">
				{/* Header - Simplified */}
				<div className="mb-8 text-center">
					<h2 className="text-2xl md:text-3xl font-bold font-playfair uppercase tracking-widest transition-colors duration-300 text-accent">
						Contact Me
					</h2>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
					{/* Left Side - Info */}
					<div className="lg:col-span-5 space-y-6">
						<div>
							<div className="inline-flex items-center gap-2 px-3 py-1 rounded border shadow-[0_0_20px_rgba(29,233,182,0.15)] font-black bg-gradient-to-br from-[#1de9b6]/20 via-[#0a1a14]/95 to-[#0a1a14] text-[#1de9b6] border-[#1de9b6]/40 backdrop-blur-md text-[10px] uppercase tracking-widest mb-6">
								<span className="relative flex h-2 w-2">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1de9b6] opacity-75"></span>
									<span className="relative inline-flex rounded-full h-2 w-2 bg-[#1de9b6]"></span>
								</span>
								SYSTEM STATUS: ACTIVE
							</div>

							<h3 className="text-3xl md:text-4xl font-bold font-display mb-6 leading-tight tracking-tight transition-colors duration-300 text-slate-100">
								Let's Build the <br />
								<span className="text-accent">Future Together.</span>
							</h3>
						</div>

						{/* Contact Info Cards - Simplified Design */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<ContactInfoCard
								icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>}
								label="Electronic Mail"
								value={profile?.email || "galataddesalegn@gmail.com"}
								tilt={emailTilt}
							/>
							<ContactInfoCard
								icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>}
								label="Global Base"
								value={profile?.location || "Remote / Worldwide"}
								tilt={locationTilt}
							/>
							<ContactInfoCard
								icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>}
								label="Direct Line"
								value={profile?.phone || "+00 000 000 000"}
								tilt={phoneTilt}
								className="sm:col-span-2"
							/>
						</div>

						{/* Social Links - Simplified */}
						<div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-gradient-to-br from-[#0d1411] to-[#0a1a14] border border-emerald-500/10 shadow-lg relative overflow-hidden group">
							<div className="absolute inset-0 bg-gradient-to-br from-[#1de9b6]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							<h4 className="relative z-10 col-span-2 text-[#1de9b6] text-[11px] font-black uppercase tracking-[0.2em] mb-1 text-center">Digital Footprint</h4>
							{profile?.socialLinks?.map((social, idx) => (
								<a
									key={idx}
									href={social.url}
									target="_blank"
									rel="noopener noreferrer"
									className="relative z-10 flex items-center gap-2 p-2 rounded-lg border transition-all bg-[#12221b] border-emerald-500/20 hover:border-[#1de9b6] hover:shadow-soft group/social"
								>
									<div className="text-emerald-500/60 group-hover/social:text-[#1de9b6] transition-colors">
										<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 22 3 22 10" /><line x1="14" y1="10" x2="22" y2="3" /></svg>
									</div>
									<span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover/social:text-white transition-colors">{social.platform}</span>
								</a>
							))}
						</div>
					</div>

					{/* Right Side - Form */}
					<div className="lg:col-span-7">
						<div
							ref={formTilt.ref}
							style={{
								...formTilt.style,
								background: formHovered
									? `radial-gradient(circle at ${formMousePos.x}px ${formMousePos.y}px, rgba(29,233,182,0.1) 0%, transparent 50%), linear-gradient(135deg, #0d1411 0%, #0a1a14 100%)`
									: 'linear-gradient(135deg, #0d1411 0%, #0a1a14 100%)'
							}}
							onMouseMove={handleFormMove}
							onMouseLeave={handleFormMouseLeave}
							onMouseEnter={handleFormMouseEnter}
							onTouchMove={handleFormTouchMove}
							onTouchEnd={handleFormTouchEnd}
							className={`relative p-6 md:p-10 rounded-2xl border overflow-hidden border-emerald-500/10 transition-all duration-300 ${formHovered ? 'shadow-[0_0_30px_rgba(29,233,182,0.15)] hover:border-[#1de9b6]/30' : ''
								}`}
						>
							{/* Form Decoration */}
							<div className="absolute top-0 right-0 w-32 h-32 bg-[#1de9b6]/5 blur-3xl pointer-events-none"></div>

							<form onSubmit={handleSubmit} className="relative z-10 space-y-5">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
									<div className="space-y-2">
										<label className="text-[10px] font-bold text-accent uppercase tracking-widest ml-1">Full Name</label>
										<input
											type="text"
											name="name"
											value={formData.name}
											onChange={handleChange}
											required
											placeholder="e.g. Alan Turing"
											className="w-full px-5 py-3.5 rounded-xl border border-border-theme outline-none transition-all duration-300 font-bold text-xs bg-bg-secondary text-theme-primary placeholder:text-theme-muted focus:border-accent/50 focus:bg-bg-card focus:shadow-soft"
										/>
									</div>
									<div className="space-y-2">
										<label className="text-[10px] font-bold text-accent uppercase tracking-widest ml-1">Email Address</label>
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={handleChange}
											required
											placeholder="alan@turing.io"
											className="w-full px-5 py-3.5 rounded-xl border border-border-theme outline-none transition-all duration-300 font-bold text-xs bg-bg-secondary text-theme-primary placeholder:text-theme-muted focus:border-accent/50 focus:bg-bg-card focus:shadow-soft"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<label className="text-[10px] font-bold text-accent uppercase tracking-widest ml-1">Message Subject</label>
									<input
										type="text"
										name="subject"
										value={formData.subject}
										onChange={handleChange}
										placeholder="Project Collaboration"
										className="w-full px-5 py-3.5 rounded-xl border border-border-theme outline-none transition-all duration-300 font-bold text-xs bg-bg-secondary text-theme-primary placeholder:text-theme-muted focus:border-accent/50 focus:bg-bg-card focus:shadow-soft"
									/>
								</div>

								<div className="space-y-2">
									<label className="text-[10px] font-bold text-accent uppercase tracking-widest ml-1">Your Message</label>
									<textarea
										name="message"
										value={formData.message}
										onChange={handleChange}
										required
										rows="4"
										placeholder="Tell me about your vision..."
										className="w-full px-5 py-3.5 rounded-xl border border-border-theme outline-none transition-all duration-300 font-bold text-xs resize-none bg-bg-secondary text-theme-primary placeholder:text-theme-muted focus:border-accent/50 focus:bg-bg-card focus:shadow-soft"
									></textarea>
								</div>

								{/* Status Messages */}
								{status === "success" && (
									<div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
										Transmission Successful.
									</div>
								)}

								{status === "error" && (
									<div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
										Transmission Failed.
									</div>
								)}

								<button
									type="submit"
									disabled={isSubmitting}
									className={`w-full relative overflow-hidden group/btn px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all duration-500 flex items-center justify-center gap-3 ${isSubmitting ? 'bg-accent/20 text-accent cursor-not-allowed' : 'bg-[#1de9b6] text-[#0a1a14] shadow-[0_0_20px_rgba(29,233,182,0.3)] hover:shadow-[0_0_25px_rgba(29,233,182,0.5)] hover:-translate-y-1 active:translate-y-0'}`}
								>
									<span className="relative z-10 flex items-center gap-3">
										{isSubmitting ? (
											<>
												<div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
												Transmitting...
											</>
										) : (
											<>
												Send Message
												<svg className="group-hover/btn:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
											</>
										)}
									</span>
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Contact;
