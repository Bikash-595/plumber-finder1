import { FaCheckCircle, FaGoogle, FaListUl } from "react-icons/fa";
import type { ReviewSourceKey } from "./reviewsApi";

/** Where a review comes from. "Verified Booking" only ever appears on reviews the server tied to a completed booking. */
export default function SourceBadge({ source }: { source: ReviewSourceKey | "google" }) {
  if (source === "google") return <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-bold text-gray-700"><FaGoogle className="h-2.5 w-2.5 text-[#4285F4]" aria-hidden /> Google Review</span>;
  if (source === "verified_booking") return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200"><FaCheckCircle className="h-2.5 w-2.5" aria-hidden /> Verified Booking</span>;
  return <span className="inline-flex items-center gap-1 rounded-full bg-[#FFD60A]/25 px-2 py-0.5 text-[11px] font-bold text-[#5c4d00]"><FaListUl className="h-2.5 w-2.5" aria-hidden /> Directory Review</span>;
}
