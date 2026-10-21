// Sign in with Apple. APPLE_CLIENT_ID is your Services ID (web) — or a comma-separated list
// that also includes your iOS bundle ID if apps share the backend. Read lazily from the environment.
export const appleConfig = {
  issuer: "https://appleid.apple.com",
  get clientIds() {
    return (process.env.APPLE_CLIENT_ID || "").split(",").map((id) => id.trim()).filter(Boolean);
  },
  get isConfigured() {
    return this.clientIds.length > 0;
  },
  // Apple's public signing keys (JWKS). Overridable for tests.
  get keysUrl() {
    return process.env.APPLE_KEYS_URL || "https://appleid.apple.com/auth/keys";
  },
  keysCacheMs: 60 * 60 * 1000,
};
