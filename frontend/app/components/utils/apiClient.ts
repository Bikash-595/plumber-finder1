"use client";

import { readStoredUser } from "@/components/utils/auth";

export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300/api";

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
    throw new ApiRequestError("Cannot reach the backend. Start it with: cd backend && npm run dev");
  }

  let payload: ApiPayload<T>;
  try {
    payload = await response.json();
  } catch {
    throw new ApiRequestError(`Request failed (${response.status}).`, response.status);
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
