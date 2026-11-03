// Premium plans for companies and freelancers. Prices live only here (in cents, USD) — the browser never
// sends a price. A plan's `rank` orders the directory: Premium Plus (2) above Premium (1) above free (0).

export const PREMIUM_PLANS = {
  premium: {
    name: "Premium",
    rank: 1,
    monthly: { company: 4900, freelancer: 2900 },
    features: [
      "Premium badge on your profile and directory card",
      "Shown above free listings in search and on service pages",
      "Highlighted card in the directory",
      "Priority support from the Plumber Finder team",
    ],
  },
  elite: {
    name: "Premium Plus",
    rank: 2,
    monthly: { company: 9900, freelancer: 5900 },
    features: [
      "Everything in Premium",
      "Top Pro badge and gold card",
      "Shown first — above Premium and free listings",
      "Listed first on the home page and city pages",
    ],
  },
};

export const PLAN_IDS = Object.keys(PREMIUM_PLANS);
// Yearly billing: 12 months for the price of 10.
export const INTERVALS = { month: { months: 1, multiplier: 1, label: "Monthly" }, year: { months: 12, multiplier: 10, label: "Yearly (2 months free)" } };
export const CURRENCY = "usd";

/** Price in cents for a plan, account type and billing interval. */
export const priceOf = (plan, providerType, interval) => PREMIUM_PLANS[plan].monthly[providerType] * INTERVALS[interval].multiplier;

/** Plans as the dashboard shows them, with this account type's prices. */
export const plansFor = (providerType) => PLAN_IDS.map((id) => ({
  id, name: PREMIUM_PLANS[id].name, rank: PREMIUM_PLANS[id].rank, features: PREMIUM_PLANS[id].features,
  prices: Object.fromEntries(Object.keys(INTERVALS).map((interval) => [interval, priceOf(id, providerType, interval)])),
}));

// Statuses: pending (asked for premium, not paid yet), active, past_due (a renewal failed — Stripe is retrying),
// canceled (won't renew; premium until the period ends), expired (no longer premium).
export const STATUSES = ["pending", "active", "past_due", "canceled", "expired"];
/** Statuses that still carry premium while the paid period lasts. */
export const PREMIUM_STATUSES = ["active", "past_due", "canceled"];
// Stripe renews a few hours after the period ends; this grace stops a late webhook from dropping premium.
export const RENEWAL_GRACE_MS = 3 * 24 * 60 * 60 * 1000;
