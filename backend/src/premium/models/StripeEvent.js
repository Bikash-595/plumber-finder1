import mongoose from "mongoose";

// Stripe webhook events already handled. Stripe can deliver an event more than once; the unique id makes
// sure each one changes a subscription only once. Kept 30 days.
const stripeEventSchema = new mongoose.Schema({
  _id: { type: String },
  type: String,
  receivedAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 },
}, { collection: "premium_stripe_events" });

export const StripeEvent = mongoose.model("PremiumStripeEvent", stripeEventSchema);
