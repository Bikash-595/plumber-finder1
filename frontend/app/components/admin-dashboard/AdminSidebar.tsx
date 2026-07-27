"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type MouseEvent, useState } from "react";
import { FaChevronRight, FaCheckCircle, FaSignOutAlt, FaTools } from "react-icons/fa";
import { TbSquareToggle } from "react-icons/tb";
import { clearStoredUser } from "@/components/utils/auth";
import {
  adminNavSections,
  type AdminNavItem,
  type AdminSidebarState,
} from "./adminDashboardData";

interface AdminSidebarProps {
  sidebarState?: AdminSidebarState;
  onLinkClick?: () => void;
  onToggle?: () => void;
}

function isRouteActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === href;
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

export default function AdminSidebar({
  sidebarState = "open",
  onLinkClick,
  onToggle,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openSections, setOpenSections] = useState<string[]>([]);
  const activeSection =
    adminNavSections.find((section) =>
      section.items.some((item) => isRouteActive(pathname, item.href))
    )?.label || adminNavSections[0].label;

  const toggleSection = (sectionLabel: string) => {
    setOpenSections((current) =>
      current.includes(sectionLabel)
        ? current.filter((label) => label !== sectionLabel)
        : [...current, sectionLabel]
    );
  };

  const handleLogout = () => {
    clearStoredUser();
    router.push("/");
    onLinkClick?.();
  };

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isModifiedClick(event)) return;
    event.preventDefault();
    router.push(href);
    onLinkClick?.();
  };

  if (sidebarState === "closed") {
    return (
      <aside className="contents">
        <button
          type="button"
          onClick={onToggle}
          className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-[#0b1f3b] shadow-sm transition hover:text-[#0b1f3b]"
          aria-label="Open admin sidebar"
        >
          <TbSquareToggle className="h-6 w-6" />
        </button>
      </aside>
    );
  }

  if (sidebarState === "icons") {
    const iconItems = adminNavSections.flatMap((section) => section.items);

    return (
      <aside className="flex h-full w-20 flex-shrink-0 flex-col items-center overflow-hidden border-r border-slate-900/10 bg-[#0b1f3b] py-4 text-white shadow-xl">
        <button
          type="button"
          onClick={onToggle}
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#FFD60A] text-[#0b1f3b] transition hover:bg-white"
          aria-label="Open admin sidebar"
        >
          <TbSquareToggle className="h-5 w-5" />
        </button>
        <nav className="flex min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto px-2">
          {iconItems.map((item) => {
            const Icon = item.icon;
            const isActive = isRouteActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(event) => handleNavClick(event, item.href)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition ${
                  isActive
                    ? "bg-[#FFD60A] text-[#0b1f3b]"
                    : "bg-white/[0.06] text-white/70 hover:bg-white/[0.12] hover:text-white"
                }`}
                aria-label={item.label}
                title={item.label}
              >
                <Icon className="h-4 w-4" />
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-200 transition hover:bg-red-500/20 hover:text-white"
          aria-label="Logout"
          title="Logout"
        >
          <FaSignOutAlt className="h-4 w-4" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-72 flex-shrink-0 flex-col overflow-hidden border-r border-slate-900/10 bg-[#0b1f3b] text-white shadow-xl">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            onClick={(event) => handleNavClick(event, "/admin")}
            className="flex min-w-0 flex-1 items-center gap-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FFD60A] text-[#0b1f3b] shadow-sm">
              <FaTools className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-bold tracking-wide !text-white">
                Admin Controls
              </span>
              <span className="block truncate text-xs font-medium !text-white/60">
                Platform management
              </span>
            </span>
          </Link>
          {onToggle && (
            <button
              type="button"
              onClick={onToggle}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.08] text-white transition hover:border-[#FFD60A] hover:bg-[#FFD60A] hover:text-[#0b1f3b]"
              aria-label="Collapse admin sidebar"
            >
              <TbSquareToggle className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="mx-4 mt-4 rounded-lg border border-white/10 bg-white/[0.06] p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-300">
            <FaCheckCircle className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold !text-white">Control center</p>
            <p className="mt-1 text-xs leading-5 !text-white/60">
              Manage users, companies, freelancers, reports and security from one place.
            </p>
          </div>
        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-2">
          {adminNavSections.map((section) => {
            const isOpen = section.label === activeSection || openSections.includes(section.label);

            return (
              <div key={section.label}>
                <button
                  type="button"
                  onClick={() => toggleSection(section.label)}
                  className={`mb-1 flex min-h-9 w-full items-center justify-between rounded-lg px-3 text-left text-[11px] font-bold uppercase tracking-wider transition ${
                    isOpen
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span>{section.label}</span>
                  <FaChevronRight
                    className={`h-3 w-3 transition-transform ${
                      isOpen ? "rotate-90 text-[#FFD60A]" : "text-white/40"
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="space-y-1 pb-2">
                    {section.items.map((item: AdminNavItem) => {
                      const Icon = item.icon;
                      const isActive = isRouteActive(pathname, item.href);

                      return (
                        <div key={item.href}>
                          <Link
                            href={item.href}
                            onClick={(event) => handleNavClick(event, item.href)}
                            className={`group relative flex min-h-11 items-center justify-between rounded-lg px-3 py-2.5 pl-4 text-sm font-semibold transition-all duration-200 ${
                              isActive
                                ? "bg-[#FFD60A] text-[#0b1f3b] shadow-md shadow-black/10"
                                : "text-white/80 hover:bg-white/[0.08] hover:text-white"
                            }`}
                          >
                            {isActive && (
                              <span className="absolute bottom-2 left-1 top-2 w-1 rounded-full bg-[#0b1f3b]" />
                            )}
                            <div className="flex min-w-0 items-center gap-3">
                              <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md ${
                                isActive ? "bg-[#0b1f3b]/10" : "bg-white/5 group-hover:bg-white/[0.08]"
                              }`}>
                                <Icon className={`h-4 w-4 ${isActive ? "text-[#0b1f3b]" : "text-white/70 group-hover:text-white"}`} />
                              </span>
                              <span className="truncate">{item.label}</span>
                            </div>
                            {isActive && <FaChevronRight className="h-3.5 w-3.5 text-[#0b1f3b]" />}
                          </Link>

                          {item.stats && isActive && (
                            <div className="mt-2 grid grid-cols-1 gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-[11px] text-white/80">
                              {item.stats.map((stat) => (
                                <div key={stat.label} className="flex items-center justify-between gap-2">
                                  <span className="truncate text-white/80">{stat.label}</span>
                                  <span className="font-semibold text-white">{stat.value}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {item.subItems && isActive && (
                            <div className="mt-2 space-y-1 rounded-2xl border border-white/10 bg-white/5 p-2 text-sm text-white/80">
                              {item.subItems.map((subItem) => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  onClick={(event) => handleNavClick(event, subItem.href)}
                                  className="block rounded-xl px-3 py-2 transition hover:bg-white/[0.08] hover:text-white"
                                >
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/10 bg-black/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex min-h-11 w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-red-200 transition-all duration-200 hover:bg-red-500/15 hover:text-white"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500/10">
              <FaSignOutAlt className="h-4 w-4" />
            </span>
            Logout
          </div>
        </button>
      </div>
    </aside>
  );
}
