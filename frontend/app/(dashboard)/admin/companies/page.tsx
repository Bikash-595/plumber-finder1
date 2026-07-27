"use client";

import { useState } from "react";
import AdminSectionPage from "@/components/admin-dashboard/AdminSectionPage";
import AdminActionDropdown from "@/components/admin-dashboard/AdminActionDropdown";

const companies = [
  { name: "Blue Valley Plumbing", status: "Verified", projects: "18", owner: "Mark Benson" },
  { name: "ProFlow Services", status: "Pending", projects: "12", owner: "Sophie Reed" },
  { name: "Rapid Repair Co.", status: "Verified", projects: "24", owner: "Noah Bennett" },
  { name: "ClearPipe Solutions", status: "Review", projects: "9", owner: "Emma Russo" },
];

export default function AdminCompaniesPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const filteredCompanies = companies.filter(
    (company) => statusFilter === "All" || company.status === statusFilter
  );

  return (
    <AdminSectionPage
      title="Company Management"
      description="Manage company profiles, verify listings, and review business health at a glance."
      actions={
        <AdminActionDropdown
          label={`Status: ${statusFilter}`}
          items={[
            { label: "All", onClick: () => setStatusFilter("All") },
            { label: "Verified", onClick: () => setStatusFilter("Verified") },
            { label: "Pending", onClick: () => setStatusFilter("Pending") },
            { label: "Review", onClick: () => setStatusFilter("Review") },
          ]}
        />
      }
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Companies</h2>
            <p className="text-sm text-gray-500">Review company status, performance and verification workflow.</p>
          </div>
          <AdminActionDropdown
            label="Company actions"
            items={[
              { label: "Add company", onClick: () => alert("Add company...") },
              { label: "Export listings", onClick: () => alert("Export companies...") },
              { label: "Review pending", onClick: () => setStatusFilter("Pending") },
            ]}
          />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-gray-700 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-slate-500">Verified companies</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">138</p>
            <p className="mt-2 text-xs text-slate-500">Confirmed businesses with valid documentation.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-gray-700 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-slate-500">Pending reviews</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">34</p>
            <p className="mt-2 text-xs text-slate-500">Companies waiting for verification or proof checks.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-gray-700 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-slate-500">Company blogs</p>
            <p className="mt-3 text-base font-semibold text-slate-900">420 posts reviewed</p>
            <p className="mt-2 text-xs text-slate-500">Track company content and topic quality.</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Projects</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company.name} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4 text-gray-900">{company.name}</td>
                  <td className="px-4 py-4 text-gray-700">{company.owner}</td>
                  <td className="px-4 py-4 text-gray-700">{company.projects}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      company.status === "Verified"
                        ? "bg-emerald-100 text-emerald-700"
                        : company.status === "Pending"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-sky-100 text-sky-700"
                    }`}>
                      {company.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <AdminActionDropdown
                      label="Actions"
                      items={[
                        { label: "View profile", onClick: () => alert(`View ${company.name}`) },
                        { label: "Verify company", onClick: () => alert(`Verify ${company.name}`) },
                        { label: "Suspend account", onClick: () => alert(`Suspend ${company.name}`) },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminSectionPage>
  );
}
