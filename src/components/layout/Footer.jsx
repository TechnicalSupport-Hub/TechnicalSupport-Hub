import { HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 sm:flex-row sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400 text-white shadow-sm">
            <HeartHandshake size={24} strokeWidth={2.2} />
          </div>
          <span className="text-xl font-bold tracking-[-0.02em] text-gray-900">
            Help Desk
          </span>

          <span className="hidden text-gray-300 sm:inline">·</span>
        </div>

        <nav className="flex items-center gap-5 text-xs font-medium text-gray-500">
          <Link to="/faq" className="transition-colors hover:text-gray-900">
            Privacy
          </Link>

          <Link to="/faq" className="transition-colors hover:text-gray-900">
            Terms
          </Link>

          <Link to="/faq" className="transition-colors hover:text-blue-600">
            Help Center
          </Link>
        </nav>
      </div>
    </footer>
  );
}
