import mongoose from "mongoose";
import { Router } from "express";
import { pagination, searchFilter } from "../../admin/shared/listQuery.js";
import { UserBooking } from "../../user/bookings/models/UserBooking.js";
import { bookingsConfig } from "../../user/bookings/config/bookingsConfig.js";
import { createValidator } from "../profileSections/createValidator.js";
import { announce, applyStatus, forProvider } from "./bookingWorkflow.js";

// What the plumber sends with each answer. Declining or cancelling needs a reason the customer will see.
export const responseConfigs = {
  accept: { label: "booking", fields: { scheduledDate: { type: "date" }, timeSlot: { type: "string", max: 60 }, note: { type: "text", max: 500 } } },
  decline: { label: "booking", fields: { reason: { type: "text", required: true, max: 500 } } },
  complete: { label: "booking", fields: { note: { type: "text", max: 500 } } },
  cancel: { label: "booking", fields: { reason: { type: "text", required: true, max: 500 } } },
};
const actions = { accept: "scheduled", decline: "declined", complete: "completed", cancel: "cancelled" };

/** Bookings addressed to a company or freelancer: an inbox with Accept / Decline / Complete / Cancel. */
export function createProviderBookingsController(providerType) {
  const mine = (req) => ({ providerType, providerAccount: new mongoose.Types.ObjectId(String(req.auth.sub)) });
  const findMine = (req) => (mongoose.isValidObjectId(req.params.id) ? UserBooking.findOne({ ...mine(req), _id: req.params.id }) : null);

  const respond = (action) => async (req, res, next) => {
    try {
      const booking = await findMine(req);
      if (!booking) return res.status(404).json({ message: "Booking not found." });
      const { scheduledDate, timeSlot, note, reason } = req.validated;
      if (action === "accept" && !scheduledDate && !booking.scheduledDate) return res.status(400).json({ message: "Choose the date of the visit before accepting.", errors: { scheduledDate: "is required" } });
      const problem = applyStatus(booking, { to: actions[action], by: "provider", note: note ?? reason, scheduledDate, timeSlot });
      if (problem) return res.status(409).json({ message: problem });
      await booking.save();
      await announce(booking, actions[action], "provider");
      const messages = { accept: "Booking accepted. The customer has been notified.", decline: "Booking declined. The customer has been notified.", complete: "Job marked as completed.", cancel: "Booking cancelled. The customer has been notified." };
      res.json({ message: messages[action], data: forProvider(booking) });
    } catch (error) { next(error); }
  };

  return {
    // GET /?status=pending&search=&page= — with how many bookings are in each status (for the tabs).
    list: async (req, res, next) => {
      try {
        const status = bookingsConfig.statuses.includes(req.query.status) ? { status: req.query.status } : {};
        const filter = { ...mine(req), ...status, ...searchFilter(req.query.search, ["reference", "customerName", "service"]) };
        const { page, limit, skip } = pagination(req.query);
        const [data, total, grouped] = await Promise.all([
          // Requests waiting for an answer first, then the soonest visits.
          UserBooking.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
          UserBooking.countDocuments(filter),
          UserBooking.aggregate([{ $match: mine(req) }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
        ]);
        const counts = Object.fromEntries(bookingsConfig.statuses.map((name) => [name, grouped.find((row) => row._id === name)?.count ?? 0]));
        res.json({ data: data.map(forProvider), page, limit, total, counts });
      } catch (error) { next(error); }
    },
    getOne: async (req, res, next) => {
      try {
        const booking = await findMine(req);
        if (!booking) return res.status(404).json({ message: "Booking not found." });
        res.json({ data: forProvider(booking) });
      } catch (error) { next(error); }
    },
    accept: respond("accept"),
    decline: respond("decline"),
    complete: respond("complete"),
    cancel: respond("cancel"),
  };
}

/** Router for /api/companies/bookings or /api/freelancers/bookings; `auth` signs in that account type. */
export function createProviderBookingsRouter(providerType, auth) {
  const controller = createProviderBookingsController(providerType);
  const router = Router();
  router.use(auth);
  router.get("/", controller.list);
  router.get("/:id", controller.getOne);
  for (const action of Object.keys(actions)) router.patch(`/:id/${action}`, createValidator(responseConfigs[action]), controller[action]);
  return router;
}
