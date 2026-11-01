import crypto from "node:crypto";
import { GoogleOAuthState, GoogleOAuthToken } from "../models/index.js";
import { decrypt, encrypt } from "./crypto.js";
import { googleHttp } from "./places.js";

// Optional Google Business Profile connection (OAuth 2.0, scope business.manage) for companies.
// Needs GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_REDIRECT_URI (this API's
// …/api/companies/reviews/google/oauth/callback), and a Google Cloud project approved for the Business Profile APIs.
// Without it, companies still connect with their Place ID and Google reviews come from the Places API.

const SCOPE = "https://www.googleapis.com/auth/business.manage";
const STATE_TTL_MS = 10 * 60 * 1000;
const env = (name) => (process.env[name] || "").trim();
export const oauthConfigured = () => Boolean(env("GOOGLE_CLIENT_ID") && env("GOOGLE_CLIENT_SECRET") && env("GOOGLE_REDIRECT_URI"));

/** Starts the round trip: a one-time state tied to the company, and Google's consent URL. */
export async function authorizationUrl(companyId) {
  const nonce = crypto.randomBytes(24).toString("base64url");
  await GoogleOAuthState.create({ nonce, company: companyId, expiresAt: new Date(Date.now() + STATE_TTL_MS) });
  const params = new URLSearchParams({ client_id: env("GOOGLE_CLIENT_ID"), redirect_uri: env("GOOGLE_REDIRECT_URI"), response_type: "code", scope: SCOPE, access_type: "offline", prompt: "consent", include_granted_scopes: "true", state: nonce });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

/** Uses up a state value; returns the company it belongs to, or null if unknown, expired or already used. */
export async function consumeState(nonce) {
  if (typeof nonce !== "string" || nonce.length < 20) return null;
  const state = await GoogleOAuthState.findOneAndDelete({ nonce, expiresAt: { $gt: new Date() } }).lean();
  return state?.company ?? null;
}

async function tokenRequest(body) {
  const response = await googleHttp.fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: env("GOOGLE_CLIENT_ID"), client_secret: env("GOOGLE_CLIENT_SECRET"), ...body }).toString() });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error_description || payload.error || `Google returned ${response.status}.`);
  return payload;
}

/** Exchanges the code from the callback and stores the (encrypted) refresh token for the company. */
export async function completeAuthorization(companyId, code) {
  const tokens = await tokenRequest({ code, grant_type: "authorization_code", redirect_uri: env("GOOGLE_REDIRECT_URI") });
  if (!tokens.refresh_token) throw new Error("Google didn't return offline access. Remove PlumberFinder from your Google account's connected apps and try again.");
  await GoogleOAuthToken.findOneAndUpdate(
    { company: companyId },
    { $set: { refreshToken: encrypt(tokens.refresh_token), scope: tokens.scope, status: "connected", connectedAt: new Date() }, $unset: { lastError: 1, accountName: 1, locationName: 1 } },
    { upsert: true },
  );
}

/** A short-lived access token for the company, or null when it hasn't connected. */
export async function accessTokenFor(companyId) {
  const record = await GoogleOAuthToken.findOne({ company: companyId, status: "connected" }).select("+refreshToken");
  if (!record?.refreshToken) return null;
  try {
    const tokens = await tokenRequest({ refresh_token: decrypt(record.refreshToken), grant_type: "refresh_token" });
    return { token: tokens.access_token, record };
  } catch (error) {
    // A revoked or expired grant: stop using it until the company reconnects.
    await GoogleOAuthToken.updateOne({ _id: record._id }, { $set: { status: "error", lastError: { message: error.message, at: new Date() } } });
    return null;
  }
}

/** Removes the stored grant (and asks Google to revoke it; failures there don't block the disconnect). */
export async function disconnect(companyId) {
  const record = await GoogleOAuthToken.findOneAndDelete({ company: companyId }).select("+refreshToken");
  if (record?.refreshToken) {
    try { await googleHttp.fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(decrypt(record.refreshToken))}`, { method: "POST" }); } catch { /* best effort */ }
  }
  return Boolean(record);
}

export async function oauthStatus(companyId) {
  const record = await GoogleOAuthToken.findOne({ company: companyId }).lean();
  return { configured: oauthConfigured(), connected: record?.status === "connected", status: record?.status ?? "not_connected", connectedAt: record?.connectedAt ?? null, error: record?.lastError?.message ?? null, locationFound: Boolean(record?.locationName) };
}
