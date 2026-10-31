/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaBell,
  FaBars,
  FaChevronDown,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaWallet,
} from "react-icons/fa";
import {
  clearStoredUser,
  getInitials,
  readStoredUser,
  type AppUser,
} from "../utils/auth";
import { userApi } from "../utils/userApi";
import DashboardSearch from "./DashboardSearch";
import { useUserData } from "./useUserData";

const quickLinks = [
  { label: "Find", href: "/find" },
  { label: "Bookings", href: "/dashboard/bookings" },
  { label: "Saved", href: "/dashboard/saved" },
  { label: "Invoices", href: "/dashboard/invoices" },
];

interface UserNavbarProps {
  onToggleSidebar: () => void;
}

function getPageLabel(pathname: string) {
  if (pathname === "/dashboard") return "Dashboard";

  const lastSegment = pathname.split("/").filter(Boolean).at(-1);
  if (!lastSegment) return "Dashboard";

  return lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function UserNavbar({ onToggleSidebar }: UserNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const unread = useUserData(userApi.dashboard).data?.counts.unreadNotifications ?? 0;

  const displayName = user?.name || "Guest User";
  const displayEmail = user?.email || "customer@plumberfinder.com";
  const initials = getInitials(displayName) || "GU";
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
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-x-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#0b1f3b] shadow-sm transition hover:border-[#FFD60A] hover:bg-[#FFD60A]"
            aria-label="Toggle dashboard menu"
          >
            <FaBars className="h-4 w-4" />
          </button>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Customer Area
            </p>
            <p className="truncate text-lg font-bold text-gray-900 sm:text-xl">
              {getPageLabel(pathname)}
            </p>
          </div>
        </div>

        <DashboardSearch />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Dashboard quick links">
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
        </nav>

        {/* Mobile quick links */}
        <div className="order-last -mx-4 w-[calc(100%+2rem)] border-t border-gray-100 bg-white/95 px-3 py-2 sm:-mx-6 sm:w-[calc(100%+3rem)] md:hidden">
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
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-[#FFD60A] hover:text-[#0b1f3b]"
            aria-label={unread ? `Notifications (${unread} unread)` : "Notifications"}
          >
            <FaBell className="h-4 w-4" />
            {unread > 0 && <span className="absolute -right-1.5 -top-1.5 min-w-5 rounded-full bg-red-500 px-1 text-center text-[11px] font-bold leading-5 text-white">{unread > 99 ? "99+" : unread}</span>}
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 shadow-sm transition hover:border-[#FFD60A]"
              aria-expanded={isMenuOpen}
              aria-label="Open user menu"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#FFD60A] text-sm font-bold text-[#0b1f3b]">
                {initials}
              </span>
              <span className="hidden max-w-32 truncate text-sm font-semibold text-gray-800 sm:block">
                {displayName}
              </span>
              <FaChevronDown className="hidden h-3 w-3 text-gray-500 sm:block" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="truncate text-sm font-bold text-gray-900">{displayName}</p>
                  <p className="truncate text-xs text-gray-500">{displayEmail}</p>
                </div>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <FaUser className="h-4 w-4 text-gray-400" />
                  Profile
                </Link>
                <Link
                  href="/dashboard/wallet"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <FaWallet className="h-4 w-4 text-gray-400" />
                  Wallet
                </Link>
                <Link
                  href="/dashboard/settings"
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
