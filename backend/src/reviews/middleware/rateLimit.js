/**
 * A small fixed-window rate limit, per signed-in account (or IP), kept in this server's memory.
 * It stops bursts of review/report spam; the per-day review limit in the database is the real ceiling.
 * With several API servers, put a shared limiter (e.g. at the load balancer) in front as well.
 */
export function rateLimit({ windowMs, max, message }) {
  const hits = new Map();
  return (req, res, next) => {
    const key = req.auth?.sub ?? req.ip;
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || now - entry.start > windowMs) hits.set(key, { start: now, count: 1 });
    else if (++entry.count > max) {
      res.set("Retry-After", String(Math.ceil((entry.start + windowMs - now) / 1000)));
      return res.status(429).json({ message });
    }
    if (hits.size > 10_000) for (const [k, v] of hits) if (now - v.start > windowMs) hits.delete(k);
    next();
  };
}
