





"use client";

import { ReactNode, useState } from "react";
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

export default function DashboardLayout({
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Full Width Navbar */}
      <header className="sticky top-0 z-50 w-full shadow-sm bg-white">
        <UserNavbar
          onToggleSidebar={() =>
            setMobileSidebarState(nextSidebarState)
          }
        />
      </header>

      {/* Main Dashboard Section */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col bg-white border-r transition-all duration-300 ${getDesktopSidebarWidth(
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
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="bg-white rounded-2xl shadow-sm min-h-[calc(100vh-180px)] p-6 text-gray-900">
            {children}
          </div>
        </main>
      </div>

      {/* Full Width Footer */}
      <footer className="w-full bg-white border-t shadow-sm">
        <UserFooter />
      </footer>
    </div>
  );
}







