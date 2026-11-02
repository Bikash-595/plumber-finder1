"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/components/utils/apiClient";

export type ProviderAvailability = { acceptingBookings: boolean; pauseMessage?: string; minNoticeDays: number; blockedDays: string[] };

const isoDay = (offsetDays: number) => new Date(Date.now() + offsetDays * 864e5).toISOString().slice(0, 10);

/** A company's public booking rules (paused, minimum notice, days off). Freelancers have none, so this stays null. */
export function useProviderAvailability(providerType: string | undefined, listingId: string) {
  const [availability, setAvailability] = useState<ProviderAvailability | null>(null);
  useEffect(() => {
    if ((providerType ?? "company") !== "company" || !listingId) return;
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/companies/availability/public/${encodeURIComponent(listingId)}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => { if (body?.data) setAvailability(body.data); })
      .catch(() => {});
    return () => controller.abort();
  }, [providerType, listingId]);

  const minDate = isoDay(availability?.minNoticeDays ?? 0);
  const dateProblem = (date: string) => {
    if (!date || !availability) return "";
    if (date < minDate) return `Please choose ${minDate} or later — they need ${availability.minNoticeDays} day${availability.minNoticeDays === 1 ? "" : "s"}' notice.`;
    if (availability.blockedDays.includes(date)) return "They're away on that date. Please pick another day.";
    return "";
  };
  return { availability, minDate, dateProblem };
}
