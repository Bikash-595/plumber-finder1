"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearStoredUser, readStoredUser, syncSessionCookie } from "@/components/utils/auth";
import { DASHBOARD_HOME, isExpired, readTokenClaims, type DashboardArea } from "@/components/utils/session";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300/api";
const meEndpoint: Record<DashboardArea, string> = { user: "/auth/users/me", company: "/auth/companies/me", freelancer: "/auth/freelancers/me" };

/**
 * Shows a dashboard only to its own account type, after the backend confirms the session is real.
 * Everyone else goes to their own dashboard, or to the login page (and back here afterwards).
 */
export default function DashboardGuard({ area, children }: { area: DashboardArea; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const toLogin = () => {
      clearStoredUser();
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    };

    const check = async () => {
      const token = readStoredUser()?.accessToken;
      const claims = readTokenClaims(token);
      if (!token || !claims || isExpired(claims)) return toLogin();
      if (claims.accountType !== area) return router.replace(DASHBOARD_HOME[claims.accountType]);
      syncSessionCookie(token); // keeps the server-side check in step (e.g. sessions from before the cookie)
      try {
        const response = await fetch(`${API_BASE}${meEndpoint[area]}`, { headers: { Authorization: `Bearer ${token}` } });
        if (cancelled) return;
        if (response.status === 401 || response.status === 403 || response.status === 404) return toLogin();
      } catch {
        // Backend unreachable: the token is still checked by every data request, so don't log out.
      }
      if (!cancelled) setAllowed(true);
    };

    check();
    // Logging out (or into another account) in another tab re-checks this one.
    const onStorage = (event: StorageEvent) => { if (event.key === null || event.key === "plumberfinder_user") { setAllowed(false); check(); } };
    window.addEventListener("storage", onStorage);
    return () => { cancelled = true; window.removeEventListener("storage", onStorage); };
  }, [area, pathname, router]);

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100" aria-busy="true">
        <div className="flex flex-col items-center gap-3 text-sm text-gray-500">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#FFD60A] border-t-transparent" aria-hidden />
          Checking your account…
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
