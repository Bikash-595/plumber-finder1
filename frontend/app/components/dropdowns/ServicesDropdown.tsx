"use client";

import Link from "next/link";
import { FaArrowRight, FaBolt, FaChevronDown } from "react-icons/fa6";
import { serviceDefinitions } from "@/components/services/serviceData";
import { ServiceIcon } from "@/components/services/serviceIcons";

type NavMenuProps = {
  open: boolean;
  active?: boolean;
  onOpenChange: (open: boolean) => void;
};

// Mega menu listing every plumbing service type. The panel is positioned against the
// nearest `relative` ancestor (the desktop nav row) so it never overflows the viewport.
export function ServicesDropdown({ open, active = false, onOpenChange }: NavMenuProps) {
  const close = () => onOpenChange(false);

  return (
    <div
      onPointerEnter={(event) => { if (event.pointerType === "mouse") onOpenChange(true); }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") onOpenChange(false); }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => onOpenChange(!open)}
        className={`relative flex h-12 items-center gap-1.5 text-sm font-semibold transition-colors hover:text-[#0b1f3b] ${
          active || open ? "text-[#0b1f3b]" : "text-slate-600"
        }`}
      >
        Services
        <FaChevronDown className={`h-2.5 w-2.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden />
        {(active || open) && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#FFD60A]" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-50 pt-px">
          <div className="animate-nav-menu grid overflow-hidden rounded-b-2xl border border-t-0 border-slate-200 bg-white shadow-[0_24px_48px_-12px_rgba(11,31,59,0.25)] lg:grid-cols-[minmax(0,1fr)_16rem]">
            <div className="p-5 xl:p-6">
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Plumbing services</p>
                <Link href="/services" onClick={close} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0b1f3b] hover:underline">
                  View all <FaArrowRight className="h-3 w-3" aria-hidden />
                </Link>
              </div>
              <ul className="grid grid-cols-2 gap-x-2 gap-y-1 xl:grid-cols-3">
                {serviceDefinitions.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      onClick={close}
                      className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-50"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-[#0b1f3b] transition-colors group-hover:border-[#FFD60A] group-hover:bg-[#FFD60A]">
                        <ServiceIcon slug={service.slug} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-slate-900">{service.name}</span>
                        <span className="mt-0.5 block truncate text-xs text-slate-500">{service.tagline}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="flex flex-col justify-between gap-6 bg-[#0b1f3b] p-6 text-white">
              <div>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFD60A] text-[#0b1f3b]">
                  <FaBolt className="h-4 w-4" aria-hidden />
                </span>
                <p className="mt-4 text-base font-bold">Plumbing emergency?</p>
                <p className="mt-1.5 text-sm leading-6 text-white/70">
                  Burst pipe, flooding, or no water? Reach plumbers who respond 24/7.
                </p>
              </div>
              <div className="space-y-3">
                <Link
                  href="/services/emergency-plumbing"
                  onClick={close}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#FFD60A] px-4 py-2.5 text-sm font-bold text-[#0b1f3b] transition hover:brightness-95"
                >
                  Find 24/7 help <FaArrowRight className="h-3 w-3" aria-hidden />
                </Link>
                <Link href="/find" onClick={close} className="block text-center text-sm font-medium text-white/80 hover:text-white">
                  Not sure? Compare all plumbers
                </Link>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
