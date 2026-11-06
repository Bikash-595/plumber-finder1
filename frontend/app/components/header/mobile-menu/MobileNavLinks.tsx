import Link from "next/link";
import { isActivePath, navLinks } from "../headerConfig";

/** The main page links in the phone menu. */
export default function MobileNavLinks({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return (
    <>
      <p className="px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Menu</p>
      <ul className="mt-1.5 space-y-0.5">
        {navLinks.map((link) => {
          const active = isActivePath(pathname, link.href);
          const Icon = link.icon;
          return (
            <li key={link.href}>
              <Link href={link.href} aria-current={active ? "page" : undefined} onClick={onNavigate} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-semibold transition ${active ? "bg-[#FFD60A]/15 text-[#0b1f3b]" : "text-slate-700 hover:bg-slate-50"}`}>
                <Icon className={`h-4 w-4 ${active ? "text-[#b39200]" : "text-slate-400"}`} aria-hidden />
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
