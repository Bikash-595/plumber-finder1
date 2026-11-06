"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { FaArrowRight, FaBriefcase, FaCalendarCheck } from "react-icons/fa6";
import { ServicesDropdown } from "@/components/dropdowns/ServicesDropdown";
import { StatesDropdown } from "@/components/dropdowns/StatesDropdown";
import { isActivePath, navLinks } from "./headerConfig";
import { useDismiss } from "./useDismiss";

/** The desktop nav row: page links, the Services and States mega menus, Book a Plumber and Get Pro Leads. */
export default function DesktopNav({ pathname }: { pathname: string }) {
  const [menu, setMenu] = useState<"services" | "states" | null>(null);
  // `relative` anchors the mega menus to the full nav width.
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setMenu(null), []);
  useDismiss(menu !== null, close, ref);
  return (
    <div ref={ref} className="relative hidden h-12 items-center border-t border-slate-100 lg:flex">
      <nav aria-label="Main" className="flex h-full items-center gap-6 xl:gap-8">
        {navLinks.map((link) => {
          const active = isActivePath(pathname, link.href);
          return (
            <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`relative flex h-full items-center text-sm font-semibold transition-colors hover:text-[#0b1f3b] ${active ? "text-[#0b1f3b]" : "text-slate-600"}`}>
              {link.label}
              {active && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#FFD60A]" />}
            </Link>
          );
        })}
        <ServicesDropdown open={menu === "services"} active={isActivePath(pathname, "/services")} onOpenChange={(open) => setMenu(open ? "services" : null)} />
        <StatesDropdown open={menu === "states"} active={isActivePath(pathname, "/states")} onOpenChange={(open) => setMenu(open ? "states" : null)} />
      </nav>
      <Link href="/book-plumber" className="ml-auto mr-5 inline-flex h-9 items-center gap-2 rounded-full bg-[#FFD60A] px-4 text-sm font-bold text-[#0b1f3b] shadow-sm shadow-[#FFD60A]/40 transition hover:-translate-y-px hover:brightness-95 hover:shadow-md">
        <FaCalendarCheck className="h-3.5 w-3.5" aria-hidden />
        Book a Plumber
      </Link>
      <Link href="/add-business" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-50">
          <FaBriefcase className="h-3 w-3" aria-hidden />
        </span>
        Get Pro Leads
        <FaArrowRight className="h-3 w-3" aria-hidden />
      </Link>
    </div>
  );
}
