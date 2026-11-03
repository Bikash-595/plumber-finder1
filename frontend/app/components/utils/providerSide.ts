"use client";

import { readStoredUser } from "./auth";

// Companies and freelancers share the business dashboard screens (home, analytics, operations, growth,
// settings). Each dashboard only opens for its own account type (DashboardGuard), so the signed-in account
// says which API and which dashboard URLs to use. Business screens render only after that check, in the browser.

export type ProviderSide = "company" | "freelancer";

export const currentSide = (): ProviderSide => (readStoredUser()?.accountType === "freelancer" ? "freelancer" : "company");
export const isFreelancer = () => currentSide() === "freelancer";

/** "/companies" or "/freelancers" — the API prefix for the signed-in business account. */
export const apiBase = () => (isFreelancer() ? "/freelancers" : "/companies");

/** "/company-dashboard" or "/freelancer" — where the signed-in account's dashboard lives. */
export const dashBase = () => (isFreelancer() ? "/freelancer" : "/company-dashboard");

// Profile sections that have a different name in the freelancer editor.
const freelancerSlugs: Record<string, string> = { "company-overview": "overview", media: "gallery", "business-hours": "opening-hours", team: "header-profile" };

/** A Business Profile editor page, e.g. editorHref("services"). */
export const editorHref = (slug: string) => (isFreelancer() ? `/freelancer/business-profile/${freelancerSlugs[slug] ?? slug}` : `/company-dashboard/business-profile/${slug}`);

/** "company" / "business" wording for screens that mention the account. */
export const accountNoun = () => (isFreelancer() ? "profile" : "company");
