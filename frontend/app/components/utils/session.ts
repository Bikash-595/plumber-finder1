// Which dashboard belongs to which account type, and how to read a sign-in token's claims.
// Shared by proxy.ts (server, before the page renders) and the dashboard guard (browser).

export type DashboardArea = "user" | "company" | "freelancer";
export const SESSION_COOKIE = "pf_session";

export const DASHBOARD_HOME: Record<DashboardArea, string> = {
  user: "/dashboard",
  company: "/company-dashboard",
  freelancer: "/freelancer",
};

/** The dashboard a path belongs to, or null for public pages. */
export function dashboardAreaFor(pathname: string): DashboardArea | null {
  const inside = (prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`);
  if (inside("/company-dashboard")) return "company";
  if (inside("/freelancer")) return "freelancer";
  if (inside("/dashboard")) return "user";
  return null;
}

export type TokenClaims = { accountType: DashboardArea; exp: number; sub: string };

/**
 * Reads the claims of a sign-in token without checking its signature — only to decide where to
 * send someone. The backend checks the signature on every request, so a forged token gets no data.
 */
export function readTokenClaims(token: string | undefined | null): TokenClaims | null {
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "="));
    const claims = JSON.parse(json) as Partial<TokenClaims>;
    if (!claims.accountType || !(claims.accountType in DASHBOARD_HOME) || typeof claims.exp !== "number") return null;
    return claims as TokenClaims;
  } catch {
    return null;
  }
}

export const isExpired = (claims: TokenClaims) => claims.exp * 1000 <= Date.now();
