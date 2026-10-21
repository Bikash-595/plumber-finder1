// Settings for the access tokens issued after any successful sign-in (email, Google, or Apple).
export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === "replace-with-a-long-random-secret") throw new Error("JWT_SECRET must be set to a long random value.");
  return secret;
}

export const getJwtExpiresIn = () => process.env.JWT_EXPIRES_IN || "7d";

/** Called at startup so a missing secret fails fast instead of on the first login. */
export function validateAuthConfiguration() {
  getJwtSecret();
}
