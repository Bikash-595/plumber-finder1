import { LoginEvent, maskIp } from "../models/LoginEvent.js";
import { createAccessToken } from "./tokens.js";

/** Account data safe to send to the browser (never the password hash). */
export function publicAccount(account) {
  const result = account.toObject ? account.toObject() : { ...account };
  delete result.password;
  delete result.tokenVersion;
  return result;
}

/** Every sign-in method answers the same way: an access token plus the public account. */
export function sendAuthResponse(res, account, status = 200) {
  recordLogin(res.req, account);
  res.status(status).json({ token: createAccessToken(account), account: publicAccount(account) });
}

/** Remembers a sign-in for the owner's "Recent sign-ins" list (never blocks the login). */
function recordLogin(req, account) {
  if (!req || !["user", "company", "freelancer"].includes(account.accountType)) return;
  const method = (req.path.split("/").filter(Boolean).at(-1) || "login").slice(0, 20);
  LoginEvent.create({ accountType: account.accountType, account: account._id, method, ip: maskIp(req.ip), userAgent: String(req.headers["user-agent"] ?? "").slice(0, 300) }).catch(() => undefined);
}

/** "This account uses Google sign-in." for accounts that have no password. */
export function socialOnlyMessage(account) {
  const providers = [account.googleId && "Google", account.appleId && "Apple"].filter(Boolean);
  return `This account uses ${providers.join(" or ") || "social"} sign-in. Please continue with ${providers[0] || "that provider"}.`;
}
