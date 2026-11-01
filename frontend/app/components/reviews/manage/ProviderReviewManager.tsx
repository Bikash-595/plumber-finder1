"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { FaSearch } from "react-icons/fa";
import { apiRequest } from "@/components/utils/apiClient";
import ReviewInboxCard from "./ReviewInboxCard";
import ReviewStatsPanel from "./ReviewStatsPanel";
import { inboxField, type Inbox, type InboxReview, type ProviderBase } from "./types";

/**
 * Reviews & Ratings for a company or freelancer: their PlumberFinder rating by source (directory / verified), and
 * every review with replies and reporting. Ratings and customers' words can't be changed. `aside` sits next to the
 * stats — the company dashboard puts its Google connection there.
 */
export default function ProviderReviewManager({ base, aside, intro }: { base: ProviderBase; aside?: ReactNode; intro: string }) {
  const [inbox, setInbox] = useState<Inbox | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filters, setFilters] = useState({ search: "", sort: "newest", rating: "", status: "", source: "", unanswered: "" });
  const [page, setPage] = useState(1);
  const set = (change: Partial<typeof filters>) => { setFilters((current) => ({ ...current, ...change })); setPage(1); };

  const load = useCallback(async () => {
    try {
      const query = new URLSearchParams(Object.entries({ ...filters, page: String(page) }).filter(([, v]) => v));
      setInbox((await apiRequest<InboxReview[]>(`${base}/reviews?${query}`)) as unknown as Inbox);
      setError("");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not load reviews."); }
  }, [base, filters, page]);
  useEffect(() => { const timer = window.setTimeout(load, filters.search ? 300 : 0); return () => window.clearTimeout(timer); }, [load, filters.search]);

  const pages = inbox ? Math.ceil(inbox.total / inbox.limit) : 1;
  const shortcut = (key: "unanswered" | "new" | "pending" | "reported") => set(key === "unanswered" ? { unanswered: "true", status: "" } : key === "pending" ? { status: "pending", unanswered: "" } : key === "new" ? { sort: "newest", status: "", unanswered: "" } : { status: "", unanswered: "", sort: "newest", search: "" });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#0b1f3b]">Business Profile</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">Reviews &amp; Ratings</h1>
        <p className="mt-1 text-sm text-gray-500">{intro}</p>
      </div>

      <div className={`grid gap-4 ${aside ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]" : ""}`}>
        <ReviewStatsPanel summary={inbox?.summary} onShortcut={shortcut} />
        {aside}
      </div>

      <section className="rounded-2xl border border-gray-200 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-base font-bold text-gray-900">PlumberFinder reviews {inbox && <span className="font-medium text-gray-400">({inbox.total})</span>}</h2>
          <div className="flex flex-wrap gap-2">
            <label className="relative"><FaSearch className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" aria-hidden /><input value={filters.search} onChange={(e) => set({ search: e.target.value })} placeholder="Search reviews" aria-label="Search reviews" className={`${inboxField} w-44 pl-8`} /></label>
            <select value={filters.source} onChange={(e) => set({ source: e.target.value })} aria-label="Review type" className={`${inboxField} w-auto`}><option value="">All types</option><option value="verified_booking">Verified customers</option><option value="directory">Directory reviews</option></select>
            <select value={filters.rating} onChange={(e) => set({ rating: e.target.value })} aria-label="Stars" className={`${inboxField} w-auto`}><option value="">All stars</option>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}</select>
            <select value={filters.unanswered ? "unanswered" : filters.status} onChange={(e) => set(e.target.value === "unanswered" ? { unanswered: "true", status: "" } : { status: e.target.value, unanswered: "" })} aria-label="Status" className={`${inboxField} w-auto`}>
              <option value="">Any status</option><option value="unanswered">Not answered yet</option><option value="published">Live</option><option value="pending">Being checked</option><option value="hidden">Removed</option>
            </select>
            <select value={filters.sort} onChange={(e) => set({ sort: e.target.value })} aria-label="Sort" className={`${inboxField} w-auto`}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="highest">Highest rated</option><option value="lowest">Lowest rated</option></select>
          </div>
        </div>
        {notice && <p role="status" className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p>}
        {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {!inbox && !error && <div className="mt-4 space-y-3">{[0, 1].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />)}</div>}
        {inbox && inbox.data.length === 0 && <p className="mt-4 rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">{Object.entries(filters).some(([key, value]) => key !== "sort" && value) ? "No reviews match." : "No reviews yet. When customers review you on PlumberFinder, they'll appear here — and you'll get a notification. Customers are asked for a review automatically when a booking is completed."}</p>}
        <ul className="divide-y divide-gray-100">{inbox?.data.map((review) => <ReviewInboxCard key={review._id} review={review} base={base} onChanged={(text) => { setNotice(text); load(); }} />)}</ul>
        {pages > 1 && <div className="mt-3 flex items-center justify-center gap-3 text-sm"><button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 font-semibold disabled:opacity-40">Previous</button><span className="text-gray-500">Page {page} of {pages}</span><button type="button" disabled={page >= pages} onClick={() => setPage(page + 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 font-semibold disabled:opacity-40">Next</button></div>}
      </section>
    </div>
  );
}
