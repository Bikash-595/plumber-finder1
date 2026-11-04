import { FaSearch } from "react-icons/fa";
import type { SeoDraft } from "./SeoChecklist";

/** The card customers see under the booking form on your profile. */
export default function SidebarPreview({ draft, name }: { draft: SeoDraft; name: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Profile sidebar preview</p>
      <p className="mt-2 text-base font-extrabold text-[#0b1f3b]">{draft.sidebarHeading || `About ${name}`}</p>
      <p className="mt-1 line-clamp-4 whitespace-pre-line text-sm text-gray-600">{draft.sidebarContent || "A few sentences about your business: what you do best, where you work and why customers choose you."}</p>
      {draft.keywords.length > 0 && (
        <div className="mt-3">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Popular searches</p>
          <div className="mt-1.5 flex flex-wrap gap-1">{draft.keywords.slice(0, 10).map((k) => <span key={k} className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-semibold text-gray-700"><FaSearch className="h-2 w-2 text-gray-400" aria-hidden />{k}</span>)}</div>
        </div>
      )}
    </div>
  );
}
