import mongoose from "mongoose";
import { UserBooking } from "../../bookings/models/UserBooking.js";
import { UserCartItem } from "../../cart/models/UserCartItem.js";
import { UserCompareItem } from "../../compare/models/UserCompareItem.js";
import { UserInvoice } from "../../invoices/models/UserInvoice.js";
import { UserNotification } from "../../notifications/models/UserNotification.js";
import { UserSavedItem } from "../../saved/models/UserSavedItem.js";

/** GET /api/users/dashboard — counts for the dashboard home and the navbar badges, plus recent activity. */
export async function getDashboardSummary(req, res, next) {
  try {
    const user = req.auth.sub;
    const [cartItems, savedCount, compareCount, activeBookings, completedBookings, unreadNotifications, pendingInvoices, upcoming, recentNotifications, spent] = await Promise.all([
      UserCartItem.find({ user }).select("quantity").lean(),
      UserSavedItem.countDocuments({ user }),
      UserCompareItem.countDocuments({ user }),
      UserBooking.countDocuments({ user, status: { $in: ["pending", "scheduled"] } }),
      UserBooking.countDocuments({ user, status: "completed" }),
      UserNotification.countDocuments({ user, read: false }),
      UserInvoice.countDocuments({ user, status: "pending" }),
      UserBooking.find({ user, status: { $in: ["pending", "scheduled"] } }).sort({ scheduledDate: 1, createdAt: -1 }).limit(3),
      UserNotification.find({ user }).sort({ createdAt: -1 }).limit(5),
      UserInvoice.aggregate([{ $match: { user: new mongoose.Types.ObjectId(String(user)), status: "paid" } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
    ]);
    res.json({
      data: {
        counts: {
          cart: cartItems.reduce((sum, item) => sum + item.quantity, 0),
          saved: savedCount,
          compare: compareCount,
          activeBookings,
          completedBookings,
          unreadNotifications,
          pendingInvoices,
        },
        totalSpent: spent[0]?.total ?? 0,
        upcomingBookings: upcoming,
        recentNotifications,
      },
    });
  } catch (error) { next(error); }
}
