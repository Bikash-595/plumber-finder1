"use client";

// Weekly opening hours editor, used by the Add Company wizard and the freelancer Opening Hours form.
export const weekDays = [
  { day: "monday", label: "Monday" },
  { day: "tuesday", label: "Tuesday" },
  { day: "wednesday", label: "Wednesday" },
  { day: "thursday", label: "Thursday" },
  { day: "friday", label: "Friday" },
  { day: "saturday", label: "Saturday" },
  { day: "sunday", label: "Sunday" },
] as const;

export type HoursRow = { day: string; isOpen: boolean; opensAt: string; closesAt: string };

// Every day starts closed; ticking "Open" uses these times until they are changed.
export const initialWeeklyHours: HoursRow[] = weekDays.map(({ day }) => ({ day, isOpen: false, opensAt: "09:00", closesAt: "17:00" }));

/** Saved rows (only some days, closed days without times) → one row for every day. */
export const withAllDays = (saved: HoursRow[] | undefined) => initialWeeklyHours.map((row) => {
  const match = saved?.find((item) => item.day === row.day);
  return match?.isOpen ? { ...row, ...match } : match ? { ...row, isOpen: false } : row;
});

/** No open days means "hours not set" rather than "closed all week". */
export const hoursPayload = (rows: HoursRow[]) => (rows.some((row) => row.isOpen) ? rows : []);

type Props = { rows: HoursRow[]; onChange: (rows: HoursRow[]) => void; description?: string };

export default function WeeklyHoursEditor({ rows, onChange, description = "Tick the days you are open and set the times. Customers see these hours and an “Open now” badge on your profile." }: Props) {
  const update = (day: string, changes: Partial<HoursRow>) => onChange(rows.map((row) => (row.day === day ? { ...row, ...changes } : row)));
  const copyMondayToWeekdays = () => {
    const monday = rows[0];
    onChange(rows.map((row, index) => (index > 0 && index < 5 ? { ...row, isOpen: monday.isOpen, opensAt: monday.opensAt, closesAt: monday.closesAt } : row)));
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
      <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">Weekly Opening Hours</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <button type="button" onClick={copyMondayToWeekdays} className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-[#FFD60A]">
          Copy Monday to Tue–Fri
        </button>
      </div>
      <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
        {weekDays.map(({ day, label }) => {
          const row = rows.find((item) => item.day === day)!;
          return (
            <div key={day} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[8rem_6rem_minmax(0,1fr)]">
              <span className="text-sm font-bold text-gray-900">{label}</span>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={row.isOpen} onChange={(event) => update(day, { isOpen: event.target.checked })} className="h-4 w-4 accent-[#0b1f3b]" aria-label={`Open on ${label}`} />
                {row.isOpen ? "Open" : "Closed"}
              </label>
              <div className="col-span-2 flex flex-wrap items-center gap-2 sm:col-span-1">
                <input type="time" value={row.opensAt} disabled={!row.isOpen} onChange={(event) => update(day, { opensAt: event.target.value })} aria-label={`${label} opening time`} className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FFD60A] disabled:bg-gray-50 disabled:text-gray-400" />
                <span className="text-sm text-gray-500">to</span>
                <input type="time" value={row.closesAt} disabled={!row.isOpen} onChange={(event) => update(day, { closesAt: event.target.value })} aria-label={`${label} closing time`} className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FFD60A] disabled:bg-gray-50 disabled:text-gray-400" />
                {row.isOpen && row.closesAt < row.opensAt && <span className="text-xs text-gray-500">(closes next day)</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
