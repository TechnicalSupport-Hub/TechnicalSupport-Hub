import { 
  ShieldCheck, 
  Inbox, 
  History, 
  LogOut, 
  Ticket,
  ExternalLink,
  Layers,
  HelpCircle
} from 'lucide-react';

export default function AdminSidebar({
  adminProfile,
  activeTab, // 'active' | 'history' | 'clustering' | 'faqs'
  onSelectTab,
  onSignOut,
  activeTicketsCount = 0,
  historyTicketsCount = 0,
  faqsCount = 0,
  onSwitchToUserPortal,
}) {
  return (
    <aside className="w-full lg:w-72 shrink-0 flex flex-col justify-between p-5 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 text-left">
      {/* Top: Profile Section */}
      <div className="space-y-6">

        {/* Admin Profile Box */}
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center gap-3.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#0084ff] to-blue-700 p-0.5">
              <div className="w-full h-full rounded-xl bg-white flex items-center justify-center text-[#0084ff] font-bold text-base">
                {adminProfile?.name
                  ? adminProfile.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                  : 'AR'}
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-gray-900 truncate">
                {adminProfile?.name || 'Alex Rivera'}
              </h4>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0084ff] border border-blue-200">
                <ShieldCheck size={12} />
                <span>Admin</span>
              </span>
            </div>
          </div>
        </div>

        {/* Middle Navigation */}
        <nav className="space-y-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-1 block">
            Ticket Management
          </span>

          <button
            type="button"
            onClick={() => onSelectTab('active')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'active'
                ? 'bg-[#0084ff] text-white shadow-sm'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Inbox size={18} />
              <span>Active Queue</span>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                activeTab === 'active'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {activeTicketsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('history')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#0084ff] text-white shadow-sm'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <History size={18} />
              <span>Ticket History</span>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                activeTab === 'history'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {historyTicketsCount}
            </span>
          </button>

          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 pt-3 mb-1 block">
            Knowledge & Analytics
          </span>

          <button
            type="button"
            onClick={() => onSelectTab('clustering')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'clustering'
                ? 'bg-[#0084ff] text-white shadow-sm'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers size={18} />
              <span>Issue Trends</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('faqs')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'faqs'
                ? 'bg-[#0084ff] text-white shadow-sm'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <HelpCircle size={18} />
              <span>FAQ Manager</span>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                activeTab === 'faqs'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {faqsCount}
            </span>
          </button>
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="pt-6 mt-6 border-t border-gray-200 space-y-2.5">
        <button
          type="button"
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
