import mongoose from "mongoose";
import { bookingsConfig } from "../config/bookingsConfig.js";

const userBookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  // providerType + providerId let the plumber's dashboard find bookings addressed to it later.
  providerType: { type: String, enum: ["company", "freelancer"], required: true },
  providerId: { type: String, required: true, trim: true, maxlength: 64, index: true },
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
  status: { type: String, enum: bookingsConfig.statuses, default: "pending" },
  source: { type: String, enum: ["request", "checkout"], default: "request" },
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: "UserInvoice" },
  cancelledAt: { type: Date },
}, { timestamps: true, collection: "user_bookings" });

userBookingSchema.index({ user: 1, createdAt: -1 });

export const UserBooking = mongoose.model("UserBooking", userBookingSchema);
