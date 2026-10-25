"use client";

import { isExpired, readTokenClaims, SESSION_COOKIE } from "./session";

export type AppUser = {
  name: string;
  email: string;
  avatarUrl?: string;
  accountType?: "seeker" | "company" | "freelancer";
  accessToken?: string;
};

export type AccountType = "seeker" | "company" | "freelancer";
type AuthAction = "signup" | "login" | "google" | "apple";

type AuthResponse = {
  token: string;
  account: { name?: string; companyName?: string; email: string; avatarUrl?: string };
  verificationRequired?: boolean;
  email?: string;
  accountType?: string;
};

const API_BASE = () => process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300/api";
const apiAccountType: Record<AccountType, string> = { seeker: "user", company: "company", freelancer: "freelancer" };

/** Thrown when the account exists but its email isn't confirmed yet: show the code step for `email`. */
export class VerificationRequiredError extends Error {
  constructor(message: string, public email: string, public accountType: AccountType) {
    super(message);
  }
}

function accountTypeFromApi(accountType: string | undefined): AccountType {
  return accountType === "company" || accountType === "freelancer" ? accountType : "seeker";
}

// Error responses from proxies or a crashed server may not be JSON.
async function readAuthPayload(response: Response): Promise<AuthResponse & { message?: string }> {
  try {
    return (await response.json()) as AuthResponse & { message?: string };
  } catch {
    if (response.ok) throw new Error("The server returned an unexpected response.");
    return { message: `Request failed (${response.status}).` } as AuthResponse & { message?: string };
  }
}

export const AUTH_STORAGE_KEY = "plumberfinder_user";

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function readStoredUser(): AppUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  } catch {
    return null;
  }
}

/**
 * Mirrors the sign-in token into a cookie so proxy.ts can keep each account type out of the
 * other dashboards before the page even renders. It expires with the token.
 */
export function syncSessionCookie(token: string | undefined) {
  const claims = readTokenClaims(token);
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  if (!token || !claims || isExpired(claims)) {
    document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
    return;
  }
  const maxAge = Math.max(0, Math.floor(claims.exp - Date.now() / 1000));
  document.cookie = `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function storeUser(user: AppUser) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  syncSessionCookie(user.accessToken);
}

export function clearStoredUser() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  syncSessionCookie(undefined);
}

export async function authenticateAccount(accountType: AccountType, action: AuthAction, body: Record<string, unknown>) {
  const resourceByAccountType: Record<AccountType, string> = {
    seeker: "users",
    company: "companies",
    freelancer: "freelancers",
  };
  const resource = resourceByAccountType[accountType];
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300/api";
  let response: Response;
  try {
    response = await fetch(`${baseUrl}/auth/${resource}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Cannot reach the backend. Make sure it is running on http://localhost:3300.");
  }

  const payload = await readAuthPayload(response);
  if (payload.verificationRequired) throw new VerificationRequiredError(payload.message || "Check your email for a code.", payload.email || String(body.email ?? ""), accountType);
  if (!response.ok) throw new Error(payload.message || "Authentication failed.");

  const name = payload.account.name || payload.account.companyName || "Account";
  storeUser({ name, email: payload.account.email, avatarUrl: payload.account.avatarUrl, accountType, accessToken: payload.token });
  return { name, email: payload.account.email };
}

export async function loginWithEmail(email: string, password: string, selectedAccountType: AccountType) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300/api";
  let response: Response;
  try {
    response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });
  } catch {
    throw new Error("Cannot reach the backend. Make sure it is running on http://localhost:3300.");
  }

  const payload = await readAuthPayload(response);
  if (payload.verificationRequired) {
    throw new VerificationRequiredError(payload.message || "Check your email for a code.", payload.email || email.trim(), accountTypeFromApi(payload.accountType));
  }
  if (!response.ok) {
    // Supports a backend that has the role-specific routes but has not yet been restarted
    // with the newer unified /api/auth/login route.
    if (payload.message === "Route not found.") {
      const account = await authenticateAccount(selectedAccountType, "login", { email: email.trim(), password });
      return { ...account, accountType: selectedAccountType };
    }
    throw new Error(payload.message || "Unable to log in.");
  }

  const name = payload.account.name || payload.account.companyName || "Account";
  const accountType = accountTypeFromApi((payload.account as { accountType?: string }).accountType);
  storeUser({ name, email: payload.account.email, avatarUrl: payload.account.avatarUrl, accountType, accessToken: payload.token });
  return { name, email: payload.account.email, accountType };
}

