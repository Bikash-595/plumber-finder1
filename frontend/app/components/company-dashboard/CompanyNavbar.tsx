/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaBars,
  FaBell,
  FaChevronDown,
  FaCog,
  FaSearch,
  FaSignOutAlt,
  FaTools,
  FaUserCog,
} from "react-icons/fa";
import {
  clearStoredUser,
  getInitials,
  readStoredUser,
  type AppUser,
} from "@/components/utils/auth";

// const quickLinks = [
//   { label: "Add Company", href: "/company-dashboard/add-company" },
//   { label: "Leads", href: "/company-dashboard/leads" },
//   { label: "Jobs", href: "/company-dashboard/jobs" },
//   { label: "Companies", href: "/company-dashboard/company-list" },
//   { label: "Schedule", href: "/company-dashboard/schedule" },
// ];

interface CompanyNavbarProps {
  onToggleSidebar: () => void;
}

function getPageLabel(pathname: string) {
  if (pathname === "/company-dashboard") return "Company Dashboard";
  const lastSegment = pathname.split("/").filter(Boolean).at(-1);
  if (!lastSegment) return "Company Dashboard";

  return lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function CompanyNavbar({ onToggleSidebar }: CompanyNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const displayName = user?.name || "Pro Plumbing Co.";
  const displayEmail = user?.email || "owner@plumberfinder.com";
  const initials = getInitials(displayName) || "PP";
  const quickLinkActive = "bg-[#FFD60A] text-[#0b1f3b]";
  const quickLinkDefault = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  useEffect(() => {
    setUser(readStoredUser());
  }, []);

  const handleLogout = () => {
    clearStoredUser();
    setIsMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur text-gray-900">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#0b1f3b] shadow-sm transition hover:border-[#FFD60A] hover:bg-[#FFD60A]"
            aria-label="Toggle company dashboard menu"
          >
            <FaBars className="h-4 w-4" />
          </button>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Company Area
            </p>
            <h1 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
              {getPageLabel(pathname)}
            </h1>
          </div>
        </div>

        <div className="hidden min-w-[260px] max-w-lg flex-1 items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 md:flex">
          <FaSearch className="h-4 w-4 flex-shrink-0" />
          <input
            type="search"
            placeholder="Search leads, jobs, customers, invoices"
            className="ml-3 w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
        </div>
{/* 
        <nav className="hidden items-center gap-1 md:flex" aria-label="Company dashboard quick links">
          {quickLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? quickLinkActive : quickLinkDefault}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav> */}

        {/* <div className="md:hidden w-full border-t border-gray-100 bg-white/95 px-3 py-2">
          <div className="-mx-1 flex w-full gap-2 overflow-x-auto px-1">
            {quickLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex shrink-0 items-center rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? quickLinkActive : "text-gray-700 hover:bg-gray-100"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div> */}

        <div className="flex items-center gap-2">
          <Link
            href="/company-dashboard/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-[#FFD60A] hover:text-[#0b1f3b]"
            aria-label="Notifications"
          >
            <FaBell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 shadow-sm transition hover:border-[#FFD60A]"
              aria-expanded={isMenuOpen}
              aria-label="Open company menu"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#FFD60A] text-sm font-bold text-[#0b1f3b]">
                {initials}
              </span>
              <span className="hidden max-w-40 truncate text-sm font-semibold text-gray-800 sm:block">
                {displayName}
              </span>
              <FaChevronDown className="hidden h-3 w-3 text-gray-500 sm:block" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="truncate text-sm font-bold text-gray-900">{displayName}</p>
                  <p className="truncate text-xs text-gray-500">{displayEmail}</p>
                </div>
                <Link
                  href="/company-dashboard/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <FaTools className="h-4 w-4 text-gray-400" />
                  Company Profile
                </Link>
                <Link
                  href="/company-dashboard/team"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <FaUserCog className="h-4 w-4 text-gray-400" />
                  Team Access
                </Link>
                <Link
                  href="/company-dashboard/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <FaCog className="h-4 w-4 text-gray-400" />
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 border-t border-gray-100 px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <FaSignOutAlt className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
