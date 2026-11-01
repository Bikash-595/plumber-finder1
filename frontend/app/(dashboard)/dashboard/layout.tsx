"use client";

import { ReactNode } from "react";
import DashboardGuard from "@/components/auth/DashboardGuard";
import DashboardFrame from "@/components/dashboard-shell/DashboardFrame";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import UserFooter from "@/components/dashboard/UserFooter";
import UserNavbar from "@/components/dashboard/UserNavbar";

/** Only customers can open this dashboard (see DashboardGuard and proxy.ts). */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardGuard area="user">
      <DashboardFrame background="bg-[#f5f6f8]" widths={{ open: "lg:w-64", icons: "lg:w-20", drawer: "w-64" }}
        navbar={(onMenu) => <UserNavbar onToggleSidebar={onMenu} />}
        sidebar={(mode, onNavigate) => <DashboardSidebar sidebarState={mode} onLinkClick={onNavigate} />}
        footer={<UserFooter />}>
        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 text-gray-900 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </DashboardFrame>
    </DashboardGuard>
  );
}
