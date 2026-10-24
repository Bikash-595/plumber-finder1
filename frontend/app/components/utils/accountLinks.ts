import type { AppUser } from "./auth";
import { readTokenClaims, type DashboardArea } from "./session";

// Each signed-in account's own dashboard and menu links (customer, company, or freelancer).
// Worked out from this browser's own session, so any number of people signed in at once each
// get only their own links.

export type AccountLink = { href: string; label: string; key: "dashboard" | "profile" | "saved" | "notifications" | "cart" | "business" | "preview" };

const kindFromStored: Record<string, DashboardArea> = { seeker: "user", company: "company", freelancer: "freelancer" };

/** The account type, from the signed-in token when there is one (it can't drift from the server's view). */
export function accountKind(user: AppUser | null): DashboardArea | null {
  if (!user) return null;
  return readTokenClaims(user.accessToken)?.accountType ?? kindFromStored[user.accountType ?? "seeker"] ?? "user";
}

const dashboards: Record<DashboardArea, AccountLink> = {
  user: { href: "/dashboard", label: "My Dashboard", key: "dashboard" },
  company: { href: "/company-dashboard", label: "Company Dashboard", key: "dashboard" },
  freelancer: { href: "/freelancer", label: "Freelancer Dashboard", key: "dashboard" },
};

export function dashboardLink(user: AppUser | null): AccountLink | null {
  const kind = accountKind(user);
  return kind ? dashboards[kind] : null;
}

/** Profile-menu links: the dashboard first, then the shortcuts that belong to this account type. */
export function accountMenuLinks(user: AppUser | null): AccountLink[] {
  const kind = accountKind(user);
  if (!kind) return [];
  if (kind === "company") {
    return [dashboards.company, { href: "/company-dashboard/business-profile/header-profile", label: "Business Profile", key: "business" }, { href: "/company-dashboard/business-profile/preview", label: "View My Public Page", key: "preview" }, { href: "/company-dashboard/notifications", label: "Notifications", key: "notifications" }];
  }
  if (kind === "freelancer") {
    return [dashboards.freelancer, { href: "/freelancer/business-profile/header-profile", label: "My Profile", key: "profile" }, { href: "/freelancer/notifications", label: "Notifications", key: "notifications" }];
  }
  return [dashboards.user, { href: "/account", label: "My Profile", key: "profile" }, { href: "/saved", label: "Saved Deals", key: "saved" }, { href: "/notifications", label: "Notifications", key: "notifications" }, { href: "/checkout", label: "Cart", key: "cart" }];
}
