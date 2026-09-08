import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  id,
  label,
  type = "text",
  placeholder,
  required = false,
  error,
  value,
  onChange,
  className = "",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          } ${isPassword ? "pr-10" : ""} ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 transition-colors hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}