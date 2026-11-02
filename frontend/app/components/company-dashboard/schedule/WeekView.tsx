import type { ScheduleItem, Schedule } from "../operationsApi";
import { iso, label, todayUtc, weekdayName } from "./dates";
import EventChip from "./EventChip";

/** Seven day columns (an agenda list on phones). Closed days from your business hours are shaded. */
export default function WeekView({ days, byDay, hours, blocked, onOpen }: { days: Date[]; byDay: Map<string, ScheduleItem[]>; hours: Schedule["hours"]; blocked: Set<string>; onOpen: (item: ScheduleItem) => void }) {
  const today = iso(todayUtc());
  const closed = (day: Date) => hours?.weekly?.find((h) => h.day.toLowerCase() === weekdayName(day).toLowerCase())?.isOpen === false;
  const openTimes = (day: Date) => { const h = hours?.weekly?.find((row) => row.day.toLowerCase() === weekdayName(day).toLowerCase()); return h?.isOpen && h.opensAt ? `${h.opensAt}–${h.closesAt}` : null; };
  return (
    <>
      <div className="hidden grid-cols-7 gap-2 md:grid">
        {days.map((day) => {
          const key = iso(day);
          const items = byDay.get(key) ?? [];
          return (
            <section key={key} aria-label={label(day, { weekday: "long", month: "long", day: "numeric" })} className={`min-h-64 rounded-2xl border p-2 ${blocked.has(key) ? "border-gray-300 bg-[repeating-linear-gradient(45deg,#f3f4f6,#f3f4f6_6px,#fff_6px,#fff_12px)]" : key === today ? "border-[#FFD60A] bg-[#FFD60A]/5" : closed(day) ? "border-gray-200 bg-gray-100/70" : "border-gray-200 bg-white"}`}>
              <header className="mb-2 px-1">
                <p className="text-xs font-semibold uppercase text-gray-500">{label(day, { weekday: "short" })}</p>
                <p className={`text-xl font-bold ${key === today ? "text-[#8a7300]" : "text-gray-900"}`}>{day.getUTCDate()}</p>
                <p className="text-[10px] text-gray-400">{blocked.has(key) ? "Day off" : closed(day) ? "Closed" : openTimes(day) ?? ""}</p>
              </header>
              <div className="space-y-1.5">{items.map((item) => <EventChip key={item._id} item={item} onOpen={() => onOpen(item)} />)}</div>
            </section>
          );
        })}
      </div>
      <ol className="space-y-3 md:hidden">
        {days.map((day) => {
          const key = iso(day);
          const items = byDay.get(key) ?? [];
          return (
            <li key={key} className={`rounded-2xl border p-3 ${key === today ? "border-[#FFD60A]" : "border-gray-200"} bg-white`}>
              <p className="text-sm font-bold text-gray-900">{label(day, { weekday: "long", month: "short", day: "numeric" })}{key === today && <span className="ml-2 text-xs font-semibold text-[#8a7300]">Today</span>}{blocked.has(key) ? <span className="ml-2 text-xs text-gray-500">Day off</span> : closed(day) && <span className="ml-2 text-xs text-gray-400">Closed</span>}</p>
              <div className="mt-2 space-y-1.5">{items.length ? items.map((item) => <EventChip key={item._id} item={item} onOpen={() => onOpen(item)} />) : <p className="text-xs text-gray-400">No jobs</p>}</div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
