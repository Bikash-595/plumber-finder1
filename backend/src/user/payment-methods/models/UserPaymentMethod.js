import mongoose from "mongoose";

const userPaymentMethodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  brand: { type: String, enum: ["visa", "mastercard", "amex", "discover", "other"], required: true },
  last4: { type: String, required: true, match: /^\d{4}$/ },
  expMonth: { type: Number, required: true, min: 1, max: 12 },
  expYear: { type: Number, required: true, min: 2000, max: 2100 },
  holderName: { type: String, trim: true, maxlength: 120 },
  label: { type: String, trim: true, maxlength: 60 },
  isDefault: { type: Boolean, default: false },
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "user_payment_methods" });

export const UserPaymentMethod = mongoose.model("UserPaymentMethod", userPaymentMethodSchema);
