import React, { useState, useRef, useEffect } from "react";
import { useCertificates } from "../../hooks";
import CertificateModal from "./CertificateModal";

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


const FILTERS = [
	{ label: "All", value: "all" },
	{ label: "Web", value: "Web" },
	{ label: "Mobile", value: "Mobile" },
	{ label: "AI/ML", value: "AI/ML" },
	{ label: "UI/UX", value: "UI/UX" },
	{ label: "Cloud", value: "Cloud" },
	{ label: "Data Science", value: "Data Science" },
	{ label: "DevOps", value: "DevOps" },
	{ label: "Cybersecurity", value: "Cybersecurity" },
];

// Format date
const formatDate = (dateString) => {
	if (!dateString) return 'N/A';
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const Certificates = () => {
	const [selectedFilter, setSelectedFilter] = useState("all");
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedCert, setSelectedCert] = useState(null);
	const [sectionRef, isVisible] = useFadeIn();
	const [hoveredId, setHoveredId] = useState(null);

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 6;

	const { certificates: apiCertificates, loading, error } = useCertificates();

	const certificates = apiCertificates.map(cert => ({
		id: cert._id,
		title: cert.name,
		issuer: cert.issuer,
		date: formatDate(cert.date),
		rawDate: new Date(cert.date),
		description: cert.description || `Issued by ${cert.issuer}`,
		image: cert.image,
		link: cert.link,
		category: cert.category || 'Other',
		certificateId: cert.certificateId,
		order: cert.order || 0,
	})).sort((a, b) => (a.order - b.order) || (b.rawDate - a.rawDate));

	const filteredCertificates = selectedFilter === "all"
		? certificates
		: certificates.filter(cert => cert.category === selectedFilter);

	const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);
	const paginatedCertificates = filteredCertificates.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const handleFilterChange = (filter) => {
		setSelectedFilter(filter);
		setCurrentPage(1);
	};

	const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
	const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

	return (
		<section
			id="certificates"
			ref={sectionRef}
			className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-primary relative overflow-hidden transition-all duration-1000 ease-out scroll-mt-20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
				}`}
		>
			<div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-4 md:py-6">
				<h2 className="text-2xl md:text-3xl font-bold text-[#1de9b6] mb-8 text-center font-playfair uppercase tracking-widest">Certificates</h2>

				{/* Filters */}
				<div className="flex flex-wrap gap-2 justify-center mb-6">
					{FILTERS.map(f => (
						<button
							key={f.value}
							onClick={() => handleFilterChange(f.value)}
							className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-tighter border transition-all duration-300 ${selectedFilter === f.value ? 'bg-[#1de9b6] text-[#0a1a14] border-[#1de9b6] shadow-[0_0_15px_rgba(29,233,182,0.3)]' : 'bg-[#1a1a1a] text-[#1de9b6] border-[#1de9b6]/20 hover:border-[#1de9b6]/50'}`}
						>
							{f.label}
						</button>
					))}
				</div>

				{loading && (
					<div className="flex flex-col items-center justify-center py-12">
						<div className="w-10 h-10 border-2 border-[#1de9b6]/20 border-t-[#1de9b6] rounded-full animate-spin mb-4" />
						<div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Validating Seals...</div>
					</div>
				)}

				{(error || (!loading && !error && filteredCertificates.length === 0)) && (
					<div className="text-center py-12 text-gray-500 text-xs font-bold uppercase tracking-widest">
						{error ? "SYSTEM SYNC FAILED" : "NO CERTIFICATES MATCHING MATRIX"}
					</div>
				)}

				{!loading && !error && filteredCertificates.length > 0 && (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
							{paginatedCertificates.map(cert => (
								<Card3D
									key={cert.id}
									className={`relative bg-[#101c18] rounded-2xl p-0 overflow-hidden flex flex-col border transition-all duration-300 cursor-pointer w-full max-w-[340px] mx-auto min-h-[280px] ${hoveredId === cert.id ? 'shadow-[0_0_30px_rgba(29,233,182,0.25)] border-[#1de9b6]/50 bg-[#152a22]' : 'border-[#1de9b6]/10'}`}
								>
									<div
										onMouseEnter={() => setHoveredId(cert.id)}
										onMouseLeave={() => setHoveredId(null)}
										onClick={() => { setSelectedCert(cert); setModalOpen(true); }}
										className="flex flex-col h-full"
									>
										{/* Thumbnail Image */}
										<div className="w-full h-32 bg-[#0a1a14] relative overflow-hidden group/img">
											{cert.image ? (
												<img
													src={cert.image}
													alt={cert.title}
													className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110 opacity-100"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1de9b6]/15 to-[#00b894]/15">
													<span className="text-3xl opacity-50">📜</span>
												</div>
											)}
											<div className="absolute inset-0 bg-gradient-to-t from-[#101c18] via-transparent to-transparent opacity-40" />

											<div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
												<span className="text-[#1de9b6] text-[9px] font-black tracking-widest uppercase border border-[#1de9b6]/30 bg-[#0a1a14]/60 backdrop-blur-sm px-2 py-1 rounded-full">Verified</span>
											</div>
										</div>

										<div className="p-4 flex flex-col flex-1">
											<div className="flex items-center justify-between mb-2">
												<span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{cert.date}</span>
											</div>

											<h3 className="text-base font-bold text-white mb-1 line-clamp-1">{cert.title}</h3>
											<p className="text-[#1de9b6] text-[12px] font-semibold mb-2">{cert.issuer}</p>

											{cert.certificateId && (
												<p className="text-[11px] text-gray-500 font-mono mb-3 bg-black/30 px-2 py-1 rounded inline-block w-fit">
													ID: {cert.certificateId}
												</p>
											)}

											<p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
												{cert.description}
											</p>

											<button className="mt-auto w-full bg-[#1de9b6]/5 text-[#1de9b6] border border-[#1de9b6]/30 py-2.5 rounded-lg font-bold hover:bg-[#1de9b6] hover:text-[#0a1a14] transition-all text-xs uppercase tracking-widest shadow-inner">
												E-Verify
											</button>
										</div>
									</div>
								</Card3D>
							))}
						</div>

						{/* Pagination Controls */}
						{totalPages > 1 && (
							<div className="flex justify-center items-center gap-4 mt-8">
								<button
									onClick={prevPage}
									disabled={currentPage === 1}
									className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed border-gray-800 text-gray-600' : 'bg-[#1a1a1a] text-[#1de9b6] border-[#1de9b6]/20 hover:border-[#1de9b6]/50'}`}
								>
									Previous
								</button>
								<div className="text-[#1de9b6] text-xs font-bold uppercase tracking-widest">
									Page {currentPage} of {totalPages}
								</div>
								<button
									onClick={nextPage}
									disabled={currentPage === totalPages}
									className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed border-gray-800 text-gray-600' : 'bg-[#1a1a1a] text-[#1de9b6] border-[#1de9b6]/20 hover:border-[#1de9b6]/50'}`}
								>
									Next
								</button>
							</div>
						)}
					</>
				)}

				<CertificateModal
					isOpen={modalOpen}
					onClose={() => setModalOpen(false)}
					certificate={selectedCert}
				/>
			</div>
		</section>
	);
};

export default Certificates;