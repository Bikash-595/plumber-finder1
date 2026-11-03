import { sides } from "../../../shared/business/sides.js";
import { UserBooking } from "../../../user/bookings/models/UserBooking.js";

const DAY_MS = 86_400_000;
const utcDay = (value) => { const d = new Date(value); return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())); };
const iso = (date) => date.toISOString().slice(0, 10);

/** Every day ("YYYY-MM-DD") covered by the time-off periods within [from, to), sorted. */
export function blockedDays(timeOff = [], from, to) {
  const days = new Set();
  for (const period of timeOff ?? []) {
    const start = Math.max(utcDay(period.start).getTime(), utcDay(from).getTime());
    const end = Math.min(utcDay(period.end).getTime(), utcDay(to).getTime() - DAY_MS);
    for (let time = start; time <= end; time += DAY_MS) days.add(iso(new Date(time)));
  }
  return [...days].sort();
}

/**
 * Can a customer book this company or freelancer for `date`? Returns a message for the customer, or null
 * when it's fine: paused, inside the minimum notice, on a day off, or the day is already full.
 */
export async function availabilityProblem(accountId, date, type = "company") {
  const side = sides[type];
  if (!accountId || !side) return null;
  const rules = await side.Availability.findOne({ [side.ownerField]: accountId }).lean();
  if (!rules) return null;
  if (rules.acceptingBookings === false) return rules.pauseMessage || "They aren't taking new bookings right now. Please check back soon.";
  if (!date) return null;
  const day = utcDay(date);
  const earliest = new Date(utcDay(new Date()).getTime() + (rules.minNoticeDays ?? 0) * DAY_MS);
  if (rules.minNoticeDays > 0 && day < earliest) return `They need ${rules.minNoticeDays} day${rules.minNoticeDays === 1 ? "" : "s"}' notice — please choose ${iso(earliest)} or later.`;
  if ((rules.timeOff ?? []).some((period) => day >= utcDay(period.start) && day <= utcDay(period.end))) return "They're away on that date. Please pick another day.";
  if (rules.maxJobsPerDay > 0) {
    const taken = await UserBooking.countDocuments({ providerType: type, providerAccount: accountId, scheduledDate: day, status: { $in: ["pending", "scheduled", "in_progress"] } });
    if (taken >= rules.maxJobsPerDay) return "They're fully booked on that date. Please pick another day.";
  }
  return null;
}
