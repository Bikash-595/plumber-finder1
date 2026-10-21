"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ADMIN_SESSION_EVENT, readStoredAdmin } from "@/lib/adminAuth";
import { adminApi } from "@/lib/adminApi";

type SessionState = "loading" | "in" | "out";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(ADMIN_SESSION_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(ADMIN_SESSION_EVENT, onChange);
  };
}
const clientState = (): SessionState => (readStoredAdmin()?.accessToken ? "in" : "out");

/**
 * Shows the panel only to a signed-in admin. The backend enforces access on every admin API;
 * this guard keeps signed-out visitors on the login page and signs out revoked/expired sessions.
 */
export default function AdminGuard({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, clientState, () => "loading" as SessionState);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (state === "out") router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    // Confirm the stored token is still accepted (an invalid one signs the admin out).
    if (state === "in") adminApi.me().catch(() => undefined);
  }, [state, router, pathname]);

  if (state !== "in") {
    return <div className="flex min-h-screen items-center justify-center bg-gray-100 text-sm text-gray-500">Checking your admin session…</div>;
  }
  return <>{children}</>;
}
