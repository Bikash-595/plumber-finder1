"use client";

import { useState } from "react";
import { FaCheckCircle, FaHistory, FaStar } from "react-icons/fa";
import AdminSectionPage from "@/components/AdminSectionPage";
import { Pager, Panel, StatusBadge, useAdminQuery } from "@/components/AdminData";
import { adminApi, formatDate, type ModerationReview, type ReviewHistory, type ReviewStatus } from "@/lib/adminApi";

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
const tabs = [{ value: "pending", label: "Held for review" }, { value: "reported", label: "Reported" }, { value: "published", label: "Live" }, { value: "hidden", label: "Hidden" }, { value: "rejected", label: "Rejected" }, { value: "all", label: "All" }];
const statusLabels: Record<ReviewStatus, string> = { published: "Live", pending: "Held", hidden: "Hidden", rejected: "Rejected" };
const badge: Record<ReviewStatus, string> = { published: "completed", pending: "pending", hidden: "cancelled", rejected: "declined" };
const reasonLabels: Record<string, string> = { spam: "Spam", fake: "Fake", offensive: "Offensive", not_relevant: "Not relevant", personal_info: "Personal info", other: "Other" };
const actionLabels: Record<string, string> = { created: "Written", edited: "Edited by the customer", deleted: "Deleted by the customer", held: "Held for moderation", published: "Published", hidden: "Hidden", rejected: "Rejected", reply: "Plumber replied", reply_deleted: "Plumber deleted their reply", reported: "Reported" };
const field = "rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FFD60A]";
const when = (value?: string) => (value ? new Date(value).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) : "—");

