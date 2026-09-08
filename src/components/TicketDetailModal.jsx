import { 
  X, 
  User, 
  Mail, 
  Calendar, 
  FileText, 
  Paperclip, 
  Download
} from 'lucide-react';

export default function TicketDetailModal({
  ticket,
  onClose,
  onStatusChange,
}) {
  if (!ticket) return null;

  const normalizedStatus =
    ticket.status === 'Rejected' ? 'Reject' : ticket.status || 'Pending';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-gray-200 shadow-2xl text-left overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Dark Black & Blue Gradient Theme */}
        <div className="relative overflow-hidden bg-gray-950 px-6 py-5 border-b border-gray-800">
          <div className="absolute -right-10 -top-14 h-36 w-36 rounded-full bg-[#0084ff]/25 blur-2xl" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-white bg-[#0084ff] px-3.5 py-1 rounded-lg shadow-xs">
                #{ticket.id}
              </span>
              <span className="text-base font-bold text-gray-100">
                Ticket Details
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body (Major Details View) */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* User & Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-xs uppercase font-bold text-gray-400 flex items-center gap-1.5 mb-1">
                <User size={13} /> User Name
              </span>
              <p className="text-sm font-bold text-gray-900 truncate">
                {ticket.userName || 'Anonymous User'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-xs uppercase font-bold text-gray-400 flex items-center gap-1.5 mb-1">
                <Mail size={13} /> Email
              </span>
              <p className="text-sm font-bold text-gray-900 truncate" title={ticket.userEmail}>
                {ticket.userEmail || 'user@company.com'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-xs uppercase font-bold text-gray-400 flex items-center gap-1.5 mb-1">
                <FileText size={13} /> User ID
              </span>
              <p className="text-sm font-mono font-bold text-gray-800 truncate">
                {ticket.userId || 'USR-AUTO'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-xs uppercase font-bold text-gray-400 flex items-center gap-1.5 mb-1">
                <Calendar size={13} /> Created Date
              </span>
              <p className="text-sm font-semibold text-gray-700 truncate">
                {ticket.createdAt || '2026-09-07'}
              </p>
            </div>
          </div>

          {/* Issue Title */}
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
              Issue Title
            </span>
            <h3 className="text-xl font-extrabold text-gray-900 leading-snug">
              {ticket.title}
            </h3>
          </div>

          {/* Full Issue Description */}
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Full Description
            </span>
            <div className="p-4.5 rounded-xl bg-gray-50 border border-gray-200 text-sm sm:text-base text-gray-800 leading-relaxed whitespace-pre-line">
              {ticket.description}
            </div>
          </div>

          {/* Attachment Area */}
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Attachment Evidence
            </span>

            {ticket.attachment ? (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {ticket.attachment.previewUrl || ticket.attachment.url ? (
                    <img
                      src={ticket.attachment.previewUrl || ticket.attachment.url}
                      alt="Attachment screenshot"
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0084ff]">
                      <Paperclip size={24} />
                    </div>
                  )}
                  <div>
                    <h5 className="text-sm font-bold text-gray-900">
                      {ticket.attachment.name || 'screenshot.png'}
                    </h5>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {ticket.attachment.size || 'Image Evidence'}
                    </p>
                  </div>
                </div>

                <a
                  href={ticket.attachment.previewUrl || ticket.attachment.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 transition-colors"
                >
                  <Download size={15} />
                  <span>Download File</span>
                </a>
              </div>
            ) : (
              <div className="p-4.5 rounded-xl bg-gray-50 border border-dashed border-gray-200 text-center text-sm text-gray-400">
                No attachments uploaded with this ticket.
              </div>
            )}
          </div>

          {/* Update Status Quick Action inside Modal */}
          <div className="p-4.5 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            <div>
              <span className="text-sm font-bold text-gray-900 block">
                Update Ticket Status
              </span>
              <span className="text-xs text-gray-500">
                Immediately updates ticket status across the application.
              </span>
            </div>

            <div className="flex items-center gap-2">
              {['Pending', 'Processing', 'Reject', 'Resolved'].map((st) => {
                const isSelected = normalizedStatus === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => onStatusChange?.(ticket.id, st)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors border cursor-pointer ${
                      isSelected
                        ? st === 'Resolved'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : st === 'Reject'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : st === 'Processing'
                          ? 'bg-[#0084ff] text-white border-[#0084ff] shadow-xs'
                          : 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    {st === 'Reject' ? 'Rejected' : st}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer with Close button */}
        <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
