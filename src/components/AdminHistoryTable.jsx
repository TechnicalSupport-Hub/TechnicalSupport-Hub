import { useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  History,
  Inbox,
} from "lucide-react";

const HISTORY_TABS = [
  { id: "All", label: "All History" },
  { id: "Resolved", label: "Resolved (Success)" },
  { id: "Reject", label: "Rejected" },
];

export default function AdminHistoryTable({ tickets = [], onViewDetails }) {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const historyTickets = useMemo(() => {
    return tickets.filter(
      (t) => t.status === "Resolved" || t.status === "Reject" || t.status === "Rejected"
    );
  }, [tickets]);

  const resolvedCount = historyTickets.filter((t) => t.status === "Resolved").length;
  const rejectCount = historyTickets.filter(
    (t) => t.status === "Reject" || t.status === "Rejected"
  ).length;

  const filteredTickets = useMemo(() => {
    return historyTickets.filter((t) => {
      const normalizedStatus = t.status === "Rejected" ? "Reject" : t.status;

      if (activeTab !== "All" && normalizedStatus !== activeTab) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = t.id?.toLowerCase().includes(q);
        const matchUser = t.userId?.toLowerCase().includes(q);
        const matchTitle = t.title?.toLowerCase().includes(q);
        return matchId || matchUser || matchTitle;
      }

      return true;
    });
  }, [historyTickets, activeTab, searchQuery]);

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto text-left">
      <section className="relative mb-6 rounded-2xl bg-gray-950 px-6 py-6 sm:px-8 sm:py-7">
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#0084ff]/20 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#0084ff]/15 text-[#0084ff]">
              <History size={18} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Ticket History & Archive
            </h1>

            <p className="mt-1 max-w-xl text-sm text-gray-400">
              Overview log of resolved resolutions and rejected ticket claims. Click View for major details.
            </p>
          </div>

          <div className="self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-300 bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-xs">
              Showing:{" "}
              <span className="pt-0.5 text-[#0084ff] font-mono font-bold">
                {filteredTickets.length}
              </span>{" "}
              records
            </span>
          </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
        <div className="relative w-full lg:w-80">
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

        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          {HISTORY_TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            const count =
              tab.id === "All"
                ? historyTickets.length
                : tab.id === "Resolved"
                ? resolvedCount
                : rejectCount;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? tab.id === "Resolved"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : tab.id === "Reject"
                      ? "bg-rose-600 text-white shadow-sm"
                      : "bg-[#0084ff] text-white shadow-sm"
                    : "bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-4 px-5">Ticket ID</th>
                <th className="py-4 px-5">User ID</th>
                <th className="py-4 px-5">Issue Title</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((t) => {
                  const isResolved = t.status === "Resolved";

                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="py-4 px-5 font-mono text-sm sm:text-base font-bold text-[#0084ff] whitespace-nowrap">
                        #{t.id}
                      </td>

                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="font-mono text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
                          {t.userId}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <div
                          className="font-bold text-sm sm:text-base text-gray-900 line-clamp-1 group-hover:text-[#0084ff] transition-colors"
                          title={t.title}
                        >
                          {t.title}
                        </div>
                      </td>

                      <td className="py-4 px-5 whitespace-nowrap">
                        {isResolved ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={14} />
                            <span>Resolved</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle size={14} />
                            <span>Rejected</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onViewDetails(t)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold text-gray-800 hover:text-white bg-gray-50 hover:bg-[#0084ff] border border-gray-200 transition-colors cursor-pointer shadow-2xs"
                        >
                          <Eye size={15} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-gray-400">
                    <Inbox size={24} className="mx-auto mb-2 text-gray-300" />
                    No historical tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
