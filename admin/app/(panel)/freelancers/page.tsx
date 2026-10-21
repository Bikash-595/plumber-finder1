"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminSectionPage from "@/components/AdminSectionPage";
import { DataTable, FilterBar, Pager, Panel, StatusBadge, useAdminQuery } from "@/components/AdminData";
import { adminApi, formatDate, type FreelancerStatus } from "@/lib/adminApi";

const statuses = [{ value: "all", label: "All" }, { value: "pending", label: "Pending" }, { value: "verified", label: "Verified" }, { value: "rejected", label: "Rejected" }];
const actions: Record<FreelancerStatus, { label: string; status: FreelancerStatus; tone: string }[]> = {
  pending: [{ label: "Verify", status: "verified", tone: "bg-emerald-600 text-white" }, { label: "Reject", status: "rejected", tone: "border border-red-200 text-red-600" }],
  verified: [{ label: "Revoke", status: "pending", tone: "border border-gray-300 text-gray-700" }],
  rejected: [{ label: "Verify", status: "verified", tone: "bg-emerald-600 text-white" }],
};

function FreelancersManager() {
  const params = useSearchParams();
  const initial = params.get("status") ?? params.get("tab");
  const [status, setStatus] = useState(statuses.some((s) => s.value === initial) ? initial! : "all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { data, error, setError, loading, reload } = useAdminQuery(`freelancers|${status}|${search}|${page}`, () => adminApi.freelancers({ status: status === "all" ? undefined : status, search, page }));

  const change = async (id: string, next: FreelancerStatus) => {
    setBusyId(id);
    try { await adminApi.setFreelancerStatus(id, next); await reload(); } catch (caught) { setError(caught instanceof Error ? caught.message : "Update failed."); } finally { setBusyId(null); }
  };

  return (
    <Panel title="Freelancers" description="Verify freelance plumbers after checking their licence and insurance.">
      <FilterBar search={search} onSearch={(value) => { setSearch(value); setPage(1); }} status={status} onStatus={(value) => { setStatus(value); setPage(1); }} statuses={statuses} placeholder="Search freelancers…" />
      <DataTable head={["Name", "Email", "Trade", "Location", "Directory", "Verification", "Joined", "Actions"]} loading={loading} error={error} empty={!data?.data.length}>
        {data?.data.map((freelancer) => (
          <tr key={freelancer._id} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3 font-medium text-gray-900">{freelancer.listing?.displayName || freelancer.name}</td>
            <td className="px-4 py-3 text-gray-600">{freelancer.email}</td>
            <td className="px-4 py-3 text-gray-600">{freelancer.listing?.headline || "—"}</td>
            <td className="px-4 py-3 text-gray-600">{[freelancer.listing?.city, freelancer.listing?.state].filter(Boolean).join(", ") || "—"}</td>
            <td className="px-4 py-3 text-gray-700">{freelancer.listing ? (freelancer.listing.isPublished ? "Listed" : "Hidden") : "No profile yet"}</td>
            <td className="px-4 py-3"><StatusBadge value={freelancer.verificationStatus} /></td>
            <td className="px-4 py-3 text-gray-600">{formatDate(freelancer.createdAt)}</td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                {actions[freelancer.verificationStatus].map((action) => (
                  <button key={action.label} type="button" disabled={busyId === freelancer._id} onClick={() => change(freelancer._id, action.status)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${action.tone}`}>{action.label}</button>
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

export default function AdminFreelancersPage() {
  return (
    <AdminSectionPage title="Freelancer Management" description="Review freelance plumbers, their directory profiles, and verification.">
      <Suspense fallback={null}><FreelancersManager /></Suspense>
    </AdminSectionPage>
  );
}
