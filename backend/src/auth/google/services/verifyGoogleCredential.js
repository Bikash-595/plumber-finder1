import { OAuth2Client } from "google-auth-library";
import { googleConfig } from "../config/googleConfig.js";

const httpError = (status, message) => Object.assign(new Error(message), { status, expose: true });

/** Verifies a Google ID token (the `credential` from Google Identity Services) and returns the identity. */
export async function verifyGoogleCredential(credential) {
  if (!googleConfig.isConfigured) throw httpError(503, "Google sign-in is not configured on the server.");

  let ticket;
  try {
    ticket = await new OAuth2Client(googleConfig.clientId).verifyIdToken({ idToken: credential, audience: googleConfig.clientId });
  } catch {
    throw httpError(401, "Google sign-in could not be verified. Please try again.");
  }
  const profile = ticket.getPayload();
  if (!profile?.sub || !profile.email || !profile.email_verified) throw httpError(401, "Google did not return a verified email address.");

  return { providerField: "googleId", providerId: profile.sub, email: profile.email.toLowerCase(), name: profile.name, avatarUrl: profile.picture };
}
