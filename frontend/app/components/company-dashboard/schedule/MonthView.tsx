import type { ScheduleItem } from "../operationsApi";
import { iso, todayUtc } from "./dates";
import EventChip from "./EventChip";

const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** A month grid: up to 3 jobs per day, then "+N more" (which opens the week). */
export default function MonthView({ days, month, byDay, onOpen, onDay }: { days: Date[]; month: number; byDay: Map<string, ScheduleItem[]>; onOpen: (item: ScheduleItem) => void; onDay: (day: Date) => void }) {
  const today = iso(todayUtc());
  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[640px] grid-cols-7 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200">
        {names.map((name) => <div key={name} className="bg-gray-50 px-2 py-2 text-center text-xs font-semibold uppercase text-gray-500">{name}</div>)}
        {days.map((day) => {
          const key = iso(day);
          const items = byDay.get(key) ?? [];
          const outside = day.getUTCMonth() !== month;
          return (
            <div key={key} className={`min-h-28 p-1.5 ${outside ? "bg-gray-50" : "bg-white"}`}>
              <button type="button" onClick={() => onDay(day)} className={`mb-1 grid h-6 w-6 place-items-center rounded-full text-xs font-semibold ${key === today ? "bg-[#0b1f3b] text-white" : outside ? "text-gray-400" : "text-gray-700 hover:bg-gray-100"}`} aria-label={`Open week of ${key}`}>{day.getUTCDate()}</button>
              <div className="space-y-1">
                {items.slice(0, 3).map((item) => <EventChip key={item._id} item={item} compact onOpen={() => onOpen(item)} />)}
                {items.length > 3 && <button type="button" onClick={() => onDay(day)} className="px-1 text-[11px] font-semibold text-[#8a7300] hover:underline">+{items.length - 3} more</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
