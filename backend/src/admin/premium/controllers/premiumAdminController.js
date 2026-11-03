import mongoose from "mongoose";
import { sides } from "../../../shared/business/sides.js";
import { PREMIUM_PLANS, PREMIUM_STATUSES, STATUSES, priceOf } from "../../../premium/config/plans.js";
import { PremiumPayment } from "../../../premium/models/PremiumPayment.js";
import { Subscription } from "../../../premium/models/Subscription.js";
import { syncListingBadge } from "../../../premium/services/listingBadge.js";
import { cancelNow, stripeConfigured } from "../../../premium/services/stripe.js";
import { addMonths, hasPremium, notifyAccount, subscriptionView } from "../../../premium/services/subscriptions.js";
import { premiumAdminConfig as config } from "../config/premiumAdminConfig.js";

const notFound = (res) => res.status(404).json({ message: "Subscription not found." });
const DAY_MS = 86_400_000;

/** Names for a page of subscriptions (one query per account type). */
async function withNames(rows) {
  const names = new Map();
  for (const side of Object.values(sides)) {
    const ids = rows.filter((row) => row.providerType === side.type).map((row) => row.account);
    if (!ids.length) continue;
    const listings = await side.Listing.find({ [side.ownerField]: { $in: ids } }).select(`${side.ownerField} ${side.listingFields}`).lean();
    // Only the name and public link (the listing's own id must not replace the subscription's).
    for (const listing of listings) { const view = side.listingView(listing); names.set(`${side.type}:${listing[side.ownerField]}`, { name: view.name, url: view.url }); }
    const accounts = await side.Account.find({ _id: { $in: ids } }).select(`email ${side.accountFields}`).lean();
    for (const account of accounts) { const key = `${side.type}:${account._id}`; names.set(key, { ...(names.get(key) ?? {}), accountName: side.accountView(account).name, email: account.email }); }
  }
  return rows.map((row) => ({ ...subscriptionView(row), providerType: row.providerType, account: row.account, createdAt: row.createdAt, ...(names.get(`${row.providerType}:${row.account}`) ?? {}) }));
}

export const premiumAdminController = {
  // GET /?status=&type=&page= — requests and subscriptions, counts by status, and revenue.
  list: async (req, res, next) => {
    try {
      const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
      const filter = { ...(STATUSES.includes(req.query.status) ? { status: req.query.status } : {}), ...(sides[req.query.type] ? { providerType: req.query.type } : {}) };
      const since = new Date(Date.now() - 30 * DAY_MS);
      const [rows, total, counts, active, revenue] = await Promise.all([
        Subscription.find(filter).sort({ updatedAt: -1 }).skip((page - 1) * config.pageSize).limit(config.pageSize),
        Subscription.countDocuments(filter),
        Subscription.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        Subscription.find({ status: { $in: PREMIUM_STATUSES }, currentPeriodEnd: { $gt: new Date() } }).select("plan providerType").lean(),
        PremiumPayment.aggregate([{ $match: { status: "paid", createdAt: { $gte: since } } }, { $group: { _id: null, cents: { $sum: "$amount" } } }]),
      ]);
      res.json({
        data: await withNames(rows), page, limit: config.pageSize, total,
        counts: Object.fromEntries(STATUSES.map((status) => [status, counts.find((row) => row._id === status)?.count ?? 0])),
        summary: { activePlans: active.length, monthlyRecurring: active.reduce((sum, row) => sum + priceOf(row.plan, row.providerType, "month"), 0), last30Days: revenue[0]?.cents ?? 0 },
        stripe: stripeConfigured(),
      });
    } catch (error) { next(error); }
  },

  // POST /:id/activate { plan?, months, amount, note? } — after payment received another way. Extends an active plan.
  activate: async (req, res, next) => {
    try {
      const subscription = mongoose.isValidObjectId(req.params.id) ? await Subscription.findById(req.params.id) : null;
      if (!subscription) return notFound(res);
      if (subscription.source === "stripe" && hasPremium(subscription) && subscription.status !== "canceled") return res.status(409).json({ message: "This plan is paid by card through Stripe. Change it in Stripe." });
      const { plan, months, amount, note } = req.validated;
      const now = new Date();
      const from = hasPremium(subscription, now) && subscription.currentPeriodEnd > now ? subscription.currentPeriodEnd : now;
      Object.assign(subscription, { plan: plan ?? subscription.plan, status: "active", source: "manual", cancelAtPeriodEnd: false, currentPeriodStart: from, currentPeriodEnd: addMonths(from, months), interval: months >= 12 ? "year" : "month" });
      subscription.log(`activated for ${months} month${months === 1 ? "" : "s"}`, "admin", `${note ? `${note} · ` : ""}admin ${req.auth.sub}`);
      await subscription.save();
      await PremiumPayment.create({ providerType: subscription.providerType, account: subscription.account, subscription: subscription._id, plan: subscription.plan, amount: Math.round(amount * 100), source: "manual", status: "paid", periodStart: from, periodEnd: subscription.currentPeriodEnd, note, recordedBy: req.auth.sub });
      await syncListingBadge(subscription, now);
      await notifyAccount(subscription, `${PREMIUM_PLANS[subscription.plan].name} is active`, `Your plan runs until ${subscription.currentPeriodEnd.toISOString().slice(0, 10)}. Your badge and top position are live now.`);
      res.json({ message: "Premium activated.", data: (await withNames([subscription]))[0] });
    } catch (error) { next(error); }
  },

  // POST /:id/cancel { note? } — ends premium now (and the Stripe subscription, if any). Declines a pending request.
  cancel: async (req, res, next) => {
    try {
      const subscription = mongoose.isValidObjectId(req.params.id) ? await Subscription.findById(req.params.id) : null;
      if (!subscription) return notFound(res);
      if (subscription.status === "expired") return res.status(409).json({ message: "This plan has already ended." });
      if (subscription.source === "stripe" && subscription.stripe?.subscriptionId && stripeConfigured()) await cancelNow(subscription.stripe.subscriptionId);
      const wasPending = subscription.status === "pending";
      subscription.status = "expired";
      subscription.cancelAtPeriodEnd = false;
      subscription.log(wasPending ? "request declined" : "ended by admin", "admin", `${req.validated.note ? `${req.validated.note} · ` : ""}admin ${req.auth.sub}`);
      await subscription.save();
      await syncListingBadge(subscription);
      await notifyAccount(subscription, wasPending ? "Your premium request was closed" : "Your premium plan was ended", req.validated.note || "Contact Plumber Finder support if you have questions.");
      res.json({ message: wasPending ? "Request declined." : "Premium ended.", data: (await withNames([subscription]))[0] });
    } catch (error) { next(error); }
  },

  // GET /payments — recent payments across all accounts.
  payments: async (_req, res, next) => {
    try { res.json({ data: await PremiumPayment.find().sort({ createdAt: -1 }).limit(100).lean() }); } catch (error) { next(error); }
  },
};
