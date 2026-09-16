













// components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FaBell,
  FaCaretDown,
  FaEllipsisH,
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaUserCircle,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { ServicesDropdown } from "../components/dropdowns/ServicesDropdown";
import { StatesDropdown } from "../components/dropdowns/StatesDropdown";
import { allStateAbbrs, getStateName } from "../components/utils/location";
import SearchSuggestionsPanel from "./search/SearchSuggestionsPanel";
import { getInitials, readStoredUser, clearStoredUser, type AppUser } from "../components/utils/auth";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Find Plumber", href: "/find" },
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

const usStates = allStateAbbrs.map(getStateName);

const headerActions = [
  { label: "Saved deals", href: "/saved", icon: FaHeart, countKey: "savedCount" },
  { label: "Alerts", href: "/notifications", icon: FaBell, countKey: "notifCount" },
  { label: "Cart", href: "/checkout", icon: FaShoppingCart, countKey: "cartCount" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("Chicago");
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const router = useRouter();
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Mock counts (replace with real data)
  const [counts, setCounts] = useState({ savedCount: 2, notifCount: 3, cartCount: 1 });

  // Main search handler – accepts event (optional) + term + location
  const handleSearch = useCallback(
    (e?: FormEvent | null, term?: string, location?: string) => {
      if (e) e.preventDefault();
      const nextTerm = (term ?? searchQuery).trim();
      const nextLocation = (location ?? searchLocation).trim();
      const params = new URLSearchParams();
      if (nextTerm) params.set("search", nextTerm);
      if (nextLocation) params.set("location", nextLocation);
      router.push(params.toString() ? `/find?${params.toString()}` : "/find");
      setMenuOpen(false);
      setSearchOpen(false);
      if (nextLocation) {
        window.localStorage.setItem("plumberfinder_location", nextLocation);
      }
    },
    [searchLocation, searchQuery, router]
  );

  // ✅ Wrapper for SearchSuggestionsPanel (no event, just term + location)
  const handlePanelSearch = useCallback(
    (term: string, location: string) => {
      handleSearch(null, term, location);
    },
    [handleSearch]
  );

  const handleLogout = () => {
    clearStoredUser();
    setUser(null);
    router.push("/");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const syncUser = () => setUser(readStoredUser());
    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener("focus", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("focus", syncUser);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white text-gray-800 backdrop-blur shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          {/* Logo */}
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="flex items-center gap-2 text-[#FFD60A]">
              <div className="relative h-14 w-14">
                <Image
                  src="/Plumber%20(1).png"
                  alt="Plumber Finder icon"
                  fill
                  sizes="56px"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="leading-none text-gray-800">
                <div className="text-xl font-extrabold">Plumber Finder</div>
              </div>
            </Link>
          </div>

          {/* Search (desktop) */}
          <div ref={searchWrapRef} className="relative hidden flex-1 justify-center lg:flex">
            <form onSubmit={(e) => handleSearch(e)} className="relative w-full max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onClick={() => setSearchOpen(true)}
                placeholder="Search plumbers, services, location..."
                className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-12 pr-20 text-sm text-gray-800 placeholder-gray-500 focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-[#FFD60A] px-4 py-1 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
              >
                Search
              </button>
            </form>
            <SearchSuggestionsPanel
              open={searchOpen}
              onClose={() => setSearchOpen(false)}
              query={searchQuery}
              onQueryChange={setSearchQuery}
              location={searchLocation}
              onLocationChange={setSearchLocation}
              onSearch={handlePanelSearch}
            />
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/add-business"
              className="rounded-full border border-emerald-700 bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-100"
            >
              Get Pro Leads
            </Link>

            <div className="ml-2 flex items-center gap-1">
              {headerActions.map((action) => {
                const Icon = action.icon;
                const count = counts[action.countKey as keyof typeof counts] || 0;
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    aria-label={action.label}
                    className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                    title={action.label}
                  >
                    <Icon className="text-[15px]" />
                    {count > 0 && (
                      <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-700 px-1 text-[10px] font-bold text-white">
                        {count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="ml-1 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100"
                  aria-label="Profile menu"
                >
                  {user.avatarUrl ? (
                    <span className="relative h-8 w-8 overflow-hidden rounded-full bg-slate-200">
                      <Image src={user.avatarUrl} alt={user.name} fill sizes="32px" className="object-cover" />
                    </span>
                  ) : (
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs text-white">
                      {getInitials(user.name)}
                    </span>
                  )}
                  <span className="hidden xl:inline">{user.name}</span>
                  <FaCaretDown className="text-[11px] text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5">
                    <div className="p-2">
                      <Link
                        href="/account"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <FaUser className="h-4 w-4" />
                        My Profile
                      </Link>
                      <Link
                        href="/saved"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <FaHeart className="h-4 w-4" />
                        Saved Deals
                      </Link>
                      <Link
                        href="/notifications"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <FaBell className="h-4 w-4" />
                        Notifications
                      </Link>
                      <Link
                        href="/checkout"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <FaShoppingCart className="h-4 w-4" />
                        Cart
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                      >
                        <FaSignOutAlt className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-1 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                title="Login"
              >
                <FaUserCircle className="text-base text-slate-500" />
                <span className="hidden xl:inline">Login</span>
              </Link>
            )}

            <Link
              href={user ? "/account" : "/signup"}
              className="ml-1 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              title={user ? "Account" : "Sign up"}
            >
              <FaEllipsisH className="text-[15px]" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-gray-800/20 p-2 text-gray-800 hover:bg-gray-800/5 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
              {menuOpen ? <path d="M6 18 18 6M6 6l12 12" /> : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
            </svg>
          </button>
        </div>

        {/* Desktop bottom nav */}
        <div className="hidden h-12 items-center justify-start gap-8 border-t border-gray-200 text-sm font-semibold text-gray-800 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-[#FFD60A]">
              {link.label}
            </Link>
          ))}
          <ServicesDropdown />
          <StatesDropdown />
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 sm:px-6 lg:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium text-gray-800">
            <form onSubmit={handleSearch} className="relative mb-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plumbers, services..."
                className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-12 pr-20 text-sm text-gray-800 placeholder-gray-500 focus:border-[#FFD60A] focus:outline-none focus:ring-1 focus:ring-[#FFD60A]"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-[#FFD60A] px-4 py-1 text-sm font-semibold text-white shadow-sm transition hover:brightness-105">
                Search
              </button>
            </form>

            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="pl-4 border-l-2 border-gray-200 mt-1">
              <div className="text-xs font-semibold text-gray-500 mb-1">Services</div>
              <div className="grid grid-cols-1 gap-1">
                <Link href="/find" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                  Find Plumber Companies
                </Link>
                <Link href="/post-requirement" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                  Post a Requirement
                </Link>
                <Link href="/quotes" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                  Get Quotes
                </Link>
                <Link href="/book-appointment" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                  Book Appointment
                </Link>
                <Link href="/compare" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                  Compare Companies
                </Link>
                <Link href="/register-business" className="flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                  Register Your Business
                </Link>
              </div>
            </div>
            <div className="pl-4 border-l-2 border-gray-200 mt-1">
              <div className="text-xs font-semibold text-gray-500 mb-1">States</div>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {usStates.map((state) => (
                  <Link key={state} href={`/states/${state.toLowerCase().replace(/\s/g, '-')}`} className="rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition" onClick={() => setMenuOpen(false)}>
                    {state}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Link href="/add-business" className="flex-1 rounded-full bg-emerald-700 px-4 py-2 text-center text-sm font-semibold text-white shadow-md transition hover:brightness-110" onClick={() => setMenuOpen(false)}>
                Get Pro Leads
              </Link>
              {user ? (
                <button type="button" className="flex-1 rounded-full border border-gray-800 px-4 py-2 text-center text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-800/10">
                  {getInitials(user.name)} {user.name.split(" ")[0]}
                </button>
              ) : (
                <Link href="/login" className="flex-1 rounded-full border border-gray-800 px-4 py-2 text-center text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-800/10" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
              )}
              <Link href="/signup" className="flex-1 rounded-full border border-emerald-700 px-4 py-2 text-center text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}





















