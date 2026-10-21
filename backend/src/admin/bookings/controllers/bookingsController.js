import { UserBooking } from "../../../user/bookings/models/UserBooking.js";
import { notify } from "../../../user/notifications/services/notify.js";
import { paginatedList, searchFilter } from "../../shared/listQuery.js";
import { bookingsConfig } from "../config/bookingsConfig.js";

/** GET /api/admin/bookings?status=&search=&page= — every customer booking, with the customer's name and email. */
export async function listBookings(req, res, next) {
  try {
    const status = bookingsConfig.statuses.includes(req.query.status) ? { status: req.query.status } : {};
    const result = await paginatedList(UserBooking, { ...status, ...searchFilter(req.query.search, ["providerName", "service", "address"]) }, req.query);
    const withCustomers = await UserBooking.populate(result.data, { path: "user", select: "name email" });
    res.json({ ...result, data: withCustomers });
  } catch (error) { next(error); }
}

/** PATCH /api/admin/bookings/:id/status { status } — only allowed transitions; the customer is notified. */
export async function setBookingStatus(req, res, next) {
  try {
    const booking = await UserBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found." });
    const nextStatus = req.validated.status;
    if (!bookingsConfig.transitions[booking.status].includes(nextStatus)) {
      return res.status(409).json({ message: `A ${booking.status} booking cannot be marked ${nextStatus}.` });
    }
    booking.status = nextStatus;
    if (nextStatus === "cancelled") booking.cancelledAt = new Date();
    await booking.save();
    const titles = { scheduled: "Booking scheduled", completed: "Job completed", cancelled: "Booking cancelled" };
    await notify(booking.user, { type: "booking", title: titles[nextStatus], message: `Your ${booking.service} booking with ${booking.providerName} is now ${nextStatus}.`, link: "/dashboard/bookings" });
    res.json({ message: `Booking ${nextStatus}.`, data: booking });
  } catch (error) { next(error); }
}
