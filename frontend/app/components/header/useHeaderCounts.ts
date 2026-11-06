"use client";

import { useEffect } from "react";
import { useUserData } from "@/components/dashboard/useUserData";
import { isCustomerSignedIn, USER_DATA_EVENT, userApi } from "@/components/utils/userApi";
import type { HeaderCounts } from "./headerConfig";

/** Live badge counts for signed-in customers (refreshed after any cart / saved / notification change). */
export function useHeaderCounts(): HeaderCounts {
  const summary = useUserData(userApi.dashboard);
  const reload = summary.reload;
  useEffect(() => {
    const refresh = () => { if (isCustomerSignedIn()) reload(); };
    window.addEventListener(USER_DATA_EVENT, refresh);
    return () => window.removeEventListener(USER_DATA_EVENT, refresh);
  }, [reload]);
  const counts = summary.signedIn ? summary.data?.counts : undefined;
  return { savedCount: counts?.saved ?? 0, notifCount: counts?.unreadNotifications ?? 0, cartCount: counts?.cart ?? 0 };
}
