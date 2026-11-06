import Link from "next/link";
import { headerActions, iconButton, isActivePath, type HeaderCounts } from "./headerConfig";

/** Saved / alerts / cart icons with their counts (laptop and up). */
export default function QuickActions({ counts, pathname }: { counts: HeaderCounts; pathname: string }) {
  return (
    <div className="hidden items-center lg:flex">
      {headerActions.map((action) => {
        const Icon = action.icon;
        const count = counts[action.countKey];
        const active = isActivePath(pathname, action.href);
        return (
          <Link key={action.label} href={action.href} aria-label={`${action.label}${count ? ` (${count})` : ""}`} title={action.label} className={`${iconButton} ${active ? "bg-[#FFD60A]/15 text-[#0b1f3b]" : ""}`}>
            <Icon className="h-[17px] w-[17px]" aria-hidden />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">{count}</span>
            )}
          </Link>
        );
      })}
      <span aria-hidden className="mx-2 h-6 w-px bg-slate-200" />
    </div>
  );
}
