"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { FaCheckCircle, FaExternalLinkAlt, FaFlag, FaGoogle, FaReply, FaSearch } from "react-icons/fa";
import { apiRequest } from "@/components/utils/apiClient";
import { Stars } from "./Stars";
import { formatReviewDate, REPORT_REASONS, type GoogleSummary, type PFReview, type ReviewSummary } from "./reviewsApi";

type Base = "/companies" | "/freelancers";
type InboxReview = PFReview & { status: "published" | "pending" | "hidden"; moderation?: { reason?: string; by?: string }; reportCount: number; reportReasons: string[] };
type Inbox = { data: InboxReview[]; total: number; page: number; limit: number; summary: ReviewSummary & { byStatus: Record<string, number>; unanswered: number }; listingId: string | null };
type Candidate = { placeId: string; name?: string; address?: string; rating: number | null; userRatingCount: number };

const field = "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";
const statusBadge = { published: "bg-emerald-50 text-emerald-700", pending: "bg-amber-50 text-amber-800", hidden: "bg-red-50 text-red-700" };
const statusText = { published: "Live", pending: "Held for moderation", hidden: "Removed by moderators" };
const googleReason: Record<string, string> = {
  not_connected: "Add your Google Business Profile link so customers can read and write your Google reviews.",
  no_place_id: "Your Google link is saved. Add your Google Place ID to also show your Google rating and reviews here.",
  api_not_configured: "Your Google link is saved. Showing Google ratings and review text needs the site's Google Places API key; until then customers get your Read/Write Google Review buttons.",
  google_error: "Google didn't return your reviews just now — check the Place ID or try Refresh later.",
};

