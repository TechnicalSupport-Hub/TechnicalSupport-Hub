import {
  HelpCircle,
  HeartHandshake,
  ShieldCheck,
  Ticket,
  Plus,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/useApp";
import NotificationBell from "../NotificationBell";

export default function Header() {
  const { auth, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0084ff] text-white shadow-sm">
            <HeartHandshake size={22} strokeWidth={2.2} />
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xl font-bold tracking-[-0.02em] text-gray-900">
              AutoTicket
            </span>
          </div>
        </Link>

        {/* Navigation & Controls */}
        <nav className="flex items-center gap-2 sm:gap-3">
          {/* FAQ link */}
          <Link
            to="/faq"
            className="group flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <HelpCircle
              size={16}
              strokeWidth={1.9}
              className="text-gray-400 transition-colors group-hover:text-[#0084ff]"
            />
            <span>FAQ</span>
          </Link>

          {/* Regular User Navigation */}
          {auth.isAuthenticated && auth.role !== "admin" && (
            <>
              {/* My Tickets */}
              <Link
                to="/tickets"
                className="group flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                title="View your submitted complaints & status"
              >
                <Ticket
                  size={16}
                  strokeWidth={1.9}
                  className="text-gray-400 transition-colors group-hover:text-[#0084ff]"
                />
                <span>My Tickets</span>
              </Link>

              {/* Raise Ticket */}
              <Link
                to="/create-ticket"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0084ff] border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <Plus size={14} />
                <span>Raise Ticket</span>
              </Link>

              {/* User Notifications (ONLY FOR USERS) */}
              <NotificationBell />
            </>
          )}

          {/* Admin Navigation */}
          {auth.isAuthenticated && auth.role === "admin" && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0084ff] border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <ShieldCheck size={14} />
              <span>Admin Desk</span>
            </Link>
          )}

          {/* User Profile */}
          {auth.isAuthenticated && (
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors border border-gray-200"
              title="Profile Settings"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0084ff] text-white text-xs font-bold">
                {auth.name ? auth.name[0].toUpperCase() : "U"}
              </div>
              <span className="hidden md:inline font-semibold">
                {auth.name ? auth.name.split(" ")[0] : "Profile"}
              </span>
            </Link>
          )}

          {/* Logout Button directly on Navbar */}
          {auth.isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
