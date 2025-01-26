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
			"bg-accent hover:bg-accent-hover text-dark-primary shadow-soft hover:shadow-lg",
		secondary:
			"bg-bg-secondary text-accent border border-border-theme hover:bg-bg-accent",
		outline:
			"bg-transparent border border-border-theme text-theme-secondary hover:border-accent hover:text-accent",
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