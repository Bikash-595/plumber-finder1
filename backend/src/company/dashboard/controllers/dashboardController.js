import { CustomerReview, GoogleBusinessLink } from "../../../reviews/models/index.js";
import { reviewStatsForAccount } from "../../../reviews/services/stats.js";
import { ProfileActivity } from "../../../activity/ProfileActivity.js";
import { AccountNotification } from "../../../shared/notifications/AccountNotification.js";
import { UserBooking } from "../../../user/bookings/models/UserBooking.js";
import { dashboardConfig as config } from "../config/dashboardConfig.js";
import { sideOf, listingFor } from "../../../shared/business/sides.js";
import { profileStrength as freelancerStrength } from "../../../freelancer/dashboard/services/profileStrength.js";
import { activityTotals, bookingTotals, DAY_MS, pctChange, toId } from "../services/metrics.js";
import { profileStrength as companyStrength } from "../services/profileStrength.js";

const startOfDay = (date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
const bookingCard = "reference customerName service status scheduledDate timeSlot price quantity createdAt";
const strengthOf = { company: companyStrength, freelancer: freelancerStrength };

/** GET /api/companies/dashboard (and /api/freelancers/dashboard) — everything the dashboard home shows, in one request. */
export async function getDashboard(req, res, next) {
  try {
    const side = sideOf(req);
    const company = toId(req.auth.sub);
    const scope = { providerType: side.type, providerAccount: company };
    const now = new Date();
    const from = new Date(now.getTime() - config.periodDays * DAY_MS);
    const prevFrom = new Date(from.getTime() - config.periodDays * DAY_MS);
    const trendFrom = new Date(startOfDay(now).getTime() - (config.trendDays - 1) * DAY_MS);
    const listing = await listingFor(side.type, company);

    const [account, strength, activity, activityPrev, bookings, bookingsPrev, pipeline, pending, upcoming, reviews, unanswered, google, unread, notes, viewsTrend, bookingsTrend] = await Promise.all([
      side.Account.findById(company).select(side.accountFields).lean(),
      strengthOf[side.type](company),
      activityTotals(listing?._id, from, now, side.type),
      activityTotals(listing?._id, prevFrom, from, side.type),
      bookingTotals(company, from, now, side.type),
      bookingTotals(company, prevFrom, from, side.type),
      UserBooking.aggregate([{ $match: scope }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
      UserBooking.find({ ...scope, status: "pending" }).sort({ createdAt: -1 }).limit(config.listSize).select(bookingCard).lean(),
      UserBooking.find({ ...scope, status: { $in: ["scheduled", "in_progress"] }, scheduledDate: { $gte: startOfDay(now) } }).sort({ scheduledDate: 1 }).limit(config.listSize).select(bookingCard).lean(),
      reviewStatsForAccount(side.type, company),
      CustomerReview.countDocuments({ ...scope, status: "published", "reply.body": { $exists: false } }),
      GoogleBusinessLink.findOne({ ...scope, connectionStatus: "connected" }).select("cache.rating cache.userRatingCount").lean(),
      AccountNotification.countDocuments({ recipientType: side.type, recipient: company, read: false }),
      AccountNotification.find({ recipientType: side.type, recipient: company }).sort({ _id: -1 }).limit(config.listSize).select("type title message link read createdAt").lean(),
      listing ? ProfileActivity.aggregate([{ $match: { providerType: side.type, providerId: String(listing._id), event: "profile_view", createdAt: { $gte: trendFrom } } }, { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }]) : [],
      UserBooking.aggregate([{ $match: { ...scope, createdAt: { $gte: trendFrom } } }, { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }]),
    ]);

    const counts = Object.fromEntries(pipeline.map((row) => [row._id, row.count]));
    const views = new Map(viewsTrend.map((row) => [row._id, row.count]));
    const requests = new Map(bookingsTrend.map((row) => [row._id, row.count]));
    const trend = Array.from({ length: config.trendDays }, (_, index) => {
      const day = new Date(trendFrom.getTime() + index * DAY_MS).toISOString().slice(0, 10);
      return { day, views: views.get(day) ?? 0, bookings: requests.get(day) ?? 0 };
    });
    const kpi = (value, previous) => ({ value, previous, change: pctChange(value, previous) });

    res.json({
      data: {
        // `companyName` is the display name for both account types (kept for existing clients).
        account: (({ name, ...rest }) => ({ companyName: name, ...rest }))(side.accountView(account)),
        listing: side.listingView(listing) ?? null,
        strength: { percent: strength.percent, level: strength.level, next: strength.items.filter((item) => strength.next.includes(item.key)) },
        period: { days: config.periodDays },
        kpis: {
          views: kpi(activity.views, activityPrev.views),
          visitors: kpi(activity.visitors, activityPrev.visitors),
          contacts: kpi(activity.contacts, activityPrev.contacts),
          requests: kpi(bookings.received, bookingsPrev.received),
          completed: kpi(bookings.completed, bookingsPrev.completed),
          revenue: kpi(bookings.revenue, bookingsPrev.revenue),
          acceptanceRate: bookings.acceptanceRate,
          avgReplyMinutes: bookings.avgReplyMinutes,
        },
        actions: {
          pendingRequests: counts.pending ?? 0, awaitingConfirmation: counts.awaiting_confirmation ?? 0, disputed: counts.disputed ?? 0,
          inProgress: counts.in_progress ?? 0, scheduled: counts.scheduled ?? 0, unansweredReviews: unanswered, unreadNotifications: unread,
        },
        pending, upcoming,
        reviews: { platform: { average: reviews.platform.average, count: reviews.platform.count }, verified: reviews.verified.count, directory: reviews.directory.count, google: google?.cache?.rating ? { rating: google.cache.rating, count: google.cache.userRatingCount ?? 0 } : null },
        trend,
        notifications: notes,
      },
    });
  } catch (error) { next(error); }
}

/** GET /api/companies/dashboard/strength — the full profile checklist (Company Profile / My Profile page). */
export async function getStrength(req, res, next) {
  try {
    const side = sideOf(req);
    const [strength, listing] = await Promise.all([strengthOf[side.type](req.auth.sub), listingFor(side.type, toId(req.auth.sub))]);
    res.json({ data: { ...strength, listing: side.listingView(listing) ?? null } });
  } catch (error) { next(error); }
}
