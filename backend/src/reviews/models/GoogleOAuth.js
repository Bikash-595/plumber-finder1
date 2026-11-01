import mongoose from "mongoose";

// Google Business Profile OAuth for a company (optional — it gives the full review list and owner replies).
// The refresh token is encrypted (google/crypto.js) and never selected unless asked for; it is never sent to a browser.
const googleOAuthTokenSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  refreshToken: { type: String, select: false },
  scope: String,
  status: { type: String, enum: ["connected", "error"], default: "connected" },
  accountName: String,   // accounts/123
  locationName: String,  // locations/456
  connectedAt: Date,
  lastError: { message: String, at: Date },
}, { timestamps: true, collection: "google_oauth_tokens" });
export const GoogleOAuthToken = mongoose.model("GoogleOAuthToken", googleOAuthTokenSchema);

// One-time `state` values for the OAuth round trip (CSRF protection). Expired ones are removed by MongoDB.
const googleOAuthStateSchema = new mongoose.Schema({
  nonce: { type: String, required: true, unique: true },
  company: { type: mongoose.Schema.Types.ObjectId, required: true },
  expiresAt: { type: Date, required: true },
}, { collection: "google_oauth_states" });
googleOAuthStateSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const GoogleOAuthState = mongoose.model("GoogleOAuthState", googleOAuthStateSchema);
