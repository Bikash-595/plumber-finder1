"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminSectionPage from "@/components/AdminSectionPage";
import { DataTable, FilterBar, Pager, Panel, StatusBadge, useAdminQuery } from "@/components/AdminData";
import { adminApi, formatDate, type CompanyStatus } from "@/lib/adminApi";

const statuses = [{ value: "all", label: "All" }, { value: "pending", label: "Pending" }, { value: "approved", label: "Approved" }, { value: "suspended", label: "Suspended" }];
const actions: Record<CompanyStatus, { label: string; status: CompanyStatus; tone: string }[]> = {
  pending: [{ label: "Approve", status: "approved", tone: "bg-emerald-600 text-white" }, { label: "Suspend", status: "suspended", tone: "border border-red-200 text-red-600" }],
  approved: [{ label: "Suspend", status: "suspended", tone: "border border-red-200 text-red-600" }],
  suspended: [{ label: "Reinstate", status: "approved", tone: "bg-emerald-600 text-white" }],
};

function CompaniesManager() {
  const params = useSearchParams();
  const initial = params.get("status") ?? params.get("tab");
  const [status, setStatus] = useState(statuses.some((s) => s.value === initial) ? initial! : "all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { data, error, setError, loading, reload } = useAdminQuery(`companies|${status}|${search}|${page}`, () => adminApi.companies({ status: status === "all" ? undefined : status, search, page }));

  const change = async (id: string, name: string, next: CompanyStatus) => {
    if (next === "suspended" && !window.confirm(`Suspend ${name}? Their public listing will be hidden.`)) return;
    setBusyId(id);
    try { await adminApi.setCompanyStatus(id, next); await reload(); } catch (caught) { setError(caught instanceof Error ? caught.message : "Update failed."); } finally { setBusyId(null); }
  };

  return (
    <Panel title="Companies" description="Approve new companies, suspend problem accounts (their public listing is hidden), or reinstate them.">
      <FilterBar search={search} onSearch={(value) => { setSearch(value); setPage(1); }} status={status} onStatus={(value) => { setStatus(value); setPage(1); }} statuses={statuses} placeholder="Search companies…" />
      <DataTable head={["Company", "Email", "Location", "Listing", "Status", "Joined", "Actions"]} loading={loading} error={error} empty={!data?.data.length}>
        {data?.data.map((company) => (
          <tr key={company._id} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-900">{company.companyName}</td>
            <td className="px-4 py-3 text-gray-600">{company.email}</td>
            <td className="px-4 py-3 text-gray-600">{[company.listing?.city, company.listing?.state].filter(Boolean).join(", ") || "—"}</td>
            <td className="px-4 py-3 text-gray-700">{company.listing ? (company.listing.isPublished ? "Public" : "Hidden") : "Not published"}</td>
            <td className="px-4 py-3"><StatusBadge value={company.status} /></td>
            <td className="px-4 py-3 text-gray-600">{formatDate(company.createdAt)}</td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                {actions[company.status].map((action) => (
                  <button key={action.label} type="button" disabled={busyId === company._id} onClick={() => change(company._id, company.companyName, action.status)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${action.tone}`}>{action.label}</button>
                ))}
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
      {data && <Pager page={data.page} limit={data.limit} total={data.total} onPage={setPage} />}
    </Panel>
  );
}

export default function AdminCompaniesPage() {
  return (
    <AdminSectionPage title="Company Management" description="Review company accounts, approval status, and public listings.">
      <Suspense fallback={null}><CompaniesManager /></Suspense>
    </AdminSectionPage>
  );
}
