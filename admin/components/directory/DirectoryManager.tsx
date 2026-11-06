"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAdminQuery } from "@/components/AdminData";
import { adminApi, type DirectoryConfig } from "@/lib/adminApi";
import LandingPages from "./landing-pages/LandingPages";
import PageTemplates from "./PageTemplates";
import Placements from "./placements/Placements";
import PremiumEligibility from "./PremiumEligibility";
import RankingPreview from "./RankingPreview";
import RankingSettings from "./RankingSettings";
import SearchAnalytics from "./SearchAnalytics";
import SitemapStatus from "./SitemapStatus";

const tabs = [
  { value: "settings", label: "Ranking settings" },
  { value: "premium", label: "Premium eligibility" },
  { value: "preview", label: "Preview & exclusions" },
  { value: "pages", label: "Landing pages & SEO" },
  { value: "placements", label: "Featured & sponsored" },
  { value: "templates", label: "Page templates" },
  { value: "sitemap", label: "Sitemaps & indexing" },
  { value: "search", label: "Search analytics" },
] as const;
type Tab = (typeof tabs)[number]["value"];

/**
 * Premium Directory & SEO: how the premium-only Top 10 / Top 50 pages rank, who is eligible, each landing page's
 * publishing and wording, placements, the three page designs, sitemaps and what people search for.
 */
export default function DirectoryManager() {
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>(tabs.some((item) => item.value === params.get("tab")) ? (params.get("tab") as Tab) : "settings");
  const { data, error, loading } = useAdminQuery("directory-config", () => adminApi.directoryConfig());
  const [saved, setSaved] = useState<DirectoryConfig | null>(null);
  const config = saved ?? data?.data ?? null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2" role="tablist">
        {tabs.map((item) => <button key={item.value} type="button" role="tab" aria-selected={tab === item.value} onClick={() => setTab(item.value)} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === item.value ? "bg-[#0b1f3b] text-white" : "border border-gray-200 bg-white text-gray-700"}`}>{item.label}</button>)}
      </div>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {tab === "search" ? <SearchAnalytics /> : tab === "sitemap" ? <SitemapStatus /> : loading && !config ? <div className="h-64 animate-pulse rounded-2xl bg-gray-100" /> : config && (
        tab === "settings" ? <RankingSettings key={config.updatedAt ?? "defaults"} config={config} onSaved={setSaved} />
          : tab === "premium" ? <PremiumEligibility config={config} onSaved={setSaved} />
          : tab === "pages" ? <LandingPages config={config} />
          : tab === "placements" ? <Placements config={config} onSaved={setSaved} />
          : tab === "templates" ? <PageTemplates key={config.updatedAt ?? "defaults"} config={config} onSaved={setSaved} />
          : <RankingPreview config={config} onSaved={setSaved} />
      )}
    </div>
  );
}
