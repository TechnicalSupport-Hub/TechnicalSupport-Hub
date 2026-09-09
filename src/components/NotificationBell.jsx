import { useState, useRef, useEffect } from "react";
import { Bell, Check, Ticket, Inbox } from "lucide-react";
import { useApp } from "../context/useApp";

export default function NotificationBell() {
  const { notifications, markNotificationRead, clearAllNotifications } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
        aria-label="View notifications"
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0084ff] text-white text-xs font-bold ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute -right-20 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-gray-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-blue-100 text-[#0084ff] text-xs font-semibold px-2 py-0.5">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={clearAllNotifications}
                className="text-xs font-semibold text-[#0084ff] hover:text-[#0074e0] cursor-pointer flex items-center gap-1"
              >
                <Check size={13} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                    n.isRead ? "bg-white hover:bg-gray-50" : "bg-blue-50/50 hover:bg-blue-50"
                  }`}
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[#0084ff]">
                    <Ticket size={14} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-gray-900 truncate">
                        {n.title}
                      </h4>
                      <span className="text-xs text-gray-400 font-mono shrink-0">
                        {n.createdAt}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {n.message}
                    </p>
                  </div>

                  {!n.isRead && (
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-[#0084ff] shrink-0" />
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                <Inbox size={24} className="mb-2 text-gray-300" />
                <p className="text-xs font-medium">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  You'll be alerted when an admin updates your ticket.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