/** Google Business Profile: the link, the Place ID (or find it), and what customers will see. */
function GoogleSettings({ base }: { base: Base }) {
  const [summary, setSummary] = useState<GoogleSummary | null>(null);
  const [profileUrl, setProfileUrl] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const apply = (data: GoogleSummary) => { setSummary(data); setProfileUrl(data.profileUrl ?? ""); setPlaceId(data.placeId ?? ""); };
  useEffect(() => { apiRequest<GoogleSummary>(`${base}/reviews/google`).then(({ data }) => apply(data)).catch((caught: Error) => setMessage({ tone: "error", text: caught.message })); }, [base]);

  const save = async (event?: FormEvent, clear = false) => {
    event?.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const { data, message: text } = await apiRequest<GoogleSummary>(`${base}/reviews/google`, { method: "PUT", body: clear ? {} : { profileUrl, placeId } });
      apply(data);
      setMessage({ tone: "ok", text: text ?? "Saved." });
    } catch (caught) { setMessage({ tone: "error", text: caught instanceof Error ? caught.message : "Could not save." }); } finally { setBusy(false); }
  };
  const search = async () => {
    setBusy(true);
    try { setCandidates((await apiRequest<Candidate[]>(`${base}/reviews/google/search`, { method: "POST", body: { query } })).data); } catch (caught) { setMessage({ tone: "error", text: caught instanceof Error ? caught.message : "Search failed." }); } finally { setBusy(false); }
  };
  const refresh = async () => {
    setBusy(true);
    try { apply((await apiRequest<GoogleSummary>(`${base}/reviews/google/refresh`, { method: "POST" })).data); setMessage({ tone: "ok", text: "Fetched the latest from Google." }); } catch (caught) { setMessage({ tone: "error", text: caught instanceof Error ? caught.message : "Refresh failed." }); } finally { setBusy(false); }
  };

  return (
    <section className="rounded-2xl border border-gray-200 p-4 sm:p-5" aria-labelledby="google-settings">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="google-settings" className="flex items-center gap-2 text-base font-bold text-gray-900"><FaGoogle className="text-[#4285F4]" aria-hidden /> Google Business Profile</h2>
          <p className="mt-0.5 text-sm text-gray-500">Your Google reviews show on your profile next to — never mixed with — your PlumberFinder reviews.</p>
        </div>
        {summary?.available && <div className="text-right"><p className="text-2xl font-extrabold text-gray-900">{summary.rating?.toFixed(1)}</p><Stars value={summary.rating ?? 0} size="h-3 w-3" /><p className="text-xs text-gray-500">{summary.count} on Google</p></div>}
      </div>
      {summary && !summary.available && summary.reason && <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">{googleReason[summary.reason]}{summary.error ? ` (${summary.error})` : ""}</p>}
      <form onSubmit={save} className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="text-sm font-semibold text-gray-700">Google Business Profile or Google Maps link
          <input value={profileUrl} onChange={(e) => setProfileUrl(e.target.value)} placeholder="https://maps.app.goo.gl/…" className={`${field} mt-1`} />
        </label>
        <label className="text-sm font-semibold text-gray-700">Google Place ID <span className="font-normal text-gray-400">(optional)</span>
          <input value={placeId} onChange={(e) => setPlaceId(e.target.value.trim())} placeholder="ChIJ…" className={`${field} mt-1 font-mono`} />
          <a href="https://developers.google.com/maps/documentation/places/web-service/place-id" target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-normal text-[#1a73e8] hover:underline">Find your Place ID <FaExternalLinkAlt className="h-2 w-2" aria-hidden /></a>
        </label>
        <div className="flex flex-wrap gap-2 md:col-span-2">
          <button type="submit" disabled={busy} className="rounded-xl bg-[#0b1f3b] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">{busy ? "Saving…" : "Save"}</button>
          {summary?.connected && summary.placeId && summary.apiConfigured && <button type="button" onClick={refresh} disabled={busy} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-60">Refresh from Google</button>}
          {summary?.connected && <button type="button" onClick={() => { if (window.confirm("Remove your Google Business Profile from PlumberFinder?")) save(undefined, true); }} disabled={busy} className="rounded-xl px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Remove</button>}
          {summary?.readUrl && <a href={summary.readUrl} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-[#1a73e8] hover:underline">Open on Google <FaExternalLinkAlt className="h-2.5 w-2.5" aria-hidden /></a>}
        </div>
      </form>
      {summary?.apiConfigured && (
        <div className="mt-4 rounded-xl bg-gray-50 p-3">
          <p className="text-sm font-semibold text-gray-800">Find my business on Google</p>
          <div className="mt-2 flex gap-2"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Business name and city" aria-label="Search Google for your business" className={field} /><button type="button" onClick={search} disabled={busy || query.trim().length < 3} className="shrink-0 rounded-xl bg-[#1a73e8] px-3 text-sm font-bold text-white disabled:opacity-50">Search</button></div>
          {candidates && (candidates.length ? (
            <ul className="mt-2 divide-y divide-gray-200">
              {candidates.map((c) => <li key={c.placeId} className="flex items-center justify-between gap-2 py-2 text-sm"><span><span className="font-semibold">{c.name}</span><span className="block text-xs text-gray-500">{c.address}{c.rating ? ` · ${c.rating}★ (${c.userRatingCount})` : ""}</span></span><button type="button" onClick={() => { setPlaceId(c.placeId); setCandidates(null); }} className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-bold">This is me</button></li>)}
            </ul>
          ) : <p className="mt-2 text-xs text-gray-500">No matches. Try your business name exactly as on Google.</p>)}
        </div>
      )}
      {message && <p role={message.tone === "ok" ? "status" : "alert"} className={`mt-3 rounded-lg px-3 py-2 text-sm ${message.tone === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{message.text}</p>}
    </section>
  );
}

/** One review in the inbox: read-only customer content, its status, and the public reply. */
function InboxCard({ review, base, onChanged }: { review: InboxReview; base: Base; onChanged: (text: string) => void }) {
  const [replying, setReplying] = useState(false);
  const [text, setText] = useState(review.reply?.body ?? "");
  const [reporting, setReporting] = useState(false);
  const [reason, setReason] = useState("fake");
  const [error, setError] = useState("");
  const call = async (path: string, method: string, body?: unknown, done?: string) => {
    setError("");
    try { const { message } = await apiRequest(`${base}/reviews/${review._id}${path}`, { method, body }); onChanged(done ?? message ?? "Saved."); return true; } catch (caught) { setError(caught instanceof Error ? caught.message : "Something went wrong."); return false; }
  };
  return (
    <li className="py-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2"><Stars value={review.rating} /><span className="font-semibold text-gray-900">{review.title}</span></div>
          <p className="mt-0.5 text-xs text-gray-500">{review.author.name} · {formatReviewDate(review.createdAt)}{review.edited ? " · edited" : ""}{review.serviceCategory ? ` · ${review.serviceCategory}` : ""}{review.bookingReference ? ` · booking ${review.bookingReference}` : ""}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {review.verified && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700"><FaCheckCircle className="h-2.5 w-2.5" aria-hidden /> Verified</span>}
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
            <img key={i} src={photo} alt="" className="h-16 w-24 rounded-lg object-cover" />
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
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} maxLength={1500} placeholder={`Reply publicly to ${review.author.name.split(" ")[0]}…`} aria-label="Your public reply" className={field} />
          <div className="flex gap-2"><button type="button" disabled={text.trim().length < 2} onClick={async () => { if (await call("/reply", "PUT", { body: text })) setReplying(false); }} className="rounded-xl bg-[#0b1f3b] px-4 py-2 text-xs font-bold text-white disabled:opacity-40">Post reply</button><button type="button" onClick={() => setReplying(false)} className="rounded-xl px-3 py-2 text-xs font-semibold text-gray-600">Cancel</button></div>
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

/**
 * Reviews & Ratings for a company or freelancer: their PlumberFinder rating and reviews (read-only, with public
 * replies and reporting), and their Google Business Profile settings.
 */
export default function ProviderReviews({ base }: { base: Base }) {
  const [inbox, setInbox] = useState<Inbox | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [rating, setRating] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    try {
      const query = new URLSearchParams(Object.entries({ search, sort, rating, status, page: String(page) }).filter(([, v]) => v));
      setInbox((await apiRequest<InboxReview[]>(`${base}/reviews?${query}`)) as unknown as Inbox);
      setError("");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not load reviews."); }
  }, [base, search, sort, rating, status, page]);
  useEffect(() => { const timer = window.setTimeout(load, search ? 300 : 0); return () => window.clearTimeout(timer); }, [load, search]);

  const s = inbox?.summary;
  const pages = inbox ? Math.ceil(inbox.total / inbox.limit) : 1;
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#0b1f3b]">Business Profile</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">Reviews &amp; Ratings</h1>
        <p className="mt-1 text-sm text-gray-500">Reviews customers wrote about you on PlumberFinder. You can reply publicly and report reviews that break the rules — ratings and review text can&apos;t be changed.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <section className="rounded-2xl border border-gray-200 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">PlumberFinder rating</p>
          {!s ? <div className="mt-3 h-28 animate-pulse rounded-xl bg-gray-100" /> : (
            <>
              <div className="mt-2 flex items-center gap-4">
                <p className="text-5xl font-extrabold text-gray-900">{s.count ? s.average.toFixed(1) : "–"}</p>
                <div><Stars value={s.average} /><p className="mt-1 text-sm text-gray-500">{s.count} published review{s.count === 1 ? "" : "s"}</p></div>
              </div>
              <div className="mt-3 space-y-1">
                {([5, 4, 3, 2, 1] as const).map((star) => <div key={star} className="flex items-center gap-2 text-xs"><span className="w-3 text-gray-600">{star}</span><span className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100"><span className="block h-full rounded-full bg-[#FFD60A]" style={{ width: `${s.count ? (s.distribution[star] / s.count) * 100 : 0}%` }} /></span><span className="w-6 text-right text-gray-500">{s.distribution[star]}</span></div>)}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <button type="button" onClick={() => { setStatus("published"); setPage(1); }} className="rounded-xl bg-gray-50 p-2"><p className="text-lg font-bold text-gray-900">{s.unanswered}</p>Not answered</button>
                <button type="button" onClick={() => { setStatus("pending"); setPage(1); }} className="rounded-xl bg-amber-50 p-2"><p className="text-lg font-bold text-amber-900">{s.byStatus.pending}</p>Held</button>
                <button type="button" onClick={() => { setStatus("hidden"); setPage(1); }} className="rounded-xl bg-red-50 p-2"><p className="text-lg font-bold text-red-800">{s.byStatus.hidden}</p>Removed</button>
              </div>
            </>
          )}
        </section>
        <GoogleSettings base={base} />
      </div>

      <section className="rounded-2xl border border-gray-200 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-base font-bold text-gray-900">Customer reviews {inbox && <span className="font-medium text-gray-400">({inbox.total})</span>}</h2>
          <div className="flex flex-wrap gap-2">
            <label className="relative"><FaSearch className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" aria-hidden /><input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search reviews" aria-label="Search reviews" className={`${field} w-48 pl-8`} /></label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort" className={`${field} w-auto`}><option value="newest">Newest</option><option value="highest">Highest rated</option><option value="lowest">Lowest rated</option></select>
            <select value={rating} onChange={(e) => { setRating(e.target.value); setPage(1); }} aria-label="Stars" className={`${field} w-auto`}><option value="">All stars</option>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}</select>
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Status" className={`${field} w-auto`}><option value="">Any status</option><option value="published">Live</option><option value="pending">Held for moderation</option><option value="hidden">Removed</option></select>
          </div>
        </div>
        {notice && <p role="status" className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p>}
        {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {!inbox && !error && <div className="mt-4 space-y-3">{[0, 1].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />)}</div>}
        {inbox && inbox.data.length === 0 && <p className="mt-4 rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">{search || rating || status ? "No reviews match." : "No reviews yet. When customers review you on PlumberFinder, they'll appear here — and you'll get a notification."}</p>}
        <ul className="divide-y divide-gray-100">{inbox?.data.map((review) => <InboxCard key={review._id} review={review} base={base} onChanged={(text) => { setNotice(text); load(); }} />)}</ul>
        {pages > 1 && <div className="mt-3 flex items-center justify-center gap-3 text-sm"><button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 font-semibold disabled:opacity-40">Previous</button><span className="text-gray-500">Page {page} of {pages}</span><button type="button" disabled={page >= pages} onClick={() => setPage(page + 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 font-semibold disabled:opacity-40">Next</button></div>}
      </section>
    </div>
  );
}
