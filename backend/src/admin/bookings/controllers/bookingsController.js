import mongoose from "mongoose";
import { CompanyListing } from "../../../company/listing/models/CompanyListing.js";
import { FreelancerListing } from "../../../freelancer/listing/models/FreelancerListing.js";
import { announce, applyStatus, canMove, statusLabels } from "../../../shared/bookings/bookingWorkflow.js";
import { UserBooking } from "../../../user/bookings/models/UserBooking.js";
import { paginatedList, searchFilter } from "../../shared/listQuery.js";
import { bookingsConfig } from "../config/bookingsConfig.js";

/** GET /api/admin/bookings?status=&search=&page= — every booking, with the customer and counts per status. */
export async function listBookings(req, res, next) {
  try {
    const status = bookingsConfig.statuses.includes(req.query.status) ? { status: req.query.status } : {};
    const [result, grouped] = await Promise.all([
      paginatedList(UserBooking, { ...status, ...searchFilter(req.query.search, ["reference", "customerName", "customerEmail", "providerName", "service", "address"]) }, req.query),
      UserBooking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);
    const withCustomers = await UserBooking.populate(result.data, { path: "user", select: "name email" });
    const counts = Object.fromEntries(bookingsConfig.statuses.map((name) => [name, grouped.find((row) => row._id === name)?.count ?? 0]));
    res.json({ ...result, data: withCustomers, counts });
  } catch (error) { next(error); }
}

/** GET /api/admin/bookings/:id — one booking with its full history, the customer, and the plumber's public page. */
export async function getBooking(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Booking not found." });
    const booking = await UserBooking.findById(req.params.id).populate("user", "name email phone").lean();
    if (!booking) return res.status(404).json({ message: "Booking not found." });
    const Listing = booking.providerType === "company" ? CompanyListing : FreelancerListing;
    const listing = mongoose.isValidObjectId(booking.providerId) ? await Listing.findById(booking.providerId).select("slug phone email").lean() : null;
    const providerUrl = listing ? (booking.providerType === "company" ? `/company/${listing.slug}` : `/plumber/${listing._id}`) : `/plumber/${booking.providerId}`;
    res.json({ data: { ...booking, provider: { hasAccount: Boolean(booking.providerAccount), phone: listing?.phone, email: listing?.email, url: providerUrl } } });
  } catch (error) { next(error); }
}

/** PATCH /api/admin/bookings/:id/status { status, note?, scheduledDate?, timeSlot? } — the customer and plumber are notified. */
export async function setBookingStatus(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Booking not found." });
    const booking = await UserBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found." });
    const { status: nextStatus, note, scheduledDate, timeSlot } = req.validated;
    if (!canMove("admin", booking.status, nextStatus)) return res.status(409).json({ message: `This booking is ${statusLabels[booking.status]} and can't be changed to ${nextStatus}.` });
    if ((nextStatus === "declined" || nextStatus === "cancelled") && !note) return res.status(400).json({ message: "Give a reason — the customer will see it.", errors: { note: "is required" } });
    const problem = applyStatus(booking, { to: nextStatus, by: "admin", note, scheduledDate, timeSlot });
    if (problem) return res.status(409).json({ message: problem });
    await booking.save();
    await announce(booking, nextStatus, "admin");
    res.json({ message: `Booking ${nextStatus === "scheduled" ? "confirmed" : nextStatus}.`, data: booking });
  } catch (error) { next(error); }
}
