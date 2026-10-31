"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa";
import AdminSectionPage from "@/components/AdminSectionPage";
import { Pager, Panel, StatusBadge, useAdminQuery } from "@/components/AdminData";
import { adminApi, formatDate, type ModerationReview } from "@/lib/adminApi";

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
const tabs = [{ value: "pending", label: "Held for review" }, { value: "reported", label: "Reported" }, { value: "published", label: "Live" }, { value: "hidden", label: "Removed" }, { value: "all", label: "All" }];
const statusLabels = { published: "Live", pending: "Held", hidden: "Removed" };
const reasonLabels: Record<string, string> = { spam: "Spam", fake: "Fake", offensive: "Offensive", not_relevant: "Not relevant", personal_info: "Personal info", other: "Other" };

function ReviewRow({ review, onDone }: { review: ModerationReview; onDone: (text: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const act = async (status: "published" | "hidden") => {
    const reason = status === "hidden" ? window.prompt("Why is this review being removed? (kept for the record)", "Breaks the review rules") : undefined;
    if (status === "hidden" && reason === null) return;
    setBusy(true);
    try { onDone((await adminApi.moderateReview(review._id, status, reason ?? undefined)).message); } catch (caught) { setError(caught instanceof Error ? caught.message : "Failed."); } finally { setBusy(false); }
  };
  return (
    <li className="py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2"><span className="inline-flex text-[#FFD60A]">{[1, 2, 3, 4, 5].map((n) => <FaStar key={n} className={`h-3.5 w-3.5 ${n <= review.rating ? "" : "text-gray-200"}`} />)}</span><span className="font-semibold text-gray-900">{review.title}</span><StatusBadge value={review.status === "published" ? "completed" : review.status === "pending" ? "pending" : "cancelled"} label={statusLabels[review.status]} /></p>
          <p className="mt-0.5 text-xs text-gray-500">{review.user?.name ?? review.userName} ({review.user?.email ?? "deleted account"}) → <a href={`${FRONTEND_URL}/plumber/${review.providerId}#reviews`} target="_blank" rel="noreferrer" className="font-semibold text-[#0b1f3b] underline">{review.providerName ?? review.providerId}</a> · {formatDate(review.createdAt)}{review.verified ? " · verified booking" : ""}</p>
        </div>
        <div className="flex gap-2">
          {review.status !== "published" && <button type="button" disabled={busy} onClick={() => act("published")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50">Publish</button>}
          {review.status !== "hidden" && <button type="button" disabled={busy} onClick={() => act("hidden")} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 disabled:opacity-50">Remove</button>}
        </div>
      </div>
      <p className="mt-2 whitespace-pre-line text-sm text-gray-700">{review.body}</p>
      {review.moderation?.reason && <p className="mt-1 text-xs text-gray-500">Moderation: {review.moderation.reason} ({review.moderation.by})</p>}
      {review.reports.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5">{review.reports.map((report, i) => <li key={i} className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700" title={report.details}>{reasonLabels[report.reason] ?? report.reason} · by {report.by}</li>)}</ul>
      )}
      {error && <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}
    </li>
  );
}

function ReviewsManager() {
  const [status, setStatus] = useState("pending");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState("");
  const { data, error, loading, reload } = useAdminQuery(`reviews|${status}|${search}|${page}`, () => adminApi.reviews({ status: status === "all" ? undefined : status, search, page }));
  return (
    <Panel title="PlumberFinder reviews" description="Reviews with links or flagged words, and reviews reported by three people, are held here until you publish or remove them. Google reviews aren't stored on PlumberFinder, so they don't appear here.">
      <div className="mb-4 flex flex-wrap gap-2" role="tablist">
        {tabs.map((tab) => (
          <button key={tab.value} type="button" role="tab" aria-selected={status === tab.value} onClick={() => { setStatus(tab.value); setPage(1); }} className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${status === tab.value ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
            {tab.label}{data?.counts && tab.value !== "all" && <span className="ml-1 text-xs opacity-70">{data.counts[tab.value] ?? 0}</span>}
          </button>
        ))}
      </div>
      <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search title, text, customer, plumber…" aria-label="Search reviews" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FFD60A] sm:w-80" />
      {notice && <p role="status" className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p>}
      {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {loading && !data && <p className="py-6 text-center text-sm text-gray-500">Loading…</p>}
      {data && data.data.length === 0 && <p className="mt-4 rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">Nothing here.</p>}
      <ul className="divide-y divide-gray-100">{data?.data.map((review) => <ReviewRow key={review._id} review={review} onDone={(text) => { setNotice(text); reload(); }} />)}</ul>
      {data && <Pager page={data.page} limit={data.limit} total={data.total} onPage={setPage} />}
    </Panel>
  );
}

export default function AdminReviewsPage() {
  return (
    <AdminSectionPage title="Reviews" description="Moderate PlumberFinder reviews: approve held reviews and remove ones that break the rules.">
      <ReviewsManager />
    </AdminSectionPage>
  );
}
