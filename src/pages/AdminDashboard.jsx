import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LayoutGrid, List } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import TicketsGrid from '../components/TicketsGrid';
import AdminHistoryTable from '../components/AdminHistoryTable';
import NotebookTicketList from '../components/NotebookTicketList';
import TicketDetailModal from '../components/TicketDetailModal';
import { useApp } from '../context/useApp';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { auth, logout, tickets, updateTicketStatus } = useApp();

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active & History counts
  const activeTicketsCount = tickets.filter(
    (t) => t.status === 'Pending' || t.status === 'Processing'
  ).length;

  const historyTicketsCount = tickets.filter(
    (t) =>
      t.status === 'Resolved' ||
      t.status === 'Reject' ||
      t.status === 'Rejected'
  ).length;

  const handleStatusChange = (ticketId, newStatus) => {
    updateTicketStatus(ticketId, newStatus);
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const handleSwitchToUserPortal = () => {
    navigate('/faq');
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-[calc(100vh-136px)] bg-white text-gray-900">
      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
            aria-label="Toggle admin sidebar"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="text-base font-bold text-gray-900">Admin Desk</span>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'active' && (
            <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md text-xs cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#0084ff] text-white'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
                title="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md text-xs cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#0084ff] text-white'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
                title="List view"
              >
                <List size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar - Desktop and Mobile Drawer */}
      <div
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } lg:block w-full lg:w-72 shrink-0`}
      >
        <AdminSidebar
          adminProfile={{
            name: auth.name || 'Alex Rivera',
            email: auth.email || 'admin@autoticket.com',
          }}
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setMobileMenuOpen(false);
          }}
          onSignOut={handleSignOut}
          activeTicketsCount={activeTicketsCount}
          historyTicketsCount={historyTicketsCount}
          onSwitchToUserPortal={handleSwitchToUserPortal}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Desktop View Switcher Bar for Active Queue */}
        {activeTab === 'active' && (
          <div className="hidden lg:flex items-center justify-end px-8 pt-5 pb-0">
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mr-2.5">
              <span>View Mode:</span>
            </div>
            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#0084ff] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutGrid size={15} />
                <span>Card Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#0084ff] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List size={15} />
                <span>Ledger Log</span>
              </button>
            </div>
          </div>
        )}

        {/* Content based on Active Tab */}
        {activeTab === 'active' ? (
          viewMode === 'grid' ? (
            <TicketsGrid
              tickets={tickets}
              activeTab="active"
              onViewDetails={(t) => setSelectedTicket(t)}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <NotebookTicketList
              tickets={tickets}
              onViewDetails={(t) => setSelectedTicket(t)}
              onStatusChange={handleStatusChange}
            />
          )
        ) : (
          <AdminHistoryTable
            tickets={tickets}
            onViewDetails={(t) => setSelectedTicket(t)}
          />
        )}
      </div>

      {/* Ticket Details Modal (Major Details View) */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}