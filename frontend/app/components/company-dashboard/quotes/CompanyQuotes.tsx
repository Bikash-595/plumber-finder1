"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { FaCheckCircle, FaFileInvoiceDollar, FaHourglassHalf, FaPercent, FaPlus } from "react-icons/fa";
import EmptyState from "@/components/dashboard/ui/EmptyState";
import FilterTabs from "@/components/dashboard/ui/FilterTabs";
import Notice from "@/components/dashboard/ui/Notice";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import SearchBox from "@/components/dashboard/ui/SearchBox";
import { SkeletonRows } from "@/components/dashboard/ui/Skeleton";
import StatusPill from "@/components/dashboard/ui/StatusPill";
import { formatMoney, useCompanyData } from "../companyApi";
import { growthApi, type Quote, type QuotesPage } from "../growthApi";
import KpiCard from "../ui/KpiCard";
import QuoteBuilder from "./QuoteBuilder";
import QuoteDetail from "./QuoteDetail";
import { quoteStatus } from "./quoteStatus";

const tabs = [{ value: "", label: "All" }, { value: "draft", label: "Drafts" }, { value: "sent", label: "Waiting" }, { value: "accepted", label: "Accepted" }, { value: "declined", label: "Declined" }] as const;

/** /company-dashboard/quotes — itemised estimates for bookings; customers accept them from their dashboard. */
export default function CompanyQuotes() {
  const params = useSearchParams();
  const [status, setStatus] = useState<(typeof tabs)[number]["value"]>("");
  const [q, setQ] = useState("");
  const [builder, setBuilder] = useState<{ draft?: Quote | null; bookingId?: string | null } | null>(() => (params.get("booking") ? { bookingId: params.get("booking") } : null));
  const [viewing, setViewing] = useState<Quote | null>(null);
  const [notice, setNotice] = useState("");
  const { data, error, loading, reload } = useCompanyData<QuotesPage>(`company-quotes-${status}-${q}`, () => growthApi.quotes({ status, q }));
  const onSearch = useCallback((value: string) => setQ(value), []);
  const done = (message: string) => { setNotice(message); setBuilder(null); setViewing(null); reload(); };

  return (
    <div className="space-y-6">
      <PageHeader icon={FaFileInvoiceDollar} title="Quotes" description="Send itemised estimates. When a customer accepts, the total becomes the booking's price."
        actions={<button type="button" onClick={() => setBuilder({})} className="inline-flex items-center gap-2 rounded-full bg-[#FFD60A] px-5 py-2.5 text-sm font-bold text-[#0b1f3b] hover:brightness-95"><FaPlus className="h-3 w-3" /> New quote</button>} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Waiting for customers" icon={FaHourglassHalf} tone="warning" loading={loading} value={data?.counts?.sent ?? "–"} hint={data?.value ? `${formatMoney(data.value.open)} open` : undefined} />
        <KpiCard label="Accepted" icon={FaCheckCircle} tone="success" loading={loading} value={data?.counts?.accepted ?? "–"} hint={data?.value ? `${formatMoney(data.value.won)} won` : undefined} />
        <KpiCard label="Acceptance rate" icon={FaPercent} tone="info" loading={loading} value={data?.acceptanceRate == null ? "—" : `${data.acceptanceRate}%`} hint="Of answered quotes" />
        <KpiCard label="Drafts" icon={FaFileInvoiceDollar} tone="neutral" loading={loading} value={data?.counts?.draft ?? "–"} hint="Not sent yet" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs label="Quote status" value={status} onChange={setStatus} options={tabs.map((t) => ({ ...t, count: t.value ? data?.counts?.[t.value] : undefined }))} />
        <SearchBox label="Search quotes" placeholder="Customer, Q- or BK- number" value={q} onChange={onSearch} />
      </div>
      <Notice tone="success">{notice}</Notice>
      <Notice>{error}</Notice>
      {loading ? <SkeletonRows rows={3} className="h-16" /> : !data?.data.length ? (
        <EmptyState icon={FaFileInvoiceDollar} title={q || status ? "No matching quotes" : "No quotes yet"} text={q || status ? undefined : "Price a job line by line and send it — customers accept with one click."} />
      ) : (
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
          {data.data.map((quote) => (
            <li key={quote._id}>
              <button type="button" onClick={() => setViewing(quote)} className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 text-left hover:bg-gray-50">
                <span className="min-w-0 flex-1 basis-56"><span className="block truncate font-semibold text-gray-900">{quote.title || "Quote"} <span className="font-mono text-xs font-normal text-gray-400">{quote.number}</span></span><span className="block truncate text-xs text-gray-500">{quote.customerName ?? "Customer"} · booking {quote.bookingReference} · {new Date(quote.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span></span>
                <StatusPill tone={quoteStatus[quote.status].tone}>{quoteStatus[quote.status].label}</StatusPill>
                <span className="w-28 text-right text-base font-bold tabular-nums text-gray-900">{formatMoney(quote.total)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {builder && <QuoteBuilder open draft={builder.draft} bookingId={builder.bookingId} onClose={() => setBuilder(null)} onSaved={(_q, message) => done(message)} />}
      <QuoteDetail quote={viewing} onClose={() => setViewing(null)} onEdit={(quote) => { setViewing(null); setBuilder({ draft: quote }); }} onChanged={done} />
    </div>
  );
}
