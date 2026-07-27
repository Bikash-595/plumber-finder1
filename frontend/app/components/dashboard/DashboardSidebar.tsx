

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type MouseEvent, useState } from "react";
import {
  FaHeart,
  FaBell,
  FaSignOutAlt,
  FaBuilding,
  FaQuestionCircle,
  FaShieldAlt,
  FaChevronRight,
  FaFileInvoice,
  FaHistory,
  FaUser,
  FaWallet,
  FaCog,
  FaChartBar,
  FaHome,
  FaSearch,
  FaTools,
  FaCheckCircle,
} from "react-icons/fa";
import { TbSquareToggle } from "react-icons/tb";
import { clearStoredUser } from "../utils/auth";

export type DashboardSidebarState = "open" | "icons" | "closed";

const navSections = [
  {
    label: "Dashboard",
    items: [
      { label: "Home", href: "/dashboard", icon: FaHome },
      { label: "Overview", href: "/dashboard/overview", icon: FaChartBar },
    ],
  },
  {
    label: "Services",
    items: [
      { label: "Find Plumbers", href: "/find", icon: FaSearch },
      { label: "Compare Companies", href: "/dashboard/compare", icon: FaBuilding },
      { label: "Saved Deals", href: "/dashboard/saved", icon: FaHeart },
      { label: "Booking History", href: "/dashboard/bookings", icon: FaHistory },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", href: "/dashboard/profile", icon: FaUser },
      { label: "Settings", href: "/dashboard/settings", icon: FaCog },
      { label: "Wallet & Payments", href: "/dashboard/wallet", icon: FaWallet },
      { label: "Invoices", href: "/dashboard/invoices", icon: FaFileInvoice },
    ],
  },
  {
    label: "Support",
    items: [
      { label: "Notifications", href: "/dashboard/notifications", icon: FaBell },
      { label: "Help & Support", href: "/dashboard/support", icon: FaQuestionCircle },
      { label: "Security", href: "/dashboard/security", icon: FaShieldAlt },
    ],
  },
];

interface DashboardSidebarProps {
  sidebarState?: DashboardSidebarState;
  onLinkClick?: () => void;
  onToggle?: () => void;
}

function isRouteActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export default function DashboardSidebar({
  sidebarState = "open",
  onLinkClick,
  onToggle,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openSections, setOpenSections] = useState<string[]>([]);
  const activeSection =
    navSections.find((section) =>
      section.items.some((item) => isRouteActive(pathname, item.href))
    )?.label || navSections[0].label;

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
    if (isModifiedClick(event)) {
      return;
    }

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
          className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-lg bg-transparent text-black transition hover:text-[#0b1f3b]"
          aria-label="Open sidebar"
        >
          <TbSquareToggle className="h-6 w-6" />
        </button>
      </aside>
    );
  }

  if (sidebarState === "icons") {
    const iconItems = navSections.flatMap((section) => section.items);

    return (
      <aside className="flex h-full w-14 flex-shrink-0 flex-col items-center overflow-hidden border-r border-slate-900/10 bg-[#0b1f3b] py-4 text-white shadow-xl">
        <button
          type="button"
          onClick={onToggle}
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#FFD60A] text-[#0b1f3b] transition hover:bg-white"
          aria-label="Open sidebar"
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
    <aside className="flex h-full w-64 flex-shrink-0 flex-col overflow-hidden border-r border-slate-900/10 bg-[#0b1f3b] text-white shadow-xl">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            onClick={(event) => handleNavClick(event, "/dashboard")}
            className="flex min-w-0 flex-1 items-center gap-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FFD60A] text-[#0b1f3b] shadow-sm">
              <FaTools className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-bold tracking-wide !text-white">
                Plumber Finder
              </span>
              <span className="block truncate text-xs font-medium !text-white/60">
                Customer Dashboard
              </span>
            </span>
          </Link>
          {onToggle && (
            <button
              type="button"
              onClick={onToggle}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.08] text-white transition hover:border-[#FFD60A] hover:bg-[#FFD60A] hover:text-[#0b1f3b]"
              aria-label="Close sidebar"
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
            <p className="text-sm font-semibold !text-white">Ready to book</p>
            <p className="mt-1 text-xs leading-5 !text-white/60">
              Compare verified plumbers, saved deals, invoices, and support in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-2">
          {navSections.map((section) => {
            const isOpen = section.label === activeSection || openSections.includes(section.label);

            return (
              <div key={section.label}>
                <button
                  type="button"
                  onClick={() => toggleSection(section.label)}
                  className={`mb-1 flex min-h-9 w-full items-center justify-between rounded-lg px-3 text-left text-[11px] font-bold uppercase tracking-wider transition ${
                    isOpen
                      ? "bg-white/10 !text-white"
                      : "!text-white/45 hover:bg-white/[0.06] hover:!text-white/75"
                  }`}
                >
                  <span>{section.label}</span>
                  <FaChevronRight
                    className={`h-3 w-3 transition-transform ${
                      isOpen ? "rotate-90 !text-[#FFD60A]" : "!text-white/40"
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="space-y-1 pb-2">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = isRouteActive(pathname, item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={(event) => handleNavClick(event, item.href)}
                          className={`group relative flex min-h-11 items-center justify-between rounded-lg px-3 py-2.5 pl-4 text-sm font-semibold transition-all duration-200 ${
                            isActive
                              ? "bg-[#FFD60A] !text-[#0b1f3b] shadow-md shadow-black/10"
                              : "!text-white/75 hover:bg-white/[0.08] hover:!text-white"
                          }`}
                        >
                          {isActive && (
                            <span className="absolute left-1 top-2 bottom-2 w-1 rounded-full bg-[#0b1f3b]" />
                          )}
                          <div className="flex min-w-0 items-center gap-3">
                            <span
                              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md transition ${
                                isActive ? "bg-[#0b1f3b]/10" : "bg-white/5 group-hover:bg-white/[0.08]"
                              }`}
                            >
                              <Icon
                                className={`h-4 w-4 ${
                                  isActive ? "!text-[#0b1f3b]" : "!text-white/70 group-hover:!text-white"
                                }`}
                              />
                            </span>
                            <span
                              className={`truncate ${
                                isActive ? "!text-[#0b1f3b]" : "!text-white/80 group-hover:!text-white"
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>
                          {isActive && (
                            <FaChevronRight className="h-3.5 w-3.5 flex-shrink-0 !text-[#0b1f3b]" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="border-t border-white/10 bg-black/10 p-3">
        <button
          onClick={handleLogout}
          className="flex min-h-11 w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold !text-red-200 transition-all duration-200 hover:bg-red-500/15 hover:!text-white"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500/10">
              <FaSignOutAlt className="h-4 w-4" />
            </span>
            <span>Logout</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
