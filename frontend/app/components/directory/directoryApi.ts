// Top 10 / Top 50 directory pages: data from the backend (GET /api/directory/rankings/...), fetched on the server
// so search engines see the real listings. Answers are cached for 60 seconds (the backend caches rankings too).

const API = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300/api";

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
};

export type RankingPage = {
  page: {
    limit: 10 | 50; noun: string; type: string; verifiedOnly: boolean;
    state: { code: string; name: string; slug: string }; city: { name: string; slug: string } | null;
    service: { slug: string; name: string; noun: string } | null;
    path: string; top10Path: string; allPath: string;
  };
  items: RankedProvider[];
  sponsored: RankedProvider[];
  qualifying: number;
  stats: { averageRating: number | null; verified: number; emergency: number; reviews: number };
  seo: { minimumQualifyingCompanies: number; isIndexable: boolean; duplicateOfTop10: boolean };
  rankingTypes: { key: string; label: string }[];
  nearby: { name: string; slug: string; providers: number }[];
  relatedServices: { slug: string; name: string; noun: string; urlNoun: string; providers: number }[];
};

export type RankingResult = { status: "ok"; data: RankingPage } | { status: "missing" } | { status: "unavailable" };

/** One ranking page, or "missing" (404) / "unavailable" (backend down). */
export async function fetchRankingPage(limit: string, noun: string, state: string, city?: string, sort?: string): Promise<RankingResult> {
  const path = [limit, noun, state, city].filter(Boolean).map((part) => encodeURIComponent(part!)).join("/");
  try {
    const response = await fetch(`${API}/directory/rankings/${path}${sort ? `?sort=${encodeURIComponent(sort)}` : ""}`, { next: { revalidate: 60 } });
    if (response.status === 404) return { status: "missing" };
    if (!response.ok) return { status: "unavailable" };
    return { status: "ok", data: (await response.json()).data as RankingPage };
  } catch {
    return { status: "unavailable" };
  }
}

/** The ranking pages worth indexing (for sitemap.xml). Empty when the backend is down. */
export async function fetchDirectorySitemap(): Promise<{ path: string; providers: number }[]> {
  try {
    const response = await fetch(`${API}/directory/sitemap`, { next: { revalidate: 3600 } });
    return response.ok ? (await response.json()).data : [];
  } catch {
    return [];
  }
}

/** "/top-10-plumbers/texas" built from parts (same rule as the backend). */
export const rankingHref = (limit: number, noun: string, stateSlug: string, citySlug?: string | null) => `/top-${limit}-${noun}/${stateSlug}${citySlug ? `/${citySlug}` : ""}`;
