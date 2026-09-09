import { useState, useMemo } from "react";
import { Search, Eye, X, BookOpen, Inbox } from "lucide-react";

export default function NotebookTicketList({
  tickets = [],
  onViewDetails,
  onStatusChange,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Active queue filters out resolved / rejected
      const isHistorical =
        ticket.status === "Resolved" ||
        ticket.status === "Reject" ||
        ticket.status === "Rejected";

      if (isHistorical) return false;

      if (statusFilter !== "All" && ticket.status !== statusFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchId = ticket.id?.toLowerCase().includes(query);
        const matchUser = ticket.userId?.toLowerCase().includes(query);
        const matchTitle = ticket.title?.toLowerCase().includes(query);
        return matchId || matchUser || matchTitle;
      }

      return true;
    });
  }, [tickets, statusFilter, searchQuery]);

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto text-left">
      {/* Header Banner */}
      <section className="relative mb-6 overflow-hidden rounded-2xl bg-gray-950 px-6 py-6 sm:px-8 sm:py-7">
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#0084ff]/20 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#0084ff]/15 text-[#0084ff]">
              <BookOpen size={18} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Active Support Queue (Log View)
            </h1>

            <p className="mt-1 max-w-xl text-sm text-gray-400">
              Overview list of active user inquiries and triage statuses.
            </p>
          </div>

          <div className="self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-300 bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-xs">
              Total Queue:{" "}
              <span className="pt-0.5 text-[#0084ff] font-mono font-bold">
                {filteredTickets.length}
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Search Bar and Filter Badges */}
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
            placeholder="Search by ticket ID, user ID, title..."
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

        {/* Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {["All", "Pending", "Processing"].map((opt) => {
            const isSelected = statusFilter === opt;

            return (
              <button
                key={opt}
                type="button"
                onClick={() => setStatusFilter(opt)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-[#0084ff] text-white shadow-sm"
                    : "bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ruled Container */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider items-center">
          <div className="col-span-2">Ticket ID</div>
          <div className="col-span-2">User ID</div>
          <div className="col-span-5">Issue Title</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {filteredTickets.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center text-sm hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-2 font-mono font-bold text-sm sm:text-base text-[#0084ff]">
                  #{ticket.id}
                </div>

                <div className="col-span-2 flex items-center">
                  <span className="font-mono text-xs sm:text-sm font-medium px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 border border-gray-200">
                    {ticket.userId}
                  </span>
                </div>

                <div className="col-span-5 pr-2">
                  <p
                    onClick={() => onViewDetails(ticket)}
                    className="font-bold text-sm sm:text-base text-gray-900 hover:text-[#0084ff] cursor-pointer truncate transition-colors"
                    title={ticket.title}
                  >
                    {ticket.title}
                  </p>
                </div>

                <div className="col-span-2 flex justify-center">
                  <select
                    value={ticket.status}
                    onChange={(e) => onStatusChange?.(ticket.id, e.target.value)}
                    className={`text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0084ff] ${
                      ticket.status === "Processing"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Reject">Reject</option>
                  </select>
                </div>

                <div className="col-span-1 text-right">
                  <button
                    type="button"
                    onClick={() => onViewDetails(ticket)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-gray-50 hover:bg-[#0084ff] text-gray-800 hover:text-white border border-gray-200 transition-colors cursor-pointer shadow-2xs"
                    title="Open details modal"
                  >
                    <Eye size={14} />
                    <span className="hidden sm:inline">View</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-sm text-gray-400">
            <Inbox size={24} className="mx-auto mb-2 text-gray-300" />
            No active tickets matching the current filter.
          </div>
        )}
      </div>
    </div>
  );
}
