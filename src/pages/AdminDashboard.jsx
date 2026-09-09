import { useState } from "react";
import { Menu, X } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHistoryTable from "../components/AdminHistoryTable";
import NotebookTicketList from "../components/NotebookTicketList";
import TicketDetailModal from "../components/TicketDetailModal";
import AdminFaqManager from "../components/AdminFaqManager";
import AdminIssueClustering from "../components/AdminIssueClustering";
import { useApp } from "../context/useApp";

export default function AdminDashboard() {
  const { auth, tickets, updateTicketStatus, faqs } = useApp();

  const [activeTab, setActiveTab] = useState("active");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeTicketsCount = tickets.filter(
    (t) => t.status === "Pending" || t.status === "Processing"
  ).length;

  const historyTicketsCount = tickets.filter(
    (t) =>
      t.status === "Resolved" ||
      t.status === "Reject" ||
      t.status === "Rejected"
  ).length;

  const handleStatusChange = (ticketId, newStatus) => {
    updateTicketStatus(ticketId, newStatus);
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-[calc(100vh-68px)] bg-white text-gray-900">
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
      </div>

      <div
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } lg:block w-full lg:w-72 shrink-0 border-r border-gray-200 lg:h-[calc(100vh-68px)] lg:sticky lg:top-[68px] overflow-y-auto bg-white`}
      >
        <AdminSidebar
          adminProfile={{
            name: auth.name || "Alex Rivera",
            email: auth.email || "admin@autoticket.com",
          }}
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setMobileMenuOpen(false);
          }}
          activeTicketsCount={activeTicketsCount}
          historyTicketsCount={historyTicketsCount}
          faqsCount={faqs.length}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-y-auto">
        {activeTab === "active" && (
          <NotebookTicketList
            tickets={tickets}
            onViewDetails={(t) => setSelectedTicket(t)}
            onStatusChange={handleStatusChange}
          />
        )}

        {activeTab === "history" && (
          <AdminHistoryTable
            tickets={tickets}
            onViewDetails={(t) => setSelectedTicket(t)}
          />
        )}

        {activeTab === "clustering" && <AdminIssueClustering />}

        {activeTab === "faqs" && <AdminFaqManager />}
      </div>

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