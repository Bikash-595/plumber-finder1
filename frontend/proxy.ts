import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DASHBOARD_HOME, dashboardAreaFor, isExpired, loginPathFor, readTokenClaims, SESSION_COOKIE } from "./app/components/utils/session";

const securityHeaders = {
  "X-DNS-Prefetch-Control": "on",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(self), payment=()",
};

function withSecurityHeaders(response: NextResponse) {
  Object.entries(securityHeaders).forEach(([key, value]) => response.headers.set(key, value));
  return response;
}

/**
 * Each dashboard is only for its own account type: customers → /dashboard, companies →
 * /company-dashboard, freelancers → /freelancer. Anyone else is sent to their own dashboard,
 * or to the login page (which brings them back afterwards).
 */
function dashboardRedirect(request: NextRequest) {
  const area = dashboardAreaFor(request.nextUrl.pathname);
  if (!area) return null;
  const claims = readTokenClaims(request.cookies.get(SESSION_COOKIE)?.value);
  if (!claims || isExpired(claims)) {
    // Customers log in at /login; companies and freelancers at /business/login.
    const redirect = NextResponse.redirect(new URL(loginPathFor(area, request.nextUrl.pathname + request.nextUrl.search), request.url));
    if (claims) redirect.cookies.delete(SESSION_COOKIE);
    return redirect;
  }
  if (claims.accountType !== area) return NextResponse.redirect(new URL(DASHBOARD_HOME[claims.accountType], request.url));
  return null;
}

export function proxy(request: NextRequest) {
  const redirect = dashboardRedirect(request);
  if (redirect) return withSecurityHeaders(redirect);
  const response = NextResponse.next({ request: { headers: request.headers } });

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
