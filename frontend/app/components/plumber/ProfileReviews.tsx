"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaCheckCircle, FaExternalLinkAlt, FaFlag, FaGoogle, FaPen, FaReply, FaTrash } from "react-icons/fa";
import type { Plumber } from "@/components/find/types";
import { readStoredUser } from "@/components/utils/auth";
import ReviewForm from "@/components/reviews/ReviewForm";
import { Stars } from "@/components/reviews/Stars";
import { formatReviewDate, REPORT_REASONS, reviewsCall, type GoogleReview, type GoogleSummary, type PFReview, type ReviewList } from "@/components/reviews/reviewsApi";

type Tab = "all" | "plumberfinder" | "google";
type Sort = "newest" | "highest" | "lowest";
type Item = { source: "plumberfinder"; review: PFReview; date: number; rating: number } | { source: "google"; review: GoogleReview; date: number; rating: number };

const SourceLabel = ({ source }: { source: "plumberfinder" | "google" }) => source === "google"
  ? <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-bold text-gray-700"><FaGoogle className="h-2.5 w-2.5 text-[#4285F4]" aria-hidden /> Google Review</span>
  : <span className="inline-flex items-center gap-1 rounded-full bg-[#FFD60A] px-2 py-0.5 text-[11px] font-bold text-[#0b1f3b]">PlumberFinder Review</span>;

/** The customer's review card: rating, title, text, photos, verified booking, and the plumber's reply. */
function PFReviewCard({ review, plumberName, onReport }: { review: PFReview; plumberName: string; onReport?: (review: PFReview) => void }) {
  return (
    <article className="py-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0b1f3b] text-xs font-bold text-white" aria-hidden>{review.author.name.slice(0, 1)}</span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900">{review.author.name}{review.isMine ? " (you)" : ""}</p>
          <p className="text-xs text-gray-500">{formatReviewDate(review.createdAt)}{review.edited ? " · edited" : ""}</p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-1.5"><SourceLabel source="plumberfinder" />{review.verified && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700"><FaCheckCircle className="h-2.5 w-2.5" aria-hidden /> Verified booking</span>}</div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2"><Stars value={review.rating} /><span className="font-semibold text-gray-900">{review.title}</span></div>
      {review.serviceCategory && <p className="mt-0.5 text-xs font-semibold text-[#f7672c]">{review.serviceCategory}</p>}
      <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-gray-700">{review.body}</p>
      {review.photos.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- customer uploads are data URLs */}
          {review.photos.map((photo, index) => <a key={index} href={photo} target="_blank" rel="noreferrer"><img src={photo} alt={`Photo ${index + 1} from ${review.author.name}`} className="h-20 w-28 rounded-lg object-cover" /></a>)}
        </div>
      )}
      {review.reply && (
        <div className="mt-3 rounded-xl border-l-4 border-[#FFD60A] bg-gray-50 p-3 text-sm">
          <p className="flex items-center gap-1.5 font-semibold text-gray-900"><FaReply className="h-3 w-3 text-gray-400" aria-hidden /> Response from {plumberName}</p>
          <p className="mt-1 whitespace-pre-line text-gray-700">{review.reply.body}</p>
        </div>
      )}
      {onReport && !review.isMine && <button type="button" onClick={() => onReport(review)} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-red-600"><FaFlag className="h-2.5 w-2.5" aria-hidden /> Report</button>}
    </article>
  );
}

