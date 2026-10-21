import { notify } from "../../notifications/services/notify.js";
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
      const booking = await UserBooking.create({ ...req.validated, user: req.auth.sub, source: "request", status: "pending" });
      await notify(req.auth.sub, { type: "booking", title: "Booking request sent", message: `Your request for ${booking.service} was sent to ${booking.providerName}.`, link: "/dashboard/bookings" });
      res.status(201).json({ message: "Booking request sent.", data: booking });
    } catch (error) { next(error); }
  },

  getOne: async (req, res, next) => {
    try {
      const booking = await UserBooking.findOne({ _id: req.params.id, user: req.auth.sub });
      if (!booking) return notFound(res);
      res.json({ data: booking });
    } catch (error) { next(error); }
  },

  cancel: async (req, res, next) => {
    try {
      const booking = await UserBooking.findOneAndUpdate(
        { _id: req.params.id, user: req.auth.sub, status: { $in: bookingsConfig.cancellable } },
        { $set: { status: "cancelled", cancelledAt: new Date() } },
        { new: true }
      );
      if (!booking) {
        const exists = await UserBooking.exists({ _id: req.params.id, user: req.auth.sub });
        return exists ? res.status(409).json({ message: "Only pending or scheduled bookings can be cancelled." }) : notFound(res);
      }
      await notify(req.auth.sub, { type: "booking", title: "Booking cancelled", message: `Your ${booking.service} booking with ${booking.providerName} was cancelled.`, link: "/dashboard/bookings" });
      res.json({ message: "Booking cancelled.", data: booking });
    } catch (error) { next(error); }
  },
};
