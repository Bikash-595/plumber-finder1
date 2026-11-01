"use client";

import { FormEvent, useEffect, useState } from "react";
import { FaCheckCircle, FaExternalLinkAlt, FaGoogle, FaSyncAlt } from "react-icons/fa";
import { apiRequest } from "@/components/utils/apiClient";
import { Stars } from "@/components/reviews/Stars";
import { formatReviewDate, type GoogleSummary } from "@/components/reviews/reviewsApi";

type Candidate = { placeId: string; name?: string; address?: string; phone?: string; website?: string; rating: number | null; userRatingCount: number; matchedOn?: string[] };
const field = "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";
const reasons: Record<string, string> = {
  not_connected: "Connect your Google business so its Google reviews show on your PlumberFinder profile.",
  no_place_id: "Your Google link is saved. Choose your business below to also show your Google rating and reviews.",
  api_not_configured: "Connected. Showing Google ratings and review text needs the site's Google Places API key — until then customers get your Google review links.",
  google_error: "Google didn't return your reviews just now. Try Refresh later.",
};

/**
 * The company's Google Business Profile: suggested matches from its listing (the owner confirms which is theirs —
 * similar names are common), sync status, manual refresh, optional Business Profile sign-in for full reviews
 * and owner replies, and disconnect. Companies only.
 */
