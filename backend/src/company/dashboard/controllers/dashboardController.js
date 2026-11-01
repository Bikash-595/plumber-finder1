import { Company } from "../../../auth/company/models/Company.js";
import { CustomerReview, GoogleBusinessLink } from "../../../reviews/models/index.js";
import { reviewStatsForAccount } from "../../../reviews/services/stats.js";
import { ProfileActivity } from "../../../activity/ProfileActivity.js";
import { AccountNotification } from "../../../shared/notifications/AccountNotification.js";
import { UserBooking } from "../../../user/bookings/models/UserBooking.js";
import { dashboardConfig as config } from "../config/dashboardConfig.js";
import { activityTotals, bookingTotals, DAY_MS, listingOf, pctChange, toId } from "../services/metrics.js";
import { profileStrength } from "../services/profileStrength.js";

const startOfDay = (date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
const bookingCard = "reference customerName service status scheduledDate timeSlot price quantity createdAt";

/** GET /api/companies/dashboard — everything the dashboard home shows, in one request. */
export async function getDashboard(req, res, next) {
  try {
    const companyId = req.auth.sub;
    const company = toId(companyId);
    const scope = { providerType: "company", providerAccount: company };
    const now = new Date();
    const from = new Date(now.getTime() - config.periodDays * DAY_MS);
    const prevFrom = new Date(from.getTime() - config.periodDays * DAY_MS);
    const trendFrom = new Date(startOfDay(now).getTime() - (config.trendDays - 1) * DAY_MS);
    const listing = await listingOf(company);

    const [account, strength, activity, activityPrev, bookings, bookingsPrev, pipeline, pending, upcoming, reviews, unanswered, google, unread, notes, viewsTrend, bookingsTrend] = await Promise.all([
      Company.findById(company).select("companyName status emailVerified").lean(),
      profileStrength(company),
      activityTotals(listing?._id, from, now),
      activityTotals(listing?._id, prevFrom, from),
      bookingTotals(company, from, now),
      bookingTotals(company, prevFrom, from),
      UserBooking.aggregate([{ $match: scope }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
      UserBooking.find({ ...scope, status: "pending" }).sort({ createdAt: -1 }).limit(config.listSize).select(bookingCard).lean(),
      UserBooking.find({ ...scope, status: { $in: ["scheduled", "in_progress"] }, scheduledDate: { $gte: startOfDay(now) } }).sort({ scheduledDate: 1 }).limit(config.listSize).select(bookingCard).lean(),
      reviewStatsForAccount("company", company),
      CustomerReview.countDocuments({ ...scope, status: "published", "reply.body": { $exists: false } }),
      GoogleBusinessLink.findOne({ ...scope, connectionStatus: "connected" }).select("cache.rating cache.userRatingCount").lean(),
      AccountNotification.countDocuments({ recipientType: "company", recipient: company, read: false }),
      AccountNotification.find({ recipientType: "company", recipient: company }).sort({ _id: -1 }).limit(config.listSize).select("type title message link read createdAt").lean(),
      listing ? ProfileActivity.aggregate([{ $match: { providerType: "company", providerId: String(listing._id), event: "profile_view", createdAt: { $gte: trendFrom } } }, { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }]) : [],
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
        account: { companyName: account?.companyName, status: account?.status, emailVerified: account?.emailVerified !== false },
        listing: listing ? { id: listing._id, slug: listing.slug, name: listing.companyName, published: listing.isPublished !== false, logo: listing.logo ?? null } : null,
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

/** GET /api/companies/dashboard/strength — the full profile checklist (Company Profile page). */
export async function getStrength(req, res, next) {
  try {
    const [strength, listing] = await Promise.all([profileStrength(req.auth.sub), listingOf(toId(req.auth.sub))]);
    res.json({ data: { ...strength, listing: listing ? { id: listing._id, slug: listing.slug, name: listing.companyName, published: listing.isPublished !== false, logo: listing.logo ?? null, city: listing.city, state: listing.state } : null } });
  } catch (error) { next(error); }
}
