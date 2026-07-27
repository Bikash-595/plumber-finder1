"use client";

import { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";

interface DashboardShellProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function DashboardShell({ children, title, description }: DashboardShellProps) {

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        <DashboardSidebar />
        <main className="flex-1">
          {(title || description) && (
            <div className="mb-6">
              {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
              {description && <p className="text-gray-600">{description}</p>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}