import { sides } from "../../shared/business/sides.js";
import { PREMIUM_PLANS } from "../config/plans.js";
import { hasPremium } from "./subscriptions.js";

/**
 * Copies a subscription's premium state onto the account's public listing (badge, directory rank, end date),
 * or clears it. The directory reads only the listing, so this keeps searches a single indexed query.
 */
export async function syncListingBadge(subscription, now = new Date()) {
  const side = sides[subscription.providerType];
  const owner = { [side.ownerField]: subscription.account };
  if (hasPremium(subscription, now)) {
    const { rank } = PREMIUM_PLANS[subscription.plan];
    await side.Listing.updateOne(owner, { $set: { premium: { tier: subscription.plan, rank, until: subscription.currentPeriodEnd } } });
  } else {
    await side.Listing.updateOne(owner, { $unset: { premium: 1 } });
  }
}
