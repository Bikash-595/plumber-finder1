import mongoose from "mongoose";

// Successful sign-ins, shown to the account owner in Settings ("Recent sign-ins") so they can spot one that
// wasn't them. The IP address is stored with its last part hidden. Removed automatically after 180 days.
const loginEventSchema = new mongoose.Schema({
  accountType: { type: String, enum: ["user", "company", "freelancer"], required: true },
  account: { type: mongoose.Schema.Types.ObjectId, required: true },
  method: { type: String, maxlength: 20 },
  ip: { type: String, maxlength: 64 },
  userAgent: { type: String, maxlength: 300 },
  createdAt: { type: Date, default: Date.now },
}, { collection: "login_events", versionKey: false });
loginEventSchema.index({ accountType: 1, account: 1, createdAt: -1 });
loginEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 180 * 24 * 60 * 60 });

export const LoginEvent = mongoose.model("LoginEvent", loginEventSchema);

/** "203.0.113.42" → "203.0.113.x"; IPv6 keeps its first four groups. */
export function maskIp(ip) {
  const value = String(ip ?? "").replace(/^::ffff:/, "");
  if (/^\d+\.\d+\.\d+\.\d+$/.test(value)) return value.replace(/\.\d+$/, ".x");
  if (value.includes(":")) return `${value.split(":").slice(0, 4).join(":")}:…`;
  return value || "unknown";
}
