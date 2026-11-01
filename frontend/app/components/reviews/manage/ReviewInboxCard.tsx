"use client";

import { useState } from "react";
import { FaFlag, FaReply } from "react-icons/fa";
import { apiRequest } from "@/components/utils/apiClient";
import SourceBadge from "../SourceBadge";
import { Stars } from "../Stars";
import { formatReviewDate, REPORT_REASONS } from "../reviewsApi";
import { inboxField, type InboxReview, type ProviderBase } from "./types";

const statusBadge = { published: "bg-emerald-50 text-emerald-700", pending: "bg-amber-50 text-amber-800", hidden: "bg-red-50 text-red-700", rejected: "bg-red-50 text-red-700" };
const statusText = { published: "Live", pending: "Being checked", hidden: "Removed by moderators", rejected: "Not published" };

/** One review in the provider's inbox: the customer's words (read-only), its status, and the public reply. */
export default function ReviewInboxCard({ review, base, onChanged }: { review: InboxReview; base: ProviderBase; onChanged: (text: string) => void }) {
  const [replying, setReplying] = useState(false);
  const [text, setText] = useState(review.reply?.body ?? "");
  const [reporting, setReporting] = useState(false);
  const [reason, setReason] = useState("fake");
  const [error, setError] = useState("");
  const call = async (path: string, method: string, body?: unknown) => {
    setError("");
    try { const { message } = await apiRequest(`${base}/reviews/${review._id}${path}`, { method, body }); onChanged(message ?? "Saved."); return true; } catch (caught) { setError(caught instanceof Error ? caught.message : "Something went wrong."); return false; }
  };
  return (
    <li className="py-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2"><Stars value={review.rating} />{review.title && <span className="font-semibold text-gray-900">{review.title}</span>}</div>
          <p className="mt-0.5 text-xs text-gray-500">{review.author.name} · {formatReviewDate(review.createdAt)}{review.edited ? " · edited" : ""}{review.serviceCategory ? ` · ${review.serviceCategory}` : ""}{review.bookingReference ? ` · booking ${review.bookingReference}` : ""}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <SourceBadge source={review.source} />
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${statusBadge[review.status]}`}>{statusText[review.status]}</span>
          {review.reportCount > 0 && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-600" title={review.reportReasons.join(", ")}>Reported {review.reportCount}×</span>}
        </div>
      </div>
      {review.moderation?.reason && review.status !== "published" && <p className="mt-1 text-xs text-gray-500">Reason: {review.moderation.reason}</p>}
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">{review.body}</p>
      {review.photos.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {review.photos.map((photo, i) => (
            // eslint-disable-next-line @next/next/no-img-element -- customer uploads are data URLs
            <img key={i} src={photo} alt="" loading="lazy" className="h-16 w-24 rounded-lg object-cover" />
          ))}
        </div>
      )}

      {review.reply && !replying ? (
        <div className="mt-3 rounded-xl border-l-4 border-[#FFD60A] bg-gray-50 p-3 text-sm">
          <p className="font-semibold text-gray-900">Your public reply</p>
          <p className="mt-1 whitespace-pre-line text-gray-700">{review.reply.body}</p>
          <div className="mt-2 flex gap-3 text-xs font-semibold"><button type="button" onClick={() => { setReplying(true); setText(review.reply!.body); }} className="text-[#0b1f3b] hover:underline">Edit reply</button><button type="button" onClick={() => { if (window.confirm("Delete your reply?")) call("/reply", "DELETE"); }} className="text-red-600 hover:underline">Delete reply</button></div>
        </div>
      ) : replying ? (
        <div className="mt-3 space-y-2">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} maxLength={1500} placeholder={`Reply publicly to ${review.author.name.split(" ")[0]}…`} aria-label="Your public reply" className={inboxField} />
          <div className="flex gap-2"><button type="button" disabled={text.trim().length < 2} onClick={async () => { if (await call("/reply", review.reply ? "PUT" : "POST", { body: text })) setReplying(false); }} className="rounded-xl bg-[#0b1f3b] px-4 py-2 text-xs font-bold text-white disabled:opacity-40">{review.reply ? "Save reply" : "Post reply"}</button><button type="button" onClick={() => setReplying(false)} className="rounded-xl px-3 py-2 text-xs font-semibold text-gray-600">Cancel</button></div>
        </div>
      ) : review.status === "published" && (
        <button type="button" onClick={() => setReplying(true)} className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50"><FaReply className="h-3 w-3" aria-hidden /> Reply publicly</button>
      )}
      {review.status === "published" && (reporting ? (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <select value={reason} onChange={(e) => setReason(e.target.value)} aria-label="Why are you reporting this review?" className="rounded-lg border border-gray-200 bg-white px-2 py-1">{REPORT_REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}</select>
          <button type="button" onClick={async () => { if (await call("/report", "POST", { reason })) setReporting(false); }} className="rounded-lg bg-red-600 px-2.5 py-1 font-bold text-white">Report to moderators</button>
          <button type="button" onClick={() => setReporting(false)} className="font-semibold text-gray-600">Cancel</button>
        </div>
      ) : <button type="button" onClick={() => setReporting(true)} className="ml-3 mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-red-600"><FaFlag className="h-2.5 w-2.5" aria-hidden /> Report</button>)}
      {error && <p role="alert" className="mt-2 text-xs font-medium text-red-600">{error}</p>}
    </li>
  );
}
