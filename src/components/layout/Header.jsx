import { HelpCircle, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400 text-white shadow-sm">
            <HeartHandshake size={24} strokeWidth={2.2} />
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xl font-bold tracking-[-0.02em] text-gray-900">
              Help Desk
            </span>
          </div>
        </Link>

        <nav className="flex items-center">
          <Link
            to="/faq"
            className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <HelpCircle
              size={16}
              strokeWidth={1.9}
              className="text-gray-400 transition-colors group-hover:text-blue-600"
            />
            <span>FAQ</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
