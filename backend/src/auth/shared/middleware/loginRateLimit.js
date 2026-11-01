// Slows down password guessing on every login form: after 10 wrong passwords for the same email from the same
// IP within 15 minutes, that pair is blocked until the window ends. A successful login clears it. Kept in this
// server's memory; with several API servers, add a shared limiter (e.g. Redis or the load balancer) as well.
const MAX_FAILURES = 10;
const WINDOW_MS = 15 * 60 * 1000;
const failures = new Map();
const keyFor = (req) => `${req.ip}|${String(req.body?.email ?? "").trim().toLowerCase()}`;

export function loginRateLimit(req, res, next) {
  const key = keyFor(req);
  const entry = failures.get(key);
  if (entry && Date.now() - entry.first >= WINDOW_MS) failures.delete(key);
  else if (entry && entry.count >= MAX_FAILURES) {
    res.set("Retry-After", String(Math.ceil((entry.first + WINDOW_MS - Date.now()) / 1000)));
    return res.status(429).json({ message: "Too many failed sign-in attempts. Please wait 15 minutes or reset your password." });
  }
  res.on("finish", () => {
    if (res.statusCode === 401) {
      const current = failures.get(key);
      if (!current || Date.now() - current.first >= WINDOW_MS) failures.set(key, { count: 1, first: Date.now() });
      else current.count += 1;
      if (failures.size > 100_000) failures.clear();
    } else if (res.statusCode < 300) failures.delete(key);
  });
  next();
}

/** Test helper. */
export const resetLoginRateLimit = () => failures.clear();
