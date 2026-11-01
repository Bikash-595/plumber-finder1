import Link from "next/link";
import { FaCheck, FaChevronRight } from "react-icons/fa";
import type { StrengthItem } from "../companyApi";

/** The profile checklist, grouped (Brand, Trust, Services …), each item linking to its editor with the points it adds. */
export default function StrengthChecklist({ items }: { items: StrengthItem[] }) {
  const groups = [...new Set(items.map((item) => item.group))];
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {groups.map((group) => {
        const rows = items.filter((item) => item.group === group);
        const earned = rows.filter((item) => item.done).reduce((sum, item) => sum + item.weight, 0);
        const total = rows.reduce((sum, item) => sum + item.weight, 0);
        return (
          <section key={group}>
            <div className="mb-2 flex items-baseline justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">{group}</h3>
              <span className="text-xs tabular-nums text-gray-500">{earned}/{total} pts</span>
            </div>
            <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200">
              {rows.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="group flex items-center gap-3 px-3 py-3 transition hover:bg-gray-50">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${item.done ? "bg-emerald-100 text-emerald-600" : "border-2 border-gray-300"}`}>{item.done && <FaCheck className="h-3 w-3" />}</span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm font-semibold ${item.done ? "text-gray-500" : "text-gray-900"}`}>{item.label}{item.progress && !item.done ? <span className="ml-1.5 font-normal text-gray-400">({item.progress})</span> : null}</span>
                      {!item.done && <span className="block text-xs text-gray-500">{item.tip}</span>}
                    </span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${item.done ? "bg-emerald-50 text-emerald-700" : "bg-[#FFD60A]/25 text-[#5c4d00]"}`}>{item.done ? "Done" : `+${item.weight}%`}</span>
                    <FaChevronRight className="h-3 w-3 shrink-0 text-gray-300 group-hover:text-gray-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
