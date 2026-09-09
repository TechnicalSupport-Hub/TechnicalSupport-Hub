import { Navigate } from "react-router-dom";
import { useApp } from "../context/useApp";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { auth, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <svg
            className="h-5 w-5 animate-spin text-[#0084ff]"
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
          <span>Loading session...</span>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && auth.role !== "admin") {
    return <Navigate to="/tickets" replace />;
  }

  return children;
}
