"use client";

import { Panel } from "@/components/AdminData";
import { type BlogStats } from "@/lib/adminApi";
import { typeLabels } from "./blogConfig";

/** How much the blogs are read: Plumber Finder's own posts, and every blog on the site by author type. */
export default function Readership({ stats }: { stats: BlogStats | null }) {
  if (!stats) return null;
  const tile = (label: string, value: number, hint: string) => (
    <div className="rounded-xl bg-gray-50 p-3" title={hint}><p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p><p className="mt-1 text-2xl font-bold text-gray-900">{value.toLocaleString()}</p></div>
  );
  return (
    <Panel title="Readership" description="Views count every time an article is opened (a refresh within 30 minutes counts once); readers are different people — accounts when signed in, otherwise browsers.">
      <p className="text-xs font-bold uppercase tracking-wide text-[#0b1f3b]">Plumber Finder articles</p>
      <div className="mt-2 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tile("Views", stats.totals.views, "Times opened")}{tile("Readers", stats.totals.readers, "Different people")}{tile("Likes", stats.totals.likes, "Readers who liked them")}{tile("Comments", stats.totals.comments, "Comments and replies")}
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-wide text-[#0b1f3b]">All blogs on the site</p>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead><tr className="text-xs uppercase tracking-wide text-gray-500"><th className="py-2 pr-3">Written by</th><th className="px-3 py-2 text-right">Articles read</th><th className="px-3 py-2 text-right">Views</th><th className="py-2 pl-3 text-right">Readers</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {(Object.keys(typeLabels) as (keyof typeof typeLabels)[]).map((type) => (
              <tr key={type}><td className="py-2 pr-3 text-gray-900">{typeLabels[type]}</td><td className="px-3 py-2 text-right text-gray-700">{stats.site.byType[type].postsRead}</td><td className="px-3 py-2 text-right font-semibold text-gray-900">{stats.site.byType[type].views.toLocaleString()}</td><td className="py-2 pl-3 text-right text-gray-700">{stats.site.byType[type].readers.toLocaleString()}</td></tr>
            ))}
            <tr className="font-bold"><td className="py-2 pr-3 text-gray-900">Total</td><td className="px-3 py-2" /><td className="px-3 py-2 text-right text-gray-900">{stats.site.views.toLocaleString()}</td><td className="py-2 pl-3 text-right text-gray-900">{stats.site.readers.toLocaleString()}</td></tr>
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
