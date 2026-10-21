import { createHash } from "node:crypto";
import jwt from "jsonwebtoken";
import { appleConfig } from "../config/appleConfig.js";
import { getAppleSigningKey } from "./appleKeys.js";

const httpError = (status, message) => Object.assign(new Error(message), { status, expose: true });
const unverified = () => httpError(401, "Apple sign-in could not be verified. Please try again.");

/**
 * Verifies the identity token (JWT) returned by Sign in with Apple: RS256 signature against Apple's
 * published keys, issuer, audience (our client IDs), expiry, optional nonce, and verified email.
 */
export async function verifyAppleIdentityToken(identityToken, { nonce } = {}) {
  if (!appleConfig.isConfigured) throw httpError(503, "Apple sign-in is not configured on the server.");

  const decoded = jwt.decode(identityToken, { complete: true });
  if (!decoded?.header?.kid || decoded.header.alg !== "RS256") throw unverified();
  const key = await getAppleSigningKey(decoded.header.kid);
  if (!key) throw unverified();

  let payload;
  try {
    payload = jwt.verify(identityToken, key, { algorithms: ["RS256"], issuer: appleConfig.issuer, audience: appleConfig.clientIds });
  } catch {
    throw unverified();
  }
  if (!payload.sub) throw unverified();
  // Web flows embed the raw nonce; native flows embed its SHA-256 hash.
  if (nonce && payload.nonce !== nonce && payload.nonce !== createHash("sha256").update(nonce).digest("hex")) throw unverified();

  const emailVerified = payload.email_verified === true || payload.email_verified === "true";
  if (payload.email && !emailVerified) throw httpError(401, "Apple did not return a verified email address.");

  return { providerField: "appleId", providerId: payload.sub, email: payload.email?.toLowerCase() };
}
