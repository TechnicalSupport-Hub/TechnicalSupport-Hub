import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 sm:flex-row sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white">
            <span className="text-[11px] font-semibold">A</span>
          </div>

          <span className="text-sm font-medium tracking-[-0.01em] text-gray-700">
            AutoTicket
          </span>

          <span className="hidden text-gray-300 sm:inline">·</span>

          <span className="hidden text-xs text-gray-400 sm:inline">
            Support System
          </span>
        </div>

        <nav className="flex items-center gap-5 text-xs font-medium text-gray-500">
          <Link
            to="/privacy"
            className="transition-colors hover:text-gray-900"
          >
            Privacy
          </Link>

          <Link
            to="/terms"
            className="transition-colors hover:text-gray-900"
          >
            Terms
          </Link>

          <Link
            to="/faq"
            className="transition-colors hover:text-blue-600"
          >
            Help Center
          </Link>
        </nav>
      </div>
    </footer>
  );
}
