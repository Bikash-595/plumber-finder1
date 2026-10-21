"use client";

import { useState } from "react";
import AdminSectionPage from "@/components/AdminSectionPage";
import { DataTable, Panel, StatusBadge, useAdminQuery } from "@/components/AdminData";
import { adminApi, formatDate } from "@/lib/adminApi";

const ranges = [7, 30, 90];

/** Newest customer, company, and freelancer signups in one list. */
export default function AdminNewRegistrationsPage() {
  const [days, setDays] = useState(30);
  const [type, setType] = useState<"all" | "user" | "company" | "freelancer">("all");
  const { data, error, loading } = useAdminQuery(`registrations|${days}`, () => adminApi.registrations(days));
  const rows = (data?.data ?? []).filter((row) => type === "all" || row.accountType === type);
  const count = (accountType: string) => (data?.data ?? []).filter((row) => row.accountType === accountType).length;

  return (
    <AdminSectionPage title="New Registrations" description="The latest account signups across customers, companies, and freelancers.">
      <Panel title={`Signups in the last ${days} days (${data?.data.length ?? "…"})`}>
        <div className="flex flex-wrap gap-2">
          {ranges.map((range) => (
            <button key={range} type="button" aria-pressed={days === range} onClick={() => setDays(range)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${days === range ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 bg-white text-gray-700"}`}>{range} days</button>
          ))}
          <span className="mx-1 w-px bg-gray-200" aria-hidden />
          {(["all", "user", "company", "freelancer"] as const).map((option) => (
            <button key={option} type="button" aria-pressed={type === option} onClick={() => setType(option)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${type === option ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 bg-white text-gray-700"}`}>
              {option === "all" ? "All types" : `${option}s (${count(option)})`}
            </button>
          ))}
        </div>
        <DataTable head={["Name", "Email", "Type", "Status", "Joined"]} loading={loading} error={error} empty={!rows.length}>
          {rows.map((row) => (
            <tr key={`${row.accountType}-${row._id}`} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
              <td className="px-4 py-3 text-gray-600">{row.email}</td>
              <td className="px-4 py-3"><StatusBadge value={row.accountType} /></td>
              <td className="px-4 py-3">{row.status ? <StatusBadge value={row.status} /> : <span className="text-gray-400">—</span>}</td>
              <td className="px-4 py-3 text-gray-600">{formatDate(row.createdAt)}</td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </AdminSectionPage>
  );
}
