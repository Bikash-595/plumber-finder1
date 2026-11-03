import mongoose from "mongoose";
import { sides } from "../../shared/business/sides.js";
import { INTERVALS, PLAN_IDS, PREMIUM_PLANS } from "../config/plans.js";
import { PremiumPayment } from "../models/PremiumPayment.js";
import { StripeEvent } from "../models/StripeEvent.js";
import { Subscription } from "../models/Subscription.js";
import { syncListingBadge } from "../services/listingBadge.js";
import { getSubscription, periodOf, verifyWebhook } from "../services/stripe.js";
import { hasPremium, notifyAccount } from "../services/subscriptions.js";

// POST /api/premium/webhook/stripe — the only way a card payment turns premium on or off. The request must be
// signed by Stripe (checked against the raw body); each event is applied once.

const statusFrom = { active: "active", trialing: "active", past_due: "past_due", unpaid: "past_due", incomplete: "pending", incomplete_expired: "expired", canceled: "expired", paused: "expired" };

/** Applies a Stripe subscription object to our record and the listing badge. Unknown metadata is ignored. */
async function applyStripeSubscription(stripeSub, extra = {}) {
  const { providerType, account, plan, interval } = stripeSub.metadata ?? {};
  if (!sides[providerType] || !mongoose.isValidObjectId(account) || !PLAN_IDS.includes(plan)) return;
  const { start, end } = periodOf(stripeSub);
  const before = await Subscription.findOne({ providerType, account });
  const wasPremium = hasPremium(before);
  const subscription = before ?? new Subscription({ providerType, account, plan, source: "stripe" });
  Object.assign(subscription, {
    plan, interval: INTERVALS[interval] ? interval : "month", source: "stripe",
    status: statusFrom[stripeSub.status] ?? "pending",
    currentPeriodStart: start ?? subscription.currentPeriodStart, currentPeriodEnd: end ?? subscription.currentPeriodEnd,
    cancelAtPeriodEnd: Boolean(stripeSub.cancel_at_period_end),
  });
  subscription.stripe = { ...(subscription.stripe ?? {}), subscriptionId: stripeSub.id, customerId: extra.customerId ?? stripeSub.customer ?? subscription.stripe?.customerId, ...(extra.checkoutSessionId ? { checkoutSessionId: extra.checkoutSessionId } : {}) };
  subscription.log(`stripe: ${stripeSub.status}${stripeSub.cancel_at_period_end ? " (ends at period end)" : ""}`, "stripe");
  await subscription.save();
  await syncListingBadge(subscription);
  if (!wasPremium && hasPremium(subscription)) await notifyAccount(subscription, `Welcome to ${PREMIUM_PLANS[plan].name}`, "Your payment went through. Your badge and top position are live now.");
  if (wasPremium && !hasPremium(subscription)) await notifyAccount(subscription, "Your premium plan has ended", "Renew any time to get your badge and top position back.");
}

/** Records a paid or failed invoice in the billing history (once per invoice). */
async function applyInvoice(invoice, paid) {
  const subscriptionId = invoice.subscription ?? invoice.parent?.subscription_details?.subscription;
  if (!subscriptionId) return;
  const subscription = await Subscription.findOne({ "stripe.subscriptionId": subscriptionId });
  if (!subscription) return;
  const period = invoice.lines?.data?.[0]?.period ?? {};
  await PremiumPayment.updateOne({ stripeInvoiceId: invoice.id }, { $setOnInsert: {
    providerType: subscription.providerType, account: subscription.account, subscription: subscription._id, plan: subscription.plan,
    amount: paid ? invoice.amount_paid ?? 0 : invoice.amount_due ?? 0, currency: invoice.currency ?? "usd", status: paid ? "paid" : "failed", source: "stripe",
    periodStart: period.start ? new Date(period.start * 1000) : undefined, periodEnd: period.end ? new Date(period.end * 1000) : undefined,
    invoiceUrl: typeof invoice.hosted_invoice_url === "string" && invoice.hosted_invoice_url.startsWith("https://") ? invoice.hosted_invoice_url : undefined,
  } }, { upsert: true });
  if (!paid) await notifyAccount(subscription, "Your premium payment didn't go through", "Please update your card under Premium → Manage billing. Stripe will try again automatically.");
}

async function handle(event) {
  const object = event.data?.object ?? {};
  switch (event.type) {
    case "checkout.session.completed":
      if (object.mode === "subscription" && object.subscription) await applyStripeSubscription(await getSubscription(object.subscription), { customerId: object.customer, checkoutSessionId: object.id });
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await applyStripeSubscription(object);
      break;
    case "invoice.paid":
      await applyInvoice(object, true);
      break;
    case "invoice.payment_failed":
      await applyInvoice(object, false);
      break;
    default:
      break; // other events aren't used
  }
}

export async function stripeWebhook(req, res) {
  let event;
  try {
    event = verifyWebhook(Buffer.isBuffer(req.body) ? req.body.toString("utf8") : "", req.headers["stripe-signature"]);
  } catch {
    return res.status(400).json({ message: "Invalid webhook signature." });
  }
  try {
    // Claim the event first: a second delivery of the same event does nothing.
    await StripeEvent.create({ _id: event.id, type: event.type });
  } catch (error) {
    if (error?.code === 11000) return res.json({ received: true, duplicate: true });
    return res.status(500).json({ message: "Could not record the event." });
  }
  try {
    await handle(event);
    res.json({ received: true });
  } catch (error) {
    // Let Stripe retry: forget the claim so the retry is processed.
    await StripeEvent.deleteOne({ _id: event.id }).catch(() => undefined);
    console.error("Stripe webhook failed:", error.message);
    res.status(500).json({ message: "Webhook handling failed." });
  }
}
