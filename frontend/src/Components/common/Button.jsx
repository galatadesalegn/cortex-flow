import React from "react";

const Button = ({
	children,
	variant = "primary",
	onClick,
	type = "button",
	disabled = false,
	className = "",
}) => {
	const baseStyles =
		"inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

	const variants = {
		primary:
			"bg-[#1de9b6] hover:bg-[#14b98a] text-[#0c221b] shadow-lg hover:shadow-xl",
		secondary:
			"bg-transparent border-2 border-[#1de9b6] text-[#1de9b6] hover:bg-[#1de9b6] hover:text-[#0c221b]",
		outline:
			"bg-transparent border border-gray-600 text-gray-300 hover:border-[#1de9b6] hover:text-[#1de9b6]",
	};

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`${baseStyles} ${variants[variant]} ${className}`}
		>
			{children}
		</button>
	);
};

export default Button;