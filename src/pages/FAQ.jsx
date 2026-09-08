import { useState } from "react";
import { ChevronDown, ArrowRight, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "How long does it typically take to resolve a support ticket?",
    answer:
      "Most standard tickets are reviewed within 2 to 4 hours. Critical issues receive higher priority, with a target resolution time of 24 hours.",
  },
  {
    id: "faq-2",
    question: "Can I provide screenshots or additional files after submitting?",
    answer:
      "Yes. You can provide additional screenshots, logs, or other relevant files if our support team requests more information during the ticket review.",
  },
  {
    id: "faq-3",
    question: "What image formats and file sizes are supported?",
    answer:
      "PNG, JPG, and JPEG files are supported. Attachments can be up to 10MB each and should clearly show the issue whenever possible.",
  },
  {
    id: "faq-4",
    question: "How do I track the current progress of my ticket?",
    answer:
      "Use your assigned Ticket ID on the Ticket Status page. You can see whether your ticket is Pending, Processing, Resolved, or requires further action.",
  },
  {
    id: "faq-5",
    question: "What happens if my ticket is marked as rejected?",
    answer:
      "A ticket may be rejected if it is a duplicate, missing important information, or falls outside the scope of the support system. The reason will be provided so you can take the appropriate next step.",
  },
  {
    id: "faq-6",
    question: "How do I create a new support ticket?",
    answer:
      "Select New Ticket from the navigation menu, describe your issue, provide the relevant details, and submit the form. You will receive a Ticket ID after submission.",
  },
  {
    id: "faq-7",
    question: "Can I submit more than one support ticket?",
    answer:
      "Yes, you can create multiple tickets when you have separate issues. However, avoid creating duplicate tickets for the same problem as this can slow down the resolution process.",
  },
  {
    id: "faq-8",
    question: "What information should I include in my ticket?",
    answer:
      "Include a clear description of the issue, what you expected to happen, what actually happened, and any relevant steps that reproduce the problem.",
  },
  {
    id: "faq-9",
    question: "Can I update a ticket after submitting it?",
    answer:
      "If additional information is required, the support team may request an update. You should provide the requested details as soon as possible to avoid delays.",
  },
  {
    id: "faq-10",
    question: "How will I know when my ticket is resolved?",
    answer:
      "Your ticket status will change to Resolved once the support team has completed the investigation or provided a solution. You can verify the latest status using your Ticket ID.",
  },
  {
    id: "faq-11",
    question: "What should I do if I cannot find my Ticket ID?",
    answer:
      "Check the confirmation shown after submitting your ticket. If you still cannot locate your Ticket ID, contact the support desk with the email address used when creating the ticket.",
  },
  {
    id: "faq-12",
    question: "What types of issues can I report through AutoTicket?",
    answer:
      "AutoTicket is intended for reporting product issues, technical problems, access difficulties, and other support-related concerns that require assistance from the support team.",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState("faq-1");

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <main className="w-full">
      <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        <section className="relative mb-8 overflow-hidden rounded-2xl bg-gray-950 px-6 py-7 sm:px-8 sm:py-9">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#0084ff]/20 blur-3xl" />

          <div className="relative">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-[#0084ff]/15 text-[#0084ff]">
              <HelpCircle size={18} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Frequently Asked Questions
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
              Find quick answers to common questions before raising a new
              support ticket.
            </p>
          </div>
        </section>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => {
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
                    <p className="text-sm leading-6 text-gray-500">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:flex-row sm:items-center sm:p-7">
          <div>
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
              Still need help?
            </h2>

            <p className="mt-1 text-sm leading-5 text-gray-500">
              If you couldn't find an answer, raise a ticket with our support
              team.
            </p>
          </div>

          <Link
            to={"/create-ticket"}
            type="button"
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
