// Weekly opening hours shared by companies (Add Company wizard) and freelancers (Opening Hours section):
// one row per weekday { day, isOpen, opensAt, closesAt } in 24-hour HH:MM.
export const weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Validates the rows and returns them in day order. A closing time before the opening time means open past midnight. */
export function cleanWeeklyHours(items) {
  if (!Array.isArray(items) || !items.every((item) => item && typeof item === "object" && !Array.isArray(item))) return { error: "weeklyHours must be a list of objects" };
  if (items.length > weekDays.length) return { error: "weeklyHours can have at most 7 days" };
  const seen = new Set();
  const values = [];
  for (const item of items) {
    const day = typeof item.day === "string" ? item.day.trim().toLowerCase() : "";
    if (!weekDays.includes(day)) return { error: `weeklyHours day must be one of: ${weekDays.join(", ")}` };
    if (seen.has(day)) return { error: `weeklyHours has ${day} more than once` };
    seen.add(day);
    const isOpen = item.isOpen === true || item.isOpen === "true";
    if (!isOpen) { values.push({ day, isOpen: false, opensAt: "", closesAt: "" }); continue; }
    const opensAt = String(item.opensAt ?? "").trim();
    const closesAt = String(item.closesAt ?? "").trim();
    if (!TIME.test(opensAt) || !TIME.test(closesAt)) return { error: `weeklyHours ${day} times must be HH:MM (24-hour)` };
    if (opensAt === closesAt) return { error: `weeklyHours ${day} opening and closing times must differ` };
    values.push({ day, isOpen: true, opensAt, closesAt });
  }
  return { values: values.sort((a, b) => weekDays.indexOf(a.day) - weekDays.indexOf(b.day)) };
}

// Mongoose shape for a stored list of rows.
export const weeklyHoursSchema = [{ _id: false, day: String, isOpen: Boolean, opensAt: String, closesAt: String }];
