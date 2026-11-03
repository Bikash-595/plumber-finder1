import mongoose from "mongoose";
import { ProfileActivity } from "../../../activity/ProfileActivity.js";
import { UserBooking } from "../../../user/bookings/models/UserBooking.js";
import { CompanyListing } from "../../listing/models/CompanyListing.js";

// Numbers shared by the business dashboards (companies and freelancers) and analytics. Every query is scoped to
// one account (its account id or its public listing id) and served by an index that starts with that scope.

export const DAY_MS = 24 * 60 * 60 * 1000;
export const CONTACT_EVENTS = ["call_click", "email_click", "website_click"];
export const toId = (id) => new mongoose.Types.ObjectId(String(id));
export const money = (value) => Math.round((value ?? 0) * 100) / 100;
export const pctChange = (now, before) => (before ? Math.round(((now - before) / before) * 100) : now ? 100 : 0);

export const listingOf = (companyId) => CompanyListing.findOne({ company: companyId }).select("companyName slug isPublished logo city state").lean();

/** Profile views, unique visitors and contact clicks for a listing in [from, to). */
export async function activityTotals(listingId, from, to, type = "company") {
  if (!listingId) return { views: 0, visitors: 0, contacts: 0, byEvent: {} };
  const match = { providerType: type, providerId: String(listingId), createdAt: { $gte: from, $lt: to } };
  const [events, visitors] = await Promise.all([
    ProfileActivity.aggregate([{ $match: match }, { $group: { _id: "$event", count: { $sum: 1 } } }]),
    ProfileActivity.aggregate([{ $match: { ...match, event: "profile_view" } }, { $group: { _id: "$actor.id" } }, { $count: "n" }]),
  ]);
  const byEvent = Object.fromEntries(events.map((row) => [row._id, row.count]));
  return { views: byEvent.profile_view ?? 0, visitors: visitors[0]?.n ?? 0, contacts: CONTACT_EVENTS.reduce((sum, key) => sum + (byEvent[key] ?? 0), 0), byEvent };
}

/** Booking requests received, accepted, completed, revenue (completed jobs) and reply speed in [from, to). */
export async function bookingTotals(accountId, from, to, type = "company") {
  const scope = { providerType: type, providerAccount: toId(accountId) };
  const [received, completed] = await Promise.all([
    UserBooking.aggregate([
      { $match: { ...scope, createdAt: { $gte: from, $lt: to } } },
      { $group: {
        _id: null, count: { $sum: 1 },
        accepted: { $sum: { $cond: [{ $ifNull: ["$acceptedAt", false] }, 1, 0] } },
        declined: { $sum: { $cond: [{ $eq: ["$status", "declined"] }, 1, 0] } },
        answered: { $sum: { $cond: [{ $or: [{ $ifNull: ["$acceptedAt", false] }, { $ifNull: ["$declinedAt", false] }] }, 1, 0] } },
        replyMs: { $sum: { $cond: [{ $ifNull: ["$acceptedAt", false] }, { $subtract: ["$acceptedAt", "$createdAt"] }, { $cond: [{ $ifNull: ["$declinedAt", false] }, { $subtract: ["$declinedAt", "$createdAt"] }, 0] }] } },
      } },
    ]),
    UserBooking.aggregate([
      { $match: { ...scope, status: "completed", completedAt: { $gte: from, $lt: to } } },
      { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: { $multiply: [{ $ifNull: ["$price", 0] }, { $ifNull: ["$quantity", 1] }] } } } },
    ]),
  ]);
  const r = received[0] ?? {};
  return {
    received: r.count ?? 0, accepted: r.accepted ?? 0, declined: r.declined ?? 0,
    acceptanceRate: r.answered ? Math.round(((r.accepted ?? 0) / r.answered) * 100) : null,
    avgReplyMinutes: r.answered ? Math.round(r.replyMs / r.answered / 60000) : null,
    completed: completed[0]?.count ?? 0, revenue: money(completed[0]?.revenue),
  };
}
