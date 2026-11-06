"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { FaArrowRight, FaBolt, FaXmark } from "react-icons/fa6";
import { serviceDefinitions } from "@/components/services/serviceData";
import type { AppUser } from "@/components/utils/auth";
import type { AccountLink, dashboardLink } from "@/components/utils/accountLinks";
import Logo from "../Logo";
import { usStates, type HeaderCounts } from "../headerConfig";
import type { HeaderSearch } from "../useHeaderSearch";
import { useDismiss } from "../useDismiss";
import MenuAccordion from "./MenuAccordion";
import MobileAccountActions from "./MobileAccountActions";
import MobileNavLinks from "./MobileNavLinks";
import MobileQuickActions from "./MobileQuickActions";
import MobileSearch from "./MobileSearch";
import MobileServicesList from "./MobileServicesList";
import MobileStatesList from "./MobileStatesList";

/** The phone / tablet slide-in menu (rendered outside <header> so it is never clipped by it). */
export default function MobileMenu({ onClose, focusSearch, search, pathname, counts, user, avatar, dashboard, links, businessCta, onLogout }: {
  onClose: () => void; focusSearch: boolean; search: HeaderSearch; pathname: string; counts: HeaderCounts;
  user: AppUser | null; avatar: ReactNode; dashboard: ReturnType<typeof dashboardLink>; links: AccountLink[];
  businessCta: { href: string; label: string }; onLogout: () => void;
}) {
  const [section, setSection] = useState<"services" | "states" | null>(null);
  const toggle = (name: "services" | "states") => setSection((current) => (current === name ? null : name));
  useDismiss(true, onClose);

  // Lock page scroll behind the menu, and close it if the screen grows to desktop size.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => { if (desktop.matches) onClose(); };
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", onResize);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
      <button type="button" tabIndex={-1} aria-label="Close menu" className="animate-nav-backdrop absolute inset-0 h-full w-full bg-[#0b1f3b]/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="animate-nav-drawer absolute inset-y-0 right-0 flex w-full max-w-[22rem] flex-col bg-white shadow-2xl sm:max-w-md">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4 sm:px-6">
          <Logo />
          <button type="button" onClick={onClose} aria-label="Close menu" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200">
            <FaXmark className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-4 sm:px-6">
          <MobileSearch search={search} autoFocus={focusSearch} />
          <Link href="/services/emergency-plumbing" onClick={onClose} className="mt-4 flex items-center gap-3 rounded-2xl bg-[#0b1f3b] p-4 text-white md:mt-0">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFD60A] text-[#0b1f3b]"><FaBolt className="h-4 w-4" aria-hidden /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">Plumbing emergency?</span>
              <span className="block text-xs text-white/70">Find plumbers available 24/7</span>
            </span>
            <FaArrowRight className="h-3.5 w-3.5 text-[#FFD60A]" aria-hidden />
          </Link>

          <nav aria-label="Mobile" className="mt-5">
            <MobileNavLinks pathname={pathname} onNavigate={onClose} />
            <p className="mt-5 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Browse</p>
            <MenuAccordion title="Services" count={serviceDefinitions.length} open={section === "services"} onToggle={() => toggle("services")} className="mt-1.5">
              <MobileServicesList pathname={pathname} onNavigate={onClose} />
            </MenuAccordion>
            <MenuAccordion title="States" count={usStates.length} open={section === "states"} onToggle={() => toggle("states")} className="mt-2">
              <MobileStatesList onNavigate={onClose} />
            </MenuAccordion>
            <MobileQuickActions counts={counts} onNavigate={onClose} />
          </nav>
        </div>

        <MobileAccountActions user={user} avatar={avatar} dashboard={dashboard} links={links} businessCta={businessCta} onNavigate={onClose} onLogout={onLogout} />
      </div>
    </div>
  );
}
