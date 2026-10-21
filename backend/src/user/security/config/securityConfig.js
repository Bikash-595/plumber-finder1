import { emailAuthConfig } from "../../../auth/email/config/emailAuthConfig.js";

// Password rules are the same as at signup.
export const securityConfig = {
  passwordMinLength: emailAuthConfig.passwordMinLength,
  passwordMaxBytes: emailAuthConfig.passwordMaxBytes,
};
