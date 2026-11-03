import { sides } from "../../../shared/business/sides.js";
import mongoose from "mongoose";
import { Quote } from "../../../company/quotes/models/Quote.js";
import { effectiveStatus } from "../../../company/quotes/services/quoteMath.js";
import { notifyProvider } from "../../../shared/notifications/AccountNotification.js";
import { UserBooking } from "../../bookings/models/UserBooking.js";

const hidden = "-providerAccount";
const present = (quote) => ({ ...quote, status: effectiveStatus(quote) });

/** The customer's quotes (sent to them; drafts are never visible). */
export const userQuotesController = {
  // GET /?bookingId= — newest first.
  list: async (req, res, next) => {
    try {
      const filter = { user: req.auth.sub, status: { $ne: "draft" }, ...(mongoose.isValidObjectId(req.query.bookingId) ? { booking: req.query.bookingId } : {}) };
      const rows = await Quote.find(filter).sort({ _id: -1 }).limit(100).select(hidden).lean();
      res.json({ data: rows.map(present) });
    } catch (error) { next(error); }
  },

  // POST /:id/accept — the quote's total becomes the booking's price.
  accept: async (req, res, next) => {
    try {
      const quote = mongoose.isValidObjectId(req.params.id) ? await Quote.findOne({ _id: req.params.id, user: req.auth.sub, status: { $ne: "draft" } }) : null;
      if (!quote) return res.status(404).json({ message: "Quote not found." });
      const status = effectiveStatus(quote);
      if (status !== "sent") return res.status(409).json({ message: status === "expired" ? "This quote has expired. Ask the plumber for a new one." : `This quote is ${status}.` });
      const booking = await UserBooking.findOne({ _id: quote.booking, user: req.auth.sub });
      if (!booking || ["declined", "cancelled", "completed"].includes(booking.status)) return res.status(409).json({ message: "This booking can no longer be quoted." });
      Object.assign(quote, { status: "accepted", respondedAt: new Date() });
      await quote.save();
      // Other open quotes for the same booking are no longer needed.
      await Quote.updateMany({ booking: quote.booking, status: "sent", _id: { $ne: quote._id } }, { $set: { status: "withdrawn" } });
      Object.assign(booking, { price: quote.total, quantity: 1, originalPrice: quote.subtotal, discountAmount: quote.discount || undefined });
      booking.history.push({ status: booking.status, by: "customer", note: `Accepted quote ${quote.number} (${quote.total.toFixed(2)})`, at: new Date() });
      await booking.save();
      await notifyProvider(quote.providerType, quote.providerAccount, { type: "booking", title: `Quote ${quote.number} accepted`, message: `${quote.customerName ?? "The customer"} accepted your quote for ${quote.bookingReference}: $${quote.total.toFixed(2)}.`, link: `${sides[quote.providerType]?.dashboard ?? "/company-dashboard"}/quotes?quote=${quote._id}`, booking: booking._id });
      res.json({ message: "Quote accepted. The plumber has been told.", data: present(quote.toObject()) });
    } catch (error) { next(error); }
  },

  // POST /:id/decline { reason? }
  decline: async (req, res, next) => {
    try {
      const quote = mongoose.isValidObjectId(req.params.id) ? await Quote.findOne({ _id: req.params.id, user: req.auth.sub, status: { $ne: "draft" } }) : null;
      if (!quote) return res.status(404).json({ message: "Quote not found." });
      if (effectiveStatus(quote) !== "sent") return res.status(409).json({ message: `This quote is ${effectiveStatus(quote)}.` });
      const reason = typeof req.body?.reason === "string" ? req.body.reason.trim().slice(0, 500) : "";
      Object.assign(quote, { status: "declined", respondedAt: new Date(), declineReason: reason || undefined });
      await quote.save();
      await notifyProvider(quote.providerType, quote.providerAccount, { type: "booking", title: `Quote ${quote.number} declined`, message: `${quote.customerName ?? "The customer"} declined your quote for ${quote.bookingReference}${reason ? `: "${reason}"` : "."}`, link: `${sides[quote.providerType]?.dashboard ?? "/company-dashboard"}/quotes?quote=${quote._id}` });
      res.json({ message: "Quote declined.", data: present(quote.toObject()) });
    } catch (error) { next(error); }
  },
};
