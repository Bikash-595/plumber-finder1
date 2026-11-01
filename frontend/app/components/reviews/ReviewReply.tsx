import { FaReply } from "react-icons/fa";

/** The plumber's public response, shown under the review it answers. */
export default function ReviewReply({ from, body, label = "Response from" }: { from: string; body: string; label?: string }) {
  return (
    <div className="mt-3 rounded-xl border-l-4 border-[#FFD60A] bg-gray-50 p-3 text-sm">
      <p className="flex items-center gap-1.5 font-semibold text-gray-900"><FaReply className="h-3 w-3 text-gray-400" aria-hidden /> {label} {from}</p>
      <p className="mt-1 whitespace-pre-line text-gray-700">{body}</p>
    </div>
  );
}
