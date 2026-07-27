"use client";

import { ReactNode, useState } from "react";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import type { AdminSidebarState } from "@/components/admin-dashboard/adminDashboardData";
import AdminFooter from "@/components/admin-dashboard/AdminFooter";
import AdminNavbar from "@/components/admin-dashboard/AdminNavbar";

const nextSidebarState = (
  state: AdminSidebarState
): AdminSidebarState => {
  if (state === "open") return "icons";
  if (state === "icons") return "closed";
  return "open";
};

const getDesktopSidebarWidth = (state: AdminSidebarState) => {
  if (state === "open") return "lg:w-72";
  if (state === "icons") return "lg:w-20";
  return "lg:w-0";
};

const getMobileSidebarWidth = (state: AdminSidebarState) => {
  if (state === "open") return "w-72";
  return "w-20";
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileSidebarState, setMobileSidebarState] =
    useState<AdminSidebarState>("closed");
  const [desktopSidebarState, setDesktopSidebarState] =
    useState<AdminSidebarState>("open");

  const mobileSidebar = (
    <AdminSidebar
      sidebarState={mobileSidebarState}
      onLinkClick={() => setMobileSidebarState("closed")}
      onToggle={() => setMobileSidebarState(nextSidebarState)}
    />
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
        <AdminNavbar
          onToggleSidebar={() => setMobileSidebarState(nextSidebarState)}
        />
      </header>

      <div className="flex flex-1">
        <aside
          className={`hidden flex-col border-r bg-white transition-all duration-300 lg:flex ${getDesktopSidebarWidth(
            desktopSidebarState
          )}`}
        >
          <AdminSidebar
            sidebarState={desktopSidebarState}
            onToggle={() => setDesktopSidebarState(nextSidebarState)}
          />
        </aside>

        {mobileSidebarState === "open" && (
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileSidebarState("closed")}
          />
        )}

        {mobileSidebarState !== "closed" && (
          <aside
            className={`fixed inset-y-0 left-0 z-50 bg-white shadow-xl transition-all duration-300 lg:hidden ${getMobileSidebarWidth(
              mobileSidebarState
            )}`}
          >
            {mobileSidebar}
          </aside>
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="min-h-[calc(100vh-180px)] rounded-2xl bg-white p-4 shadow-sm sm:p-6 text-gray-900">
            {children}
          </div>
        </main>
      </div>

      <footer className="w-full border-t bg-white shadow-sm">
        <AdminFooter />
      </footer>
    </div>
  );
}
