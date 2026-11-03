import mongoose from "mongoose";

// Every premium payment, for the account's billing history and admin reports. Card payments come from
// Stripe invoices (one row per invoice, never twice); manual payments are entered by an admin.
const premiumPaymentSchema = new mongoose.Schema({
  providerType: { type: String, enum: ["company", "freelancer"], required: true },
  account: { type: mongoose.Schema.Types.ObjectId, required: true },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: "PremiumSubscription", required: true },
  plan: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 }, // cents
  currency: { type: String, default: "usd" },
  status: { type: String, enum: ["paid", "failed", "refunded"], default: "paid" },
  source: { type: String, enum: ["stripe", "manual"], required: true },
  periodStart: Date,
  periodEnd: Date,
  stripeInvoiceId: { type: String, index: { unique: true, sparse: true } },
  invoiceUrl: String,
  note: { type: String, maxlength: 500 },
  recordedBy: { type: mongoose.Schema.Types.ObjectId }, // the admin, for manual payments
}, { timestamps: true, collection: "premium_payments" });

premiumPaymentSchema.index({ providerType: 1, account: 1, createdAt: -1 });

export const PremiumPayment = mongoose.model("PremiumPayment", premiumPaymentSchema);
