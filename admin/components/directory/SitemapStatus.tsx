"use client";

import { Panel, useAdminQuery } from "@/components/AdminData";
import { adminApi, formatDate } from "@/lib/adminApi";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * What the site tells search engines: pages in the directory sitemaps per design, state pages too thin to index,
 * and unpublished pages. Google's own indexing report is in Search Console (it needs the site owner's sign-in).
 */
export default function SitemapStatus() {
  const { data, error, loading } = useAdminQuery("directory-sitemap-status", () => adminApi.sitemapStatus());
  const status = data?.data;
  if (loading && !status) return <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />;
  if (error) return <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  if (!status) return null;
  const tiles = [
    { label: "Pages in directory sitemaps", value: status.total },
    { label: "USA pages", value: status.byScope.usa },
    { label: "State pages", value: status.byScope.state },
    { label: "City pages", value: status.byScope.city },
    { label: "States with premium", value: `${status.statesWithPremium} / ${status.statesWithPremium + status.statesWithoutPremium}` },
  ];
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {tiles.map((tile) => <div key={tile.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"><p className="text-xs font-semibold text-gray-500">{tile.label}</p><p className="mt-1 text-2xl font-bold tabular-nums text-gray-900">{tile.value}</p></div>)}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Sitemaps & robots.txt" description={`Checked ${formatDate(status.generatedAt)}. Submit these in Google Search Console to monitor indexing.`}>
          <ul className="space-y-2 text-sm">
            {status.sitemaps.map((url) => <li key={url}><a href={url} target="_blank" rel="noreferrer" className="font-medium text-[#0b1f3b] underline-offset-2 hover:underline">{url}</a></li>)}
            <li><a href={status.robots} target="_blank" rel="noreferrer" className="font-medium text-[#0b1f3b] underline-offset-2 hover:underline">{status.robots}</a></li>
          </ul>
          <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="mt-4 inline-block rounded-full bg-[#0b1f3b] px-4 py-2 text-sm font-semibold text-white">Open Google Search Console</a>
        </Panel>
        <Panel title="State pages kept out of search" description="Top 10 pages with too few premium providers are noindex until enough join.">
          {status.thinStatePages.length ? (
            <ul className="divide-y divide-gray-100 text-sm">
              {status.thinStatePages.map((page) => <li key={page.path} className="flex justify-between gap-3 py-2"><a href={`${siteUrl}${page.path}`} target="_blank" rel="noreferrer" className="text-gray-800 hover:underline">{page.path}</a><span className="text-xs text-gray-500">{page.qualifying} of {page.needs} needed</span></li>)}
            </ul>
          ) : <p className="text-sm text-gray-500">Every state with premium providers has enough to be indexed.</p>}
        </Panel>
      </div>
      <Panel title="Unpublished" description="Pages and locations an admin turned off (404, not in any sitemap). Change them under Landing pages.">
        {status.unpublished.length ? (
          <ul className="divide-y divide-gray-100 text-sm">
            {status.unpublished.map((item) => <li key={item.key} className="flex justify-between gap-3 py-2"><span className="font-medium text-gray-800">{item.key}</span><span className="text-xs text-gray-500">{item.kind}{item.updatedBy ? ` · ${item.updatedBy}` : ""} · {formatDate(item.updatedAt)}</span></li>)}
          </ul>
        ) : <p className="text-sm text-gray-500">Everything is published.</p>}
      </Panel>
    </div>
  );
}
