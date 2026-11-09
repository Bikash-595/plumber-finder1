import { API_BASE_URL } from "@/components/utils/apiBase";

// Top 10 / Top 50 directory pages (USA, state and city): data from the backend (GET /api/directory/rankings/...),
// fetched on the server so search engines see the real listings. Answers are cached for 60 seconds (the backend caches rankings too).

const API = API_BASE_URL;
// A sleeping backend (free hosting plans wake up slowly) must not hang the page until the host cuts it off:
// after this long the page shows "temporarily unavailable" and tries again on the next visit.
// (A race rather than an abort signal, so the response still goes into Next's data cache.)
const SERVER_TIMEOUT_MS = 12_000;
const timed = (request: Promise<Response>) => Promise.race([request, new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), SERVER_TIMEOUT_MS))]);

export type WeekDay = { day: string; isOpen: boolean; opensAt?: string; closesAt?: string };
export type ScoreFactor = { key: string; label: string; weight: number; value: number; points: number };

export type RankedProvider = {
  position?: number;
  providerType: "company" | "freelancer";
  listingId: string; name: string; url: string; logo: string | null;
  address: string | null; city: string | null; stateCode: string | null; phone: string | null; website: string | null;
  description: string; services: string[]; verified: boolean; isEmergency: boolean;
  rating: { average: number; count: number; platform: { average: number; count: number }; google: { rating: number; count: number } | null };
  completedJobs: number; weeklyHours: WeekDay[]; coordinates: { lat: number; lng: number } | null;
  score: number; breakdown: ScoreFactor[]; newBusinessPenalty: number; premiumTier?: "premium" | "elite";
  /** Set on featured / sponsored placements (shown apart from the ranking). */
  placement?: "featured" | "sponsored";
  /** City pages: miles from the city centre. */
  distanceMiles?: number;
};

export type RankingScope = "usa" | "state" | "city";

export type RankingPage = {
  page: {
    scope: RankingScope; limit: 10 | 50; noun: string; type: string; verifiedOnly: boolean;
    /** null on USA pages. */
    state: { code: string; name: string; slug: string } | null; city: { name: string; slug: string } | null;
    service: { slug: string; name: string; noun: string } | null;
    path: string; top10Path: string; allPath: string;
  };
  /** Premium providers only, best first (verified premium before the others). */
  items: RankedProvider[];
  /** Featured / sponsored placements chosen by an admin — never part of the ranking. */
  sponsored: RankedProvider[];
  qualifying: number;
  verifiedQualifying: number;
  /** Listings in the area without premium (not ranked; reachable through "see all plumbers"). */
  otherProviders: number;
  stats: { averageRating: number | null; verified: number; emergency: number; reviews: number; states: number };
  seo: { minimumQualifyingCompanies: number; isIndexable: boolean; duplicateOfTop10: boolean };
  /** The admin's wording (null = the built-in text). */
  text: { title: string | null; description: string | null; intro: string | null };
  sections: { map: boolean; faq: boolean };
  rankingTypes: { key: string; label: string }[];
  coverage: { code: string; name: string; slug: string; premium: number }[];
  nearby: { name: string; slug: string; providers: number }[];
  relatedServices: { slug: string; name: string; noun: string; urlNoun: string; providers: number }[];
  centre?: { lat: number; lng: number };
};

export type RankingResult = { status: "ok"; data: RankingPage } | { status: "missing" } | { status: "unavailable" };

/** One ranking page, or "missing" (404) / "unavailable" (backend down). */
export async function fetchRankingPage(limit: string, noun: string, state: string, city?: string, sort?: string): Promise<RankingResult> {
  const path = [limit, noun, state, city].filter(Boolean).map((part) => encodeURIComponent(part!)).join("/");
  try {
    const response = await timed(fetch(`${API}/directory/rankings/${path}${sort ? `?sort=${encodeURIComponent(sort)}` : ""}`, { next: { revalidate: 60 } }));
    if (response.status === 404) return { status: "missing" };
    if (!response.ok) return { status: "unavailable" };
    return { status: "ok", data: (await response.json()).data as RankingPage };
  } catch {
    return { status: "unavailable" };
  }
}

/** The ranking pages worth indexing, all or for one page design (for the sitemaps). Empty when the backend is down. */
export async function fetchDirectorySitemap(scope?: RankingScope): Promise<{ path: string; providers: number; scope: RankingScope }[]> {
  try {
    const response = await timed(fetch(`${API}/directory/sitemap${scope ? `?scope=${scope}` : ""}`, { next: { revalidate: 3600 } }));
    return response.ok ? (await response.json()).data : [];
  } catch {
    return [];
  }
}

/** "/top-10-plumbers/texas" built from parts (same rule as the backend); no state = "/top-10-plumbers-usa". */
export const rankingHref = (limit: number, noun: string, stateSlug?: string | null, citySlug?: string | null) =>
  stateSlug ? `/top-${limit}-${noun}/${stateSlug}${citySlug ? `/${citySlug}` : ""}` : `/top-${limit}-${noun}-usa`;
