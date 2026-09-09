import { useMemo } from "react";
import { Users, Layers, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { clusterTicketsByIssue } from "../utils/issueClustering";

export default function AdminIssueClustering({ tickets = [], onConvertToFaq }) {
  const clusters = useMemo(() => {
    return clusterTicketsByIssue(tickets);
  }, [tickets]);

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto text-left">
      {/* Header Banner */}
      <section className="relative mb-6 rounded-2xl bg-gray-950 px-6 py-6 sm:px-8 sm:py-7">
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#0084ff]/20 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#0084ff]/15 text-[#0084ff]">
              <Layers size={18} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Issue Trends & Unique User Clustering
            </h1>

            <p className="mt-1 max-w-xl text-sm text-gray-400">
              Aggregates identical or similar support issues reported by distinct unique users. Convert high-frequency problems into public FAQs with a single click.
            </p>
          </div>

          <div className="self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-300 bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-xs">
              Discovered Clusters: <span className="pt-0.5 text-[#0084ff] font-mono font-bold">{clusters.length}</span>
            </span>
          </div>
        </div>
      </section>

      {/* Cluster Grid */}
      <div className="space-y-4">
        {clusters.length > 0 ? (
          clusters.map((cluster) => {
            const isHighPriority = cluster.uniqueUserCount >= 2;

            return (
              <div
                key={cluster.id}
                className={`rounded-2xl border bg-white p-5 sm:p-6 shadow-sm transition-all hover:shadow-md ${
                  isHighPriority
                    ? "border-[#0084ff]/40 ring-1 ring-[#0084ff]/20"
                    : "border-gray-200"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isHighPriority && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Sparkles size={12} />
                          <span>Top FAQ Candidate</span>
                        </span>
                      )}

                      {/* Unique Users Count Pill */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0084ff] border border-blue-200">
                        <Users size={13} />
                        <span>{cluster.uniqueUserCount} Unique {cluster.uniqueUserCount === 1 ? "User" : "Users"} Affected</span>
                      </span>

                      {/* Total Tickets Pill */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                        <Layers size={13} />
                        <span>{cluster.ticketCount} {cluster.ticketCount === 1 ? "Ticket" : "Tickets"} Reported</span>
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                      {cluster.title}
                    </h3>
                  </div>

                  {/* Convert to FAQ CTA */}
                  <button
                    type="button"
                    onClick={() =>
                      onConvertToFaq({
                        question: cluster.suggestedQuestion,
                        answer: cluster.suggestedAnswer,
                        category: "Technical",
                      })
                    }
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0084ff] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0074e0] cursor-pointer shadow-sm"
                  >
                    <span>Add to Knowledge Base</span>
                    <ArrowRight size={15} />
                  </button>
                </div>

                {/* Tickets In Cluster Breakdown */}
                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-semibold uppercase tracking-wider text-gray-400">
                      Associated User Reports ({cluster.tickets.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {cluster.tickets.map((t) => (
                      <div
                        key={t.id}
                        className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-[#0084ff]">
                            #{t.id}
                          </span>
                          <span className="font-mono text-gray-500">
                            {t.userId}
                          </span>
                        </div>
                        <p className="font-semibold text-gray-800 line-clamp-1">
                          {t.title}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Suggested FAQ Draft Preview */}
                  <div className="mt-3 rounded-xl bg-blue-50/50 border border-blue-100 p-3.5 text-xs text-gray-700">
                    <div className="flex items-center gap-1.5 font-bold text-[#0084ff] mb-1">
                      <CheckCircle size={14} />
                      <span>Suggested FAQ Draft</span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      Q: {cluster.suggestedQuestion}
                    </p>
                    <p className="text-gray-600 mt-1 line-clamp-2">
                      A: {cluster.suggestedAnswer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-sm text-gray-400 rounded-2xl border border-dashed border-gray-200 bg-white">
            No clusters detected yet.
          </div>
        )}
      </div>
    </div>
  );
}
