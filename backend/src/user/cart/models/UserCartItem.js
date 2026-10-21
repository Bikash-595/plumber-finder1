import mongoose from "mongoose";

const userCartItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  providerType: { type: String, enum: ["company", "freelancer"], required: true },
  providerId: { type: String, required: true, trim: true, maxlength: 64 },
  providerName: { type: String, required: true, trim: true, maxlength: 150 },
  name: { type: String, required: true, trim: true, maxlength: 150 },
  price: { type: Number, required: true, min: 0, max: 100000 },
  quantity: { type: Number, default: 1, min: 1, max: 20 },
  itemType: { type: String, enum: ["service", "offer"], default: "service" },
  image: { type: String },
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "user_cart_items" });

export const UserCartItem = mongoose.model("UserCartItem", userCartItemSchema);
