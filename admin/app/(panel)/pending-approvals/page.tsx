"use client";

import Link from "next/link";
import { useState } from "react";
import AdminSectionPage from "@/components/AdminSectionPage";
import { DataTable, Panel, useAdminQuery } from "@/components/AdminData";
import { adminApi, formatDate } from "@/lib/adminApi";

/** Companies awaiting approval and freelancers awaiting verification, with one-click decisions. */
export default function AdminPendingApprovalsPage() {
  const companies = useAdminQuery("pending-companies", () => adminApi.companies({ status: "pending" }));
  const freelancers = useAdminQuery("pending-freelancers", () => adminApi.freelancers({ status: "pending" }));
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const act = async (id: string, action: () => Promise<unknown>, reload: () => Promise<unknown>) => {
    setBusyId(id);
    setError("");
    try { await action(); await reload(); } catch (caught) { setError(caught instanceof Error ? caught.message : "Update failed."); } finally { setBusyId(null); }
  };
  const button = "rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50";

  return (
    <AdminSectionPage title="Pending Approvals" description="New companies and freelancers waiting for an admin decision.">
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <Panel title={`Companies awaiting approval (${companies.data?.total ?? "…"})`}>
        <DataTable head={["Company", "Email", "Joined", "Decision"]} loading={companies.loading} error={companies.error} empty={!companies.data?.data.length}>
          {companies.data?.data.map((company) => (
            <tr key={company._id} className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-900">{company.companyName}</td>
              <td className="px-4 py-3 text-gray-600">{company.email}</td>
              <td className="px-4 py-3 text-gray-600">{formatDate(company.createdAt)}</td>
              <td className="px-4 py-3"><div className="flex gap-2">
                <button type="button" disabled={busyId === company._id} onClick={() => act(company._id, () => adminApi.setCompanyStatus(company._id, "approved"), companies.reload)} className={`${button} bg-emerald-600 text-white`}>Approve</button>
                <button type="button" disabled={busyId === company._id} onClick={() => { if (window.confirm(`Suspend ${company.companyName}? Their listing will be hidden.`)) act(company._id, () => adminApi.setCompanyStatus(company._id, "suspended"), companies.reload); }} className={`${button} border border-red-200 text-red-600`}>Suspend</button>
              </div></td>
            </tr>
          ))}
        </DataTable>
        {(companies.data?.total ?? 0) > (companies.data?.data.length ?? 0) && <Link href="/companies?status=pending" className="mt-3 inline-block text-sm font-semibold text-[#0b1f3b] underline">See all pending companies</Link>}
      </Panel>

      <Panel title={`Freelancers awaiting verification (${freelancers.data?.total ?? "…"})`}>
        <DataTable head={["Freelancer", "Email", "Joined", "Decision"]} loading={freelancers.loading} error={freelancers.error} empty={!freelancers.data?.data.length}>
          {freelancers.data?.data.map((freelancer) => (
            <tr key={freelancer._id} className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-900">{freelancer.listing?.displayName || freelancer.name}</td>
              <td className="px-4 py-3 text-gray-600">{freelancer.email}</td>
              <td className="px-4 py-3 text-gray-600">{formatDate(freelancer.createdAt)}</td>
              <td className="px-4 py-3"><div className="flex gap-2">
                <button type="button" disabled={busyId === freelancer._id} onClick={() => act(freelancer._id, () => adminApi.setFreelancerStatus(freelancer._id, "verified"), freelancers.reload)} className={`${button} bg-emerald-600 text-white`}>Verify</button>
                <button type="button" disabled={busyId === freelancer._id} onClick={() => act(freelancer._id, () => adminApi.setFreelancerStatus(freelancer._id, "rejected"), freelancers.reload)} className={`${button} border border-red-200 text-red-600`}>Reject</button>
              </div></td>
            </tr>
          ))}
        </DataTable>
        {(freelancers.data?.total ?? 0) > (freelancers.data?.data.length ?? 0) && <Link href="/freelancers?status=pending" className="mt-3 inline-block text-sm font-semibold text-[#0b1f3b] underline">See all pending freelancers</Link>}
      </Panel>
    </AdminSectionPage>
  );
}
