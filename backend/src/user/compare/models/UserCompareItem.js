import mongoose from "mongoose";
import { providerSchemaFields } from "../../shared/providerFields.js";

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  ...providerSchemaFields,
  position: { type: Number, default: 0 },
}, { timestamps: true, collection: "user_compare_items" });

// The same plumber can only be in a customer's list once.
schema.index({ user: 1, providerType: 1, providerId: 1 }, { unique: true });

export const UserCompareItem = mongoose.model("UserCompareItem", schema);
