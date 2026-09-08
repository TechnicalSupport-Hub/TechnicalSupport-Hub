import { useState, useRef, useEffect } from 'react';
import { 
  Clock, 
  ChevronDown, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Eye
} from 'lucide-react';

const STATUS_CONFIGS = {
  Pending: {
    label: 'Pending',
    pillBg: 'bg-amber-50 text-amber-700 border-amber-200',
    dotBg: 'bg-amber-500',
    icon: Clock,
  },
  Processing: {
    label: 'Processing',
    pillBg: 'bg-blue-50 text-blue-700 border-blue-200',
    dotBg: 'bg-[#0084ff]',
    icon: AlertCircle,
  },
  Resolved: {
    label: 'Resolved',
    pillBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotBg: 'bg-emerald-500',
    icon: CheckCircle2,
  },
  Reject: {
    label: 'Rejected',
    pillBg: 'bg-rose-50 text-rose-700 border-rose-200',
    dotBg: 'bg-rose-500',
    icon: XCircle,
  },
};

export default function TicketCard({ ticket, onViewDetails, onStatusChange }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Normalize status key
  const normalizedStatus =
    ticket.status === 'Rejected' ? 'Reject' : ticket.status || 'Pending';
  const statusConfig = STATUS_CONFIGS[normalizedStatus] || STATUS_CONFIGS.Pending;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectStatus = (newStatus) => {
    onStatusChange?.(ticket.id, newStatus);
    setDropdownOpen(false);
  };

  return (
    <div className="rounded-2xl p-6 bg-white border border-gray-200 hover:border-[#0084ff]/50 transition-all flex flex-col justify-between text-left shadow-sm hover:shadow-md group">
      <div>
        {/* Top Bar: Ticket ID, User ID, and Status */}
        <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-[#0084ff] bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
              #{ticket.id}
            </span>
            <span className="text-xs sm:text-sm font-mono font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
              {ticket.userId}
            </span>
          </div>

          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border ${statusConfig.pillBg}`}
          >
            <span className={`w-2 h-2 rounded-full ${statusConfig.dotBg}`}></span>
            <span>{statusConfig.label}</span>
          </span>
        </div>

        {/* Issue Title (Prominent & Clear, Minimal Overview) */}
        <h3
          className="text-base sm:text-lg font-bold text-gray-900 leading-snug line-clamp-2 mb-6 group-hover:text-[#0084ff] transition-colors"
          title={ticket.title}
        >
          {ticket.title}
        </h3>
      </div>

      {/* Action Controls: View Details + Status Dropdown */}
      <div className="space-y-2.5 pt-3 border-t border-gray-100">
        {/* View Details Button */}
        <button
          type="button"
          onClick={() => onViewDetails(ticket)}
          className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-gray-800 hover:text-white bg-gray-50 hover:bg-[#0084ff] border border-gray-200 hover:border-[#0084ff] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          <Eye size={16} className="text-[#0084ff] group-hover:text-white" />
          <span>View Details</span>
        </button>

        {/* Styled Status Dropdown */}
        <div className="relative w-full" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-between transition-colors cursor-pointer"
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${statusConfig.dotBg}`}></span>
              <span className="text-gray-500 font-medium">Status:</span>
              <span className="text-gray-900 font-bold">{statusConfig.label}</span>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180 text-[#0084ff]' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu Options */}
          {dropdownOpen && (
            <div className="absolute left-0 right-0 bottom-full mb-2 z-30 p-1.5 rounded-xl bg-white border border-gray-200 shadow-xl space-y-1">
              <div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Change Status
              </div>

              {['Processing', 'Reject', 'Resolved'].map((statusKey) => {
                const cfg = STATUS_CONFIGS[statusKey];
                const isSelected = normalizedStatus === statusKey;
                return (
                  <button
                    key={statusKey}
                    type="button"
                    onClick={() => handleSelectStatus(statusKey)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 text-[#0084ff] font-bold'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${cfg.dotBg}`}></span>
                      <span>{statusKey === 'Reject' ? 'Reject' : cfg.label}</span>
                    </div>
                    {isSelected && (
                      <span className="text-xs text-[#0084ff] font-bold">Current</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
