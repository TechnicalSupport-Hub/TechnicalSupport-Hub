import { useState } from "react";
import { HelpCircle, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/useApp";
import Button from "./Button";
import Input from "./Input";

export default function AdminFaqManager({ prefillData, onClearPrefill }) {
  const { faqs, addFaq, deleteFaq } = useApp();

  const [question, setQuestion] = useState(prefillData?.question || "");
  const [answer, setAnswer] = useState(prefillData?.answer || "");
  const [category, setCategory] = useState(prefillData?.category || "General");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    setIsSubmitting(true);
    try {
      await addFaq({
        question: question.trim(),
        answer: answer.trim(),
        category,
      });

      setQuestion("");
      setAnswer("");
      setSuccessMessage("FAQ successfully published to the Help Center!");
      onClearPrefill?.();
      setTimeout(() => setSuccessMessage(""), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto text-left">
      {/* Header Banner */}
      <section className="relative mb-6 overflow-hidden rounded-2xl bg-gray-950 px-6 py-6 sm:px-8 sm:py-7">
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#0084ff]/20 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#0084ff]/15 text-[#0084ff]">
              <HelpCircle size={18} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              FAQ Management & Publishing
            </h1>

            <p className="mt-1 max-w-xl text-sm text-gray-400">
              Create and manage published knowledge base articles stored in the database.
            </p>
          </div>

          <div className="self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-300 bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-xs">
              Live Articles: <span className="pt-0.5 text-[#0084ff] font-mono font-bold">{faqs.length}</span>
            </span>
          </div>
        </div>
      </section>

      {/* Success Notification */}
      {successMessage && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm font-semibold text-emerald-800 animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create FAQ Form */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">
                {prefillData?.question ? "Convert Issue to FAQ" : "Add New Knowledge Article"}
              </h2>
              {prefillData && (
                <button
                  type="button"
                  onClick={() => {
                    setQuestion("");
                    setAnswer("");
                    onClearPrefill?.();
                  }}
                  className="text-xs text-gray-400 hover:text-gray-600 underline cursor-pointer"
                >
                  Clear prefill
                </button>
              )}
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] transition-colors"
              >
                <option value="General">General</option>
                <option value="Technical">Technical</option>
                <option value="Account">Account & SSO</option>
                <option value="Attachments">Attachments & Files</option>
                <option value="Billing">Billing & Webhooks</option>
              </select>
            </div>

            <Input
              id="faq-question"
              label="Question Title"
              type="text"
              placeholder="e.g., How do I resolve 504 Gateway errors during CSV export?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />

            <div className="space-y-1.5 text-left">
              <label
                htmlFor="faq-answer"
                className="block text-sm font-medium text-gray-700"
              >
                Detailed Answer & Steps <span className="text-red-500">*</span>
              </label>
              <textarea
                id="faq-answer"
                rows={5}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Provide clear step-by-step instructions or explanations..."
                required
                className="w-full resize-y rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff]"
              />
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              className="mt-2"
            >
              <Plus size={16} className="mr-1.5" />
              <span>Publish Article to FAQ</span>
            </Button>
          </form>
        </div>

        {/* Existing FAQs Table */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">
                Published Knowledge Articles ({faqs.length})
              </h3>
            </div>

            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="p-5 hover:bg-gray-50 transition-colors flex items-start justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0084ff] border border-blue-200">
                        {faq.category || "General"}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                      {faq.question}
                    </h4>

                    <p className="text-xs sm:text-sm text-gray-600 mt-1.5 line-clamp-2 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteFaq(faq.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                    title="Delete FAQ"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
