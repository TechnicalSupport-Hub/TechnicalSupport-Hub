import { Clock } from "lucide-react";

export default function AdminIssueClustering() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0084ff] flex items-center justify-center mb-4 border border-blue-100">
        <Clock size={32} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
      <p className="text-sm text-gray-500 max-w-sm">
        Issue trends and pattern analytics are currently under development.
      </p>
    </div>
  );
}
