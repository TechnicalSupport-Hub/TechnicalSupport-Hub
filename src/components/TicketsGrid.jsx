import { useState, useMemo } from "react";
import { Search, X, Inbox, LayoutGrid } from "lucide-react";
import TicketCard from "./TicketCard";

export default function TicketsGrid({
  tickets = [],
  activeTab = "active",
  onViewDetails,
  onStatusChange,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const isHistorical =
        ticket.status === "Resolved" ||
        ticket.status === "Reject" ||
        ticket.status === "Rejected";

      // 1. Tab filter
      if (activeTab === "active" && isHistorical) return false;
      if (activeTab === "history" && !isHistorical) return false;

      // 2. Status pill filter
      if (statusFilter !== "All" && ticket.status !== statusFilter) {
        return false;
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = ticket.id?.toLowerCase().includes(query);
        const matchesUser = ticket.userId?.toLowerCase().includes(query);
        const matchesTitle = ticket.title?.toLowerCase().includes(query);
        return matchesId || matchesUser || matchesTitle;
      }

      return true;
    });
  }, [tickets, activeTab, statusFilter, searchQuery]);

  const filterOptions =
    activeTab === "active"
      ? ["All", "Processing", "Pending"]
      : ["All", "Resolved", "Reject"];

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto text-left">
      {/* Header Banner */}
      <section className="relative mb-6 overflow-hidden rounded-2xl bg-gray-950 px-6 py-6 sm:px-8 sm:py-7">
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#0084ff]/20 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#0084ff]/15 text-[#0084ff]">
              <LayoutGrid size={18} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {activeTab === "active"
                ? "Active Support Queue"
                : "Ticket History & Archive"}
            </h1>

            <p className="mt-1 max-w-xl text-sm text-gray-400">
              {activeTab === "active"
                ? "Overview of active support tickets. Click View Details for complete major details."
                : "Archived resolved resolutions and rejected ticket history."}
            </p>
          </div>

          <div className="self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-300 bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-xs">
              Showing:{" "}
              <span className="pt-0.5 text-[#0084ff] font-mono font-bold">
                {filteredTickets.length}
              </span>{" "}
              tickets
            </span>
          </div>
        </div>
      </section>

      {/* Search and Filters Bar */}
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
            placeholder="Search by ticket #, user ID, title..."
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
          <span className="text-xs font-bold text-gray-400 uppercase mr-1 hidden lg:inline">
            Filter:
          </span>
          {filterOptions.map((opt) => {
            const isSelected = statusFilter === opt;
            const displayLabel = opt === "Reject" ? "Rejected" : opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setStatusFilter(opt)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-[#0084ff] text-white shadow-sm"
                    : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {displayLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Ticket Cards */}
      {filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onViewDetails={onViewDetails}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-gray-50 border border-dashed border-gray-300 my-6">
          <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 mb-3 shadow-xs">
            <Inbox size={24} />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            No matching tickets found
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm">
            {searchQuery
              ? `No tickets matching "${searchQuery}". Try another keyword or clear filters.`
              : "There are currently no tickets in this view."}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All");
              }}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-[#0084ff] bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
