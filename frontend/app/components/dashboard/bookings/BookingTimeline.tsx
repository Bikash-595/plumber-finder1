import type { Booking } from "@/components/utils/userApi";
import { bookingStatus } from "./bookingStatus";
import { toneClasses } from "../ui/tones";

const byLabels = { customer: "You", provider: "Plumber", admin: "Plumber Finder", system: "System" };

/** Every status change on a booking: what happened, who did it, when, and any message. */
export default function BookingTimeline({ history }: { history: NonNullable<Booking["history"]> }) {
  return (
    <ol className="relative space-y-4 border-l-2 border-gray-100 pl-5">
      {history.map((entry, index) => (
        <li key={index} className="relative">
          <span className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full ring-4 ring-white ${toneClasses[bookingStatus[entry.status].tone].dot}`} />
          <p className="text-sm font-semibold text-gray-900">{bookingStatus[entry.status].history}</p>
          <p className="text-xs text-gray-500">{byLabels[entry.by]} · {new Date(entry.at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
          {entry.note && <p className="mt-1 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">“{entry.note}”</p>}
        </li>
      ))}
    </ol>
  );
}
