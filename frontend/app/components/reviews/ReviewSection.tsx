"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaExternalLinkAlt, FaGoogle, FaPen, FaStar, FaTrash } from "react-icons/fa";
import type { Plumber } from "@/components/find/types";
import GoogleReviewCard from "./GoogleReviewCard";
import PlatformReviewCard from "./PlatformReviewCard";
import RatingDistribution from "./RatingDistribution";
import RatingSummary from "./RatingSummary";
import ReviewTabs, { type PlatformFilter, type ReviewTab } from "./ReviewTabs";
import SourceBadge from "./SourceBadge";
import WriteReviewModal from "./WriteReviewModal";
import { REPORT_REASONS, reviewsApi, type GoogleReview, type GoogleSummary, type PFReview, type ReviewList } from "./reviewsApi";

type Sort = "newest" | "highest" | "lowest";
type Item = { kind: "pf"; review: PFReview; date: number; rating: number } | { kind: "google"; review: GoogleReview; date: number; rating: number };

/**
 * Reviews on a company's or freelancer's profile. Companies: All / Google / PlumberFinder; freelancers: All /
 * PlumberFinder (no Google). Each source has its own rating — they're never averaged together.
 */
export default function ReviewSection({ plumber }: { plumber: Plumber }) {
  const type = plumber.providerType ?? "company";
  const provider = { type, id: plumber.id, name: plumber.companyName };
  const googleEnabled = type === "company";
  const [tab, setTab] = useState<ReviewTab>("all");
  const [filter, setFilter] = useState<PlatformFilter>("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [stars, setStars] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pf, setPf] = useState<ReviewList | null>(null);
  const [items, setItems] = useState<PFReview[]>([]);
  const [google, setGoogle] = useState<GoogleSummary | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState<{ editing?: PFReview | null; booking?: string | null } | null>(null);
  const [reporting, setReporting] = useState<PFReview | null>(null);
  const [reason, setReason] = useState("spam");

  const source = tab === "plumberfinder" && filter !== "all" ? filter : "";
  const load = useCallback(async (nextPage = 1) => {
    try {
      const query = new URLSearchParams({ sort, page: String(nextPage), ...(stars ? { rating: String(stars) } : {}), ...(source ? { source } : {}) });
      const result = await reviewsApi.list(type, plumber.id, query);
      setPf(result);
      setItems((current) => (nextPage === 1 ? result.data : [...current, ...result.data]));
      setPage(nextPage);
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load reviews.");
    }
  }, [type, plumber.id, sort, stars, source]);
  useEffect(() => { const timer = window.setTimeout(() => load(1), 0); return () => window.clearTimeout(timer); }, [load]);
  useEffect(() => {
    if (!googleEnabled) return;
    reviewsApi.google(type, plumber.id).then(({ data }) => setGoogle(data)).catch(() => setGoogle({ connected: false, available: false }));
  }, [googleEnabled, type, plumber.id]);

  // A review-request link (?review=<booking>) opens the form with that booking chosen.
  useEffect(() => {
    const booking = new URLSearchParams(window.location.search).get("review");
    if (!booking || !pf?.viewer) return;
    const timer = window.setTimeout(() => {
      if (pf.viewer.canReview && pf.viewer.eligibleBookings.some((b) => b._id === booking)) setModal({ booking });
      document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", `${window.location.pathname}#reviews`);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pf?.viewer]);

  const viewer = pf?.viewer;
  const stats = pf?.stats;
  const saved = (_review: PFReview, message: string) => { setModal(null); setNotice(message); load(1); };
  const remove = async (review: PFReview) => {
    if (!window.confirm("Delete this review? It will no longer count towards the rating.")) return;
    try { await reviewsApi.remove(review._id); setNotice("Your review was deleted."); load(1); } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not delete."); }
  };
  const sendReport = async () => {
    if (!reporting) return;
    try { const { message } = await reviewsApi.report(reporting._id, reason); setNotice(message ?? "Reported."); } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not report."); }
    setReporting(null);
  };

  const googleReviews = googleEnabled && google?.available ? google.reviews ?? [] : [];
  const googleShown = googleReviews.filter((review) => !stars || Math.round(review.rating) === stars);
  const merged: Item[] = [
    ...(tab !== "google" ? items.map((review): Item => ({ kind: "pf", review, date: new Date(review.createdAt).getTime(), rating: review.rating })) : []),
    ...(tab !== "plumberfinder" ? googleShown.map((review): Item => ({ kind: "google", review, date: review.publishTime ? new Date(review.publishTime).getTime() : 0, rating: review.rating })) : []),
  ].sort((a, b) => (sort === "highest" ? b.rating - a.rating || b.date - a.date : sort === "lowest" ? a.rating - b.rating || b.date - a.date : b.date - a.date));
  const myReviews = viewer ? [viewer.directoryReview, ...viewer.verifiedReviews].filter((review): review is PFReview => Boolean(review)) : [];
  const loginHref = `/login?next=${encodeURIComponent(`/plumber/${plumber.id}#reviews`)}`;

  const writeButton = !viewer ? null : viewer.canReview ? (
    <button type="button" onClick={() => { setModal({}); setNotice(""); }} className="inline-flex items-center gap-2 rounded-full bg-[#FFD60A] px-5 py-2.5 text-sm font-bold text-[#0b1f3b] shadow-sm hover:brightness-95"><FaStar className="h-3.5 w-3.5" aria-hidden /> Write a Review</button>
  ) : viewer.signedIn ? <p className="text-xs text-gray-500">Only customer accounts can write reviews.</p>
    : <Link href={loginHref} className="inline-flex items-center gap-2 rounded-full bg-[#FFD60A] px-5 py-2.5 text-sm font-bold text-[#0b1f3b] shadow-sm hover:brightness-95"><FaStar className="h-3.5 w-3.5" aria-hidden /> Write a Review</Link>;

  return (
    <section id="reviews" className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="reviews-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="reviews-heading" className="text-xl font-bold text-gray-900">Reviews</h2>
          <p className="text-sm text-gray-500">{googleEnabled ? "Google and PlumberFinder ratings are shown separately — never averaged together." : "Reviews from PlumberFinder customers."}</p>
        </div>
        {writeButton}
      </div>

      {/* Ratings by source */}
      <div className={`mt-4 grid gap-4 ${googleEnabled ? "md:grid-cols-2" : ""}`}>
        <RatingSummary label="PlumberFinder rating" icon={<FaStar className="h-3 w-3 text-[#b39200]" aria-hidden />} average={stats?.platform.average} count={stats?.platform.count ?? 0} loading={!pf && !error}>
          {stats && (
            <>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <button type="button" onClick={() => { setTab("plumberfinder"); setFilter("verified_booking"); }} className="rounded-xl bg-emerald-50 px-3 py-2 text-left"><span className="block text-base font-bold text-emerald-900">{stats.verified.count ? stats.verified.average.toFixed(1) : "–"} <span className="text-xs font-semibold">★</span></span><span className="text-emerald-800">{stats.verified.count} verified customer{stats.verified.count === 1 ? "" : "s"}</span></button>
                <button type="button" onClick={() => { setTab("plumberfinder"); setFilter("directory"); }} className="rounded-xl bg-[#FFD60A]/15 px-3 py-2 text-left"><span className="block text-base font-bold text-gray-900">{stats.directory.count ? stats.directory.average.toFixed(1) : "–"} <span className="text-xs font-semibold">★</span></span><span className="text-gray-700">{stats.directory.count} directory review{stats.directory.count === 1 ? "" : "s"}</span></button>
              </div>
              <div className="mt-3"><RatingDistribution stats={stats.platform} selected={stars} onSelect={(star) => { setStars(star); if (tab === "google") setTab("all"); }} /></div>
            </>
          )}
        </RatingSummary>

        {googleEnabled && (
          <RatingSummary label="Google rating" icon={<FaGoogle className="h-3 w-3 text-[#4285F4]" aria-hidden />} average={google?.available ? google.rating : null} count={google?.available ? google.count ?? 0 : 0} countLabel="Google review" loading={!google}>
            {google && !google.available && <p className="mt-2 text-sm text-gray-500">{google.connected ? `See ${plumber.companyName}'s rating on Google.` : `${plumber.companyName} hasn't connected Google reviews yet.`}</p>}
            {google?.connected && (
              <div className="mt-3 flex flex-wrap gap-2">
                {google.readUrl && <a href={google.readUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3.5 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50">Google Reviews <FaExternalLinkAlt className="h-2.5 w-2.5" aria-hidden /></a>}
                {google.writeUrl && <a href={google.writeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#1a73e8] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#1765cc]">Review on Google <FaExternalLinkAlt className="h-2.5 w-2.5" aria-hidden /></a>}
              </div>
            )}
          </RatingSummary>
        )}
      </div>

      {notice && <p role="status" className="mt-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">{notice}</p>}
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">{error} <button type="button" onClick={() => load(1)} className="font-bold underline">Try again</button></p>}

      {/* The visitor's own reviews of this plumber */}
      {myReviews.length > 0 && (
        <div className="mt-4 space-y-3 rounded-2xl border border-[#FFD60A] bg-[#FFD60A]/5 p-4">
          <p className="text-sm font-bold text-gray-900">Your review{myReviews.length > 1 ? "s" : ""}</p>
          {myReviews.map((review) => (
            <div key={review._id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2"><SourceBadge source={review.source} /><span className="text-sm font-semibold text-gray-900">{review.rating}★ {review.title || review.body.slice(0, 40)}</span></div>
                {review.status !== "published" && <p className="mt-1 text-xs text-amber-800">{review.status === "pending" ? "Waiting for a quick check before it's published." : "Removed by our moderators."}</p>}
              </div>
              <div className="flex gap-2">
                {review.status !== "hidden" && review.status !== "rejected" && <button type="button" onClick={() => setModal({ editing: review })} className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50"><FaPen className="h-2.5 w-2.5" aria-hidden /> Edit</button>}
                <button type="button" onClick={() => remove(review)} className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"><FaTrash className="h-2.5 w-2.5" aria-hidden /> Delete</button>
              </div>
            </div>
          ))}
          {viewer && viewer.eligibleBookings.length > 0 && <p className="text-xs text-emerald-800">You can also write a Verified Booking review for {viewer.eligibleBookings.length} completed booking{viewer.eligibleBookings.length === 1 ? "" : "s"}.</p>}
        </div>
      )}

      {/* Tabs, sort, filter */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <ReviewTabs tab={tab} onTab={(next) => { setTab(next); if (next !== "plumberfinder") setFilter("all"); }} filter={filter} onFilter={setFilter} googleEnabled={googleEnabled}
            counts={{ all: (stats?.platform.count ?? 0) + googleReviews.length, plumberfinder: stats?.platform.count ?? 0, google: google?.available ? google.count ?? 0 : null, directory: stats?.directory.count ?? 0, verified: stats?.verified.count ?? 0 }} />
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:pt-1">
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
          <select value={reason} onChange={(e) => setReason(e.target.value)} aria-label="Reason" className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm">{REPORT_REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}</select>
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
        <p className="py-8 text-center text-sm text-gray-500">{stars ? `No ${stars}-star reviews yet.` : tab === "google" ? "No Google reviews to show." : `No reviews yet.${viewer?.canReview ? ` Be the first to review ${plumber.companyName}.` : ""}`}</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {merged.map((item, index) => (item.kind === "pf"
            ? <PlatformReviewCard key={item.review._id} review={item.review} plumberName={plumber.companyName} onReport={viewer?.signedIn ? setReporting : undefined} />
            : <GoogleReviewCard key={`g-${index}`} review={item.review} businessName={plumber.companyName} />))}
        </div>
      )}
      {tab !== "google" && pf && items.length < pf.total && <button type="button" onClick={() => load(page + 1)} className="mt-2 w-full rounded-full border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">Show more PlumberFinder reviews</button>}
      {googleEnabled && google?.available && tab !== "plumberfinder" && googleReviews.length > 0 && (
        <p className="mt-3 flex flex-wrap items-center gap-1 text-xs text-gray-500"><FaGoogle className="h-3 w-3 text-[#4285F4]" aria-hidden /> Google reviews are provided by Google{google.origin === "places" ? ` and may show only a few of ${(google.count ?? 0).toLocaleString()}` : ""}. {google.readUrl && <a href={google.readUrl} target="_blank" rel="noreferrer" className="font-semibold text-[#1a73e8] underline">See all on Google</a>}</p>
      )}

      {modal && viewer && <WriteReviewModal open provider={provider} viewer={viewer} categories={pf?.categories ?? []} initialBooking={modal.booking} editing={modal.editing} onSaved={saved} onClose={() => setModal(null)} />}
    </section>
  );
}
