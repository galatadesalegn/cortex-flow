import React from "react";

const SectionTitle = ({ subtitle, title, align = "center" }) => {
	const alignmentClasses = {
		left: "text-left",
		center: "text-center",
		right: "text-right",
	};

	return (
		<div className={`mb-12 ${alignmentClasses[align]}`}>
			{subtitle && (
				<p className="text-[#1de9b6] font-medium text-base uppercase tracking-wider mb-3">
					{subtitle}
				</p>
			)}
			{title && (
				<h2 className="text-4xl md:text-5xl font-bold text-white">
					{title}
				</h2>
			)}
			<div
				className={`mt-4 ${align === "center"
						? "mx-auto"
						: align === "right"
							? "ml-auto"
							: "mr-auto"
					}`}
			>
				<div className="h-1 w-20 bg-[#1de9b6] rounded" />
			</div>
		</div>
	);
};

export default SectionTitle;