/** Everything that happened to a review: the audit log, its reports, and the review requests for its booking. */
function History({ id }: { id: string }) {
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

function ReviewRow({ review, onDone }: { review: ModerationReview; onDone: (text: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [acting, setActing] = useState<"published" | "hidden" | "rejected" | null>(null);
  const [reason, setReason] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const submit = async () => {
    if (!acting) return;
    if (acting !== "published" && reason.trim().length < 3) return setError("Give a reason — the reviewer will see it.");
    setBusy(true);
    setError("");
    try { onDone((await adminApi.moderateReview(review._id, acting, reason.trim() || undefined)).message); setActing(null); } catch (caught) { setError(caught instanceof Error ? caught.message : "Failed."); } finally { setBusy(false); }
  };
  const choices = ([["published", "Publish", "bg-emerald-600 text-white"], ["hidden", "Hide", "border border-red-200 text-red-600"], ["rejected", "Reject", "border border-gray-300 text-gray-700"]] as const)
    .filter(([status]) => status !== review.status && (status !== "rejected" || review.status === "pending"));
  return (
    <li className="py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2">
            <span className="inline-flex text-[#FFD60A]">{[1, 2, 3, 4, 5].map((n) => <FaStar key={n} className={`h-3.5 w-3.5 ${n <= review.rating ? "" : "text-gray-200"}`} />)}</span>
            {review.title && <span className="font-semibold text-gray-900">{review.title}</span>}
            <StatusBadge value={badge[review.status]} label={statusLabels[review.status]} />
            {review.source === "verified_booking" ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700"><FaCheckCircle className="h-2.5 w-2.5" /> Verified booking{review.bookingReference ? ` ${review.bookingReference}` : ""}</span> : <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-[11px] font-bold text-yellow-800">Directory</span>}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">{review.user?.name ?? review.userName} ({review.user?.email ?? "deleted account"}) → <a href={`${FRONTEND_URL}/plumber/${review.providerId}#reviews`} target="_blank" rel="noreferrer" className="font-semibold text-[#0b1f3b] underline">{review.providerName ?? review.providerId}</a> <span className="capitalize">({review.providerType})</span> · {formatDate(review.createdAt)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {choices.map(([status, label, tone]) => <button key={status} type="button" disabled={busy} onClick={() => { setActing(status); setReason(""); setError(""); }} className={`rounded-lg px-3 py-1.5 text-xs font-bold disabled:opacity-50 ${tone} ${acting === status ? "ring-2 ring-[#FFD60A]" : ""}`}>{label}</button>)}
          <button type="button" onClick={() => setShowHistory(!showHistory)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100"><FaHistory className="h-3 w-3" /> History</button>
        </div>
      </div>
      <p className="mt-2 whitespace-pre-line text-sm text-gray-700">{review.body}</p>
      {review.moderation?.reason && <p className="mt-1 text-xs text-gray-500">Moderation: {review.moderation.reason} ({review.moderation.by})</p>}
      {review.reports.length > 0 && <ul className="mt-2 flex flex-wrap gap-1.5">{review.reports.map((report, i) => <li key={i} className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${report.resolved ? "bg-gray-100 text-gray-500" : "bg-red-50 text-red-700"}`} title={report.details}>{reasonLabels[report.reason] ?? report.reason} · by {report.by}</li>)}</ul>}
      {acting && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 p-2">
          <input value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} placeholder={acting === "published" ? "Note (optional), e.g. Reports checked" : "Reason (required) — the reviewer will see it"} aria-label="Moderation reason" className={`${field} min-w-60 flex-1`} />
          <button type="button" disabled={busy} onClick={submit} className="rounded-lg bg-[#0b1f3b] px-3 py-2 text-xs font-bold text-white disabled:opacity-50">{busy ? "Saving…" : `Confirm ${acting === "published" ? "publish" : acting === "hidden" ? "hide" : "reject"}`}</button>
          <button type="button" onClick={() => setActing(null)} className="text-xs font-semibold text-gray-600">Cancel</button>
        </div>
      )}
      {error && <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}
      {showHistory && <History id={review._id} />}
    </li>
  );
}

function ReviewsManager() {
  const [status, setStatus] = useState("pending");
  const [filters, setFilters] = useState({ search: "", source: "", providerType: "", rating: "", from: "", to: "" });
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState("");
  const set = (change: Partial<typeof filters>) => { setFilters((current) => ({ ...current, ...change })); setPage(1); };
  const key = `reviews|${status}|${Object.values(filters).join("|")}|${page}`;
  const { data, error, loading, reload } = useAdminQuery(key, () => adminApi.reviews({ status: status === "all" ? undefined : status, ...filters, page }));
  return (
    <Panel title="PlumberFinder reviews" description="Reviews with links, flagged words or text copied from another customer — and reviews reported by three people — are held here. Every decision needs a reason, is logged, and is sent to the reviewer. Ratings and text are never edited. Google reviews aren't stored here.">
      <div className="mb-4 flex flex-wrap gap-2" role="tablist">
        {tabs.map((tab) => (
          <button key={tab.value} type="button" role="tab" aria-selected={status === tab.value} onClick={() => { setStatus(tab.value); setPage(1); }} className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${status === tab.value ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
            {tab.label}{data?.counts && tab.value !== "all" && <span className="ml-1 text-xs opacity-70">{data.counts[tab.value] ?? 0}</span>}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <input value={filters.search} onChange={(e) => set({ search: e.target.value })} placeholder="Search text, customer, plumber, booking…" aria-label="Search reviews" className={`${field} w-full sm:w-72`} />
        <select value={filters.source} onChange={(e) => set({ source: e.target.value })} aria-label="Source" className={field}><option value="">All sources</option><option value="verified_booking">Verified bookings</option><option value="directory">Directory</option></select>
        <select value={filters.providerType} onChange={(e) => set({ providerType: e.target.value })} aria-label="Plumber type" className={field}><option value="">Companies & freelancers</option><option value="company">Companies</option><option value="freelancer">Freelancers</option></select>
        <select value={filters.rating} onChange={(e) => set({ rating: e.target.value })} aria-label="Stars" className={field}><option value="">All stars</option>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}</select>
        <label className="flex items-center gap-1 text-xs text-gray-600">From<input type="date" value={filters.from} onChange={(e) => set({ from: e.target.value })} className={field} /></label>
        <label className="flex items-center gap-1 text-xs text-gray-600">To<input type="date" value={filters.to} onChange={(e) => set({ to: e.target.value })} className={field} /></label>
      </div>
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
    <AdminSectionPage title="Reviews" description="Moderate PlumberFinder reviews (directory and verified bookings): approve held reviews, hide or reject ones that break the rules, and see each review's full history.">
      <ReviewsManager />
    </AdminSectionPage>
  );
}
