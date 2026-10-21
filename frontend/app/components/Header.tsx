// components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, FormEvent, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FaArrowRight,
  FaBars,
  FaBell,
  FaBolt,
  FaBriefcase,
  FaCalendarCheck,
  FaCartShopping,
  FaChevronDown,
  FaCircleInfo,
  FaCircleQuestion,
  FaCircleUser,
  FaEnvelope,
  FaHeadset,
  FaHeart,
  FaHouse,
  FaLocationDot,
  FaMagnifyingGlass,
  FaMagnifyingGlassLocation,
  FaNewspaper,
  FaRightFromBracket,
  FaShieldHalved,
  FaStar,
  FaUser,
  FaXmark,
} from "react-icons/fa6";
import { ServicesDropdown } from "../components/dropdowns/ServicesDropdown";
import { StatesDropdown, stateHref, topStates } from "../components/dropdowns/StatesDropdown";
import { allStateAbbrs, getStateName } from "../components/utils/location";
import { serviceDefinitions } from "./services/serviceData";
import { ServiceIcon } from "./services/serviceIcons";
import SearchSuggestionsPanel from "./search/SearchSuggestionsPanel";
import { getInitials, readStoredUser, clearStoredUser, type AppUser } from "../components/utils/auth";

const navLinks = [
  { label: "Home", href: "/", icon: FaHouse },
  { label: "Find Plumber", href: "/find", icon: FaMagnifyingGlassLocation },
  { label: "About Us", href: "/about", icon: FaCircleInfo },
  { label: "FAQ", href: "/faq", icon: FaCircleQuestion },
  { label: "Blogs", href: "/blogs", icon: FaNewspaper },
  { label: "Contact", href: "/contact", icon: FaEnvelope },
];

const usStates = allStateAbbrs.map(getStateName);

const headerActions = [
  { label: "Saved deals", href: "/saved", icon: FaHeart, countKey: "savedCount" },
  { label: "Alerts", href: "/notifications", icon: FaBell, countKey: "notifCount" },
  { label: "Cart", href: "/checkout", icon: FaCartShopping, countKey: "cartCount" },
] as const;

// Mock counts (replace with real data)
const counts = { savedCount: 2, notifCount: 3, cartCount: 1 };

const isActivePath = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

type DesktopMenu = "services" | "states" | null;
type MobileSection = "services" | "states" | null;

