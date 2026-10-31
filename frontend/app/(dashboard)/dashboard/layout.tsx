





"use client";

import { ReactNode, useState } from "react";
import DashboardGuard from "@/components/auth/DashboardGuard";
import DashboardSidebar, {
  type DashboardSidebarState,
} from "@/components/dashboard/DashboardSidebar";
import UserFooter from "@/components/dashboard/UserFooter";
import UserNavbar from "@/components/dashboard/UserNavbar";

const nextSidebarState = (
  state: DashboardSidebarState
): DashboardSidebarState => {
  if (state === "open") return "icons";
  if (state === "icons") return "closed";
  return "open";
};

const getDesktopSidebarWidth = (state: DashboardSidebarState) => {
  if (state === "open") return "lg:w-64";
  if (state === "icons") return "lg:w-20";
  return "lg:w-0";
};

const getMobileSidebarWidth = (state: DashboardSidebarState) => {
  if (state === "open") return "w-64";
  return "w-20";
};

function DashboardLayoutContent({
  children,
}: {
  children: ReactNode;
}) {
  const [mobileSidebarState, setMobileSidebarState] =
    useState<DashboardSidebarState>("closed");

  const [desktopSidebarState, setDesktopSidebarState] =
    useState<DashboardSidebarState>("open");

  const mobileSidebar = (
    <DashboardSidebar
      sidebarState={mobileSidebarState}
      onLinkClick={() => setMobileSidebarState("closed")}
      onToggle={() => setMobileSidebarState(nextSidebarState)}
    />
  );

  // App shell: one screen tall. The sidebar and the page body scroll separately.
  return (
        <div className="flex h-dvh flex-col overflow-hidden bg-[#f5f6f8]">
      {/* Full Width Navbar */}
      <header className="relative z-50 w-full shrink-0 shadow-sm bg-white">
        <UserNavbar
          onToggleSidebar={() =>
            setMobileSidebarState(nextSidebarState)
          }
        />
      </header>

      {/* Main Dashboard Section */}
      <div className="flex min-h-0 flex-1">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden min-h-0 overflow-hidden lg:flex flex-col bg-white border-r transition-all duration-300 ${getDesktopSidebarWidth(
            desktopSidebarState
          )}`}
        >
          <DashboardSidebar
            sidebarState={desktopSidebarState}
            onToggle={() =>
              setDesktopSidebarState(nextSidebarState)
            }
          />
        </aside>

        {/* Mobile Overlay */}
        {mobileSidebarState === "open" && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setMobileSidebarState("closed")}
          />
        )}

        {/* Mobile Sidebar */}
        {mobileSidebarState !== "closed" && (
          <aside
            className={`fixed inset-y-0 left-0 z-50 bg-white shadow-xl transition-all duration-300 lg:hidden ${getMobileSidebarWidth(
              mobileSidebarState
            )}`}
          >
            {mobileSidebar}
          </aside>
        )}

        {/* Page Content */}
        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain">
          <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 text-gray-900 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
          <footer className="w-full bg-white border-t shadow-sm">
            <UserFooter />
          </footer>
        </main>
      </div>
    </div>
  );
}

/** Only customers can open this dashboard (see DashboardGuard and proxy.ts). */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardGuard area="user"><DashboardLayoutContent>{children}</DashboardLayoutContent></DashboardGuard>;
}
