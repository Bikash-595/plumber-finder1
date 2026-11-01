"use client";

import { ReactNode } from "react";
import DashboardGuard from "@/components/auth/DashboardGuard";
import DashboardFrame from "@/components/dashboard-shell/DashboardFrame";
import FreelancerFooter from "@/components/freelancer-dashboard/FreelancerFooter";
import FreelancerNavbar from "@/components/freelancer-dashboard/FreelancerNavbar";
import FreelancerSidebar from "@/components/freelancer-dashboard/FreelancerSidebar";

/** Only freelancers can open this dashboard (see DashboardGuard and proxy.ts). */
export default function FreelancerLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardGuard area="freelancer">
      <DashboardFrame widths={{ open: "lg:w-72", icons: "lg:w-20", drawer: "w-72" }}
        navbar={(onMenu) => <FreelancerNavbar onToggleSidebar={onMenu} />}
        sidebar={(mode, onNavigate) => <FreelancerSidebar sidebarState={mode} onLinkClick={onNavigate} />}
        footer={<FreelancerFooter />}>
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="min-h-[calc(100vh-180px)] rounded-2xl bg-white p-4 text-gray-900 shadow-sm sm:p-6">{children}</div>
        </div>
      </DashboardFrame>
    </DashboardGuard>
  );
}
