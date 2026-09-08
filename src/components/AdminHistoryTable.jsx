import { useState, useMemo } from 'react';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Eye, 
  X,
  History
} from 'lucide-react';

const HISTORY_FILTER_TABS = [
  { id: 'All', label: 'All' },
  { id: 'Resolved', label: 'Resolved (Success)', countKey: 'Resolved' },
  { id: 'Reject', label: 'Rejected (Fail)', countKey: 'Reject' },
  { id: 'Processing', label: 'Processing', countKey: 'Processing' },
];

export default function AdminHistoryTable({
  tickets = [],
  onViewDetails,
}) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Count helper
  const counts = useMemo(() => {
    return tickets.reduce((acc, t) => {
      const norm = t.status === 'Rejected' ? 'Reject' : t.status;
      acc[norm] = (acc[norm] || 0) + 1;
      return acc;
    }, {});
  }, [tickets]);

  // Filter logic
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const norm = t.status === 'Rejected' ? 'Reject' : t.status;

      if (activeTab !== 'All' && norm !== activeTab) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = t.id.toLowerCase().includes(q);
        const matchUser = t.userId?.toLowerCase().includes(q);
        const matchTitle = t.title?.toLowerCase().includes(q);
        return matchId || matchUser || matchTitle;
      }

      return true;
    });
  }, [tickets, activeTab, searchQuery]);

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto text-left">
      {/* Header Banner with Dark Black & Blue Gradient Theme */}
      <section className="relative mb-6 overflow-hidden rounded-2xl bg-gray-950 px-6 py-6 sm:px-8 sm:py-7">
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
              Showing: <span className="text-[#0084ff] font-mono font-bold">{filteredTickets.length}</span> records
            </span>
          </div>
        </div>
      </section>

      {/* Search and Tabs Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
        {/* Search bar */}
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
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filterable Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          {HISTORY_FILTER_TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            const count = tab.id === 'All' ? tickets.length : (counts[tab.countKey] || 0);

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? tab.id === 'Resolved'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : tab.id === 'Reject'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-[#0084ff] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clean Light Table of Tickets */}
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
                  const normStatus = t.status === 'Rejected' ? 'Reject' : t.status;
                  const isResolved = normStatus === 'Resolved';
                  const isReject = normStatus === 'Reject';
                  const isProcessing = normStatus === 'Processing';

                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      {/* Ticket ID */}
                      <td className="py-4 px-5 font-mono text-sm sm:text-base font-bold text-[#0084ff] whitespace-nowrap">
                        #{t.id}
                      </td>

                      {/* User ID */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="font-mono text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
                          {t.userId}
                        </span>
                      </td>

                      {/* Issue Title (Clean, Bold, No description) */}
                      <td className="py-4 px-5">
                        <div
                          className="font-bold text-sm sm:text-base text-gray-900 line-clamp-1 group-hover:text-[#0084ff] transition-colors"
                          title={t.title}
                        >
                          {t.title}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        {isResolved && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={14} />
                            <span>Resolved</span>
                          </span>
                        )}
                        {isReject && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle size={14} />
                            <span>Rejected</span>
                          </span>
                        )}
                        {isProcessing && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <AlertCircle size={14} />
                            <span>Processing</span>
                          </span>
                        )}
                        {!isResolved && !isReject && !isProcessing && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <span>{t.status}</span>
                          </span>
                        )}
                      </td>

                      {/* Action */}
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
                    No tickets found matching the filter criteria.
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
