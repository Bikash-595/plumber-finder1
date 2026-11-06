import type { WeekDay } from "../directoryApi";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const short = (day: string) => day.slice(0, 1).toUpperCase() + day.slice(1, 3);

const clock = (value?: string) => {
  const [h, m] = String(value ?? "").split(":").map(Number);
  if (!Number.isFinite(h)) return "";
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, "0")}` : ""} ${h < 12 ? "AM" : "PM"}`;
};

/** "Mon–Fri 8 AM–5 PM · Sat 9 AM–1 PM" from the weekly hours (consecutive days with the same hours are grouped). */
export function hoursSummary(week: WeekDay[]) {
  const byDay = new Map(week.map((day) => [day.day, day]));
  const groups: { from: string; to: string; hours: string }[] = [];
  for (const name of DAYS) {
    const day = byDay.get(name);
    const hours = day?.isOpen ? `${clock(day.opensAt)}–${clock(day.closesAt)}` : "";
    const last = groups.at(-1);
    if (hours && last && last.hours === hours && DAYS.indexOf(last.to) === DAYS.indexOf(name) - 1) last.to = name;
    else if (hours) groups.push({ from: name, to: name, hours });
  }
  return groups.map((group) => `${short(group.from)}${group.to !== group.from ? `–${short(group.to)}` : ""} ${group.hours}`).join(" · ");
}
