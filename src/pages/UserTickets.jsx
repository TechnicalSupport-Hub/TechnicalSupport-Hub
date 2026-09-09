import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Ticket,
  Plus,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Inbox,
  Search,
  X,
} from "lucide-react";
import { useApp } from "../context/useApp";
import TicketDetailModal from "../components/TicketDetailModal";

const STATUS_FILTERS = [
  { id: "All", label: "All Tickets" },
  { id: "Pending", label: "Pending" },
  { id: "Processing", label: "Processing" },
  { id: "Resolved", label: "Resolved" },
  { id: "Reject", label: "Rejected" },
];

export default function UserTickets() {
  const { tickets, auth } = useApp();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const userTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesUser =
        t.userId === auth.id ||
        (auth.email && t.userEmail?.toLowerCase() === auth.email.toLowerCase());
      return matchesUser;
    });
  }, [tickets, auth.id, auth.email]);

  const filteredTickets = useMemo(() => {
    return userTickets.filter((t) => {
      const normStatus = t.status === "Rejected" ? "Reject" : t.status;

      if (activeFilter !== "All" && normStatus !== activeFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = t.id?.toLowerCase().includes(q);
        const matchesTitle = t.title?.toLowerCase().includes(q);
        return matchesId || matchesTitle;
      }

      return true;
    });
  }, [userTickets, activeFilter, searchQuery]);

  return (
    <main className="w-full flex-1">
      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14 text-left">
        <section className="relative mb-8 overflow-hidden rounded-2xl bg-gray-950 px-6 py-7 sm:px-8 sm:py-9">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#0084ff]/20 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#0084ff]/15 text-[#0084ff]">
                <Ticket size={18} />
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                My Support Tickets
              </h1>

              <p className="mt-1 max-w-xl text-sm text-gray-400">
                Track the live review and resolution progress of your submitted complaints.
              </p>
            </div>

            <Link
              to="/create-ticket"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0084ff] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0074e0] cursor-pointer shadow-sm"
            >
              <Plus size={16} />
              <span>Raise New Ticket</span>
            </Link>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-200">
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket # or title..."
              className="w-full pl-10 pr-9 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {STATUS_FILTERS.map((tab) => {
              const isSelected = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-[#0084ff] text-white shadow-sm"
                      : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {filteredTickets.length > 0 ? (
          <div className="space-y-3">
            {filteredTickets.map((ticket) => {
              const normStatus =
                ticket.status === "Rejected" ? "Reject" : ticket.status || "Pending";

              return (
                <div
                  key={ticket.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm hover:border-[#0084ff]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-sm font-bold text-[#0084ff] bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                        #{ticket.id}
                      </span>

                      {normStatus === "Pending" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock size={13} className="text-amber-500" />
                          <span>Pending Review</span>
                        </span>
                      )}
                      {normStatus === "Processing" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          <AlertCircle size={13} className="text-[#0084ff]" />
                          <span>Processing</span>
                        </span>
                      )}
                      {normStatus === "Resolved" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={13} className="text-emerald-500" />
                          <span>Resolved</span>
                        </span>
                      )}
                      {normStatus === "Reject" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle size={13} className="text-rose-500" />
                          <span>Rejected</span>
                        </span>
                      )}

                      <span className="text-xs text-gray-400 font-medium">
                        {ticket.createdAt}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                      {ticket.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                      {ticket.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedTicket(ticket)}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gray-50 hover:bg-[#0084ff] text-gray-800 hover:text-white border border-gray-200 hover:border-[#0084ff] px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer shadow-2xs"
                  >
                    <Eye size={15} />
                    <span>View Details</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <Inbox size={32} className="mx-auto mb-2 text-gray-400" />
            <p className="text-base font-bold text-gray-800">
              No tickets found
            </p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              {userTickets.length === 0
                ? "You haven't submitted any support complaints yet."
                : "No tickets matching the selected filter."}
            </p>

            {userTickets.length === 0 && (
              <Link
                to="/create-ticket"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0084ff] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0074e0] transition-colors"
              >
                <Plus size={14} />
                <span>Raise a Complaint</span>
              </Link>
            )}
          </div>
        )}

        {selectedTicket && (
          <TicketDetailModal
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
          />
        )}
      </div>
    </main>
  );
}
