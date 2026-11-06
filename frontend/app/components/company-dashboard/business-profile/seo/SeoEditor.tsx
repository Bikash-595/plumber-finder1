"use client";

import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { companyApi } from "../companyApi";
import { NoticeMessage, type Notice } from "../SavedItems";
import { useOwnListing } from "../useOwnListing";
import KeywordsInput from "./KeywordsInput";
import SearchPreview from "./SearchPreview";
import SeoChecklist, { type SeoDraft } from "./SeoChecklist";
import SidebarPreview from "./SidebarPreview";
import Counter from "@/components/company-dashboard/business-profile/seo/seo-editor/Counter";

const field = "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";
const empty: SeoDraft = { metaTitle: "", metaDescription: "", keywords: [], sidebarHeading: "", sidebarContent: "" };

/**
 * SEO & keywords (companies and freelancers): the title and description search engines show, keywords, and the
 * "about" card under the booking form on the profile — with a live Google preview, the sidebar preview and a checklist.
 */
export default function SeoEditor({ apiEndpoint }: { apiEndpoint: "/companies/seo" | "/freelancers/seo" }) {
  const listing = useOwnListing();
  const [draft, setDraft] = useState<SeoDraft | null>(null);
  const [saved, setSaved] = useState<SeoDraft>(empty);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  // Keyword ideas from the account's own services.
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const fromRecord = (data: Partial<SeoDraft> | null): SeoDraft => ({ ...empty, ...Object.fromEntries(Object.entries(data ?? {}).filter(([, v]) => v != null)), keywords: data?.keywords ?? [] } as SeoDraft);

  useEffect(() => {
    companyApi<Partial<SeoDraft> | null>(apiEndpoint).then(({ data }) => { const d = fromRecord(data); setDraft(d); setSaved(d); }).catch(() => { setDraft(empty); });
    companyApi<{ name: string }[]>(apiEndpoint.replace(/\/seo$/, "/services")).then(({ data }) => setSuggestions(data.map((s) => s.name))).catch(() => undefined);
  }, [apiEndpoint]);

  if (!draft) return <section className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">Loading your SEO settings…</section>;
  const set = (change: Partial<SeoDraft>) => setDraft({ ...draft, ...change });
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const name = listing?.companyName ?? "Your business";
  const url = listing ? (apiEndpoint === "/companies/seo" ? `/company/${listing.slug}` : `/plumber/${listing._id}`) : "/your-profile";
  const save = async () => {
    setBusy(true);
    setNotice(null);
    try {
      const { data } = await companyApi<Partial<SeoDraft>>(apiEndpoint, { method: "PUT", body: { ...draft, metaTitle: draft.metaTitle.trim(), metaDescription: draft.metaDescription.trim(), sidebarHeading: draft.sidebarHeading.trim(), sidebarContent: draft.sidebarContent.trim() } });
      const d = fromRecord(data); setDraft(d); setSaved(d);
      setNotice({ tone: "success", text: "Saved. Your profile and search details are updated." });
    } catch (caught) { setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Could not save." }); } finally { setBusy(false); }
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <p className="text-xs font-bold uppercase tracking-wider text-[#0b1f3b]">Business Profile</p>
      <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold text-gray-900"><FaSearch className="h-5 w-5 text-[#b39200]" aria-hidden /> SEO &amp; keywords</h1>
      <p className="mt-2 max-w-3xl text-sm text-gray-500">Help customers find you on Google and in Plumber Finder search. Your title and description are what search engines show; your keywords and sidebar text appear under the booking form on your profile.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 p-4">
            <p className="text-sm font-bold text-gray-900">1. Search results</p>
            <label className="mt-3 block"><span className="flex justify-between text-sm font-semibold text-gray-700">Page title <Counter value={draft.metaTitle} max={70} ideal={[30, 60]} /></span>
              <input value={draft.metaTitle} maxLength={70} onChange={(e) => set({ metaTitle: e.target.value })} placeholder={`e.g. ${name} — 24/7 plumber in Austin, TX`} className={field} />
            </label>
            <label className="mt-4 block"><span className="flex justify-between text-sm font-semibold text-gray-700">Description <Counter value={draft.metaDescription} max={160} ideal={[70, 160]} /></span>
              <textarea rows={3} value={draft.metaDescription} maxLength={160} onChange={(e) => set({ metaDescription: e.target.value })} placeholder="e.g. Licensed plumbers for leaks, drains and water heaters in Austin. Upfront prices, same-day visits and a 90-day guarantee." className={field} />
            </label>
          </div>
          <div className="rounded-2xl border border-gray-200 p-4">
            <p className="text-sm font-bold text-gray-900">2. Keywords</p>
            <p className="mt-0.5 text-xs text-gray-500">Shown as “Popular searches” on your profile — each one links to Plumber Finder search.</p>
            <div className="mt-3"><KeywordsInput value={draft.keywords} onChange={(keywords) => set({ keywords })} suggestions={suggestions} /></div>
          </div>
          <div className="rounded-2xl border border-gray-200 p-4">
            <p className="text-sm font-bold text-gray-900">3. Profile sidebar</p>
            <label className="mt-3 block"><span className="flex justify-between text-sm font-semibold text-gray-700">Heading <Counter value={draft.sidebarHeading} max={80} /></span>
              <input value={draft.sidebarHeading} maxLength={80} onChange={(e) => set({ sidebarHeading: e.target.value })} placeholder={`e.g. Why Austin chooses ${name}`} className={field} />
            </label>
            <label className="mt-4 block"><span className="flex justify-between text-sm font-semibold text-gray-700">Text <Counter value={draft.sidebarContent} max={1200} ideal={[150, 1200]} /></span>
              <textarea rows={6} value={draft.sidebarContent} maxLength={1200} onChange={(e) => set({ sidebarContent: e.target.value })} placeholder="A few sentences about your business: what you do best, which neighbourhoods you cover, your licences and guarantees, and why customers come back." className={field} />
            </label>
          </div>
          <NoticeMessage notice={notice} />
          <div className="flex gap-3">
            <button type="button" disabled={busy || !dirty} onClick={save} className="rounded-xl bg-[#0b1f3b] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{busy ? "Saving…" : "Save SEO & keywords"}</button>
            {dirty && <button type="button" onClick={() => setDraft(saved)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50">Discard changes</button>}
          </div>
        </div>
        <aside className="space-y-4">
          <SearchPreview title={draft.metaTitle || name} description={draft.metaDescription} url={url} />
          <SidebarPreview draft={draft} name={name} />
          <SeoChecklist draft={draft} />
        </aside>
      </div>
    </section>
  );
}
