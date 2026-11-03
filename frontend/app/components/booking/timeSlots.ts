"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/components/utils/apiClient";

// Visit time windows. Each company or freelancer sets its own (Booking Settings); until then these are offered.
// The server accepts only the provider's windows, so the browser can't book a time they don't offer.
export const DEFAULT_SLOTS = ["8:00 AM – 10:00 AM", "10:00 AM – 12:00 PM", "1:00 PM – 3:00 PM", "3:00 PM – 5:00 PM", "5:00 PM – 7:00 PM"];

/** The provider's time windows: from the profile when it's loaded (`known`), otherwise from their booking settings. */
export function useProviderSlots(providerType: string | undefined, listingId: string, known?: string[]) {
  const [fetched, setFetched] = useState<{ id: string; slots: string[] } | null>(null);
  useEffect(() => {
    if (known?.length || !listingId) return;
    const side = providerType === "freelancer" ? "freelancers" : "companies";
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/${side}/booking/public/${encodeURIComponent(listingId)}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => setFetched({ id: listingId, slots: Array.isArray(body?.data?.slots) ? body.data.slots : [] }))
      .catch(() => {});
    return () => controller.abort();
  }, [providerType, listingId, known]);
  if (known?.length) return known;
  return fetched?.id === listingId && fetched.slots.length ? fetched.slots : DEFAULT_SLOTS;
}
