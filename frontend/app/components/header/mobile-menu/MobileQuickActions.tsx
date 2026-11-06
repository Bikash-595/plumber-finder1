import Link from "next/link";
import { headerActions, type HeaderCounts } from "../headerConfig";

/** Saved / alerts / cart tiles in the phone menu. */
export default function MobileQuickActions({ counts, onNavigate }: { counts: HeaderCounts; onNavigate: () => void }) {
  return (
    <div className="mt-5 grid grid-cols-3 gap-2">
      {headerActions.map((action) => {
        const Icon = action.icon;
        const count = counts[action.countKey];
        return (
          <Link key={action.label} href={action.href} onClick={onNavigate} className="relative flex flex-col items-center gap-1.5 rounded-2xl border border-slate-200 px-2 py-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            <Icon className="h-4 w-4 text-[#0b1f3b]" aria-hidden />
            {action.label}
            {count > 0 && <span className="absolute right-2 top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">{count}</span>}
          </Link>
        );
      })}
    </div>
  );
}
