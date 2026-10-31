import type { Booking } from "@/components/utils/userApi";
import { bookingStatus } from "../bookings/bookingStatus";
import { toneClasses } from "../ui/tones";

const order: Booking["status"][] = ["pending", "scheduled", "completed", "cancelled", "declined"];

/** Share of bookings in each status: one segmented bar plus a labelled legend with counts. */
export default function StatusBreakdown({ counts, total }: { counts: Record<Booking["status"], number>; total: number }) {
  const parts = order.filter((status) => counts[status] > 0);
  return (
    <div>
      <div className="flex h-3 gap-0.5 overflow-hidden rounded-full bg-gray-100" role="img" aria-label={parts.map((status) => `${bookingStatus[status].label}: ${counts[status]}`).join(", ") || "No bookings"}>
        {parts.map((status) => <span key={status} title={`${bookingStatus[status].label}: ${counts[status]}`} className={toneClasses[bookingStatus[status].tone].dot} style={{ width: `${(counts[status] / total) * 100}%` }} />)}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
        {order.map((status) => (
          <li key={status} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${toneClasses[bookingStatus[status].tone].dot}`} />
            <span className="flex-1 text-gray-600">{bookingStatus[status].label}</span>
            <span className="font-semibold tabular-nums text-gray-900">{counts[status]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
