import mongoose from "mongoose";
import { invoicesConfig } from "../config/invoicesConfig.js";

const lineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  providerName: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
}, { _id: false });

const userInvoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  number: { type: String, required: true, unique: true },
  items: [lineSchema],
  subtotal: { type: Number, required: true, min: 0 },
  promoCode: { type: String },
  discount: { type: Number, default: 0, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: invoicesConfig.statuses, default: "pending" },
  dueDate: { type: Date },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserBooking" }],
}, { timestamps: true, collection: "user_invoices" });

export const UserInvoice = mongoose.model("UserInvoice", userInvoiceSchema);
