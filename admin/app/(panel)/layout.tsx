"use client";

import { ReactNode } from "react";
import AdminFooter from "@/components/AdminFooter";
import AdminGuard from "@/components/AdminGuard";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";
import DashboardFrame from "@/components/DashboardFrame";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <DashboardFrame widths={{ open: "lg:w-72", icons: "lg:w-20", drawer: "w-72" }}
        navbar={(onMenu) => <AdminNavbar onToggleSidebar={onMenu} />}
        sidebar={(mode, onNavigate) => <AdminSidebar sidebarState={mode} onLinkClick={onNavigate} />}
        footer={<AdminFooter />}>
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="min-h-[calc(100vh-180px)] rounded-2xl bg-white p-4 text-gray-900 shadow-sm sm:p-6">{children}</div>
        </div>
      </DashboardFrame>
    </AdminGuard>
  );
}
