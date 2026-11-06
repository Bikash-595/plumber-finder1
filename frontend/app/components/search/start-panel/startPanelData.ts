import { serviceDefinitions } from "@/components/services/serviceData";

export type ViewedProfile = { id: string; companyName: string; title?: string; location?: string; image?: string; rating?: number };

const RECENT_VIEWS_KEY = "plumberfinder_recent_deals"; // written by the plumber profile page

export const TRENDING = ["Emergency plumbers near me", "Top 10 plumbers in New York", "Best plumbers in the USA", "Drain cleaning", "Water heater repair", "Best plumbers in Texas", "Leak detection"];

export const POPULAR_STATES = [["New York", "new-york"], ["California", "california"], ["Texas", "texas"], ["Florida", "florida"], ["Illinois", "illinois"], ["Arizona", "arizona"]] as const;

export const POPULAR_SERVICES = serviceDefinitions.slice(0, 8);

export function recentlyViewed(): ViewedProfile[] {
  try {
    const list = JSON.parse(window.localStorage.getItem(RECENT_VIEWS_KEY) ?? "[]");
    return Array.isArray(list) ? list.filter((item) => item && typeof item.id === "string" && typeof item.companyName === "string").slice(0, 4) : [];
  } catch { return []; }
}
