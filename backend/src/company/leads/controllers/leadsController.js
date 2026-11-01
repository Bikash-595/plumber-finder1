import { ProfileActivity } from "../../../activity/ProfileActivity.js";
import { UserBooking } from "../../../user/bookings/models/UserBooking.js";
import { findPage, pageParams, textFilter } from "../../../user/shared/paginate.js";
import { DAY_MS, listingOf, toId } from "../../dashboard/services/metrics.js";
import { leadsConfig as config } from "../config/leadsConfig.js";

const stageFilter = {
  new: { status: "pending" },
  won: { acceptedAt: { $exists: true } },
  lost: { acceptedAt: { $exists: false }, status: { $in: ["declined", "cancelled"] } },
};
const leadFields = "reference customerName service status scheduledDate timeSlot price quantity details couponCode createdAt acceptedAt declinedAt cancelledAt responseNote";
const stageOf = (b) => (b.status === "pending" ? "new" : b.acceptedAt ? "won" : "lost");

/** GET /api/companies/leads?stage=new|won|lost&q=&cursor= — requests by stage, stage counts, and interest signals. */
export async function listLeads(req, res, next) {
  try {
    const company = toId(req.auth.sub);
    const scope = { providerType: "company", providerAccount: company };
    const stage = config.stages.includes(req.query.stage) ? req.query.stage : "new";
    const params = pageParams(req.query, { defaultLimit: 20, maxLimit: 50 });
    const page = await findPage(UserBooking, { ...scope, ...stageFilter[stage], ...textFilter(req.query.q, ["reference", "customerName", "service"]) }, params, leadFields);
    let extra = {};
    if (!params.cursor) {
      const since = new Date(Date.now() - config.signalDays * DAY_MS);
      const listing = await listingOf(company);
      const [counts, outcome, signals] = await Promise.all([
        Promise.all(config.stages.map((name) => UserBooking.countDocuments({ ...scope, ...stageFilter[name] }))),
        UserBooking.aggregate([
          { $match: { ...scope, createdAt: { $gte: since } } },
          { $group: { _id: null, total: { $sum: 1 }, won: { $sum: { $cond: [{ $ifNull: ["$acceptedAt", false] }, 1, 0] } }, waitingMs: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, { $subtract: [new Date(), "$createdAt"] }, 0] } }, waiting: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } } } },
        ]),
        listing ? ProfileActivity.aggregate([{ $match: { providerType: "company", providerId: String(listing._id), event: { $in: config.signalEvents }, createdAt: { $gte: since } } }, { $group: { _id: "$event", count: { $sum: 1 } } }]) : [],
      ]);
      const o = outcome[0] ?? {};
      extra = {
        counts: Object.fromEntries(config.stages.map((name, i) => [name, counts[i]])),
        summary: {
          days: config.signalDays, requests: o.total ?? 0, winRate: o.total ? Math.round(((o.won ?? 0) / o.total) * 100) : null,
          avgWaitingHours: o.waiting ? Math.round(o.waitingMs / o.waiting / 3_600_000) : 0,
        },
        signals: Object.fromEntries(config.signalEvents.map((event) => [event, signals.find((row) => row._id === event)?.count ?? 0])),
      };
    }
    res.json({ ...page, data: page.data.map((b) => ({ ...b, stage: stageOf(b), waitingMinutes: b.status === "pending" ? Math.round((Date.now() - new Date(b.createdAt).getTime()) / 60000) : null })), stage, ...extra });
  } catch (error) { next(error); }
}
