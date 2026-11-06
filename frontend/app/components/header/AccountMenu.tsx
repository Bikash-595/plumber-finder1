"use client";

import Link from "next/link";
import { useCallback, useRef, useState, type ReactNode } from "react";
import { FaChevronDown, FaCircleUser, FaRightFromBracket } from "react-icons/fa6";
import type { AppUser } from "@/components/utils/auth";
import type { AccountLink } from "@/components/utils/accountLinks";
import { menuIcons } from "./headerConfig";
import { useDismiss } from "./useDismiss";

/** The signed-in account's dropdown (its dashboard and shortcuts, Logout), or "Log in". Tablet and up. */
export default function AccountMenu({ user, avatar, links, onLogout }: { user: AppUser | null; avatar: ReactNode; links: AccountLink[]; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, ref);

  if (!user) {
    return (
      <Link href="/login" aria-label="Log in" className="hidden h-10 items-center gap-2 rounded-full px-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-[#0b1f3b] md:inline-flex lg:px-3">
        <FaCircleUser className="h-5 w-5 text-slate-400" aria-hidden />
        <span className="hidden lg:inline">Log in</span>
      </Link>
    );
  }
  return (
    <div className="relative hidden md:block" ref={ref}>
      <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-full p-1 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 xl:pr-3" aria-label="Profile menu" aria-expanded={open}>
        {avatar}
        <span className="hidden max-w-[7rem] truncate xl:inline">{user.name?.split(" ")[0] || "Account"}</span>
        <FaChevronDown className="hidden h-2.5 w-2.5 text-slate-400 xl:block" aria-hidden />
      </button>
      {open && (
        // z-50: above the nav row below (Book a Plumber, mega menus), which comes later in the page.
        <div className="animate-nav-menu absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_48px_-12px_rgba(11,31,59,0.25)]">
          <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
            {avatar}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          <div className="p-2">
            {/* Each account type gets its own dashboard and shortcuts. */}
            {links.map(({ href, label, key }) => {
              const Icon = menuIcons[key];
              const isDashboard = key === "dashboard";
              return (
                <Link key={href} href={href} onClick={close} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${isDashboard ? "bg-[#FFD60A]/15 font-semibold text-[#0b1f3b] hover:bg-[#FFD60A]/25" : "text-slate-700 hover:bg-slate-100"}`}>
                  <Icon className={`h-4 w-4 ${isDashboard ? "text-[#0b1f3b]" : "text-slate-400"}`} aria-hidden />
                  {label}
                </Link>
              );
            })}
            <hr className="my-1 border-slate-100" />
            <button type="button" onClick={() => { close(); onLogout(); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50">
              <FaRightFromBracket className="h-4 w-4" aria-hidden />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
