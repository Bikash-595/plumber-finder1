import { CustomerReview } from "../../../reviews/models.js";
import { UserBooking } from "../../bookings/models/UserBooking.js";
import { bookingsConfig } from "../../bookings/config/bookingsConfig.js";
import { UserCartItem } from "../../cart/models/UserCartItem.js";
import { UserCompareItem } from "../../compare/models/UserCompareItem.js";
import { UserInvoice } from "../../invoices/models/UserInvoice.js";
import { invoicesConfig } from "../../invoices/config/invoicesConfig.js";
import { UserNotification } from "../../notifications/models/UserNotification.js";
import { UserSavedItem } from "../../saved/models/UserSavedItem.js";
import { countsByStatus, toObjectId } from "../../shared/paginate.js";

// Every query below starts with { user } and is served by an index on it, so the cost depends on
// one customer's own records, never on how many customers there are.
const ACTIVE = ["pending", "scheduled"];
const bookingCard = "reference providerType providerId providerName service quantity price scheduledDate timeSlot status createdAt";
const statusGroups = (Model, user, extra = {}) => Model.aggregate([{ $match: { user } }, { $group: { _id: "$status", count: { $sum: 1 }, ...extra } }]);
const sumOf = (rows, field = "total") => rows[0]?.[field] ?? 0;
const money = (value) => Math.round(value * 100) / 100;

/** GET /api/users/dashboard — counts for the dashboard home and the navbar badges, plus recent activity. */
export async function getDashboardSummary(req, res, next) {
  try {
    const user = toObjectId(req.auth.sub);
    const [cart, savedCount, compareCount, bookingGroups, invoiceGroups, unreadNotifications, upcoming, recentNotifications] = await Promise.all([
      UserCartItem.aggregate([{ $match: { user } }, { $group: { _id: null, total: { $sum: "$quantity" } } }]),
      UserSavedItem.countDocuments({ user }),
      UserCompareItem.countDocuments({ user }),
      statusGroups(UserBooking, user),
      statusGroups(UserInvoice, user, { total: { $sum: "$total" } }),
      UserNotification.countDocuments({ user, read: false }),
      UserBooking.find({ user, status: { $in: ACTIVE } }).sort({ scheduledDate: 1, _id: -1 }).limit(3).select(bookingCard).lean(),
      UserNotification.find({ user }).sort({ _id: -1 }).limit(5).select("type title message link read createdAt").lean(),
    ]);
    const bookings = countsByStatus(bookingGroups, bookingsConfig.statuses);
    const invoices = countsByStatus(invoiceGroups, invoicesConfig.statuses);
    res.json({
      data: {
        counts: {
          cart: sumOf(cart),
          saved: savedCount,
          compare: compareCount,
          activeBookings: bookings.pending + bookings.scheduled,
          pendingBookings: bookings.pending,
          scheduledBookings: bookings.scheduled,
          completedBookings: bookings.completed,
          totalBookings: Object.values(bookings).reduce((sum, count) => sum + count, 0),
          unreadNotifications,
          pendingInvoices: invoices.pending,
        },
        totalSpent: money(invoiceGroups.find((group) => group._id === "paid")?.total ?? 0),
        amountDue: money(invoiceGroups.find((group) => group._id === "pending")?.total ?? 0),
        upcomingBookings: upcoming,
        recentNotifications,
      },
    });
  } catch (error) { next(error); }
}

/** First day (UTC) of the month `monthsAgo` months before this one. */
const monthStart = (monthsAgo) => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsAgo, 1));
};
const monthKey = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };

/**
 * GET /api/users/dashboard/insights?months=6 — the Overview page: bookings by status, a month-by-month
 * history of bookings and money paid, the plumbers booked most, and what coupons and promo codes saved.
 */
export async function getDashboardInsights(req, res, next) {
  try {
    const user = toObjectId(req.auth.sub);
    const months = Math.min(12, Math.max(3, Number.parseInt(req.query.months, 10) || 6));
    const since = monthStart(months - 1);
    const [bookingGroups, bookingMonths, paidMonths, topProviders, bookingSavings, invoiceSavings, reviews] = await Promise.all([
      statusGroups(UserBooking, user),
      UserBooking.aggregate([{ $match: { user, createdAt: { $gte: since } } }, { $group: { _id: monthKey, count: { $sum: 1 } } }]),
      UserInvoice.aggregate([{ $match: { user, status: "paid", createdAt: { $gte: since } } }, { $group: { _id: monthKey, total: { $sum: "$total" } } }]),
      UserBooking.aggregate([
        { $match: { user, status: { $nin: ["declined"] } } },
        { $group: { _id: { providerType: "$providerType", providerId: "$providerId" }, name: { $last: "$providerName" }, bookings: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } }, lastBooked: { $max: "$createdAt" } } },
        { $sort: { bookings: -1, lastBooked: -1 } },
        { $limit: 5 },
      ]),
      UserBooking.aggregate([{ $match: { user, discountAmount: { $gt: 0 }, status: { $nin: ["cancelled", "declined"] } } }, { $group: { _id: null, total: { $sum: "$discountAmount" } } }]),
      UserInvoice.aggregate([{ $match: { user, discount: { $gt: 0 }, status: { $in: ["pending", "paid"] } } }, { $group: { _id: null, total: { $sum: "$discount" } } }]),
      CustomerReview.countDocuments({ user }),
    ]);

    const byMonth = (rows, field) => new Map(rows.map((row) => [row._id, row[field]]));
    const bookingsIn = byMonth(bookingMonths, "count");
    const paidIn = byMonth(paidMonths, "total");
    const timeline = Array.from({ length: months }, (_, index) => {
      const key = monthStart(months - 1 - index).toISOString().slice(0, 7);
      return { month: key, bookings: bookingsIn.get(key) ?? 0, spent: money(paidIn.get(key) ?? 0) };
    });
    const status = countsByStatus(bookingGroups, bookingsConfig.statuses);
    const totalBookings = Object.values(status).reduce((sum, count) => sum + count, 0);
    const spent = timeline.reduce((sum, month) => sum + month.spent, 0);

    res.json({
      data: {
        months,
        bookingsByStatus: status,
        totalBookings,
        completionRate: totalBookings ? Math.round((status.completed / totalBookings) * 100) : 0,
        timeline,
        spentInPeriod: money(spent),
        topProviders: topProviders.map(({ _id, ...rest }) => ({ ..._id, ...rest })),
        savings: money(sumOf(bookingSavings) + sumOf(invoiceSavings)),
        reviewsWritten: reviews,
      },
    });
  } catch (error) { next(error); }
}
