"use client";

// Admin session, kept separately from the public site's customer/business sessions.
export type AdminUser = { name: string; email: string; avatarUrl?: string; accessToken: string };

export const ADMIN_STORAGE_KEY = "plumberfinder_admin";
export const ADMIN_SESSION_EVENT = "plumberfinder:admin-session";

export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300/api";

export function getInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

export function readStoredAdmin(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ADMIN_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
}

function storeAdmin(admin: AdminUser) {
  window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin));
  window.dispatchEvent(new Event(ADMIN_SESSION_EVENT));
}

export function clearStoredAdmin() {
  window.localStorage.removeItem(ADMIN_STORAGE_KEY);
  window.dispatchEvent(new Event(ADMIN_SESSION_EVENT));
}

/** Signs in with an admin account (created with `npm run create-admin` in backend/). */
export async function loginAdmin(email: string, password: string) {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/admins/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });
  } catch {
    throw new Error("Cannot reach the backend. Start it with: cd backend && npm run dev");
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || `Login failed (${response.status}).`);
  storeAdmin({ name: payload.account.name, email: payload.account.email, accessToken: payload.token });
}
