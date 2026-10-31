import crypto from "node:crypto";
import mongoose from "mongoose";
import { bookingsConfig } from "../config/bookingsConfig.js";

// Short code customers, plumbers and admins can quote, e.g. BK-7F3K2Q (no 0/O/1/I to avoid mix-ups).
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
export const newBookingReference = () => `BK-${Array.from(crypto.randomBytes(6), (byte) => ALPHABET[byte % ALPHABET.length]).join("")}`;

// Every status change: who made it (customer, plumber, admin), when, and any message.
const historySchema = new mongoose.Schema({
  status: { type: String, enum: bookingsConfig.statuses, required: true },
  by: { type: String, enum: ["customer", "provider", "admin", "system"], required: true },
  note: { type: String, trim: true, maxlength: 500 },
  at: { type: Date, default: Date.now },
}, { _id: false });

const userBookingSchema = new mongoose.Schema({
  reference: { type: String, default: newBookingReference, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  // Who booked, as it was when they booked (shown to the plumber and admins).
  customerName: { type: String, trim: true, maxlength: 120 },
  customerEmail: { type: String, trim: true, lowercase: true, maxlength: 200 },
  // The customer's contact preferences from their profile, copied when they booked.
  customerContact: {
    type: new mongoose.Schema({
      preferredContact: { type: String, enum: ["phone", "sms", "email"] },
      contactTime: { type: String, enum: ["anytime", "morning", "afternoon", "evening"] },
      language: { type: String, maxlength: 40 },
      alternateName: { type: String, maxlength: 120 },
      alternatePhone: { type: String, maxlength: 40 },
    }, { _id: false }),
    default: undefined,
  },
  // providerType + providerId identify the public listing; providerAccount is the company/freelancer
  // account that owns it (null for the site's sample plumbers), so the plumber's dashboard can find it.
  providerType: { type: String, enum: ["company", "freelancer"], required: true },
  providerId: { type: String, required: true, trim: true, maxlength: 64, index: true },
  providerAccount: { type: mongoose.Schema.Types.ObjectId, default: null, index: true },
  providerName: { type: String, required: true, trim: true, maxlength: 150 },
  service: { type: String, required: true, trim: true, maxlength: 150 },
  quantity: { type: Number, default: 1, min: 1 },
  price: { type: Number, min: 0 },
  scheduledDate: { type: Date },
  timeSlot: { type: String, trim: true, maxlength: 60 },
  address: { type: String, trim: true, maxlength: 300 },
  phone: { type: String, trim: true, maxlength: 40 },
  details: { type: String, trim: true, maxlength: 2000 },
  offer: { type: String, trim: true, maxlength: 120 },
  // Coupon used: the code, what it gives ("10% off"), and the price before/after it. `price` is the total to pay.
  couponCode: { type: String, trim: true, uppercase: true, maxlength: 40 },
  couponLabel: { type: String, trim: true, maxlength: 120 },
  originalPrice: { type: Number, min: 0 },
  discountAmount: { type: Number, min: 0 },
  status: { type: String, enum: bookingsConfig.statuses, default: "pending" },
  source: { type: String, enum: ["request", "checkout"], default: "request" },
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: "UserInvoice" },
  // The plumber's (or admin's) latest message to the customer: confirmation note, decline or cancel reason.
  responseNote: { type: String, trim: true, maxlength: 500 },
  acceptedAt: { type: Date },
  declinedAt: { type: Date },
  completedAt: { type: Date },
  cancelledAt: { type: Date },
  cancelledBy: { type: String, enum: ["customer", "provider", "admin"] },
  history: { type: [historySchema], default: () => [{ status: "pending", by: "customer" }] },
}, { timestamps: true, collection: "user_bookings" });

// Customer lists page by _id (see user/shared/paginate.js); status tabs and dashboard counts use { user, status }.
userBookingSchema.index({ user: 1, _id: -1 });
userBookingSchema.index({ user: 1, status: 1, _id: -1 });
userBookingSchema.index({ user: 1, createdAt: -1 });
userBookingSchema.index({ providerType: 1, providerAccount: 1, status: 1, createdAt: -1 });

export const UserBooking = mongoose.model("UserBooking", userBookingSchema);
