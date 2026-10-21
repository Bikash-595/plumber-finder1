import { securityConfig } from "../config/securityConfig.js";

/** Body: { currentPassword?, newPassword }. currentPassword is required when the account already has one (checked in the controller). */
export function validatePasswordChange(req, res, next) {
  const { currentPassword, newPassword } = req.body ?? {};
  if (typeof newPassword !== "string" || !newPassword) return res.status(400).json({ message: "New password is required.", errors: { newPassword: "is required" } });
  if (newPassword.length < securityConfig.passwordMinLength) return res.status(400).json({ message: `Password must be at least ${securityConfig.passwordMinLength} characters.`, errors: { newPassword: "is too short" } });
  if (Buffer.byteLength(newPassword) > securityConfig.passwordMaxBytes) return res.status(400).json({ message: `Password must be at most ${securityConfig.passwordMaxBytes} bytes.`, errors: { newPassword: "is too long" } });
  if (currentPassword !== undefined && typeof currentPassword !== "string") return res.status(400).json({ message: "Current password must be text." });
  next();
}
