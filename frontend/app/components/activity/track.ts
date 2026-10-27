"use client";

import { useEffect } from "react";
import { API_BASE_URL } from "@/components/utils/apiClient";
import { readStoredUser } from "@/components/utils/auth";
import { visitorId } from "@/components/utils/visitor";

// Records what visitors do on a plumber's pages (admins see it per plumber). Never blocks or breaks the page.

export type ActivityEvent = "profile_view" | "project_view" | "call_click" | "email_click" | "website_click" | "share";
export type ActivityPayload = { providerType: "company" | "freelancer"; providerId: string; providerName?: string; event: ActivityEvent; target?: { id?: string; title?: string } };
// Page views are sent once per page load even if a component renders twice.
const sent = new Set<string>();

export function trackActivity(payload: ActivityPayload) {
  if (typeof window === "undefined") return;
  const token = readStoredUser()?.accessToken;
  // keepalive lets a click on "Call" or "Website" be recorded even while the page changes.
  fetch(`${API_BASE_URL}/activity`, {
    method: "POST",
    keepalive: true,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ ...payload, visitorId: token ? undefined : visitorId() }),
  }).catch(() => undefined);
}

/** Records a page view (profile or project) once when the page opens. */
export function useTrackView(payload: ActivityPayload | null) {
  const key = payload ? `${payload.event}|${payload.providerType}|${payload.providerId}|${payload.target?.id ?? ""}|${typeof window === "undefined" ? "" : window.location.pathname}` : null;
  useEffect(() => {
    if (!payload || !key || sent.has(key)) return;
    sent.add(key);
    trackActivity(payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the key identifies the view
  }, [key]);
}
