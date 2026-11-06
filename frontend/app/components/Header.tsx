"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaBars, FaBuilding, FaMagnifyingGlass } from "react-icons/fa6";
import UserAvatar from "@/components/UserAvatar";
import { clearStoredUser } from "@/components/utils/auth";
import { accountMenuLinks, dashboardLink } from "@/components/utils/accountLinks";
import AccountMenu from "./header/AccountMenu";
import DesktopNav from "./header/DesktopNav";
import DesktopSearch from "./header/DesktopSearch";
import Logo from "./header/Logo";
import MobileMenu from "./header/mobile-menu/MobileMenu";
import QuickActions from "./header/QuickActions";
import UtilityBar from "./header/UtilityBar";
import { iconButton } from "./header/headerConfig";
import { useHeaderCounts } from "./header/useHeaderCounts";
import { useHeaderSearch } from "./header/useHeaderSearch";
import { useSignedInUser } from "./header/useSignedInUser";

/** The site header: utility bar, logo, search, quick actions, account, nav row and the phone menu (parts in ./header). */
export function Header() {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [focusMobileSearch, setFocusMobileSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useSignedInUser();
  const counts = useHeaderCounts();
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const search = useHeaderSearch({ menuOpen, onNavigate: closeMenu });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMenu = (withSearch = false) => {
    setFocusMobileSearch(withSearch);
    setMenuOpen(true);
  };
  const logout = () => {
    clearStoredUser();
    setUser(null);
    closeMenu();
    router.push("/");
  };

  const links = accountMenuLinks(user);
  const dashboard = dashboardLink(user);
  // Signed-in companies/freelancers go straight to their dashboard; everyone else to the business login.
  const isBusiness = dashboard?.href === "/company-dashboard" || dashboard?.href === "/freelancer";
  const businessCta = isBusiness && dashboard ? { href: dashboard.href, label: "My Business" } : { href: "/business/login", label: "List Company" };
  const avatar = user && <UserAvatar name={user.name} src={user.avatarUrl} size={32} className="ring-2 ring-white" />;

  return (
    <>
      <UtilityBar signedIn={Boolean(user)} dashboard={dashboard} />

      <header className={`site-nav sticky top-0 z-50 border-b border-slate-200 bg-white transition-shadow duration-200 ${scrolled ? "shadow-[0_8px_24px_-12px_rgba(11,31,59,0.25)]" : ""}`}>
        {/* `relative` anchors the search suggestions panel to the header width. */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-3 sm:gap-4 lg:h-[72px] lg:gap-6">
            <Logo compactTagline />
            <DesktopSearch search={search} />

            <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
              <QuickActions counts={counts} pathname={pathname} />
              <AccountMenu user={user} avatar={avatar} links={links} onLogout={logout} />

              {/* Business entrance (tablet and up): companies and freelancers log in / sign up here. */}
              <Link href={businessCta.href} className="hidden h-10 items-center gap-2 rounded-full bg-[#0b1f3b] px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-px hover:bg-[#17345a] hover:shadow-md md:inline-flex lg:px-5">
                <FaBuilding className="h-3.5 w-3.5 text-[#FFD60A]" aria-hidden />
                {businessCta.label}
              </Link>

              {/* Phone search shortcut */}
              <button type="button" aria-label="Open search" onClick={() => openMenu(true)} className={`${iconButton} md:hidden`}>
                <FaMagnifyingGlass className="h-[17px] w-[17px]" aria-hidden />
              </button>

              {/* Mobile / tablet menu button */}
              <button type="button" className={`${iconButton} border border-slate-200 lg:hidden`} aria-label="Open menu" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => openMenu()}>
                <FaBars className="h-[17px] w-[17px]" aria-hidden />
              </button>
            </div>
          </div>

          <DesktopNav pathname={pathname} />
        </div>
      </header>

      {menuOpen && (
        <MobileMenu
          onClose={closeMenu} focusSearch={focusMobileSearch} search={search} pathname={pathname} counts={counts}
          user={user} avatar={avatar} dashboard={dashboard} links={links} businessCta={businessCta} onLogout={logout}
        />
      )}
    </>
  );
}
