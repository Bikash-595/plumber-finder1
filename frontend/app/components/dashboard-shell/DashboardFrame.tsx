"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export type SidebarMode = "open" | "icons";

type Props = {
  /** The navbar; `onMenu` is the one menu button for every screen size. */
  navbar: (onMenu: () => void) => ReactNode;
  /** The sidebar in a given mode. `onNavigate` closes the phone drawer after a link is followed. */
  sidebar: (mode: SidebarMode, onNavigate?: () => void) => ReactNode;
  footer: ReactNode;
  children: ReactNode;
  /** Tailwind widths of the laptop sidebar, e.g. { open: "lg:w-72", icons: "lg:w-20" }, and of the phone drawer. */
  widths: { open: string; icons: string; drawer: string };
  background?: string;
};

const LAPTOP = "(min-width: 1024px)"; // Tailwind's lg breakpoint

/**
 * Shell shared by the customer, company and freelancer dashboards (the admin app has a copy).
 * A single menu button lives in the navbar:
 *  - on laptops it switches the sidebar between full width and icons only;
 *  - on phones and tablets it opens and closes a drawer that slides in under the navbar
 *    (so the same button stays visible to close it; tapping outside or Escape also closes it).
 * The sidebar and the page body scroll separately; the page is one screen tall.
 */
export default function DashboardFrame({ navbar, sidebar, footer, children, widths, background = "bg-gray-100" }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(64);
  const headerRef = useRef<HTMLElement>(null);
  const drawerId = useId();

  const onMenu = () => {
    if (window.matchMedia(LAPTOP).matches) setCollapsed((value) => !value);
    else setDrawerOpen((value) => !value);
  };
  const closeDrawer = () => setDrawerOpen(false);

  // The drawer starts below the navbar, whose height changes with its wrapping rows on small screens.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const observer = new ResizeObserver(() => setHeaderHeight(header.offsetHeight));
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setDrawerOpen(false); };
    const onResize = () => { if (window.matchMedia(LAPTOP).matches) setDrawerOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, [drawerOpen]);

  return (
    <div className={`flex h-dvh flex-col overflow-hidden ${background}`}>
      <header ref={headerRef} className="relative z-[60] w-full shrink-0 bg-white shadow-sm">
        {navbar(onMenu)}
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Laptop sidebar: full or icons only. */}
        <aside className={`hidden min-h-0 shrink-0 flex-col overflow-hidden border-r bg-white transition-[width] duration-300 lg:flex ${collapsed ? widths.icons : widths.open}`}>
          {sidebar(collapsed ? "icons" : "open")}
        </aside>

        {/* Phone/tablet drawer, under the navbar. */}
        <div onClick={closeDrawer} aria-hidden className={`fixed inset-x-0 bottom-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} style={{ top: headerHeight }} />
        <aside id={drawerId} inert={!drawerOpen} aria-label="Navigation menu"
          className={`fixed bottom-0 left-0 z-50 flex flex-col overflow-hidden bg-white shadow-xl transition-transform duration-300 lg:hidden ${widths.drawer} ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
          style={{ top: headerHeight }}>
          {sidebar("open", closeDrawer)}
        </aside>

        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain">
          {children}
          <footer className="w-full border-t bg-white shadow-sm">{footer}</footer>
        </main>
      </div>
    </div>
  );
}