export default function GoogleConnectionCard() {
  const [summary, setSummary] = useState<GoogleSummary | null>(null);
  const [matches, setMatches] = useState<Candidate[] | null>(null);
  const [query, setQuery] = useState("");
  const [link, setLink] = useState("");
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async <T,>(action: () => Promise<{ data: T; message?: string }>, after?: (data: T) => void) => {
    setBusy(true);
    setMessage(null);
    try { const { data, message: text } = await action(); after?.(data); if (text) setMessage({ tone: "ok", text }); } catch (caught) { setMessage({ tone: "error", text: caught instanceof Error ? caught.message : "Something went wrong." }); } finally { setBusy(false); }
  };
  const apply = (data: GoogleSummary) => { setSummary(data); setLink(data.profileUrl ?? ""); };

  useEffect(() => {
    apiRequest<GoogleSummary>("/companies/reviews/google").then(({ data }) => {
      apply(data);
      // Not connected yet: look for the business on Google straight away (from the listing's name and location).
      if (data.connectionStatus !== "connected" && data.apiConfigured) apiRequest<Candidate[]>("/companies/reviews/google/matches").then(({ data: found }) => setMatches(found)).catch(() => setMatches([]));
    }).catch((caught: Error) => setMessage({ tone: "error", text: caught.message }));
    // Back from Google's sign-in page.
    const params = new URLSearchParams(window.location.search);
    if (params.get("google")) {
      const timer = window.setTimeout(() => setMessage(params.get("google") === "connected" ? { tone: "ok", text: "Google Business Profile access connected." } : { tone: "error", text: params.get("message") ?? "Google sign-in didn't finish." }), 0);
      window.history.replaceState(null, "", window.location.pathname);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const connect = (placeId: string) => run(() => apiRequest<GoogleSummary>("/companies/reviews/google/connect", { method: "POST", body: { placeId } }), (data) => { apply(data); setMatches(null); });
  const search = (event: FormEvent) => { event.preventDefault(); run(() => apiRequest<Candidate[]>("/companies/reviews/google/search", { method: "POST", body: { query } }), setMatches); };
  const saveLink = (event: FormEvent) => { event.preventDefault(); run(() => apiRequest<GoogleSummary>("/companies/reviews/google", { method: "PUT", body: { profileUrl: link } }), apply); };
  const refresh = () => run(() => apiRequest<GoogleSummary>("/companies/reviews/google/refresh", { method: "POST" }), apply);
  const disconnect = () => { if (window.confirm("Disconnect your Google business from PlumberFinder? Google reviews will stop showing on your profile.")) run(() => apiRequest<GoogleSummary>("/companies/reviews/google", { method: "DELETE" }), (data) => { apply(data); setMatches(null); }); };
  const signIn = () => run(() => apiRequest<{ url: string }>("/companies/reviews/google/oauth", { method: "POST" }), (data) => { window.location.href = data.url; });
  const signOut = () => run(() => apiRequest<GoogleSummary>("/companies/reviews/google/oauth", { method: "DELETE" }), apply);

  const connected = summary?.connectionStatus === "connected";
  return (
    <section className="rounded-2xl border border-gray-200 p-4 sm:p-5" aria-labelledby="google-connection">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="google-connection" className="flex items-center gap-2 text-base font-bold text-gray-900"><FaGoogle className="text-[#4285F4]" aria-hidden /> Google reviews</h2>
          <p className="mt-0.5 text-sm text-gray-500">{connected ? <span className="inline-flex items-center gap-1 font-semibold text-emerald-700"><FaCheckCircle className="h-3 w-3" aria-hidden /> Connected{summary?.businessName ? `: ${summary.businessName}` : ""}</span> : "Shown on your profile next to — never mixed with — your PlumberFinder rating."}</p>
          {summary?.address && <p className="text-xs text-gray-500">{summary.address}</p>}
        </div>
        {summary?.available && <div className="text-right"><p className="text-2xl font-extrabold text-gray-900">{summary.rating?.toFixed(1)}</p><Stars value={summary.rating ?? 0} size="h-3 w-3" /><p className="text-xs text-gray-500">{summary.count?.toLocaleString()} on Google</p></div>}
      </div>

      {summary && !summary.available && summary.reason && <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">{reasons[summary.reason]}{summary.error ? ` (${summary.error})` : ""}</p>}
      {summary?.lastSyncedAt && <p className="mt-2 text-xs text-gray-500">Last synced {formatReviewDate(summary.lastSyncedAt)} · {summary.origin === "business_profile" ? "full review list from your Business Profile" : "up to 5 reviews from Google Places"} · refreshed daily</p>}

      {connected ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {summary?.apiConfigured || summary?.oauth?.connected ? <button type="button" onClick={refresh} disabled={busy} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 disabled:opacity-60"><FaSyncAlt className="h-3 w-3" /> Refresh now</button> : null}
          {summary?.readUrl && <a href={summary.readUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-[#1a73e8] hover:bg-blue-50">Open on Google <FaExternalLinkAlt className="h-2.5 w-2.5" aria-hidden /></a>}
          <button type="button" onClick={disconnect} disabled={busy} className="ml-auto rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Disconnect</button>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {matches && (
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-sm font-semibold text-gray-800">Is one of these your business?</p>
              {matches.length ? (
                <ul className="mt-2 divide-y divide-gray-200">
                  {matches.map((c) => (
                    <li key={c.placeId} className="flex items-center justify-between gap-3 py-2 text-sm">
                      <span className="min-w-0"><span className="font-semibold text-gray-900">{c.name}</span><span className="block text-xs text-gray-500">{c.address}{c.rating ? ` · ${c.rating}★ (${c.userRatingCount})` : ""}</span>
                        {c.matchedOn && c.matchedOn.length > 0 && <span className="text-[11px] font-semibold text-emerald-700">Same {c.matchedOn.join(" and ")} as your listing</span>}</span>
                      <button type="button" disabled={busy} onClick={() => connect(c.placeId)} className="shrink-0 rounded-lg bg-[#0b1f3b] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60">This is my business</button>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-1 text-xs text-gray-500">No matches found. Search below, or paste your Google link.</p>}
            </div>
          )}
          {summary?.apiConfigured && (
            <form onSubmit={search} className="flex gap-2"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Business name and city" aria-label="Search Google for your business" className={field} /><button type="submit" disabled={busy || query.trim().length < 3} className="shrink-0 rounded-xl bg-[#1a73e8] px-3 text-sm font-bold text-white disabled:opacity-50">Search</button></form>
          )}
          <form onSubmit={saveLink} className="flex gap-2"><input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Or paste your Google Maps link (https://maps.app.goo.gl/…)" aria-label="Google Business Profile link" className={field} /><button type="submit" disabled={busy || !link.trim()} className="shrink-0 rounded-xl border border-gray-300 px-3 text-sm font-bold text-gray-800 disabled:opacity-50">Save</button></form>
        </div>
      )}

      {connected && (
        <div className="mt-4 rounded-xl border border-dashed border-gray-200 p-3 text-sm">
          <p className="font-semibold text-gray-800">Google Business Profile access {summary?.oauth?.connected && <span className="ml-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">On</span>}</p>
          <p className="mt-0.5 text-xs text-gray-500">Sign in with the Google account that manages your business to show all your Google reviews and your replies (instead of 5). Optional.</p>
          {summary?.oauth?.error && <p className="mt-1 text-xs text-red-600">{summary.oauth.error}</p>}
          {summary?.oauth?.connected
            ? <button type="button" onClick={signOut} disabled={busy} className="mt-2 text-xs font-semibold text-red-600 hover:underline">Remove access</button>
            : summary?.oauth?.configured ? <button type="button" onClick={signIn} disabled={busy} className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-gray-800 hover:bg-gray-50"><FaGoogle className="h-3 w-3 text-[#4285F4]" /> Sign in with Google</button>
            : <p className="mt-1 text-xs text-gray-400">Not available on this site yet.</p>}
        </div>
      )}

      {message && <p role={message.tone === "ok" ? "status" : "alert"} className={`mt-3 rounded-lg px-3 py-2 text-sm ${message.tone === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{message.text}</p>}
    </section>
  );
}
