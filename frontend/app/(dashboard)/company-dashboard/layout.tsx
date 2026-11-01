"use client";

import { ReactNode } from "react";
import DashboardGuard from "@/components/auth/DashboardGuard";
import DashboardFrame from "@/components/dashboard-shell/DashboardFrame";
import CompanyFooter from "@/components/company-dashboard/CompanyFooter";
import CompanyNavbar from "@/components/company-dashboard/CompanyNavbar";
import CompanySidebar from "@/components/company-dashboard/CompanySidebar";

/** Only companies can open this dashboard (see DashboardGuard and proxy.ts). */
export default function CompanyDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardGuard area="company">
      <DashboardFrame widths={{ open: "lg:w-72", icons: "lg:w-20", drawer: "w-72" }}
        navbar={(onMenu) => <CompanyNavbar onToggleSidebar={onMenu} />}
        sidebar={(mode, onNavigate) => <CompanySidebar sidebarState={mode} onLinkClick={onNavigate} />}
        footer={<CompanyFooter />}>
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="min-h-[calc(100vh-180px)] rounded-2xl bg-white p-4 text-gray-900 shadow-sm sm:p-6">{children}</div>
        </div>
      </DashboardFrame>
    </DashboardGuard>
  );
}
