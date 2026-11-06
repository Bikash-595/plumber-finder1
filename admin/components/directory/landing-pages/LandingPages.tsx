"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable, Panel } from "@/components/AdminData";
import { adminApi, type DirectoryConfig, type LandingPages as Pages, type PageSettingBody } from "@/lib/adminApi";
import LocationPicker from "../LocationPicker";
import { useLocations } from "../useLocations";
import PageEditor from "./PageEditor";
import { indexNote, pageLabel } from "./pageLabel";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Every landing page at a location (the USA, a state or a city): publish / unpublish it or the whole location,
 * and set its SEO title, meta description and introduction. Unpublished pages answer 404 and leave the sitemap.
 */
export default function LandingPages({ config }: { config: DirectoryConfig }) {
  const [place, setPlace] = useState({ state: "usa", city: "" });
  const { states, cities } = useLocations(place.state);
  const [data, setData] = useState<Pages | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  const load = useCallback(() => adminApi.landingPages({ state: place.state, city: place.city || undefined }).then(({ data }) => setData(data)), [place]);
  useEffect(() => {
    let cancelled = false;
    adminApi.landingPages({ state: place.state, city: place.city || undefined })
      .then(({ data }) => { if (!cancelled) { setData(data); setNotice(null); } })
      .catch((caught: Error) => { if (!cancelled) setNotice({ tone: "error", text: caught.message }); });
    return () => { cancelled = true; };
  }, [place, config.updatedAt]);

  const save = async (body: PageSettingBody) => {
    setBusy(true);
    try {
      const { message } = await adminApi.saveLandingPage(body);
      await load();
      setEditing(null);
      setNotice({ tone: "ok", text: message });
    } catch (caught) { setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Could not save." }); } finally { setBusy(false); }
  };
  const where = data?.location.city ? `${data.location.city}, ${data.location.state}` : data?.location.state ?? "the USA";

  return (
    <Panel title="Landing pages & SEO" description="Choose a location to see each of its pages, whether search engines can index it, and its wording.">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <LocationPicker states={states} cities={cities} state={place.state} city={place.city} onChange={(value) => { setPlace(value); setEditing(null); }} />
        {data && (
          <button type="button" disabled={busy} onClick={() => { if (data.location.published ? window.confirm(`Unpublish every page for ${where}? They will answer 404 and leave the sitemaps.`) : true) save({ key: data.location.key, kind: "location", published: !data.location.published }); }}
            className={`ml-auto rounded-full px-4 py-1.5 text-xs font-bold disabled:opacity-50 ${data.location.published ? "border border-red-200 text-red-700 hover:bg-red-50" : "bg-emerald-600 text-white"}`}>
            {data.location.published ? `Unpublish all of ${where}` : `Publish ${where} again`}
          </button>
        )}
      </div>
      {notice && <p className={`mb-3 rounded-xl px-4 py-3 text-sm ${notice.tone === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{notice.text}</p>}
      <DataTable head={["Page", "Premium", "Search engines", "Wording", ""]} loading={!data} error="" empty={data?.pages.length === 0}>
        {data?.pages.flatMap((page) => [
          <tr key={page.path} className="border-b border-gray-100 align-top hover:bg-gray-50">
            <td className="px-4 py-3">
              <p className="font-medium text-gray-900">{pageLabel(page, config)}</p>
              <a href={`${siteUrl}${page.path}`} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:underline">{page.path}</a>
            </td>
            <td className="px-4 py-3 tabular-nums text-gray-700">{page.qualifying}</td>
            <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${page.isIndexable ? "bg-emerald-50 text-emerald-700" : page.published ? "bg-gray-100 text-gray-600" : "bg-red-50 text-red-700"}`}>{indexNote(page)}</span></td>
            <td className="px-4 py-3 text-xs text-gray-600">{page.hasOverrides ? `Custom${page.updatedBy ? ` · ${page.updatedBy}` : ""}` : "Built-in"}</td>
            <td className="whitespace-nowrap px-4 py-3 text-right">
              <button type="button" onClick={() => setEditing(editing === page.path ? null : page.path)} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50">Edit SEO</button>
              {(page.published || page.hiddenBy === page.path) && (
                <button type="button" disabled={busy} onClick={() => save({ key: page.path, kind: "page", published: !page.published, title: page.title, description: page.description, intro: page.intro })} className={`ml-2 rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50 ${page.published ? "border border-red-200 text-red-700 hover:bg-red-50" : "bg-emerald-600 text-white"}`}>
                  {page.published ? "Unpublish" : "Publish"}
                </button>
              )}
            </td>
          </tr>,
          editing === page.path && (
            <tr key={`${page.path}-edit`} className="border-b border-gray-100">
              <td colSpan={5} className="px-4 py-3">
                <PageEditor page={page} busy={busy} onCancel={() => setEditing(null)} onSave={(values) => save({ key: page.path, kind: "page", published: page.published || page.hiddenBy !== page.path, ...values })} />
              </td>
            </tr>
          ),
        ])}
      </DataTable>
    </Panel>
  );
}
