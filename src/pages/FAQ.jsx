import { useState, useMemo } from "react";
import {
  ChevronDown,
  ArrowRight,
  HelpCircle,
  Inbox,
  Plus,
  Search,
  X,
  Ticket,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/useApp";

export default function FAQ() {
  const { faqs, isLoading, auth } = useApp();
  const [openId, setOpenId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Extract unique categories from FAQs
  const categories = useMemo(() => {
    const set = new Set();
    faqs.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ["All", ...Array.from(set)];
  }, [faqs]);

  // Filter FAQs by search query and category
  const filteredFaqs = useMemo(() => {
    return faqs.filter((item) => {
      // Category filter
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQ = item.question?.toLowerCase().includes(q);
        const matchesA = item.answer?.toLowerCase().includes(q);
        return matchesQ || matchesA;
      }

      return true;
    });
  }, [faqs, selectedCategory, searchQuery]);

  const toggleAccordion = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <main className="w-full flex-1">
      <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8 sm:py-14 text-left">
        {/* Banner with Direct Actions */}
        <section className="relative mb-8 overflow-hidden rounded-2xl bg-gray-950 px-6 py-7 sm:px-8 sm:py-9">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#0084ff]/20 blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-[#0084ff]/15 text-[#0084ff]">
                <HelpCircle size={18} />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Help & Support Center
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
                Browse instant answers below or raise a new support ticket if your issue requires investigation.
              </p>
            </div>

            {/* Quick Actions inside Banner */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <Link
                to="/create-ticket"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0084ff] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0074e0] cursor-pointer shadow-sm"
              >
                <Plus size={16} />
                <span>Raise a Ticket</span>
              </Link>

              {auth.isAuthenticated && auth.role !== "admin" && (
                <Link
                  to="/tickets"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20 backdrop-blur-xs cursor-pointer"
                >
                  <Ticket size={15} />
                  <span>My Tickets</span>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-200">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions & answers..."
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

          {/* Category Tabs (if multiple exist) */}
          {categories.length > 2 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? "bg-[#0084ff] text-white shadow-sm"
                        : "bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* FAQs List */}
        {isLoading ? (
          <div className="py-12 text-center text-sm text-gray-400">
            Loading knowledge base articles...
          </div>
        ) : filteredFaqs.length > 0 ? (
          <div className="space-y-3">
            {filteredFaqs.map((item) => {
              const isOpen = openId === item.id;

              return (
                <div
                  key={item.id}
                  className={`overflow-hidden rounded-xl border bg-white transition-colors ${
                    isOpen
                      ? "border-[#0084ff]/40"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(item.id)}
                    className="flex w-full cursor-pointer items-center justify-between gap-5 px-5 py-4 text-left sm:px-6"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      {item.category && item.category !== "General" && (
                        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0084ff] border border-blue-200 shrink-0">
                          {item.category}
                        </span>
                      )}
                      <span className="text-sm font-medium leading-6 text-gray-800">
                        {item.question}
                      </span>
                    </div>

                    <ChevronDown
                      size={17}
                      strokeWidth={2}
                      className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#0084ff]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-100 px-5 pb-5 pt-4 sm:px-6">
                      <p className="text-sm leading-6 text-gray-500 whitespace-pre-line">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <Inbox size={28} className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-semibold text-gray-700">
              {searchQuery
                ? `No articles matching "${searchQuery}"`
                : "No FAQ articles published yet"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              If your question isn't answered here, raise a support ticket and our team will help.
            </p>

            <Link
              to="/create-ticket"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0084ff] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0074e0] transition-colors"
            >
              <Plus size={14} />
              <span>Raise Ticket Now</span>
            </Link>
          </div>
        )}

        {/* Raise Ticket Callout */}
        <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:flex-row sm:items-center sm:p-7">
          <div>
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
              Still need help?
            </h2>
            <p className="mt-1 text-sm leading-5 text-gray-500">
              If you couldn't find an answer to your issue, raise a ticket with our support team.
            </p>
          </div>

          <Link
            to="/create-ticket"
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-[#0084ff] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0074e0]"
          >
            <span>Create Ticket</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </main>
  );
}
