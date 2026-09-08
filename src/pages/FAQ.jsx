import { useState } from "react";
import { ChevronDown, ArrowRight, HelpCircle, Inbox } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/useApp";

export default function FAQ() {
  const { faqs, isLoading } = useApp();
  const [openId, setOpenId] = useState(null);

  const toggleAccordion = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <main className="w-full">
      <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Banner */}
        <section className="relative mb-8 overflow-hidden rounded-2xl bg-gray-950 px-6 py-7 sm:px-8 sm:py-9 text-left">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#0084ff]/20 blur-3xl" />

          <div className="relative">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-[#0084ff]/15 text-[#0084ff]">
              <HelpCircle size={18} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Frequently Asked Questions
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
              Find quick answers to common questions before raising a new support ticket.
            </p>
          </div>
        </section>

        {/* FAQs List */}
        {isLoading ? (
          <div className="py-12 text-center text-sm text-gray-400">
            Loading knowledge base articles...
          </div>
        ) : faqs.length > 0 ? (
          <div className="space-y-3 text-left">
            {faqs.map((item) => {
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
                    <span className="text-sm font-medium leading-6 text-gray-800">
                      {item.question}
                    </span>

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
            <p className="text-sm font-semibold text-gray-700">No FAQ articles published yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Check back soon or raise a new ticket with our support team.
            </p>
          </div>
        )}

        {/* Raise Ticket Callout */}
        <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:flex-row sm:items-center sm:p-7 text-left">
          <div>
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
              Still need help?
            </h2>
            <p className="mt-1 text-sm leading-5 text-gray-500">
              If you couldn't find an answer, raise a ticket with our support team.
            </p>
          </div>

          <Link
            to="/create-ticket"
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-[#0084ff] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0074e0]"
          >
            Create Ticket
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </main>
  );
}
