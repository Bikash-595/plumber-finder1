import { notifyAdmins } from "../../shared/notifications/AccountNotification.js";
import { sideOf } from "../../shared/business/sides.js";
import { CURRENCY, PREMIUM_PLANS, plansFor, priceOf } from "../config/plans.js";
import { PremiumPayment } from "../models/PremiumPayment.js";
import { Subscription } from "../models/Subscription.js";
import { syncListingBadge } from "../services/listingBadge.js";
import { createCheckoutSession, createPortalSession, setCancelAtPeriodEnd, stripeConfigured } from "../services/stripe.js";
import { hasPremium, subscriptionView } from "../services/subscriptions.js";
import { frontendUrl } from "../../config/urls.js";

// The company's or freelancer's own premium page (/api/companies/premium and /api/freelancers/premium).
// Every action is scoped to the signed-in account; prices and return URLs are decided on the server.


const ownerOf = (req) => ({ providerType: sideOf(req).type, account: req.auth.sub });

async function snapshot(req) {
  const side = sideOf(req);
  const [subscription, payments] = await Promise.all([
    Subscription.findOne(ownerOf(req)),
    PremiumPayment.find(ownerOf(req)).sort({ createdAt: -1 }).limit(24).select("plan amount currency status source periodStart periodEnd invoiceUrl createdAt").lean(),
  ]);
  return { mode: stripeConfigured() ? "stripe" : "manual", currency: CURRENCY, plans: plansFor(side.type), subscription: subscriptionView(subscription), payments };
}

export const premiumController = {
  // GET / — plans with this account type's prices, the current plan, and billing history.
  get: async (req, res, next) => {
    try { res.json({ data: await snapshot(req) }); } catch (error) { next(error); }
  },

  // POST /checkout { plan, interval } — a Stripe Checkout page. Premium starts only when Stripe confirms payment.
  checkout: async (req, res, next) => {
    try {
      if (!stripeConfigured()) return res.status(409).json({ message: "Card payments aren't available yet. Send a premium request and our team will set it up." });
      const side = sideOf(req);
      const { plan, interval } = req.validated;
      const existing = await Subscription.findOne(ownerOf(req));
      if (hasPremium(existing) && existing.source === "stripe") return res.status(409).json({ message: "You already have premium. Use “Manage billing” to change your plan or card." });
      const account = await side.Account.findById(req.auth.sub).select("email").lean();
      const back = `${frontendUrl()}${side.dashboard}/premium`;
      const session = await createCheckoutSession({
        providerType: side.type, accountId: req.auth.sub, email: account?.email, customerId: existing?.stripe?.customerId,
        plan, planName: PREMIUM_PLANS[plan].name, interval, amount: priceOf(plan, side.type, interval), currency: CURRENCY,
        successUrl: `${back}?checkout=success`, cancelUrl: `${back}?checkout=cancelled`,
      });
      res.json({ data: { url: session.url } });
    } catch (error) { next(error); }
  },

  // POST /request { plan, interval, note? } — manual mode: ask the team to set up premium (paid by invoice/transfer).
  request: async (req, res, next) => {
    try {
      const side = sideOf(req);
      const { plan, interval, note } = req.validated;
      const existing = await Subscription.findOne(ownerOf(req));
      if (hasPremium(existing)) return res.status(409).json({ message: "You already have premium." });
      const subscription = existing ?? new Subscription({ ...ownerOf(req), source: "manual", plan });
      Object.assign(subscription, { plan, interval, status: "pending", source: "manual", requestNote: note ?? undefined, cancelAtPeriodEnd: false });
      subscription.log("requested", "provider", `${PREMIUM_PLANS[plan].name}, ${interval === "year" ? "yearly" : "monthly"}`);
      await subscription.save();
      const account = await side.Account.findById(req.auth.sub).select(side.accountFields).lean();
      await notifyAdmins({ type: "system", title: "Premium request", message: `${side.accountView(account).name ?? "An account"} (${side.type}) asked for ${PREMIUM_PLANS[plan].name}.`, link: "/premium" }).catch(() => undefined);
      res.status(201).json({ message: "Request sent. Our team will contact you to complete payment.", data: await snapshot(req) });
    } catch (error) { next(error); }
  },

  // POST /cancel — stop renewing (premium stays until the paid period ends), or withdraw a pending request.
  cancel: async (req, res, next) => {
    try {
      const subscription = await Subscription.findOne(ownerOf(req));
      if (!subscription || subscription.status === "expired") return res.status(404).json({ message: "You don't have a premium plan." });
      if (subscription.status === "pending") {
        subscription.status = "expired";
        subscription.log("request withdrawn", "provider");
      } else {
        if (subscription.source === "stripe" && subscription.stripe?.subscriptionId) await setCancelAtPeriodEnd(subscription.stripe.subscriptionId, true);
        subscription.cancelAtPeriodEnd = true;
        subscription.log("set to end at period end", "provider");
      }
      await subscription.save();
      await syncListingBadge(subscription);
      res.json({ message: subscription.status === "expired" ? "Request withdrawn." : "Your plan won't renew. You keep premium until the end of this period.", data: await snapshot(req) });
    } catch (error) { next(error); }
  },

  // POST /resume — keep renewing after a cancel.
  resume: async (req, res, next) => {
    try {
      const subscription = await Subscription.findOne(ownerOf(req));
      if (!hasPremium(subscription) || !subscription.cancelAtPeriodEnd) return res.status(409).json({ message: "There's nothing to resume." });
      if (subscription.source === "stripe" && subscription.stripe?.subscriptionId) await setCancelAtPeriodEnd(subscription.stripe.subscriptionId, false);
      subscription.cancelAtPeriodEnd = false;
      if (subscription.status === "canceled") subscription.status = "active";
      subscription.log("renewal turned back on", "provider");
      await subscription.save();
      res.json({ message: "Your plan will renew.", data: await snapshot(req) });
    } catch (error) { next(error); }
  },

  // POST /portal — Stripe's billing portal: change card, download invoices, switch or cancel plan.
  portal: async (req, res, next) => {
    try {
      const subscription = await Subscription.findOne(ownerOf(req)).select("stripe").lean();
      if (!stripeConfigured() || !subscription?.stripe?.customerId) return res.status(409).json({ message: "There's no card billing on this account." });
      const session = await createPortalSession(subscription.stripe.customerId, `${frontendUrl()}${sideOf(req).dashboard}/premium`);
      res.json({ data: { url: session.url } });
    } catch (error) { next(error); }
  },
};
