"use client";

import { useAdminQuery } from "@/components/AdminData";
import { adminApi, type ReviewHistory } from "@/lib/adminApi";
import { reasonLabels, actionLabels, when } from "./reviewLabels";

/** Everything that happened to a review: the audit log, its reports, and the review requests for its booking. */
export function History({ id }: { id: string }) {
  const { data, error, loading } = useAdminQuery(`review-history|${id}`, () => adminApi.reviewHistory(id));
  if (loading && !data) return <p className="mt-3 text-xs text-gray-500">Loading history…</p>;
  if (error) return <p className="mt-3 text-xs text-red-600">{error}</p>;
  const history: ReviewHistory | undefined = data?.data;
  if (!history) return null;
  return (
    <div className="mt-3 grid gap-4 rounded-xl bg-gray-50 p-3 text-xs md:grid-cols-2">
      <div>
        <p className="font-bold uppercase tracking-wide text-gray-500">Audit log</p>
        <ol className="mt-2 space-y-1.5">{history.audits.map((entry) => (
          <li key={entry._id}><span className="font-semibold text-gray-900">{actionLabels[entry.action] ?? entry.action}</span> <span className="text-gray-500">· {entry.actor.type} · {when(entry.createdAt)}</span>
            {entry.reason && <span className="block text-gray-600">“{entry.reason}”</span>}
            {entry.action === "edited" && entry.snapshot && <span className="block text-gray-500">Now: {entry.snapshot.rating}★ {entry.snapshot.title}</span>}
          </li>
        ))}</ol>
      </div>
      <div className="space-y-3">
        {history.reports.length > 0 && (
          <div><p className="font-bold uppercase tracking-wide text-gray-500">Reports</p>
            <ul className="mt-2 space-y-1">{history.reports.map((r) => <li key={r._id}>{reasonLabels[r.reason] ?? r.reason} · by {r.reporter.type} · {when(r.createdAt)}{r.details ? ` — “${r.details}”` : ""}{r.resolved ? <span className="text-emerald-700"> · resolved{r.adminAction ? ` (${r.adminAction})` : ""}</span> : ""}</li>)}</ul>
          </div>
        )}
        {history.requests.length > 0 && (
          <div><p className="font-bold uppercase tracking-wide text-gray-500">Review requests for the booking</p>
            <ul className="mt-2 space-y-1">{history.requests.map((r) => <li key={r._id}>{r.kind.replace("_", " ")} · <span className="font-semibold">{r.status}</span> · {r.sentAt ? `sent ${when(r.sentAt)}` : `due ${when(r.scheduledAt)}`}{r.emailed ? " · emailed" : ""}{r.cancelReason ? ` · ${r.cancelReason}` : ""}{r.lastError ? ` · ${r.lastError}` : ""}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}
