// The backend's API address, from NEXT_PUBLIC_BACKEND_URL (or NEXT_PUBLIC_API_URL). Hosting dashboards are often
// given the bare service address ("https://plumber-api.onrender.com") and sometimes the API path
// ("…/api/"), so both are accepted: quotes, spaces and trailing slashes are dropped and "/api" is added when
// missing. NEXT_PUBLIC_ values are written into the build, so a change on Vercel needs a redeploy.

const LOCAL_API = "http://localhost:3300/api";

/** "https://x.onrender.com" | "https://x.onrender.com/api/" → "https://x.onrender.com/api". */
export function normalizeApiBase(raw: string | undefined) {
  const value = String(raw ?? "").trim().replace(/^["']|["']$/g, "").replace(/\/+$/, "");
  if (!value) return LOCAL_API;
  return /\/api$/i.test(value) ? value : `${value}/api`;
}

export const API_BASE_URL = normalizeApiBase(process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL);
