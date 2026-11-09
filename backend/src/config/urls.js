// The sites that use this API, from the environment (Render: Service → Environment):
//   FRONTEND_URL  the public site, e.g. https://plumber-finder.vercel.app (links in emails, Stripe return pages)
//   ADMIN_URL     the admin panel, e.g. https://plumber-finder-admin.vercel.app
//   CORS_ORIGIN   any other origins allowed to call the API
// Each may hold several comma-separated addresses; the first FRONTEND_URL is the one put in links. An address may
// use one "*" for a sub-domain ("https://plumber-finder-*.vercel.app" lets Vercel preview deployments in).
// Quotes, spaces, paths and trailing slashes are ignored, so "https://site.vercel.app/" works as well.

const LOCAL_FRONTEND = "http://localhost:3000";
const LOCAL_ADMIN = "http://localhost:3001";

const list = (value) => String(value ?? "").split(",").map((item) => item.trim().replace(/^["']|["']$/g, "")).filter(Boolean);

/** "https://Site.vercel.app/some/path/" → "https://site.vercel.app" (an origin is scheme + host + port). */
export function toOrigin(value) {
  const text = String(value ?? "").trim();
  if (text.includes("*")) return text.replace(/\/+$/, "").toLowerCase();
  try { return new URL(text).origin.toLowerCase(); } catch { return text.replace(/\/+$/, "").toLowerCase(); }
}

/** The public site's address for links (no trailing slash). */
export const frontendUrl = () => (list(process.env.FRONTEND_URL)[0] ?? list(process.env.CORS_ORIGIN)[0] ?? LOCAL_FRONTEND).replace(/\/+$/, "");

/** The admin panel's address (no trailing slash). */
export const adminUrl = () => (list(process.env.ADMIN_URL)[0] ?? LOCAL_ADMIN).replace(/\/+$/, "");

/** Every origin allowed to call the API (the local apps when nothing is set). */
export function allowedOrigins() {
  const configured = [...list(process.env.FRONTEND_URL), ...list(process.env.ADMIN_URL), ...list(process.env.CORS_ORIGIN)];
  const origins = (configured.length ? configured : [LOCAL_FRONTEND, LOCAL_ADMIN]).map(toOrigin);
  return [...new Set(origins)];
}

const escape = (text) => text.replace(/[.+?^${}()|[\]\\]/g, "\\$&");

/** A checker for request origins: exact matches, plus "*" patterns (one sub-domain label, never a dot). */
export function originMatcher(origins = allowedOrigins()) {
  const exact = new Set(origins.filter((origin) => !origin.includes("*")));
  const patterns = origins.filter((origin) => origin.includes("*")).map((origin) => new RegExp(`^${escape(origin).replace(/\*/g, "[a-z0-9-]+")}$`));
  return (origin) => {
    const value = toOrigin(origin);
    return exact.has(value) || patterns.some((pattern) => pattern.test(value));
  };
}
