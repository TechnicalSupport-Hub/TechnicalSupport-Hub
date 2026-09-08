export default function Button({
  children,
  type = "button",
  variant = "primary",
  fullWidth = false,
  className = "",
  disabled = false,
  isLoading = false,
  onClick,
  ...props
}) {
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
    secondary:
      "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:text-gray-300",
    ghost:
      "text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:text-gray-300",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed ${
        variants[variant] || variants.primary
      } ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="h-4 w-4 animate-spin text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}