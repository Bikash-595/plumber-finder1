"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { DataTable, Pager, Panel, StatusBadge, useAdminQuery } from "@/components/AdminData";
import { adminApi, formatDate, type AdminSubscription } from "@/lib/adminApi";
import ActivateDialog from "./ActivateDialog";
import PremiumSummary from "./PremiumSummary";

const tabs = [{ value: "", label: "All" }, { value: "pending", label: "Requests" }, { value: "active", label: "Active" }, { value: "past_due", label: "Payment failed" }, { value: "canceled", label: "Ending" }, { value: "expired", label: "Ended" }];

/** Premium requests and plans for companies and freelancers: activate after payment, extend, or end. */
export default function PremiumManager() {
  const params = useSearchParams();
  const [status, setStatus] = useState(tabs.some((tab) => tab.value === params.get("status")) ? params.get("status")! : "");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [activating, setActivating] = useState<AdminSubscription | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const { data, error, setError, loading, reload } = useAdminQuery(`premium|${status}|${type}|${page}`, () => adminApi.premium({ status: status || undefined, type: type || undefined, page }));

  const act = async (action: () => Promise<{ message: string }>) => {
    setBusy(true);
    setMessage("");
    try { setMessage((await action()).message); setActivating(null); await reload(); } catch (caught) { setError(caught instanceof Error ? caught.message : "Update failed."); } finally { setBusy(false); }
  };
  const end = (row: AdminSubscription) => {
    const note = window.prompt(row.status === "pending" ? `Decline ${row.name ?? "this"} request? Reason (shown to them):` : `End premium for ${row.name ?? "this account"} now? Reason (shown to them):`);
    if (note !== null) act(() => adminApi.cancelPremium(row.id, note.trim() || undefined));
  };

  return (
    <div className="space-y-5">
      {data && <PremiumSummary data={data} />}
      {data && !data.stripe && <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">Card payments are off (no Stripe keys). Businesses send requests; activate them here after payment is received.</p>}
      {message && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>}
      <Panel title="Premium plans" description="Companies and freelancers paying for a badge and a higher directory position.">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {tabs.map((tab) => (
            <button key={tab.value} type="button" onClick={() => { setStatus(tab.value); setPage(1); }} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status === tab.value ? "bg-[#0b1f3b] text-white" : "border border-gray-200 text-gray-700"}`}>
              {tab.label}{data && tab.value ? ` (${data.counts[tab.value as keyof typeof data.counts] ?? 0})` : ""}
            </button>
          ))}
          <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} aria-label="Account type" className="ml-auto rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold">
            <option value="">Companies and freelancers</option><option value="company">Companies</option><option value="freelancer">Freelancers</option>
          </select>
        </div>
        <DataTable head={["Account", "Plan", "Status", "Paid until", "Payment", "Updated", "Actions"]} loading={loading} error={error} empty={!data?.data.length}>
          {data?.data.map((row) => (
            <tr key={row.id} className="border-b border-gray-100 align-top hover:bg-gray-50">
              <td className="px-4 py-3">
                <p className="font-medium text-gray-900">{row.name ?? row.accountName ?? "—"}</p>
                <p className="text-xs text-gray-500">{row.providerType} · {row.email}</p>
                {row.requestNote && <p className="mt-1 max-w-xs text-xs italic text-gray-600">“{row.requestNote}”</p>}
              </td>
              <td className="px-4 py-3 text-gray-700">{row.planName} <span className="text-xs text-gray-500">({row.interval === "year" ? "yearly" : "monthly"})</span></td>
              <td className="px-4 py-3"><StatusBadge value={row.status} label={row.cancelAtPeriodEnd && row.active ? "ending" : undefined} /></td>
              <td className="px-4 py-3 text-gray-600">{row.currentPeriodEnd ? formatDate(row.currentPeriodEnd) : "—"}</td>
              <td className="px-4 py-3 text-gray-600">{row.source === "stripe" ? "Card (Stripe)" : "Offline"}</td>
              <td className="px-4 py-3 text-gray-600">{row.history[0] ? formatDate(row.history[0].at) : formatDate(row.createdAt)}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {!(row.source === "stripe" && row.active) && <button type="button" disabled={busy} onClick={() => setActivating(row)} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">{row.active ? "Extend" : "Activate"}</button>}
                  {row.status !== "expired" && <button type="button" disabled={busy} onClick={() => end(row)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-50">{row.status === "pending" ? "Decline" : "End now"}</button>}
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
        {data && <Pager page={data.page} limit={data.limit} total={data.total} onPage={setPage} />}
      </Panel>
      {activating && <ActivateDialog subscription={activating} busy={busy} onSubmit={(body) => act(() => adminApi.activatePremium(activating.id, body))} onClose={() => setActivating(null)} />}
    </div>
  );
}
