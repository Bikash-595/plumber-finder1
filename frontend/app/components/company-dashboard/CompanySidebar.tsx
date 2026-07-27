
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type MouseEvent, useState } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaSignOutAlt,
  FaTools,
} from "react-icons/fa";
import { TbSquareToggle } from "react-icons/tb";
import { clearStoredUser } from "@/components/utils/auth";

import {
  companyNavSections,
  type CompanySidebarState,
} from "./companyDashboardData";

interface CompanySidebarProps {
  sidebarState?: CompanySidebarState;
  onLinkClick?: () => void;
  onToggle?: () => void;
}

function isRouteActive(pathname: string, href: string) {
  if (href === "/company-dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  );
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C9AFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1F33]";

export default function CompanySidebar({
  sidebarState = "open",
  onLinkClick,
  onToggle,
}: CompanySidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const activeSection =
    companyNavSections.find((section) =>
      section.items.some((item) => isRouteActive(pathname, item.href)),
    )?.label ?? companyNavSections[0]?.label;

  const [openSections, setOpenSections] = useState<string[]>([]);

  const isSectionOpen = (label: string) =>
    label === activeSection || openSections.includes(label);

  const toggleSection = (label: string) => {
    if (label === activeSection) return;

    setOpenSections((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  };

  const handleLogout = () => {
    clearStoredUser();
    router.push("/");
    onLinkClick?.();
  };

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (isModifiedClick(event)) return;

    event.preventDefault();
    router.push(href);
    onLinkClick?.();
  };

  if (sidebarState === "closed") {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="fixed left-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-[#102A43] shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C9AFF]"
        aria-label="Open company navigation"
      >
        <TbSquareToggle className="h-5 w-5" aria-hidden="true" />
      </button>
    );
  }

  if (sidebarState === "icons") {
    const iconItems = companyNavSections.flatMap(
      (section) => section.items,
    );

    return (
      <aside className="flex h-full w-[72px] shrink-0 flex-col items-center border-r border-white/10 bg-[#0B1F33] px-3 py-4 text-white">
        <button
          type="button"   
          onClick={onToggle}
          className={`mb-5 grid h-11 w-11 place-items-center rounded-xl bg-white/[0.08] text-white transition hover:bg-white/[0.14] ${focusRing}`}
          aria-label="Expand company navigation"
        >
          <TbSquareToggle className="h-5 w-5" aria-hidden="true" />
        </button>

        <nav
          className="flex min-h-0 flex-1 flex-col items-center gap-1.5 overflow-y-auto"
          aria-label="Company navigation"
        >
          {iconItems.map((item) => {
            const Icon = item.icon;
            const active = isRouteActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(event) =>
                  handleNavClick(event, item.href)
                }
                className={`relative grid h-11 w-11 place-items-center rounded-xl transition ${focusRing} ${
                  active
                    ? "bg-[#244969] text-white"
                    : "text-white/65 hover:bg-white/[0.08] hover:text-white"
                }`}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                title={item.label}
              >
                {active && (
                  <span className="absolute -left-3 h-6 w-1 rounded-r-full bg-[#F4C542]" />
                )}

                <Icon
                  className="h-[18px] w-[18px]"
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className={`mt-4 grid h-11 w-11 place-items-center rounded-xl text-white/55 transition hover:bg-red-400/10 hover:text-red-200 ${focusRing}`}
          aria-label="Log out"
          title="Log out"
        >
          <FaSignOutAlt
            className="h-[18px] w-[18px]"
            aria-hidden="true"
          />
        </button>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[#0B1F33] text-white shadow-[8px_0_28px_rgba(7,26,45,0.08)]">
      <header className="flex h-[76px] items-center gap-3 border-b border-white/[0.08] px-5">
        <Link
          href="/company-dashboard"
          onClick={(event) =>
            handleNavClick(event, "/company-dashboard")
          }
          className={`flex min-w-0 flex-1 items-center gap-3 rounded-lg ${focusRing}`}
          aria-label="Plumber Finder dashboard"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F4C542] text-[#0B1F33] shadow-sm">
            <FaTools
              className="h-[18px] w-[18px]"
              aria-hidden="true"
            />
          </span>

          <span className="min-w-0">
            <span className="block truncate text-[15px] font-bold tracking-[-0.01em] text-white">
              Plumber Finder
            </span>

            <span className="mt-0.5 block truncate text-[11px] font-medium tracking-wide text-white/50">
              BUSINESS PORTAL
            </span>
          </span>
        </Link>

        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white/55 transition hover:bg-white/[0.08] hover:text-white ${focusRing}`}
            aria-label="Collapse company navigation"
          >
            <TbSquareToggle
              className="h-5 w-5"
              aria-hidden="true"
            />
          </button>
        )}
      </header>

      <div className="px-4 pb-2 pt-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.055] p-3.5">
          <div className="flex items-center gap-3">
         

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                Manage your business 
              </p>

              <p className="mt-0.5 truncate text-xs text-white/50">
                Get leads, sales, and profits.
              </p>
            </div>

         
          </div>
        </div>
      </div>

      <nav
        className="min-h-0 flex-1 overflow-y-auto px-3 py-3 [scrollbar-color:rgba(255,255,255,.16)_transparent] [scrollbar-width:thin]"
        aria-label="Company navigation"
      >
        <div className="space-y-5">
          {companyNavSections.map((section) => {
            const open = isSectionOpen(section.label);

            const regionId = `company-nav-${section.label
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")}`;

            return (
              <section
                key={section.label}
                aria-labelledby={`${regionId}-label`}
              >
                <button
                  id={`${regionId}-label`}
                  type="button"
                  onClick={() => toggleSection(section.label)}
                  className={`flex h-8 w-full items-center justify-between rounded-lg px-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45 transition hover:bg-white/[0.05] hover:text-white/70 ${focusRing}`}
                  aria-expanded={open}
                  aria-controls={regionId}
                >
                  <span>{section.label}</span>

                  <FaChevronDown
                    className={`h-2.5 w-2.5 transition-transform duration-200 ${
                      open ? "rotate-0" : "-rotate-90"
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {open && (
                  <div id={regionId} className="mt-1 space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isRouteActive(
                        pathname,
                        item.href,
                      );

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={(event) =>
                            handleNavClick(event, item.href)
                          }
                          className={`group relative flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition duration-150 ${focusRing} ${
                            active
                              ? "bg-[#244969] text-white shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
                              : "text-white/65 hover:bg-white/[0.07] hover:text-white"
                          }`}
                          aria-current={
                            active ? "page" : undefined
                          }
                        >
                          {active && (
                            <span className="absolute -left-0.5 h-6 w-1 rounded-full bg-[#F4C542]" />
                          )}

                          <span
                            className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition ${
                              active
                                ? "bg-white/[0.08] text-white"
                                : "text-white/55 group-hover:text-white"
                            }`}
                          >
                            <Icon
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </span>

                          <span className="min-w-0 flex-1 truncate">
                            {item.label}
                          </span>

                          {active && (
                            <FaChevronRight
                              className="h-3 w-3 shrink-0 text-white/55"
                              aria-hidden="true"
                            />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </nav>

      <footer className="border-t border-white/[0.08] bg-[#071A2D] p-3">
        <button
          type="button"
          onClick={handleLogout}
          className={`group flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/55 transition hover:bg-red-400/10 hover:text-red-200 ${focusRing}`}
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.04] transition group-hover:bg-red-400/10">
            <FaSignOutAlt
              className="h-4 w-4"
              aria-hidden="true"
            />
          </span>

          <span>Log out</span>
        </button>
      </footer>
    </aside>
  );
}