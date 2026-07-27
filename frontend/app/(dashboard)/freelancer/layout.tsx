"use client";

import { ReactNode, useState } from "react";
import FreelancerSidebar from "@/components/freelancer-dashboard/FreelancerSidebar";
import FreelancerFooter from "@/components/freelancer-dashboard/FreelancerFooter";
import FreelancerNavbar from "@/components/freelancer-dashboard/FreelancerNavbar";
import type { FreelancerSidebarState } from "@/components/freelancer-dashboard/freelancerDashboardData";

const nextSidebarState = (
  state: FreelancerSidebarState
): FreelancerSidebarState => {
  if (state === "open") return "icons";
  if (state === "icons") return "closed";
  return "open";
};

const getDesktopSidebarWidth = (state: FreelancerSidebarState) => {
  if (state === "open") return "lg:w-72";
  if (state === "icons") return "lg:w-20";
  return "lg:w-0";
};

const getMobileSidebarWidth = (state: FreelancerSidebarState) => {
  if (state === "open") return "w-72";
  return "w-20";
};

export default function FreelancerLayout({ children }: { children: ReactNode }) {
  const [mobileSidebarState, setMobileSidebarState] =
    useState<FreelancerSidebarState>("closed");
  const [desktopSidebarState, setDesktopSidebarState] =
    useState<FreelancerSidebarState>("open");

  const mobileSidebar = (
    <FreelancerSidebar
      sidebarState={mobileSidebarState}
      onLinkClick={() => setMobileSidebarState("closed")}
      onToggle={() => setMobileSidebarState(nextSidebarState)}
    />
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
        <FreelancerNavbar
          onToggleSidebar={() => setMobileSidebarState(nextSidebarState)}
        />
      </header>

      <div className="flex flex-1">
        <aside
          className={`hidden flex-col border-r bg-white transition-all duration-300 lg:flex ${getDesktopSidebarWidth(
            desktopSidebarState
          )}`}
        >
          <FreelancerSidebar
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
        <FreelancerFooter />
      </footer>
    </div>
  );
}
