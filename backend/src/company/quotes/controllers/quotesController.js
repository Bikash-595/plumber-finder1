import mongoose from "mongoose";
import { notify as notifyCustomer } from "../../../user/notifications/services/notify.js";
import { UserBooking } from "../../../user/bookings/models/UserBooking.js";
import { findPage, pageParams, textFilter } from "../../../user/shared/paginate.js";
import { toId } from "../../dashboard/services/metrics.js";
import { QUOTE_STATUSES } from "../config/quotesConfig.js";
import { Quote } from "../models/Quote.js";
import { effectiveStatus, quoteTotals } from "../services/quoteMath.js";

const scopeOf = (req) => ({ providerType: "company", providerAccount: toId(req.auth.sub) });
const present = (quote) => ({ ...quote, status: effectiveStatus(quote) });
const money = (value) => `$${value.toFixed(2)}`;

async function findMine(req, res) {
  const quote = mongoose.isValidObjectId(req.params.id) ? await Quote.findOne({ ...scopeOf(req), _id: req.params.id }) : null;
  if (!quote) res.status(404).json({ message: "Quote not found." });
  return quote;
}

async function send(quote) {
  if (!quote.items.length || quote.total <= 0) return "Add at least one priced line before sending.";
  quote.status = "sent";
  quote.sentAt = new Date();
  await quote.save();
  await notifyCustomer(quote.user, { type: "order", title: `New quote from ${quote.providerName ?? "your plumber"}`, message: `${quote.title || "Quote"} ${quote.number} for ${quote.bookingReference}: ${money(quote.total)}. Review and accept it in your bookings.`, link: `/dashboard/bookings?quote=${quote._id}` });
  return null;
}

export const quotesController = {
  // GET /?status=&q=&cursor= — newest first, with counts per status.
  list: async (req, res, next) => {
    try {
      const scope = scopeOf(req);
      const status = QUOTE_STATUSES.includes(req.query.status) ? { status: req.query.status } : {};
      const params = pageParams(req.query, { defaultLimit: 25, maxLimit: 50 });
      const [page, groups, accepted] = await Promise.all([
        findPage(Quote, { ...scope, ...status, ...textFilter(req.query.q, ["number", "customerName", "title", "bookingReference"]) }, params),
        params.cursor ? null : Quote.aggregate([{ $match: scope }, { $group: { _id: "$status", count: { $sum: 1 }, value: { $sum: "$total" } } }]),
        params.cursor ? null : Quote.aggregate([{ $match: { ...scope, status: { $in: ["accepted", "declined"] } } }, { $group: { _id: "$status", n: { $sum: 1 } } }]),
      ]);
      const extra = groups ? {
        counts: Object.fromEntries(QUOTE_STATUSES.map((name) => [name, groups.find((g) => g._id === name)?.count ?? 0])),
        value: { open: Math.round((groups.find((g) => g._id === "sent")?.value ?? 0) * 100) / 100, won: Math.round((groups.find((g) => g._id === "accepted")?.value ?? 0) * 100) / 100 },
        acceptanceRate: (() => { const a = accepted.find((g) => g._id === "accepted")?.n ?? 0; const d = accepted.find((g) => g._id === "declined")?.n ?? 0; return a + d ? Math.round((a / (a + d)) * 100) : null; })(),
      } : {};
      res.json({ ...page, data: page.data.map(present), ...extra });
    } catch (error) { next(error); }
  },

  getOne: async (req, res, next) => {
    try { const quote = await findMine(req, res); if (quote) res.json({ data: present(quote.toObject()) }); } catch (error) { next(error); }
  },

  // POST / { bookingId, items, discount?, taxRate?, title?, notes?, validUntil?, send? } — for one of my bookings.
  create: async (req, res, next) => {
    try {
      const { bookingId, ...values } = req.validated;
      if (!bookingId) return res.status(400).json({ message: "Choose the booking this quote is for.", errors: { bookingId: "is required" } });
      const booking = await UserBooking.findOne({ ...scopeOf(req), _id: bookingId }).select("user customerName reference providerName status").lean();
      if (!booking) return res.status(404).json({ message: "Booking not found." });
      if (["declined", "cancelled", "completed"].includes(booking.status)) return res.status(409).json({ message: `This booking is ${booking.status}; it can't get a new quote.` });
      const quote = new Quote({ ...scopeOf(req), providerName: booking.providerName, booking: booking._id, bookingReference: booking.reference, user: booking.user, customerName: booking.customerName, ...values, ...quoteTotals(values) });
      await quote.save();
      if (req.body?.send === true) {
        const problem = await send(quote);
        if (problem) return res.status(400).json({ message: problem, data: quote });
      }
      res.status(201).json({ message: quote.status === "sent" ? `Quote ${quote.number} sent to ${quote.customerName ?? "the customer"}.` : `Draft ${quote.number} saved.`, data: present(quote.toObject()) });
    } catch (error) { next(error); }
  },

  // PATCH /:id — edit a draft (sent quotes are fixed; withdraw and send a new one instead).
  update: async (req, res, next) => {
    try {
      const quote = await findMine(req, res);
      if (!quote) return;
      if (quote.status !== "draft") return res.status(409).json({ message: "Only drafts can be edited. Withdraw this quote and send a new one." });
      const { bookingId: _ignored, ...values } = req.validated;
      const merged = { items: quote.items.map((i) => ({ description: i.description, quantity: i.quantity, unitPrice: i.unitPrice })), discount: quote.discount, taxRate: quote.taxRate, ...values };
      Object.assign(quote, values, quoteTotals(merged));
      await quote.save();
      res.json({ message: "Draft saved.", data: present(quote.toObject()) });
    } catch (error) { next(error); }
  },

  // POST /:id/send — the customer is notified and can accept or decline it.
  send: async (req, res, next) => {
    try {
      const quote = await findMine(req, res);
      if (!quote) return;
      if (quote.status !== "draft") return res.status(409).json({ message: "This quote was already sent." });
      const problem = await send(quote);
      if (problem) return res.status(400).json({ message: problem });
      res.json({ message: `Quote ${quote.number} sent.`, data: present(quote.toObject()) });
    } catch (error) { next(error); }
  },

  // POST /:id/withdraw — a sent quote the customer hasn't answered.
  withdraw: async (req, res, next) => {
    try {
      const quote = await findMine(req, res);
      if (!quote) return;
      if (quote.status !== "sent") return res.status(409).json({ message: "Only a sent, unanswered quote can be withdrawn." });
      quote.status = "withdrawn";
      await quote.save();
      await notifyCustomer(quote.user, { type: "order", title: `Quote ${quote.number} withdrawn`, message: `${quote.providerName ?? "Your plumber"} withdrew this quote. They may send you a new one.`, link: "/dashboard/bookings" });
      res.json({ message: "Quote withdrawn.", data: present(quote.toObject()) });
    } catch (error) { next(error); }
  },

  // DELETE /:id — drafts only.
  remove: async (req, res, next) => {
    try {
      const quote = await findMine(req, res);
      if (!quote) return;
      if (quote.status !== "draft") return res.status(409).json({ message: "Only drafts can be deleted." });
      await quote.deleteOne();
      res.json({ message: "Draft deleted." });
    } catch (error) { next(error); }
  },
};
