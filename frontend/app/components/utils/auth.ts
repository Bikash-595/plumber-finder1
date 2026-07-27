"use client";

export type AppUser = {
  name: string;
  email: string;
  avatarUrl?: string;
  accountType?: "seeker" | "company" | "freelancer";
  accessToken?: string;
};

export type AccountType = "seeker" | "company" | "freelancer";
type AuthAction = "signup" | "login" | "google";

type AuthResponse = {
  token: string;
  account: { name?: string; companyName?: string; email: string; avatarUrl?: string };
};

function accountTypeFromApi(accountType: string | undefined): AccountType {
  return accountType === "company" || accountType === "freelancer" ? accountType : "seeker";
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

export function storeUser(user: AppUser) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export async function authenticateAccount(accountType: AccountType, action: AuthAction, body: Record<string, unknown>) {
  const resourceByAccountType: Record<AccountType, string> = {
    seeker: "users",
    company: "companies",
    freelancer: "freelancers",
  };
  const resource = resourceByAccountType[accountType];
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300/api";
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

  const payload = (await response.json()) as AuthResponse & { message?: string };
  if (!response.ok) throw new Error(payload.message || "Authentication failed.");

  const name = payload.account.name || payload.account.companyName || "Account";
  storeUser({ name, email: payload.account.email, avatarUrl: payload.account.avatarUrl, accountType, accessToken: payload.token });
  return { name, email: payload.account.email };
}

export async function loginWithEmail(email: string, password: string, selectedAccountType: AccountType) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300/api";
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

  const payload = (await response.json()) as AuthResponse & { message?: string };
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
