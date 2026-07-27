"use client";

import { useState } from "react";
import AdminSectionPage from "@/components/admin-dashboard/AdminSectionPage";
import AdminActionDropdown from "@/components/admin-dashboard/AdminActionDropdown";

const freelancers = [
  { name: "Alexa Browne", specialty: "Drain repair", rating: "4.9", status: "Verified" },
  { name: "Noah Carter", specialty: "Water heater", rating: "4.8", status: "Pending" },
  { name: "Sofia King", specialty: "Leak detection", rating: "4.9", status: "Verified" },
  { name: "Mia Lopez", specialty: "Pipe lining", rating: "4.7", status: "Review" },
];

export default function AdminFreelancersPage() {
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const filteredFreelancers = freelancers.filter(
    (freelancer) => specialtyFilter === "All" || freelancer.specialty === specialtyFilter
  );

  return (
    <AdminSectionPage
      title="Freelancer Management"
      description="Approve or deactivate freelancers, review service specialties and platform ratings."
      actions={
        <AdminActionDropdown
          label={`Specialty: ${specialtyFilter}`}
          items={[
            { label: "All", onClick: () => setSpecialtyFilter("All") },
            { label: "Drain repair", onClick: () => setSpecialtyFilter("Drain repair") },
            { label: "Water heater", onClick: () => setSpecialtyFilter("Water heater") },
            { label: "Leak detection", onClick: () => setSpecialtyFilter("Leak detection") },
            { label: "Pipe lining", onClick: () => setSpecialtyFilter("Pipe lining") },
          ]}
        />
      }
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Freelancers</h2>
            <p className="text-sm text-gray-500">Track specialist freelancers, review approvals, and manage ratings.</p>
          </div>
          <AdminActionDropdown
            label="Freelancer actions"
            items={[
              { label: "Review applications", onClick: () => alert("Review applications...") },
              { label: "Export freelancers", onClick: () => alert("Export freelancers...") },
              { label: "Invite freelancer", onClick: () => alert("Invite freelancer...") },
            ]}
          />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-gray-700 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-slate-500">Verified pros</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">86</p>
            <p className="mt-2 text-xs text-slate-500">Freelancers approved for platform work.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-gray-700 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-slate-500">Pending approvals</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">15</p>
            <p className="mt-2 text-xs text-slate-500">Applications waiting for review.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-gray-700 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-slate-500">Top specialties</p>
            <p className="mt-3 text-base font-semibold text-slate-900">Drain repair, Heater service</p>
            <p className="mt-2 text-xs text-slate-500">Services most often assigned to freelancers.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredFreelancers.map((freelancer) => (
            <div key={freelancer.name} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-gray-900">{freelancer.name}</p>
                  <p className="mt-2 text-sm text-gray-500">{freelancer.specialty}</p>
                  <p className="mt-3 text-sm font-semibold text-gray-700">Rating: {freelancer.rating}</p>
                </div>
                <AdminActionDropdown
                  label="Actions"
                  items={[
                    { label: "View profile", onClick: () => alert(`View ${freelancer.name}`) },
                    { label: "Approve freelancer", onClick: () => alert(`Approve ${freelancer.name}`) },
                    { label: "Flag for review", onClick: () => alert(`Flag ${freelancer.name}`) },
                  ]}
                />
              </div>
              <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                freelancer.status === "Verified"
                  ? "bg-emerald-100 text-emerald-700"
                  : freelancer.status === "Pending"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-sky-100 text-sky-700"
              }`}>
                {freelancer.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AdminSectionPage>
  );
}