function GoogleReviewCard({ review }: { review: GoogleReview }) {
  return (
    <article className="py-5">
      <div className="flex flex-wrap items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element -- Google author photos come from Google's hosts */}
        {review.author.photoUri ? <img src={review.author.photoUri} alt="" referrerPolicy="no-referrer" className="h-9 w-9 rounded-full" /> : <span className="grid h-9 w-9 place-items-center rounded-full bg-gray-200 text-xs font-bold text-gray-700" aria-hidden>{review.author.name.slice(0, 1)}</span>}
        <div className="min-w-0">
          {review.author.uri ? <a href={review.author.uri} target="_blank" rel="noreferrer" className="text-sm font-bold text-gray-900 hover:underline">{review.author.name}</a> : <p className="text-sm font-bold text-gray-900">{review.author.name}</p>}
          <p className="text-xs text-gray-500">{review.relativeTime ?? formatReviewDate(review.publishTime)} · on Google</p>
        </div>
        <div className="ml-auto"><SourceLabel source="google" /></div>
      </div>
      <div className="mt-2"><Stars value={review.rating} /></div>
      {review.text && <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-gray-700">{review.text}</p>}
      {review.googleMapsUri && <a href={review.googleMapsUri} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#1a73e8] hover:underline">View on Google <FaExternalLinkAlt className="h-2.5 w-2.5" aria-hidden /></a>}
    </article>
  );
}

/**
 * Reviews on a plumber's profile, from two separate sources that are never mixed into one score:
 * PlumberFinder reviews (written by signed-in customers here) and Google reviews (from the plumber's
 * Google Business Profile, when connected).
 */
export default function ProfileReviews({ plumber }: { plumber: Plumber }) {
  const type = plumber.providerType ?? "company";
  const base = `/reviews/${type}/${plumber.id}`;
  const [tab, setTab] = useState<Tab>("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [stars, setStars] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pf, setPf] = useState<ReviewList | null>(null);
  const [items, setItems] = useState<PFReview[]>([]);
  const [google, setGoogle] = useState<GoogleSummary | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState<"new" | "edit" | null>(null);
  const [reporting, setReporting] = useState<PFReview | null>(null);
  const [reason, setReason] = useState("spam");
  const [signedInAs, setSignedInAs] = useState<string | null>(null);

  useEffect(() => { const timer = window.setTimeout(() => setSignedInAs(readStoredUser()?.accountType ?? null), 0); return () => window.clearTimeout(timer); }, []);

  const load = useCallback(async (nextPage = 1) => {
    try {
      const query = new URLSearchParams({ sort, page: String(nextPage), ...(stars ? { rating: String(stars) } : {}) });
      const result = (await reviewsCall<PFReview[]>(`${base}?${query}`)) as unknown as ReviewList;
      setPf(result);
      setItems((current) => (nextPage === 1 ? result.data : [...current, ...result.data]));
      setPage(nextPage);
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load reviews.");
    }
  }, [base, sort, stars]);
  useEffect(() => { const timer = window.setTimeout(() => load(1), 0); return () => window.clearTimeout(timer); }, [load]);
  useEffect(() => { reviewsCall<GoogleSummary>(`${base}/google`).then(({ data }) => setGoogle(data)).catch(() => setGoogle({ connected: false, available: false })); }, [base]);

  const saved = (review: PFReview, message: string) => { setForm(null); setNotice(message); void review; load(1); };
  const remove = async () => {
    if (!pf?.mine || !window.confirm("Delete your review? It will no longer count towards the rating.")) return;
    try { await reviewsCall(`/reviews/item/${pf.mine._id}`, { method: "DELETE" }); setNotice("Your review was deleted."); load(1); } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not delete."); }
  };
  const sendReport = async () => {
    if (!reporting) return;
    try { const { message } = await reviewsCall(`/reviews/item/${reporting._id}/report`, { method: "POST", body: { reason } }); setNotice(message ?? "Reported."); } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not report."); }
    setReporting(null);
  };

  const summary = pf?.summary;
  const googleReviews = google?.available ? google.reviews ?? [] : [];
  const googleMatching = googleReviews.filter((review) => !stars || Math.round(review.rating) === stars);
  const merged: Item[] = [
    ...(tab !== "google" ? items.map((review): Item => ({ source: "plumberfinder", review, date: new Date(review.createdAt).getTime(), rating: review.rating })) : []),
    ...(tab !== "plumberfinder" ? googleMatching.map((review): Item => ({ source: "google", review, date: review.publishTime ? new Date(review.publishTime).getTime() : 0, rating: review.rating })) : []),
  ].sort((a, b) => (sort === "highest" ? b.rating - a.rating || b.date - a.date : sort === "lowest" ? a.rating - b.rating || b.date - a.date : b.date - a.date));
  const isCustomer = signedInAs === "seeker";

  return (
    <section id="reviews" className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="text-xl font-bold text-gray-900">Reviews</h2>

      {/* The two ratings, side by side and never combined */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">PlumberFinder Reviews</p>
          {!pf && !error ? <div className="mt-3 h-24 animate-pulse rounded-xl bg-gray-100" /> : summary && (
            <div className="mt-2 flex gap-4">
              <div className="text-center">
                <p className="text-4xl font-extrabold text-gray-900">{summary.count ? summary.average.toFixed(1) : "–"}</p>
                <Stars value={summary.average} size="h-3.5 w-3.5" />
                <p className="mt-1 text-xs text-gray-500">{summary.count} review{summary.count === 1 ? "" : "s"}</p>
              </div>
              <div className="flex-1 space-y-1">
                {([5, 4, 3, 2, 1] as const).map((star) => {
                  const count = summary.distribution[star];
                  return (
                    <button key={star} type="button" onClick={() => { setStars(stars === star ? null : star); setTab(tab === "google" ? "all" : tab); }} aria-pressed={stars === star} aria-label={`${star} stars: ${count} reviews. Show only these`} className={`flex w-full items-center gap-2 rounded px-1 text-xs ${stars === star ? "bg-[#FFD60A]/20" : "hover:bg-gray-50"}`}>
                      <span className="w-3 text-gray-600">{star}</span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100"><span className="block h-full rounded-full bg-[#FFD60A]" style={{ width: `${summary.count ? (count / summary.count) * 100 : 0}%` }} /></span>
                      <span className="w-6 text-right text-gray-500">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {pf && !pf.mine && !form && (
            isCustomer ? <button type="button" onClick={() => { setForm("new"); setNotice(""); }} className="mt-4 w-full rounded-full bg-[#0b1f3b] py-2.5 text-sm font-bold text-white hover:bg-[#17345a]">Write a review</button>
              : signedInAs ? <p className="mt-4 text-xs text-gray-500">Only customer accounts can write reviews.</p>
              : <p className="mt-4 text-sm text-gray-600"><Link href="/login" className="font-bold text-[#0b1f3b] underline">Log in</Link> as a customer to write a review.</p>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 p-4">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-500"><FaGoogle className="h-3 w-3 text-[#4285F4]" aria-hidden /> Google Reviews</p>
          {!google ? <div className="mt-3 h-24 animate-pulse rounded-xl bg-gray-100" /> : google.available ? (
            <div className="mt-2">
              <div className="flex items-end gap-3"><p className="text-4xl font-extrabold text-gray-900">{google.rating?.toFixed(1) ?? "–"}</p><div className="pb-1"><Stars value={google.rating ?? 0} size="h-3.5 w-3.5" /><p className="text-xs text-gray-500">{(google.count ?? 0).toLocaleString()} reviews on Google</p></div></div>
            </div>
          ) : google.connected ? (
            <p className="mt-2 text-sm text-gray-600">See {plumber.companyName}&apos;s rating and reviews on their Google Business Profile.</p>
          ) : (
            <p className="mt-2 text-sm text-gray-500">{plumber.companyName} hasn&apos;t connected a Google Business Profile yet.</p>
          )}
          {google?.connected && (
            <div className="mt-4 flex flex-wrap gap-2">
              {google.readUrl && <a href={google.readUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50">Read Google Reviews <FaExternalLinkAlt className="h-2.5 w-2.5" aria-hidden /></a>}
              {google.writeUrl && <a href={google.writeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#1a73e8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1765cc]">Write a Google Review <FaExternalLinkAlt className="h-2.5 w-2.5" aria-hidden /></a>}
            </div>
          )}
        </div>
      </div>

      {notice && <p role="status" className="mt-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">{notice}</p>}
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">{error} <button type="button" onClick={() => load(1)} className="font-bold underline">Try again</button></p>}

      {/* The customer's own review */}
      {pf?.mine && form !== "edit" && (
        <div className="mt-4 rounded-2xl border border-[#FFD60A] bg-[#FFD60A]/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold text-gray-900">Your review{pf.mine.status === "pending" ? <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">Waiting for a quick check</span> : pf.mine.status === "hidden" ? <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">Removed by moderators</span> : null}</p>
            <div className="flex gap-2">
              {pf.mine.status !== "hidden" && <button type="button" onClick={() => setForm("edit")} className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50"><FaPen className="h-2.5 w-2.5" aria-hidden /> Edit</button>}
              <button type="button" onClick={remove} className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"><FaTrash className="h-2.5 w-2.5" aria-hidden /> Delete</button>
            </div>
          </div>
          <PFReviewCard review={pf.mine} plumberName={plumber.companyName} />
        </div>
      )}
      {form && pf && <div className="mt-4"><ReviewForm providerType={type} providerId={plumber.id} providerName={plumber.companyName} categories={pf.categories} existing={form === "edit" ? pf.mine : null} onSaved={saved} onCancel={() => setForm(null)} /></div>}

      {/* Tabs, sort, filter */}
      <div className="mt-6 flex flex-col gap-3 border-b border-gray-200 sm:flex-row sm:items-end sm:justify-between">
        <div className="-mb-px flex gap-1 overflow-x-auto" role="tablist" aria-label="Review source">
          {([["all", "All Reviews", (summary?.count ?? 0) + googleReviews.length], ["plumberfinder", "PlumberFinder Reviews", summary?.count ?? 0], ["google", "Google Reviews", google?.available ? google.count ?? 0 : null]] as const).map(([key, label, count]) => (
            <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className={`shrink-0 border-b-2 px-3 py-2 text-sm font-semibold transition ${tab === key ? "border-[#FFD60A] text-gray-900" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
              {label}{count !== null && <span className="ml-1 text-xs text-gray-400">{count.toLocaleString()}</span>}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 pb-2">
          {stars && <button type="button" onClick={() => setStars(null)} className="rounded-full bg-[#FFD60A]/30 px-3 py-1 text-xs font-bold text-[#0b1f3b]">{stars}★ only ✕</button>}
          <label className="text-xs text-gray-500">Sort{" "}
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="ml-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-800 outline-none focus:border-[#FFD60A]">
              <option value="newest">Newest</option><option value="highest">Highest rated</option><option value="lowest">Lowest rated</option>
            </select>
          </label>
        </div>
      </div>

      {reporting && (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm">
          <span className="font-semibold text-gray-900">Report {reporting.author.name}&apos;s review:</span>
          <select value={reason} onChange={(e) => setReason(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm">{REPORT_REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}</select>
          <button type="button" onClick={sendReport} className="rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white">Send report</button>
          <button type="button" onClick={() => setReporting(null)} className="text-xs font-semibold text-gray-600">Cancel</button>
        </div>
      )}

      {/* The list */}
      {tab === "google" && google && !google.available ? (
        <div className="py-8 text-center text-sm text-gray-500">
          {google.connected ? <>Google review content isn&apos;t available here right now. {google.readUrl && <a href={google.readUrl} target="_blank" rel="noreferrer" className="font-semibold text-[#1a73e8] underline">Read {plumber.companyName}&apos;s Google reviews</a>}</> : <>{plumber.companyName} hasn&apos;t connected Google reviews.</>}
        </div>
      ) : !pf && !error ? (
        <div className="space-y-3 py-4">{[0, 1].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />)}</div>
      ) : merged.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">{stars ? `No ${stars}-star reviews yet.` : tab === "google" ? "No Google reviews to show." : `No reviews yet. ${isCustomer ? "Be the first to review " + plumber.companyName + "." : ""}`}</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {merged.map((item, index) => (item.source === "plumberfinder"
            ? <PFReviewCard key={item.review._id} review={item.review} plumberName={plumber.companyName} onReport={signedInAs ? setReporting : undefined} />
            : <GoogleReviewCard key={`g-${index}`} review={item.review} />))}
        </div>
      )}
      {tab !== "google" && pf && items.length < pf.total && <button type="button" onClick={() => load(page + 1)} className="mt-2 w-full rounded-full border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Show more PlumberFinder reviews</button>}
      {google?.available && tab !== "plumberfinder" && googleReviews.length > 0 && (
        <p className="mt-3 flex flex-wrap items-center gap-1 text-xs text-gray-500"><FaGoogle className="h-3 w-3 text-[#4285F4]" aria-hidden /> Google reviews are provided by Google and may show only a few of {(google.count ?? 0).toLocaleString()}. {google.readUrl && <a href={google.readUrl} target="_blank" rel="noreferrer" className="font-semibold text-[#1a73e8] underline">See all on Google</a>}</p>
      )}
    </section>
  );
}
