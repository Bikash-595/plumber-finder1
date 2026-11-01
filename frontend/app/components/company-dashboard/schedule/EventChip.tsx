import type { ScheduleItem } from "../operationsApi";

const styles: Record<string, string> = {
  pending: "border-dashed border-amber-300 bg-amber-50 text-amber-900",
  scheduled: "border-blue-200 bg-blue-50 text-blue-900",
  in_progress: "border-violet-200 bg-violet-50 text-violet-900",
  awaiting_confirmation: "border-amber-200 bg-amber-50 text-amber-900",
  disputed: "border-red-200 bg-red-50 text-red-900",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

/** A job (or a tentative request, dashed) on the calendar. */
export default function EventChip({ item, compact, onOpen }: { item: ScheduleItem; compact?: boolean; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} title={`${item.service} — ${item.customerName ?? "Customer"}${item.timeSlot ? ` · ${item.timeSlot}` : ""}${item.status === "pending" ? " (request, not accepted yet)" : ""}`}
      className={`block w-full rounded-lg border px-2 py-1 text-left text-xs transition hover:shadow ${styles[item.status] ?? "border-gray-200 bg-white"}`}>
      {!compact && item.timeSlot && <span className="block font-semibold">{item.timeSlot}</span>}
      <span className="block truncate font-medium">{item.service}</span>
      {!compact && <span className="block truncate opacity-75">{item.customerName ?? "Customer"}</span>}
    </button>
  );
}
