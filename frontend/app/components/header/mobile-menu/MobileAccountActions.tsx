import Link from "next/link";
import type { ReactNode } from "react";
import { FaBriefcase, FaBuilding, FaCalendarCheck, FaGauge, FaRightFromBracket } from "react-icons/fa6";
import type { AppUser } from "@/components/utils/auth";
import type { AccountLink, dashboardLink } from "@/components/utils/accountLinks";

/** The phone menu's footer: Book a Plumber, the business entrance, and the account (or Log in / Sign up). */
export default function MobileAccountActions({ user, avatar, dashboard, links, businessCta, onNavigate, onLogout }: {
  user: AppUser | null; avatar: ReactNode; dashboard: ReturnType<typeof dashboardLink>; links: AccountLink[];
  businessCta: { href: string; label: string }; onNavigate: () => void; onLogout: () => void;
}) {
  return (
    <div className="shrink-0 space-y-2.5 border-t border-slate-100 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
      <Link href="/book-plumber" onClick={onNavigate} className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#FFD60A] text-sm font-bold text-[#0b1f3b] shadow-sm">
        <FaCalendarCheck className="h-4 w-4" aria-hidden />
        Book a Plumber
      </Link>
      <Link href={businessCta.href} onClick={onNavigate} className="flex h-11 items-center justify-center gap-2 rounded-full border border-[#0b1f3b] text-sm font-bold text-[#0b1f3b] hover:bg-slate-50">
        <FaBuilding className="h-4 w-4" aria-hidden />
        {businessCta.label}
      </Link>
      {user && dashboard && (
        <Link href={dashboard.href} onClick={onNavigate} className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#0b1f3b] text-sm font-semibold text-white hover:bg-[#17345a]">
          <FaGauge className="h-4 w-4" aria-hidden />
          {dashboard.label}
        </Link>
      )}
      {user ? (
        <div className="flex items-center gap-2">
          <Link href={links.find((link) => link.key === "profile" || link.key === "business")?.href ?? "/account"} onClick={onNavigate} className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-slate-200 py-1.5 pl-1.5 pr-4 hover:bg-slate-50">
            {avatar}
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-slate-900">{user.name}</span>
              <span className="block truncate text-xs text-slate-500">View profile</span>
            </span>
          </Link>
          <button type="button" onClick={onLogout} aria-label="Logout" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-200 text-red-600 hover:bg-red-50">
            <FaRightFromBracket className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <Link href="/login" onClick={onNavigate} className="flex h-11 items-center justify-center rounded-full border border-slate-300 text-sm font-semibold text-slate-800 hover:bg-slate-50">Log in</Link>
          <Link href="/signup" onClick={onNavigate} className="flex h-11 items-center justify-center rounded-full bg-[#0b1f3b] text-sm font-semibold text-white hover:bg-[#17345a]">Sign up</Link>
        </div>
      )}
      <Link href="/add-business" onClick={onNavigate} className="flex items-center justify-center gap-2 py-1 text-sm font-semibold text-emerald-700">
        <FaBriefcase className="h-3.5 w-3.5" aria-hidden />
        Are you a plumber? Get Pro Leads
      </Link>
    </div>
  );
}
