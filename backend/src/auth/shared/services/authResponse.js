import { createAccessToken } from "./tokens.js";

/** Account data safe to send to the browser (never the password hash). */
export function publicAccount(account) {
  const result = account.toObject ? account.toObject() : { ...account };
  delete result.password;
  return result;
}

/** Every sign-in method answers the same way: an access token plus the public account. */
export function sendAuthResponse(res, account, status = 200) {
  res.status(status).json({ token: createAccessToken(account), account: publicAccount(account) });
}

/** "This account uses Google sign-in." for accounts that have no password. */
export function socialOnlyMessage(account) {
  const providers = [account.googleId && "Google", account.appleId && "Apple"].filter(Boolean);
  return `This account uses ${providers.join(" or ") || "social"} sign-in. Please continue with ${providers[0] || "that provider"}.`;
}
