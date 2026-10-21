import mongoose from "mongoose";

// Cart-level state (the applied promo code). Items live in UserCartItem.
const userCartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  promoCode: { type: String, trim: true, uppercase: true, maxlength: 40 },
}, { timestamps: true, collection: "user_carts" });

export const UserCart = mongoose.model("UserCart", userCartSchema);
