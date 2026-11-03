import mongoose from "mongoose";
import { INTERVALS, PLAN_IDS, STATUSES } from "../config/plans.js";

// One premium subscription per company or freelancer account. Changed only by the server: the Stripe
// webhook (paid by card) or an admin (paid another way). Never by what the browser says.
const historySchema = new mongoose.Schema({
  at: { type: Date, default: Date.now },
  event: { type: String, required: true, maxlength: 60 },
  by: { type: String, enum: ["provider", "admin", "stripe", "system"], required: true },
  note: { type: String, maxlength: 500 },
}, { _id: false });

const subscriptionSchema = new mongoose.Schema({
  providerType: { type: String, enum: ["company", "freelancer"], required: true },
  account: { type: mongoose.Schema.Types.ObjectId, required: true },
  plan: { type: String, enum: PLAN_IDS, required: true },
  interval: { type: String, enum: Object.keys(INTERVALS), default: "month" },
  status: { type: String, enum: STATUSES, default: "pending", index: true },
  source: { type: String, enum: ["stripe", "manual"], required: true },
  currentPeriodStart: Date,
  currentPeriodEnd: { type: Date, index: true },
  cancelAtPeriodEnd: { type: Boolean, default: false },
  requestNote: { type: String, trim: true, maxlength: 500 },
  stripe: {
    customerId: String,
    subscriptionId: { type: String, index: { unique: true, sparse: true } },
    checkoutSessionId: String,
  },
  history: { type: [historySchema], default: [] },
}, { timestamps: true, collection: "premium_subscriptions" });

subscriptionSchema.index({ providerType: 1, account: 1 }, { unique: true });

/** Adds a line to the history (kept to the last 50). */
subscriptionSchema.methods.log = function log(event, by, note) {
  this.history.push({ event, by, note });
  if (this.history.length > 50) this.history = this.history.slice(-50);
};

export const Subscription = mongoose.model("PremiumSubscription", subscriptionSchema);
