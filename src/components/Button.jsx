import React from "react";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  fullWidth = false,
  className = "",
}) {
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
    ghost:
      "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
        variants[variant] || variants.primary
      } ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  );
}