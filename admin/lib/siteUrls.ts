// Addresses the admin panel needs, from its build-time environment (Vercel: Project → Settings → Environment
// Variables, then redeploy — NEXT_PUBLIC_ values are written into the build).
//   NEXT_PUBLIC_BACKEND_URL   the API, with or without "/api" ("https://plumber-api.onrender.com")
//   NEXT_PUBLIC_FRONTEND_URL  the public site, for "open page" links (NEXT_PUBLIC_SITE_URL is accepted too)

const clean = (raw: string | undefined) => String(raw ?? "").trim().replace(/^["']|["']$/g, "").replace(/\/+$/, "");

/** "https://x.onrender.com" | "https://x.onrender.com/api/" → "https://x.onrender.com/api". */
export function normalizeApiBase(raw: string | undefined) {
  const value = clean(raw);
  if (!value) return "http://localhost:3300/api";
  return /\/api$/i.test(value) ? value : `${value}/api`;
}

export const API_BASE_URL = normalizeApiBase(process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL);
export const FRONTEND_URL = clean(process.env.NEXT_PUBLIC_FRONTEND_URL || process.env.NEXT_PUBLIC_SITE_URL) || "http://localhost:3000";
