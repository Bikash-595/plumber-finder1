// Calendar maths in UTC (visit dates are stored as midnight UTC, so a job never drifts to the next day).
export const DAY_MS = 86_400_000;
export const iso = (date: Date) => date.toISOString().slice(0, 10);
export const todayUtc = () => { const now = new Date(); return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())); };
export const addDays = (date: Date, days: number) => new Date(date.getTime() + days * DAY_MS);
/** Monday of the week containing `date`. */
export const startOfWeek = (date: Date) => addDays(date, -((date.getUTCDay() + 6) % 7));
export const startOfMonth = (date: Date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
export const weekdayName = (date: Date) => date.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
export const label = (date: Date, opts: Intl.DateTimeFormatOptions) => date.toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });

/** The days shown: one week (Mon–Sun) or the month padded to whole weeks. */
export function rangeFor(view: "week" | "month", anchor: Date) {
  if (view === "week") { const from = startOfWeek(anchor); return { from, days: Array.from({ length: 7 }, (_, i) => addDays(from, i)) }; }
  const first = startOfMonth(anchor);
  const from = startOfWeek(first);
  const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0));
  const count = Math.round((addDays(startOfWeek(last), 7).getTime() - from.getTime()) / DAY_MS);
  return { from, days: Array.from({ length: count }, (_, i) => addDays(from, i)) };
}