function Logo({ compactTagline = false }: { compactTagline?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Plumber Finder home">
      <span className="relative h-9 w-9 sm:h-11 sm:w-11">
        <Image src="/Plumber%20(1).png" alt="" fill sizes="44px" className="object-contain" priority />
      </span>
      <span className="leading-none">
        <span className="block text-[17px] font-extrabold tracking-tight text-[#0b1f3b] sm:text-xl">
          Plumber<span className="text-[#d4ad00]">Finder</span>
        </span>
        <span className={`mt-1 text-[11px] font-medium text-slate-500 ${compactTagline ? "hidden sm:block md:hidden xl:block" : "block"}`}>
          Trusted local plumbers
        </span>
      </span>
    </Link>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [focusMobileSearch, setFocusMobileSearch] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState<DesktopMenu>(null);
  const [mobileSection, setMobileSection] = useState<MobileSection>(null);
  const [mobileStateSearch, setMobileStateSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("Chicago");
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const desktopNavRef = useRef<HTMLDivElement>(null);

  const openMobileMenu = (withSearch = false) => {
    setFocusMobileSearch(withSearch);
    setMenuOpen(true);
  };
  const closeMobileMenu = () => {
    setMenuOpen(false);
    setMobileSection(null);
  };

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
      setMobileSection(null);
      setSearchOpen(false);
      if (nextLocation) {
        window.localStorage.setItem("plumberfinder_location", nextLocation);
      }
    },
    [searchLocation, searchQuery, router]
  );

  // Wrapper for SearchSuggestionsPanel (no event, just term + location)
  const handlePanelSearch = useCallback(
    (term: string, location: string) => {
      handleSearch(null, term, location);
    },
    [handleSearch]
  );

  const handleLogout = () => {
    clearStoredUser();
    setUser(null);
    setUserDropdownOpen(false);
    closeMobileMenu();
    router.push("/");
  };

  // Close dropdowns when clicking outside / pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (searchWrapRef.current && !searchWrapRef.current.contains(target)) setSearchOpen(false);
      if (userDropdownRef.current && !userDropdownRef.current.contains(target)) setUserDropdownOpen(false);
      if (desktopNavRef.current && !desktopNavRef.current.contains(target)) setDesktopMenu(null);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setDesktopMenu(null);
      setUserDropdownOpen(false);
      setSearchOpen(false);
      setMenuOpen(false);
    };
    const handleScroll = () => setScrolled(window.scrollY > 8);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll);
    };
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

  // Lock page scroll behind the mobile menu, and close it if the screen grows to desktop size.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1024px)");
    const handleResize = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener("change", handleResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", handleResize);
    };
  }, [menuOpen]);

  const mobileStateQuery = mobileStateSearch.trim().toLowerCase();
  const filteredMobileStates = usStates.filter((state) => state.toLowerCase().includes(mobileStateQuery));

  const accountAvatar = user && (user.avatarUrl ? (
    <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-slate-200 ring-2 ring-white">
      <Image src={user.avatarUrl} alt="" fill sizes="32px" className="object-cover" />
    </span>
  ) : (
    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0b1f3b] text-xs font-bold text-white ring-2 ring-white">
      {getInitials(user.name)}
    </span>
  ));

  const iconButton = "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-[#0b1f3b]";

  return (
    <>
      {/* Utility bar – scrolls away so the sticky header stays compact. */}
      <div className="site-nav hidden bg-[#0b1f3b] text-xs text-white/75 md:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-5">
            <li>
              <Link href="/services/emergency-plumbing" className="inline-flex items-center gap-1.5 font-medium text-white hover:text-[#FFD60A]">
                <FaBolt className="h-3 w-3 text-[#FFD60A]" aria-hidden /> 24/7 emergency plumbers
              </Link>
            </li>
            <li className="hidden items-center gap-1.5 lg:inline-flex">
              <FaShieldHalved className="h-3 w-3 text-[#FFD60A]" aria-hidden /> Licensed &amp; verified pros
            </li>
            <li className="hidden items-center gap-1.5 xl:inline-flex">
              <FaStar className="h-3 w-3 text-[#FFD60A]" aria-hidden /> Rated by real customers
            </li>
          </ul>
          <ul className="flex items-center gap-5">
            <li>
              <Link href="/faq" className="inline-flex items-center gap-1.5 hover:text-white">
                <FaHeadset className="h-3 w-3" aria-hidden /> Help Center
              </Link>
            </li>
            <li aria-hidden className="h-3.5 w-px bg-white/20" />
            <li>
              {user ? (
                <Link href="/account" className="font-semibold text-[#FFD60A] hover:underline">My account</Link>
              ) : (
                <Link href="/signup" className="font-semibold text-[#FFD60A] hover:underline">Sign up free</Link>
              )}
            </li>
          </ul>
        </div>
      </div>

      <header className={`site-nav sticky top-0 z-50 border-b border-slate-200 bg-white transition-shadow duration-200 ${scrolled ? "shadow-[0_8px_24px_-12px_rgba(11,31,59,0.25)]" : ""}`}>
        {/* `relative` anchors the search suggestions panel to the header width. */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-3 sm:gap-4 lg:h-[72px] lg:gap-6">
            <Logo compactTagline />

            {/* Search (tablet and up) */}
            <div ref={searchWrapRef} className="hidden min-w-0 flex-1 justify-center md:flex">
              <form onSubmit={(e) => handleSearch(e)} className="group relative w-full max-w-xl" role="search">
                <label htmlFor="header-search" className="sr-only">Search plumbers, services, location</label>
                <FaMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-[#0b1f3b]" aria-hidden />
                <input
                  id="header-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onClick={() => setSearchOpen(true)}
                  placeholder="Search plumbers or services"
                  className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-14 text-sm text-slate-800 placeholder-slate-400 transition hover:border-slate-300 focus:border-[#FFD60A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFD60A]/25 lg:pr-28"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-1.5 top-1/2 inline-flex h-8 -translate-y-1/2 items-center gap-2 rounded-full bg-[#0b1f3b] px-3 text-sm font-semibold text-white transition hover:bg-[#17345a] lg:px-4"
                >
                  <FaMagnifyingGlass className="h-3 w-3 lg:hidden" aria-hidden />
                  <span className="hidden lg:inline">Search</span>
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

            <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
              {/* Saved / alerts / cart (laptop and up) */}
              <div className="hidden items-center lg:flex">
                {headerActions.map((action) => {
                  const Icon = action.icon;
                  const count = counts[action.countKey];
                  const active = isActivePath(pathname, action.href);
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      aria-label={`${action.label}${count ? ` (${count})` : ""}`}
                      title={action.label}
                      className={`${iconButton} ${active ? "bg-[#FFD60A]/15 text-[#0b1f3b]" : ""}`}
                    >
                      <Icon className="h-[17px] w-[17px]" aria-hidden />
                      {count > 0 && (
                        <span className="absolute right-0.5 top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                          {count}
                        </span>
                      )}
                    </Link>
                  );
                })}
                <span aria-hidden className="mx-2 h-6 w-px bg-slate-200" />
              </div>

              {/* Account (tablet and up) */}
              {user ? (
                <div className="relative hidden md:block" ref={userDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen((open) => !open)}
                    className="inline-flex items-center gap-2 rounded-full p-1 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 xl:pr-3"
                    aria-label="Profile menu"
                    aria-expanded={userDropdownOpen}
                  >
                    {accountAvatar}
                    <span className="hidden max-w-[7rem] truncate xl:inline">{user.name.split(" ")[0]}</span>
                    <FaChevronDown className="hidden h-2.5 w-2.5 text-slate-400 xl:block" aria-hidden />
                  </button>

                  {userDropdownOpen && (
                    <div className="animate-nav-menu absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_48px_-12px_rgba(11,31,59,0.25)]">
                      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
                        {accountAvatar}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                          <p className="truncate text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="p-2">
                        {[
                          { href: "/account", label: "My Profile", icon: FaUser },
                          { href: "/saved", label: "Saved Deals", icon: FaHeart },
                          { href: "/notifications", label: "Notifications", icon: FaBell },
                          { href: "/checkout", label: "Cart", icon: FaCartShopping },
                        ].map(({ href, label, icon: Icon }) => (
                          <Link
                            key={href}
                            href={href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <Icon className="h-4 w-4 text-slate-400" aria-hidden />
                            {label}
                          </Link>
                        ))}
                        <hr className="my-1 border-slate-100" />
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                        >
                          <FaRightFromBracket className="h-4 w-4" aria-hidden />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  aria-label="Log in"
                  className="hidden h-10 items-center gap-2 rounded-full px-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-[#0b1f3b] md:inline-flex lg:px-3"
                >
                  <FaCircleUser className="h-5 w-5 text-slate-400" aria-hidden />
                  <span className="hidden lg:inline">Log in</span>
                </Link>
              )}

              {/* Primary call to action (tablet and up) */}
              <Link
                href="/book-plumber"
                className="hidden h-10 items-center gap-2 rounded-full bg-[#FFD60A] px-4 text-sm font-bold text-[#0b1f3b] shadow-sm shadow-[#FFD60A]/40 transition hover:-translate-y-px hover:brightness-95 hover:shadow-md md:inline-flex lg:px-5"
              >
                <FaCalendarCheck className="h-3.5 w-3.5" aria-hidden />
                <span className="lg:hidden">Book</span>
                <span className="hidden lg:inline">Book a Plumber</span>
              </Link>

              {/* Phone search shortcut */}
              <button type="button" aria-label="Open search" onClick={() => openMobileMenu(true)} className={`${iconButton} md:hidden`}>
                <FaMagnifyingGlass className="h-[17px] w-[17px]" aria-hidden />
              </button>

              {/* Mobile / tablet menu button */}
              <button
                type="button"
                className={`${iconButton} border border-slate-200 lg:hidden`}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => openMobileMenu()}
              >
                <FaBars className="h-[17px] w-[17px]" aria-hidden />
              </button>
            </div>
          </div>

          {/* Desktop nav row – `relative` anchors the mega menus to the full nav width. */}
          <div ref={desktopNavRef} className="relative hidden h-12 items-center border-t border-slate-100 lg:flex">
            <nav aria-label="Main" className="flex h-full items-center gap-6 xl:gap-8">
              {navLinks.map((link) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex h-full items-center text-sm font-semibold transition-colors hover:text-[#0b1f3b] ${active ? "text-[#0b1f3b]" : "text-slate-600"}`}
                  >
                    {link.label}
                    {active && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#FFD60A]" />}
                  </Link>
                );
              })}
              <ServicesDropdown
                open={desktopMenu === "services"}
                active={isActivePath(pathname, "/services")}
                onOpenChange={(open) => setDesktopMenu(open ? "services" : null)}
              />
              <StatesDropdown
                open={desktopMenu === "states"}
                active={isActivePath(pathname, "/states")}
                onOpenChange={(open) => setDesktopMenu(open ? "states" : null)}
              />
            </nav>
            <Link
              href="/add-business"
              className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-50">
                <FaBriefcase className="h-3 w-3" aria-hidden />
              </span>
              Get Pro Leads
              <FaArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile / tablet slide-in menu (rendered outside <header> so it is never clipped by it). */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" tabIndex={-1} aria-label="Close menu" className="animate-nav-backdrop absolute inset-0 h-full w-full bg-[#0b1f3b]/50 backdrop-blur-[2px]" onClick={closeMobileMenu} />
          <div className="animate-nav-drawer absolute inset-y-0 right-0 flex w-full max-w-[22rem] flex-col bg-white shadow-2xl sm:max-w-md">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4 sm:px-6">
              <Logo />
              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
              >
                <FaXmark className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-4 sm:px-6">
              <form onSubmit={handleSearch} className="relative md:hidden" role="search">
                <label htmlFor="mobile-search" className="sr-only">Search plumbers, services</label>
                <FaMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" aria-hidden />
                <input
                  id="mobile-search"
                  type="search"
                  enterKeyHint="search"
                  autoFocus={focusMobileSearch}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search plumbers or services"
                  className="h-12 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-24 text-base text-slate-800 placeholder-slate-400 focus:border-[#FFD60A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFD60A]/25"
                />
                <button type="submit" className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2 rounded-full bg-[#0b1f3b] px-4 text-sm font-semibold text-white">
                  Search
                </button>
              </form>

              <Link
                href="/services/emergency-plumbing"
                onClick={closeMobileMenu}
                className="mt-4 flex items-center gap-3 rounded-2xl bg-[#0b1f3b] p-4 text-white md:mt-0"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFD60A] text-[#0b1f3b]">
                  <FaBolt className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">Plumbing emergency?</span>
                  <span className="block text-xs text-white/70">Find plumbers available 24/7</span>
                </span>
                <FaArrowRight className="h-3.5 w-3.5 text-[#FFD60A]" aria-hidden />
              </Link>

              <nav aria-label="Mobile" className="mt-5">
                <p className="px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Menu</p>
                <ul className="mt-1.5 space-y-0.5">
                  {navLinks.map((link) => {
                    const active = isActivePath(pathname, link.href);
                    const Icon = link.icon;
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          aria-current={active ? "page" : undefined}
                          onClick={closeMobileMenu}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-semibold transition ${active ? "bg-[#FFD60A]/15 text-[#0b1f3b]" : "text-slate-700 hover:bg-slate-50"}`}
                        >
                          <Icon className={`h-4 w-4 ${active ? "text-[#b39200]" : "text-slate-400"}`} aria-hidden />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <p className="mt-5 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Browse</p>
                {/* Services accordion */}
                <div className="mt-1.5 overflow-hidden rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    aria-expanded={mobileSection === "services"}
                    onClick={() => setMobileSection((section) => (section === "services" ? null : "services"))}
                    className="flex w-full items-center justify-between px-4 py-3 text-[15px] font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    <span>Services <span className="ml-1 text-xs font-medium text-slate-400">{serviceDefinitions.length}</span></span>
                    <FaChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${mobileSection === "services" ? "rotate-180" : ""}`} aria-hidden />
                  </button>
                  {mobileSection === "services" && (
                    <div className="border-t border-slate-100 bg-slate-50/60 p-2">
                      <ul className="grid gap-1 sm:grid-cols-2">
                        {serviceDefinitions.map((service) => {
                          const active = isActivePath(pathname, `/services/${service.slug}`);
                          return (
                            <li key={service.slug}>
                              <Link
                                href={`/services/${service.slug}`}
                                onClick={closeMobileMenu}
                                className={`flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm transition ${active ? "bg-[#FFD60A]/20 font-semibold text-[#0b1f3b]" : "text-slate-700 hover:bg-white"}`}
                              >
                                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-[#0b1f3b]">
                                  <ServiceIcon slug={service.slug} className="h-3.5 w-3.5" />
                                </span>
                                {service.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                      <Link href="/services" onClick={closeMobileMenu} className="mt-1 flex items-center gap-2 px-2.5 py-2 text-sm font-semibold text-[#0b1f3b]">
                        View all services <FaArrowRight className="h-3 w-3" aria-hidden />
                      </Link>
                    </div>
                  )}
                </div>

                {/* States accordion */}
                <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    aria-expanded={mobileSection === "states"}
                    onClick={() => setMobileSection((section) => (section === "states" ? null : "states"))}
                    className="flex w-full items-center justify-between px-4 py-3 text-[15px] font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    <span>States <span className="ml-1 text-xs font-medium text-slate-400">{usStates.length}</span></span>
                    <FaChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${mobileSection === "states" ? "rotate-180" : ""}`} aria-hidden />
                  </button>
                  {mobileSection === "states" && (
                    <div className="border-t border-slate-100 bg-slate-50/60 p-3">
                      <label className="relative block">
                        <span className="sr-only">Search states</span>
                        <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" aria-hidden />
                        <input
                          type="search"
                          value={mobileStateSearch}
                          onChange={(e) => setMobileStateSearch(e.target.value)}
                          placeholder="Search state..."
                          className="h-10 w-full rounded-full border border-slate-200 bg-white pl-8 pr-3 text-base outline-none focus:border-[#FFD60A] focus:ring-4 focus:ring-[#FFD60A]/25 sm:text-sm"
                        />
                      </label>
                      {!mobileStateQuery && topStates.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {topStates.map((state) => (
                            <Link
                              key={state.name}
                              href={stateHref(state.name)}
                              onClick={closeMobileMenu}
                              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                            >
                              {state.name} <span className="text-slate-400">· {state.count}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                      <ul className="mt-2 grid grid-cols-2 gap-0.5 sm:grid-cols-3">
                        {filteredMobileStates.map((state) => (
                          <li key={state}>
                            <Link
                              href={stateHref(state)}
                              onClick={closeMobileMenu}
                              className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-white"
                            >
                              <FaLocationDot className="h-3 w-3 shrink-0 text-slate-300" aria-hidden />
                              <span className="truncate">{state}</span>
                            </Link>
                          </li>
                        ))}
                        {filteredMobileStates.length === 0 && <li className="col-span-full px-2 py-2 text-sm text-slate-500">No states match.</li>}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Saved / alerts / cart */}
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {headerActions.map((action) => {
                    const Icon = action.icon;
                    const count = counts[action.countKey];
                    return (
                      <Link
                        key={action.label}
                        href={action.href}
                        onClick={closeMobileMenu}
                        className="relative flex flex-col items-center gap-1.5 rounded-2xl border border-slate-200 px-2 py-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        <Icon className="h-4 w-4 text-[#0b1f3b]" aria-hidden />
                        {action.label}
                        {count > 0 && (
                          <span className="absolute right-2 top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">{count}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </div>

            {/* Account actions */}
            <div className="shrink-0 space-y-2.5 border-t border-slate-100 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
              <Link
                href="/book-plumber"
                onClick={closeMobileMenu}
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#FFD60A] text-sm font-bold text-[#0b1f3b] shadow-sm"
              >
                <FaCalendarCheck className="h-4 w-4" aria-hidden />
                Book a Plumber
              </Link>
              {user ? (
                <div className="flex items-center gap-2">
                  <Link href="/account" onClick={closeMobileMenu} className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-slate-200 py-1.5 pl-1.5 pr-4 hover:bg-slate-50">
                    {accountAvatar}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-900">{user.name}</span>
                      <span className="block truncate text-xs text-slate-500">View profile</span>
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="Logout"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <FaRightFromBracket className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" onClick={closeMobileMenu} className="flex h-11 items-center justify-center rounded-full border border-slate-300 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                    Log in
                  </Link>
                  <Link href="/signup" onClick={closeMobileMenu} className="flex h-11 items-center justify-center rounded-full bg-[#0b1f3b] text-sm font-semibold text-white hover:bg-[#17345a]">
                    Sign up
                  </Link>
                </div>
              )}
              <Link href="/add-business" onClick={closeMobileMenu} className="flex items-center justify-center gap-2 py-1 text-sm font-semibold text-emerald-700">
                <FaBriefcase className="h-3.5 w-3.5" aria-hidden />
                Are you a plumber? Get Pro Leads
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
