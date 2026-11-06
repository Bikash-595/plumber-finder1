"use client";

import { useState } from "react";
import { Panel } from "@/components/AdminData";
import { adminApi, type DirectoryConfig, type PageTemplate, type TemplateKey } from "@/lib/adminApi";

const field = "mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm";
const examples: Record<TemplateKey, string> = { usa: "/top-10-plumbers-usa", state: "/top-10-plumbers/texas", city: "/top-10-plumbers/texas/austin" };

/**
 * The three page designs (USA, state, city): SEO title and description patterns used on every page of that design
 * (a page's own wording, set under Landing pages, wins), and which optional sections they show.
 */
export default function PageTemplates({ config, onSaved }: { config: DirectoryConfig; onSaved: (config: DirectoryConfig) => void }) {
  const [draft, setDraft] = useState(config.settings.templates);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const change = (key: TemplateKey, values: Partial<PageTemplate>) => setDraft({ ...draft, [key]: { ...draft[key], ...values } });

  const save = async () => {
    setBusy(true);
    try {
      const { data, message } = await adminApi.saveDirectoryConfig({ templates: draft });
      onSaved(data);
      setDraft(data.settings.templates);
      setNotice({ tone: "ok", text: message });
    } catch (caught) { setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Could not save." }); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      <p className="rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-900">
        Leave a pattern empty to use the built-in wording. Placeholders: {config.placeholders.map((item) => <code key={item} className="mx-0.5 rounded bg-white px-1 text-xs">{item}</code>)} — e.g. <i>Top {"{limit}"} {"{noun}"} in {"{place}"} ({"{count}"} premium)</i>.
      </p>
      <div className="grid gap-5 xl:grid-cols-3">
        {config.templates.map(({ key, label }) => (
          <Panel key={key} title={`${label} design`} description={`Every page like ${examples[key]}.`}>
            <div className="space-y-3">
              <label className="block text-sm"><span className="font-semibold text-gray-800">SEO title pattern</span>
                <input value={draft[key].title} maxLength={160} onChange={(e) => change(key, { title: e.target.value })} placeholder="Built-in title" className={field} />
              </label>
              <label className="block text-sm"><span className="font-semibold text-gray-800">Meta description pattern</span>
                <textarea value={draft[key].description} maxLength={320} rows={3} onChange={(e) => change(key, { description: e.target.value })} placeholder="Built-in description" className={field} />
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={draft[key].showMap} onChange={(e) => change(key, { showMap: e.target.checked })} className="accent-[#0b1f3b]" />Show the map</label>
              <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={draft[key].showFaq} onChange={(e) => change(key, { showFaq: e.target.checked })} className="accent-[#0b1f3b]" />Show the FAQ</label>
            </div>
          </Panel>
        ))}
      </div>
      {notice && <p className={`rounded-xl px-4 py-3 text-sm ${notice.tone === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{notice.text}</p>}
      <button type="button" disabled={busy} onClick={save} className="rounded-full bg-[#0b1f3b] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Saving…" : "Save templates"}</button>
    </div>
  );
}
