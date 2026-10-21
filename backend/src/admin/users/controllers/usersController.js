import { User } from "../../../auth/user/models/User.js";
import { UserBooking } from "../../../user/bookings/models/UserBooking.js";
import { paginatedList, searchFilter } from "../../shared/listQuery.js";
import { usersConfig } from "../config/usersConfig.js";

/** GET /api/admin/users?search=&page=&limit= */
export async function listUsers(req, res, next) {
  try {
    const result = await paginatedList(User, searchFilter(req.query.search, usersConfig.searchFields), req.query, { select: usersConfig.fields });
    // Booking counts per listed customer.
    const counts = await UserBooking.aggregate([{ $match: { user: { $in: result.data.map((user) => user._id) } } }, { $group: { _id: "$user", count: { $sum: 1 } } }]);
    const bookingsByUser = Object.fromEntries(counts.map(({ _id, count }) => [String(_id), count]));
    res.json({
      ...result,
      data: result.data.map(({ googleId, appleId, ...user }) => ({ ...user, signInMethods: [googleId && "google", appleId && "apple"].filter(Boolean), bookingCount: bookingsByUser[String(user._id)] ?? 0 })),
    });
  } catch (error) { next(error); }
}