// ---- Email codes (confirm a new account, reset a password) ----

async function postJson(path: string, body: Record<string, unknown>) {
  let response: Response;
  try {
    response = await fetch(`${API_BASE()}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  } catch {
    throw new Error("Cannot reach the backend. Make sure it is running on http://localhost:3300.");
  }
  const payload = await readAuthPayload(response);
  if (!response.ok) throw new Error(payload.message || `Request failed (${response.status}).`);
  return payload;
}

function storeFromPayload(payload: AuthResponse, fallbackType: AccountType) {
  const name = payload.account.name || payload.account.companyName || "Account";
  const accountType = (payload.account as { accountType?: string }).accountType ? accountTypeFromApi((payload.account as { accountType?: string }).accountType) : fallbackType;
  storeUser({ name, email: payload.account.email, avatarUrl: payload.account.avatarUrl, accountType, accessToken: payload.token });
  return { name, email: payload.account.email, accountType };
}

/** Confirms the email with the 6-digit code and signs the account in. */
export async function verifyEmailCode(email: string, accountType: AccountType, code: string) {
  return storeFromPayload(await postJson("/auth/verify-email", { email, accountType: apiAccountType[accountType], code }), accountType);
}

export async function resendVerificationCode(email: string, accountType: AccountType) {
  return (await postJson("/auth/resend-code", { email, accountType: apiAccountType[accountType] })).message as string | undefined;
}

export async function requestPasswordReset(email: string, accountType: AccountType) {
  return (await postJson("/auth/password/forgot", { email: email.trim(), accountType: apiAccountType[accountType] })).message as string | undefined;
}

/** Sets a new password with the emailed reset code and signs the account in. */
export async function resetPasswordWithCode(email: string, accountType: AccountType, code: string, password: string) {
  return storeFromPayload(await postJson("/auth/password/reset", { email: email.trim(), accountType: apiAccountType[accountType], code, password }), accountType);
}

// ---- Real places for the signup ZIP code ----

export type Place = { zipCode: string; city: string; state: string; stateCode: string; latitude: number; longitude: number; street?: string };

async function getPlace(path: string): Promise<Place> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE()}${path}`);
  } catch {
    throw new Error("Cannot reach the backend to look up your location.");
  }
  const payload = (await response.json().catch(() => ({}))) as { data?: Place; message?: string };
  if (!response.ok || !payload.data) throw new Error(payload.message || "We couldn't find that location.");
  return payload.data;
}

export const lookupZip = (zipCode: string) => getPlace(`/location/zip/${encodeURIComponent(zipCode)}`);
export const lookupCoordinates = (latitude: number, longitude: number) => getPlace(`/location/reverse?lat=${latitude}&lng=${longitude}`);

/**
 * Which account type these credentials belong to (via the unified login), without signing in.
 * Used to point people at the right entrance: customers at /login, companies and freelancers at /business/login.
 */
export async function findAccountType(email: string, password: string): Promise<AccountType | null> {
  try {
    const response = await fetch(`${API_BASE()}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim(), password }) });
    const payload = await readAuthPayload(response);
    const type = payload.accountType ?? (payload.account as { accountType?: string } | undefined)?.accountType;
    return response.ok || payload.verificationRequired ? accountTypeFromApi(type) : null;
  } catch {
    return null;
  }
}
