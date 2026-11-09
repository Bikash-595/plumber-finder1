"use client";

import { API_BASE_URL } from "@/components/utils/apiBase";
import { clearStoredUser, readStoredUser } from "@/components/utils/auth";

export { API_BASE_URL };

export class ApiRequestError extends Error {
  constructor(message: string, public status = 0) {
    super(message);
  }
}

export type ApiPayload<T> = { data: T; message?: string; errors?: Record<string, string> } & Record<string, unknown>;

/** Calls the backend with the signed-in account's token. Throws ApiRequestError with a readable message. */
export async function apiRequest<T>(path: string, init: { method?: string; body?: unknown; loginMessage?: string } = {}): Promise<ApiPayload<T>> {
  const token = readStoredUser()?.accessToken;
  if (!token) throw new ApiRequestError(init.loginMessage ?? "Please log in to continue.", 401);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: init.method ?? "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    });
  } catch {
    throw new ApiRequestError("Cannot reach the server right now. Please check your connection and try again in a moment.");
  }

  let payload: ApiPayload<T>;
  try {
    payload = await response.json();
  } catch {
    throw new ApiRequestError(`Request failed (${response.status}).`, response.status);
  }
  // The session was ended (signed out everywhere, password changed elsewhere, or expired): sign this browser out
  // and go to the login page, coming back here afterwards.
  if (response.status === 401 && typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    clearStoredUser();
    // A full page load on purpose: it also wipes every in-memory cache of the old session's data.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
  }
  if (!response.ok) {
    // Show the first field-level message, e.g. "rating must be at most 5".
    const [field, problem] = Object.entries(payload.errors ?? {})[0] ?? [];
    throw new ApiRequestError(field ? `${field} ${problem}` : payload.message || `Request failed (${response.status}).`, response.status);
  }
  return payload;
}

/**
 * Converts API values (numbers, ISO dates, arrays) to the strings/booleans the forms use.
 * Missing/null values are omitted so callers can spread the result over their blank defaults.
 */
export function toFormValues(record: Record<string, unknown>, fieldNames: string[]): Record<string, string | boolean> {
  return Object.fromEntries(fieldNames.flatMap((name): [string, string | boolean][] => {
    const value = record[name];
    if (value === undefined || value === null) return [];
    if (typeof value === "boolean") return [[name, value]];
    if (Array.isArray(value)) return [[name, value.join(", ")]];
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) return [[name, value.slice(0, 10)]];
    return [[name, String(value)]];
  }));
}
