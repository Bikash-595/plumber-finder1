import { adminAuthConfig } from "../config/adminAuthConfig.js";

// In-memory limiter for admin logins (per email + IP). Good for a single server; use a shared
// store such as Redis if the API runs on several instances.
const failures = new Map();
const windowMs = adminAuthConfig.lockoutMinutes * 60 * 1000;
const keyFor = (req) => `${req.ip}|${String(req.body?.email ?? "").trim().toLowerCase()}`;

export function adminLoginRateLimit(req, res, next) {
  const entry = failures.get(keyFor(req));
  if (entry && entry.count >= adminAuthConfig.maxFailedLogins && Date.now() - entry.first < windowMs) {
    res.set("Retry-After", String(Math.ceil((entry.first + windowMs - Date.now()) / 1000)));
    return res.status(429).json({ message: `Too many failed attempts. Try again in ${adminAuthConfig.lockoutMinutes} minutes.` });
  }
  next();
}

export function recordAdminLoginFailure(req) {
  const key = keyFor(req);
  const entry = failures.get(key);
  if (!entry || Date.now() - entry.first >= windowMs) failures.set(key, { count: 1, first: Date.now() });
  else entry.count += 1;
}

export function clearAdminLoginFailures(req) {
  failures.delete(keyFor(req));
}

/** Test helper. */
export function resetAdminLoginRateLimit() {
  failures.clear();
}
