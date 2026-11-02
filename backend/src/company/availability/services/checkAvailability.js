import { UserBooking } from "../../../user/bookings/models/UserBooking.js";
import { CompanyAvailability } from "../models/CompanyAvailability.js";

const DAY_MS = 86_400_000;
const startOfToday = () => { const now = new Date(); return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())); };
const dayKey = (date) => new Date(date).toISOString().slice(0, 10);

/** Days off as YYYY-MM-DD strings between `from` and `to` (for calendars and booking forms). */
export function blockedDays(timeOff, from, to) {
  const days = new Set();
  for (const period of timeOff ?? []) {
    for (let t = Math.max(new Date(period.start).getTime(), from.getTime()); t <= Math.min(new Date(period.end).getTime(), to.getTime()); t += DAY_MS) days.add(dayKey(t));
  }
  return [...days].sort();
}

/**
 * Can a customer book this company for `date`? Returns an error message, or null when it's fine.
 * No rules saved = always available. Called when a booking request is created.
 */
export async function availabilityProblem(companyId, date) {
  if (!companyId) return null;
  const rules = await CompanyAvailability.findOne({ company: companyId }).lean();
  if (!rules) return null;
  if (rules.acceptingBookings === false) return rules.pauseMessage || "This plumber isn't taking new bookings right now.";
  if (!date) return null;
  const day = new Date(dayKey(date));
  if (rules.minNoticeDays && day < new Date(startOfToday().getTime() + rules.minNoticeDays * DAY_MS)) return `This plumber needs at least ${rules.minNoticeDays} day${rules.minNoticeDays === 1 ? "" : "s"}' notice. Please choose a later date.`;
  if (blockedDays(rules.timeOff, day, day).length) return "This plumber is away on that date. Please choose another day.";
  if (rules.maxJobsPerDay) {
    const taken = await UserBooking.countDocuments({ providerType: "company", providerAccount: companyId, scheduledDate: day, status: { $in: ["pending", "scheduled", "in_progress"] } });
    if (taken >= rules.maxJobsPerDay) return "This plumber is fully booked on that date. Please choose another day.";
  }
  return null;
}
