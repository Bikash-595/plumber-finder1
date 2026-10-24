// One-time email codes: confirm a new account's email, and reset a forgotten password.
export const verificationConfig = {
  codeLength: 6,
  codeTtlMinutes: 10,
  maxAttempts: 5, // wrong guesses before the code is discarded
  resendCooldownSeconds: 60,
  maxSendsPerHour: 5,
};

/**
 * Email verification is always on in production. Outside production it can be switched off with
 * EMAIL_VERIFICATION=off (used by the older automated tests that sign up and log in directly).
 */
export function isEmailVerificationRequired() {
  return process.env.NODE_ENV === "production" || process.env.EMAIL_VERIFICATION !== "off";
}
