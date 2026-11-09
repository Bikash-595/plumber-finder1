"use client";

import { useState } from "react";
import { Panel } from "@/components/AdminData";
import { adminApi, formatDate, type DirectoryConfig, type RankingSettings as Settings } from "@/lib/adminApi";

type Numbers = Omit<Settings, "weights" | "exclusions" | "placements" | "templates">;
const numberFields: { key: keyof Numbers; label: string; help: string; step?: number; percent?: boolean }[] = [
  { key: "minimumQualifyingCompanies", label: "Minimum providers to index a page", help: "Pages with fewer real providers are noindex and left out of the sitemap." },
  { key: "sponsoredSlots", label: "Featured / sponsored placements per page", help: "The most placements shown in their labelled box (0 turns it off). Placements are chosen on the Placements tab." },
  { key: "ratingConfidenceReviews", label: "Reviews before a rating counts fully", help: "Fewer reviews are pulled towards a neutral 3.0." },
  { key: "jobsForFullScore", label: "Completed jobs for the full jobs score", help: "Counted on a log scale; disputes lower it." },
  { key: "engagementForFullScore", label: "Views and contact clicks (90 days) for full engagement", help: "Counted on a log scale." },
  { key: "newBusinessDays", label: "New listing period (days)", help: "Listings younger than this get the new-listing reduction." },
  { key: "newBusinessPenalty", label: "New listing reduction", help: "Largest reduction on day one, fading to 0 at the end of the period.", step: 1, percent: true },
];

/** Ranking weights and rules, saved for every directory page (with who changed what). */
export default function RankingSettings({ config, onSaved }: { config: DirectoryConfig; onSaved: (config: DirectoryConfig) => void }) {
  const [draft, setDraft] = useState<Settings>(config.settings);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const total = config.factors.reduce((sum, factor) => sum + (draft.weights[factor.key] ?? 0), 0);

  const save = async (values: Settings) => {
    setBusy(true);
    setNotice(null);
    try {
      // Exclusions, placements and templates have their own tabs, so this form never sends them.
      const body: Partial<Settings> = { ...values };
      delete body.exclusions;
      delete body.placements;
      delete body.templates;
      const { data, message } = await adminApi.saveDirectoryConfig(body);
      setDraft(data.settings);
      onSaved(data);
      setNotice({ tone: "ok", text: message });
    } catch (caught) { setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Could not save." }); } finally { setBusy(false); }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Panel title="Ranking weights" description="How much each factor counts. Shares are worked out from the total, so they don't need to add up to 100.">
        <div className="space-y-4">
          {config.factors.map((factor) => {
            const weight = draft.weights[factor.key] ?? 0;
            return (
              <label key={factor.key} className="grid items-center gap-3 sm:grid-cols-[minmax(0,1fr)_200px_80px]">
                <span className="text-sm font-semibold text-gray-800">{factor.label}<span className="block text-xs font-normal text-gray-500">Default {factor.default}</span></span>
                <input type="range" min={0} max={100} value={weight} onChange={(e) => setDraft({ ...draft, weights: { ...draft.weights, [factor.key]: Number(e.target.value) } })} className="accent-[#0b1f3b]" aria-label={`${factor.label} weight`} />
                <span className="text-right text-sm tabular-nums"><b>{weight}</b> <span className="text-gray-400">· {total ? Math.round((weight / total) * 100) : 0}%</span></span>
              </label>
            );
          })}
        </div>
        <div className="mt-6 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2">
          {numberFields.map((field) => (
            <label key={field.key} className="block text-sm">
              <span className="font-semibold text-gray-800">{field.label}</span>
              <input type="number" min={0} step={field.step ?? 1} value={field.percent ? Math.round(Number(draft[field.key]) * 100) : Number(draft[field.key])}
                onChange={(e) => setDraft({ ...draft, [field.key]: field.percent ? Number(e.target.value) / 100 : Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
              <span className="mt-1 block text-xs text-gray-500">{field.help}{field.percent ? " (in %)" : ""}</span>
            </label>
          ))}
          <label className="block text-sm">
            <span className="font-semibold text-gray-800">Results for “best plumbers in …”</span>
            <select value={draft.defaultResultLimit} onChange={(e) => setDraft({ ...draft, defaultResultLimit: Number(e.target.value) as 10 | 50 })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm">
              <option value={10}>Top 10</option><option value={50}>Top 50</option>
            </select>
            <span className="mt-1 block text-xs text-gray-500">Searches that don&apos;t ask for a number open this list.</span>
          </label>
        </div>
        {notice && <p className={`mt-4 rounded-xl px-4 py-3 text-sm ${notice.tone === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{notice.text}</p>}
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" disabled={busy || total === 0} onClick={() => save(draft)} className="rounded-full bg-[#0b1f3b] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Saving…" : "Save settings"}</button>
          <button type="button" disabled={busy} onClick={() => { if (window.confirm("Put every weight and rule back to the defaults? Exclusions, placements and templates are kept.")) save({ ...config.defaults, exclusions: draft.exclusions, placements: draft.placements, templates: draft.templates }); }} className="rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50">Reset to defaults</button>
          {total === 0 && <span className="self-center text-xs text-red-600">At least one weight must be above 0.</span>}
        </div>
      </Panel>
      <Panel title="Change history" description="Every saved change, newest first.">
        {config.history.length ? (
          <ol className="space-y-3 text-sm">
            {config.history.map((entry, index) => (
              <li key={`${entry.at}-${index}`} className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-gray-500">{formatDate(entry.at)} · {entry.adminName ?? "Admin"}</p>
                <ul className="mt-1 list-disc pl-4 text-gray-700">{entry.changes.map((change) => <li key={change}>{change}</li>)}</ul>
              </li>
            ))}
          </ol>
        ) : <p className="text-sm text-gray-500">No changes yet — the defaults are in use.</p>}
      </Panel>
    </div>
  );
}
