import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import type { RankingPage } from "../directoryApi";
import { breadcrumbs } from "./rankingLinks";

/** Home › USA › State › City (also given to search engines as structured data, see JsonLd). */
export default function Breadcrumbs({ data, tone = "light" }: { data: RankingPage; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <nav aria-label="Breadcrumb" className="overflow-x-auto">
      <ol className={`flex items-center gap-1.5 whitespace-nowrap text-xs ${dark ? "text-white/60" : "text-slate-500"}`}>
        {breadcrumbs(data).map((crumb, index, all) => (
          <li key={crumb.href} className="flex items-center gap-1.5">
            {index > 0 && <FaChevronRight className={`h-2.5 w-2.5 ${dark ? "text-white/30" : "text-slate-300"}`} aria-hidden />}
            {index === all.length - 1
              ? <span aria-current="page" className={`font-semibold ${dark ? "text-white" : "text-slate-700"}`}>{crumb.label}</span>
              : <Link href={crumb.href} className={`hover:underline ${dark ? "hover:text-white" : "hover:text-[#0b1f3b]"}`}>{crumb.label}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
