import mongoose from "mongoose";
import { OWNERSHIP, PROPERTY_TYPES } from "../config/addressesConfig.js";

const userAddressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  label: { type: String, required: true, trim: true, maxlength: 40 },
  line1: { type: String, required: true, trim: true, maxlength: 150 },
  line2: { type: String, trim: true, maxlength: 100 },
  city: { type: String, required: true, trim: true, maxlength: 100 },
  state: { type: String, required: true, trim: true, maxlength: 60 },
  zipCode: { type: String, required: true, trim: true, maxlength: 10 },
  propertyType: { type: String, enum: [...PROPERTY_TYPES, null] },
  ownership: { type: String, enum: [...OWNERSHIP, null] },
  yearBuilt: { type: Number, min: 1800 },
  accessNotes: { type: String, trim: true, maxlength: 500 },
  isDefault: { type: Boolean, default: false },
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "user_addresses" });

// Lists are read per customer in saved order.
userAddressSchema.index({ user: 1, position: 1, createdAt: 1 });

export const UserAddress = mongoose.model("UserAddress", userAddressSchema);
