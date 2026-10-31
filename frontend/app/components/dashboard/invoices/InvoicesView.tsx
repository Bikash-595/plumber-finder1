"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { FaCheckCircle, FaClock, FaFileInvoice, FaUndo } from "react-icons/fa";
import { formatMoney, userApi, type Invoice, type InvoicePageExtra } from "@/components/utils/userApi";
import SignInPrompt from "../SignInPrompt";
import { usePagedList } from "../useUserData";
import EmptyState from "../ui/EmptyState";
import FilterTabs from "../ui/FilterTabs";
import LoadMore from "../ui/LoadMore";
import Notice from "../ui/Notice";
import PageHeader from "../ui/PageHeader";
import SearchBox from "../ui/SearchBox";
import { SkeletonRows } from "../ui/Skeleton";
import StatCard from "../ui/StatCard";
import InvoiceRow from "./InvoiceRow";
import { invoiceStatus } from "./invoiceStatus";

type Filter = Invoice["status"] | "all";
const order: Invoice["status"][] = ["pending", "paid", "refunded", "cancelled"];

/** /dashboard/invoices — money owed and paid, then every invoice, filtered and searchable, one page at a time. */
export default function InvoicesView() {
  // Remount when the navbar search sends a new ?q=, so the list starts from that search.
  const initialSearch = useSearchParams().get("q") ?? "";
  return <InvoicesViewContent key={initialSearch} initialSearch={initialSearch} />;
}

function InvoicesViewContent({ initialSearch }: { initialSearch: string }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState(initialSearch);
  const status = filter === "all" ? undefined : filter;
  const list = usePagedList<Invoice, InvoicePageExtra>(`invoices?status=${status ?? ""}&q=${search}`, (cursor) => userApi.invoicesPage({ status, q: search, cursor }));
  const onSearch = useCallback((value: string) => setSearch(value), []);

  if (!list.signedIn) return <SignInPrompt what="your invoices" />;

  const summary = list.extra.summary;
  const all = summary ? Object.values(summary.counts).reduce((sum, count) => sum + count, 0) : undefined;

  return (
    <div className="space-y-6">
      <PageHeader icon={FaFileInvoice} title="Invoices" description="Invoices are created when you check out your cart. Download any of them for your records." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Amount due" icon={FaClock} tone="warning" loading={!summary} value={formatMoney(summary?.totals.pending ?? 0)} hint={`${summary?.counts.pending ?? 0} unpaid invoice(s)`} />
        <StatCard label="Total paid" icon={FaCheckCircle} tone="success" loading={!summary} value={formatMoney(summary?.totals.paid ?? 0)} hint={`${summary?.counts.paid ?? 0} paid invoice(s)`} />
        <StatCard label="Refunded" icon={FaUndo} tone="info" loading={!summary} value={formatMoney(summary?.totals.refunded ?? 0)} hint={`${summary?.counts.refunded ?? 0} refund(s)`} />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs label="Filter invoices" value={filter} onChange={setFilter}
          options={[{ value: "all" as Filter, label: "All", count: all }, ...order.map((value) => ({ value, label: invoiceStatus[value].label, count: summary?.counts[value] }))]} />
        <SearchBox label="Search invoices" placeholder="Invoice number, plumber or service" value={search} onChange={onSearch} />
      </div>

      <Notice>{list.error}</Notice>

      {list.loading ? <SkeletonRows rows={4} className="h-16" /> : list.items.length === 0 ? (
        <EmptyState icon={FaFileInvoice} title={search || filter !== "all" ? "No matching invoices" : "No invoices yet"} text={search || filter !== "all" ? "Try another status or search." : "Add services to your cart and check out to get an invoice."} />
      ) : (
        <>
          <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
            {list.items.map((invoice) => <InvoiceRow key={invoice._id} invoice={invoice} />)}
          </ul>
          <LoadMore hasMore={list.hasMore} loading={list.loadingMore} onClick={list.loadMore} shown={list.items.length} noun="invoices" />
        </>
      )}
    </div>
  );
}
