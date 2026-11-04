import { FaCheckCircle, FaRegCircle } from "react-icons/fa";

export type SeoDraft = { metaTitle: string; metaDescription: string; keywords: string[]; sidebarHeading: string; sidebarContent: string };

/** Simple, honest checks for a stronger listing in search results, with a score. */
export function seoChecks(draft: SeoDraft, place?: string) {
  const t = draft.metaTitle.trim().length, d = draft.metaDescription.trim().length;
  return [
    { label: "Title between 30 and 60 characters", done: t >= 30 && t <= 60 },
    { label: "Description between 70 and 160 characters", done: d >= 70 && d <= 160 },
    { label: "At least 5 keywords", done: draft.keywords.length >= 5 },
    { label: "Sidebar text of 150+ characters", done: draft.sidebarContent.trim().length >= 150 },
    // Only when the city is known (otherwise there's nothing to check against).
    ...(place ? [{ label: `Mentions ${place} in the title or description`, done: `${draft.metaTitle} ${draft.metaDescription}`.toLowerCase().includes(place.toLowerCase()) }] : []),
  ];
}

export default function SeoChecklist({ draft, place }: { draft: SeoDraft; place?: string }) {
  const checks = seoChecks(draft, place);
  const score = Math.round((checks.filter((c) => c.done).length / checks.length) * 100);
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">SEO checklist</p>
        <span className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${score >= 80 ? "bg-emerald-50 text-emerald-700" : score >= 40 ? "bg-amber-50 text-amber-800" : "bg-gray-100 text-gray-600"}`}>{score}%</span>
      </div>
      <ul className="mt-2 space-y-1.5">
        {checks.map((c) => <li key={c.label} className={`flex items-start gap-2 text-sm ${c.done ? "text-gray-800" : "text-gray-500"}`}>{c.done ? <FaCheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden /> : <FaRegCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-300" aria-hidden />}{c.label}</li>)}
      </ul>
    </div>
  );
}
