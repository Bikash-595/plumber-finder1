"use client";

import { useState } from "react";
import { FaCheckCircle, FaHistory, FaStar } from "react-icons/fa";
import { StatusBadge } from "@/components/AdminData";
import { adminApi, formatDate, type ModerationReview } from "@/lib/adminApi";
import { History } from "./ReviewHistory";
import { FRONTEND_URL, statusLabels, badge, reasonLabels, field } from "./reviewLabels";

export default function ReviewRow({ review, onDone }: { review: ModerationReview; onDone: (text: string) => void }) {
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
