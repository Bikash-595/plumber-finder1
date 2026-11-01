import Link from "next/link";
import { FaCheckCircle, FaStar } from "react-icons/fa";
import { formatDate, type EligibleBooking } from "@/components/utils/userApi";

/** A completed booking waiting for a verified review, with a button straight to the form. */
export default function ReviewRequestCard({ booking }: { booking: EligibleBooking }) {
  return (
    <li className="flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white"><FaCheckCircle className="h-4 w-4" /></span>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-gray-900">How was {booking.providerName}?</p>
        <p className="text-sm text-gray-600">{booking.service} · <span className="font-mono text-xs">{booking.reference}</span>{booking.completedAt ? ` · completed ${formatDate(booking.completedAt)}` : ""}</p>
        {booking.requestedAt && <p className="text-xs text-emerald-800">We asked on {formatDate(booking.requestedAt)}{booking.reminders ? ` · ${booking.reminders} reminder${booking.reminders === 1 ? "" : "s"} sent` : ""}</p>}
      </div>
      <Link href={`/plumber/${encodeURIComponent(booking.providerId)}?review=${booking._id}#reviews`} className="inline-flex items-center gap-1.5 rounded-full bg-[#0b1f3b] px-4 py-2 text-sm font-bold text-white hover:bg-[#17345a]"><FaStar className="h-3 w-3 text-[#FFD60A]" /> Write a verified review</Link>
    </li>
  );
}
