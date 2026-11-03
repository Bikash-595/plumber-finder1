import { notifyProvider } from "../../shared/notifications/AccountNotification.js";
import { sides } from "../../shared/business/sides.js";
import { INTERVALS, PREMIUM_PLANS, PREMIUM_STATUSES, RENEWAL_GRACE_MS } from "../config/plans.js";
import { Subscription } from "../models/Subscription.js";

/** Whether the subscription gives premium right now: a premium status and a paid period that hasn't ended. */
export function hasPremium(subscription, now = new Date()) {
  if (!subscription || !PREMIUM_STATUSES.includes(subscription.status) || !subscription.currentPeriodEnd) return false;
  // Card subscriptions renew a little after the period ends; keep premium during that short gap.
  const grace = subscription.source === "stripe" && !subscription.cancelAtPeriodEnd && subscription.status !== "canceled" ? RENEWAL_GRACE_MS : 0;
  return subscription.currentPeriodEnd.getTime() + grace > now.getTime();
}

/** Adds months to a date (end of a manual payment period). */
export function addMonths(date, months) {
  const next = new Date(date);
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
}

/** The subscription as the dashboard shows it (no Stripe ids). */
export function subscriptionView(subscription, now = new Date()) {
  if (!subscription) return null;
  return {
    id: subscription._id, plan: subscription.plan, planName: PREMIUM_PLANS[subscription.plan]?.name, interval: subscription.interval,
    status: subscription.status, source: subscription.source, active: hasPremium(subscription, now),
    currentPeriodEnd: subscription.currentPeriodEnd ?? null, cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    requestNote: subscription.requestNote ?? null, canManageCard: Boolean(subscription.stripe?.customerId),
    history: subscription.history.slice(-10).reverse(),
  };
}

/** Lets the account know about a change on their dashboard. */
export function notifyAccount(subscription, title, message) {
  return notifyProvider(subscription.providerType, subscription.account, { type: "system", title, message, link: `${sides[subscription.providerType].dashboard}/premium` }).catch(() => undefined);
}

/**
 * Background sweep (see scheduler.js): subscriptions whose paid period is over lose premium, and their
 * listing badge is removed. Safe to run on several servers at once.
 */
export async function expireDue(now = new Date(), syncListingBadge) {
  const due = await Subscription.find({ status: { $in: PREMIUM_STATUSES }, currentPeriodEnd: { $lt: now } }).limit(500);
  let expired = 0;
  for (const subscription of due) {
    if (hasPremium(subscription, now)) continue; // a card renewal inside the grace period
    const claimed = await Subscription.findOneAndUpdate({ _id: subscription._id, status: subscription.status }, { $set: { status: "expired" }, $push: { history: { $each: [{ event: "expired", by: "system", at: now }], $slice: -50 } } }, { new: true });
    if (!claimed) continue;
    await syncListingBadge(claimed, now);
    await notifyAccount(claimed, "Your premium plan has ended", `Your ${PREMIUM_PLANS[claimed.plan].name} plan ended. Renew any time to keep your badge and top position.`);
    expired += 1;
  }
  return expired;
}

export { INTERVALS };
