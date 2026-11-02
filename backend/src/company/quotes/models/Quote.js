import mongoose from "mongoose";
import { QUOTE_STATUSES } from "../config/quotesConfig.js";
import { newQuoteNumber } from "../services/quoteMath.js";

const lineSchema = new mongoose.Schema({
  description: { type: String, required: true, trim: true, maxlength: 200 },
  quantity: { type: Number, required: true, min: 0.01 },
  unitPrice: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true, min: 0 },
}, { _id: false });

// An itemised estimate from a company (or freelancer) for one of a customer's bookings.
const quoteSchema = new mongoose.Schema({
  number: { type: String, default: newQuoteNumber, unique: true },
  providerType: { type: String, enum: ["company", "freelancer"], required: true },
  providerAccount: { type: mongoose.Schema.Types.ObjectId, required: true },
  providerName: { type: String, maxlength: 150 },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "UserBooking", required: true },
  bookingReference: { type: String, maxlength: 20 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerName: { type: String, maxlength: 120 },
  title: { type: String, trim: true, maxlength: 120 },
  items: { type: [lineSchema], default: [] },
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  taxRate: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  notes: { type: String, trim: true, maxlength: 2000 },
  validUntil: { type: Date },
  status: { type: String, enum: QUOTE_STATUSES, default: "draft" },
  sentAt: Date,
  respondedAt: Date,
  declineReason: { type: String, trim: true, maxlength: 500 },
}, { timestamps: true, collection: "quotes" });
quoteSchema.index({ providerType: 1, providerAccount: 1, _id: -1 });
quoteSchema.index({ providerType: 1, providerAccount: 1, status: 1 });
quoteSchema.index({ user: 1, _id: -1 });
quoteSchema.index({ booking: 1 });

export const Quote = mongoose.model("Quote", quoteSchema);
