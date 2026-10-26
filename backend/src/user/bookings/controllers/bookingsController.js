import { announce, applyStatus, newBookingFields } from "../../../shared/bookings/bookingWorkflow.js";
import { bookingsConfig } from "../config/bookingsConfig.js";
import { UserBooking } from "../models/UserBooking.js";

const notFound = (res) => res.status(404).json({ message: "Booking not found." });

export const bookingsController = {
  // GET /?status=pending
  list: async (req, res, next) => {
    try {
      const status = bookingsConfig.statuses.includes(req.query.status) ? req.query.status : undefined;
      res.json({ data: await UserBooking.find({ user: req.auth.sub, ...(status ? { status } : {}) }).sort({ createdAt: -1 }) });
    } catch (error) { next(error); }
  },

  create: async (req, res, next) => {
    try {
      const fields = await newBookingFields(req.auth.sub, req.validated.providerType, req.validated.providerId);
      const booking = await UserBooking.create({ ...req.validated, ...fields, user: req.auth.sub, source: "request", status: "pending" });
      // The customer, the plumber (to accept or decline), and admins are notified.
      await announce(booking, "created", "customer");
      res.status(201).json({ message: `Booking request ${booking.reference} sent.`, data: booking });
    } catch (error) { next(error); }
  },

  getOne: async (req, res, next) => {
    try {
      const booking = await UserBooking.findOne({ _id: req.params.id, user: req.auth.sub });
      if (!booking) return notFound(res);
      res.json({ data: booking });
    } catch (error) { next(error); }
  },

  // PATCH /:id/cancel { reason? } — the plumber and admins are told, with the reason if given.
  cancel: async (req, res, next) => {
    try {
      const booking = await UserBooking.findOne({ _id: req.params.id, user: req.auth.sub });
      if (!booking) return notFound(res);
      if (!bookingsConfig.cancellable.includes(booking.status)) return res.status(409).json({ message: "Only pending or scheduled bookings can be cancelled." });
      const reason = typeof req.body?.reason === "string" ? req.body.reason.trim().slice(0, 500) : "";
      applyStatus(booking, { to: "cancelled", by: "customer", note: reason });
      await booking.save();
      await announce(booking, "cancelled", "customer");
      res.json({ message: "Booking cancelled.", data: booking });
    } catch (error) { next(error); }
  },
};
