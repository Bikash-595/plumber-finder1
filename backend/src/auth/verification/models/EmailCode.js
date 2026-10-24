import mongoose from "mongoose";

// One active code per email + account type + purpose. Only a hash of the code is stored.
const emailCodeSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  accountType: { type: String, required: true },
  purpose: { type: String, enum: ["verify-email", "reset-password"], required: true },
  codeHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  lastSentAt: { type: Date, required: true },
  // Sends in the current hour, for the per-email limit.
  sendCount: { type: Number, default: 1 },
  windowStart: { type: Date, required: true },
}, { timestamps: true, collection: "auth_email_codes" });

emailCodeSchema.index({ email: 1, accountType: 1, purpose: 1 }, { unique: true });
// Expired codes are removed by MongoDB an hour after they expire (the hourly send window outlives the code).
emailCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600 });

export const EmailCode = mongoose.model("EmailCode", emailCodeSchema);
