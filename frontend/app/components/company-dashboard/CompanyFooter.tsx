"use client";

import Link from "next/link";
import { FaCalendarCheck, FaChartLine, FaHeadset, FaTools } from "react-icons/fa";

const footerLinks = [
  { label: "Add Company", href: "/company-dashboard/add-company" },
  { label: "Company List", href: "/company-dashboard/company-list" },
  { label: "Leads", href: "/company-dashboard/leads" },
  { label: "Jobs", href: "/company-dashboard/jobs" },
  { label: "Billing", href: "/company-dashboard/billing" },
  { label: "Settings", href: "/company-dashboard/settings" },
];

const supportItems = [
  { label: "Lead tracking", icon: FaChartLine },
  { label: "Dispatch ready", icon: FaCalendarCheck },
  { label: "Partner support", icon: FaHeadset },
];

export default function CompanyFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#0b1f3b] text-[#FFD60A]">
              <FaTools className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900">Plumber Finder Company Dashboard</p>
              <p className="text-xs text-gray-500">
                Manage leads, jobs, schedules, customers, reviews, team, and billing.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {supportItems.map((item) => {
              const Icon = item.icon;

              return (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600"
                >
                  <Icon className="h-3.5 w-3.5 text-[#0b1f3b]" />
                  {item.label}
                </span>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 Plumber Finder. All rights reserved.</p>
          <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Company dashboard footer links">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-semibold text-gray-600 transition hover:text-[#0b1f3b]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
