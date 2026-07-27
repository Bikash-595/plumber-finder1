import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

function requireJwtSecret() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === "replace-with-a-long-random-secret") {
    throw new Error("JWT_SECRET must be set to a long random value.");
  }
  return process.env.JWT_SECRET;
}

export function validateAuthConfiguration() {
  requireJwtSecret();
}

export function createAccessToken(account) {
  return jwt.sign(
    { sub: account.id, role: account.role, accountType: account.accountType },
    requireJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, requireJwtSecret());
}

export async function verifyGoogleCredential(credential) {
  if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID.startsWith("your-")) {
    throw new Error("GOOGLE_CLIENT_ID must be configured before using Google sign-in.");
  }

  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
  const profile = ticket.getPayload();
  if (!profile?.sub || !profile.email || !profile.email_verified) {
    throw new Error("Google did not return a verified email address.");
  }

  return { googleId: profile.sub, email: profile.email, name: profile.name || profile.email.split("@")[0], avatarUrl: profile.picture };
}
