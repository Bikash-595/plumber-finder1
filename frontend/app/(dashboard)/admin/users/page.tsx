"use client";

import { useState } from "react";
import AdminSectionPage from "@/components/admin-dashboard/AdminSectionPage";
import AdminActionDropdown from "@/components/admin-dashboard/AdminActionDropdown";

const users = [
  { name: "Aisha Patel", email: "aisha.patel@example.com", role: "Admin", status: "Active" },
  { name: "Jacob Lee", email: "jacob.lee@example.com", role: "Manager", status: "Active" },
  { name: "Mia Johnson", email: "mia.johnson@example.com", role: "Editor", status: "Pending" },
  { name: "Noah Carter", email: "noah.carter@example.com", role: "Support", status: "Active" },
  { name: "Lina Wong", email: "lina.wong@example.com", role: "Editor", status: "Disabled" },
];

export default function AdminUsersPage() {
  const [filterRole, setFilterRole] = useState("All");
  const filteredUsers = users.filter(
    (user) => filterRole === "All" || user.role === filterRole
  );

  return (
    <AdminSectionPage
      title="User Management"
      description="Review user accounts, roles and platform access permissions in one place."
      actions={
        <AdminActionDropdown
          label={`Role: ${filterRole}`}
          items={[
            { label: "All", onClick: () => setFilterRole("All") },
            { label: "Admin", onClick: () => setFilterRole("Admin") },
            { label: "Manager", onClick: () => setFilterRole("Manager") },
            { label: "Editor", onClick: () => setFilterRole("Editor") },
            { label: "Support", onClick: () => setFilterRole("Support") },
          ]}
        />
      }
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Users</h2>
            <p className="text-sm text-gray-500">Invite, disable, approve or manage user roles for the admin panel.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <AdminActionDropdown
              label="Bulk actions"
              items={[
                { label: "Export users", onClick: () => alert("Exporting users...") },
                { label: "Disable selected", onClick: () => alert("Disable not implemented") },
                { label: "Invite new user", onClick: () => alert("Invite dialog...") },
              ]}
            />
            <button className="inline-flex items-center rounded-xl bg-[#0b1f3b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#102a4a]">
              Invite user
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-gray-700 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-slate-500">New users this week</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">28</p>
            <p className="mt-2 text-xs text-slate-500">Recent signups and registration flow.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-gray-700 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-slate-500">Active users</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">712</p>
            <p className="mt-2 text-xs text-slate-500">Users currently engaging with the platform.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-gray-700 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-slate-500">Top service types</p>
            <p className="mt-3 text-base font-semibold text-slate-900">Plumbing, Leak repair, Drain cleaning</p>
            <p className="mt-2 text-xs text-slate-500">Most requested services by users.</p>
          </div>
        </div>

        <table className="mt-6 w-full border-collapse text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-gray-500">
              <th className="border-b border-gray-200 px-4 py-3">Name</th>
              <th className="border-b border-gray-200 px-4 py-3">Email</th>
              <th className="border-b border-gray-200 px-4 py-3">Role</th>
              <th className="border-b border-gray-200 px-4 py-3">Status</th>
              <th className="border-b border-gray-200 px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.email} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4 text-gray-900">{user.name}</td>
                <td className="px-4 py-4 text-gray-600">{user.email}</td>
                <td className="px-4 py-4 text-gray-700">{user.role}</td>
                <td className="px-4 py-4 text-gray-700">{user.status}</td>
                <td className="px-4 py-4">
                  <AdminActionDropdown
                    label="Actions"
                    items={[
                      { label: "View profile", onClick: () => alert(`View ${user.name}`) },
                      { label: "Change role", onClick: () => alert(`Change role for ${user.name}`) },
                      { label: "Disable account", onClick: () => alert(`Disable ${user.name}`) },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminSectionPage>
  );
}
