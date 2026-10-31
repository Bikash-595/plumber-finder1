import { announce, applyStatus, newBookingFields } from "../../../shared/bookings/bookingWorkflow.js";
import { quoteBooking } from "../../../shared/bookings/bookingQuote.js";
import { countsByStatus, findPage, pageParams, textFilter, toObjectId } from "../../shared/paginate.js";
import { bookingsConfig } from "../config/bookingsConfig.js";
import { UserBooking } from "../models/UserBooking.js";

const notFound = (res) => res.status(404).json({ message: "Booking not found." });

export const bookingsController = {
  // GET /?status=pending&q=leak&providerType=company&providerId=…&limit=20&cursor=…
  // Newest first, one page at a time. The first page also carries `counts` per status for the filter tabs.
  list: async (req, res, next) => {
    try {
      const user = toObjectId(req.auth.sub);
      const { status, providerType, providerId } = req.query;
      const filter = {
        user,
        ...(bookingsConfig.statuses.includes(status) ? { status } : {}),
        ...(["company", "freelancer"].includes(providerType) && typeof providerId === "string" ? { providerType, providerId } : {}),
        ...textFilter(req.query.q, ["reference", "providerName", "service"]),
      };
      const params = pageParams(req.query);
      const [page, groups] = await Promise.all([
        findPage(UserBooking, filter, params),
        params.cursor ? null : UserBooking.aggregate([{ $match: { user } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
      ]);
      res.json({ ...page, ...(groups ? { counts: countsByStatus(groups, bookingsConfig.statuses) } : {}) });
    } catch (error) { next(error); }
  },

  create: async (req, res, next) => {
    try {
      const fields = await newBookingFields(req.auth.sub, req.validated.providerType, req.validated.providerId);
      // The price and any coupon are worked out here, never taken from the browser.
      const { couponCode, ...request } = req.validated;
      const quote = await quoteBooking({ providerType: request.providerType, providerId: request.providerId, service: request.service, couponCode });
      if (quote.error) return res.status(400).json({ message: quote.error, errors: { couponCode: quote.error } });
      const pricing = {
        ...(quote.price.base !== null ? { originalPrice: quote.price.base, price: quote.price.total } : {}),
        ...(quote.coupon ? { couponCode: quote.coupon.code, couponLabel: quote.coupon.label, discountAmount: quote.price.discount, offer: quote.coupon.label } : {}),
      };
      const booking = await UserBooking.create({ ...request, ...pricing, ...fields, user: req.auth.sub, source: "request", status: "pending" });
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
