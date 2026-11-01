"use client";

import { useCallback, useState } from "react";
import { FaDollarSign, FaRedo, FaUsers, FaUserCheck } from "react-icons/fa";
import UserAvatar from "@/components/UserAvatar";
import EmptyState from "@/components/dashboard/ui/EmptyState";
import Notice from "@/components/dashboard/ui/Notice";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import SearchBox from "@/components/dashboard/ui/SearchBox";
import { SkeletonRows } from "@/components/dashboard/ui/Skeleton";
import { formatMoney, useCompanyData } from "../companyApi";
import KpiCard from "../ui/KpiCard";
import { operationsApi, type CustomerRow, type CustomersPage } from "../operationsApi";
import CustomerDrawer from "./CustomerDrawer";

const sorts = [{ value: "recent", label: "Most recent" }, { value: "bookings", label: "Most bookings" }, { value: "spent", label: "Highest spend" }, { value: "name", label: "Name A–Z" }];
const short = (value: string) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/** /company-dashboard/customers — everyone who has booked you, with totals; open one for their history. */
export default function CompanyCustomers() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<CustomerRow | null>(null);
  const { data, error, loading } = useCompanyData<CustomersPage>(`company-customers-${q}-${sort}-${page}`, () => operationsApi.customers({ q, sort, page }));
  const onSearch = useCallback((value: string) => { setQ(value); setPage(1); }, []);
  const pages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;
  const s = data?.summary;

  return (
    <div className="space-y-6">
      <PageHeader icon={FaUsers} title="Customers" description="Everyone who has booked you, with what they booked and spent. Contact details appear once you've accepted one of their bookings." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Customers" icon={FaUsers} tone="info" loading={loading} value={s?.customers ?? "–"} hint={q ? "Matching your search" : "All time"} />
        <KpiCard label="Repeat customers" icon={FaRedo} tone="violet" loading={loading} value={s ? `${s.repeat}` : "–"} hint={s?.customers ? `${Math.round((s.repeat / s.customers) * 100)}% booked again` : "Booked more than once"} />
        <KpiCard label="Revenue" icon={FaDollarSign} tone="success" loading={loading} value={s ? formatMoney(s.spent) : "–"} hint="From completed jobs" />
        <KpiCard label="Average per customer" icon={FaUserCheck} tone="brand" loading={loading} value={s ? formatMoney(s.avgPerCustomer) : "–"} hint="Lifetime value" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox label="Search customers" placeholder="Name or email" value={q} onChange={onSearch} />
        <label className="flex items-center gap-2 text-sm text-gray-600">Sort
          <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800">{sorts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
        </label>
      </div>
      <Notice>{error}</Notice>
      {loading ? <SkeletonRows rows={4} className="h-14" /> : !data?.data.length ? (
        <EmptyState icon={FaUsers} title={q ? "No matching customers" : "No customers yet"} text={q ? undefined : "Customers appear here after their first booking request."} />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm md:block">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500"><th scope="col" className="px-5 py-3 font-semibold">Customer</th><th scope="col" className="px-3 py-3 text-right font-semibold">Bookings</th><th scope="col" className="px-3 py-3 font-semibold">Last service</th><th scope="col" className="px-3 py-3 font-semibold">Last booked</th><th scope="col" className="px-5 py-3 text-right font-semibold">Spent</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {data.data.map((c) => (
                  <tr key={c.id} className="cursor-pointer transition hover:bg-gray-50" onClick={() => setOpen(c)}>
                    <td className="px-5 py-3"><button type="button" onClick={() => setOpen(c)} className="flex items-center gap-3 text-left"><UserAvatar name={c.name ?? "Customer"} size={36} /><span><span className="block font-semibold text-gray-900">{c.name ?? "Customer"}</span><span className="block text-xs text-gray-500">{c.contactVisible ? c.email : "Contact after acceptance"}</span></span></button></td>
                    <td className="px-3 py-3 text-right tabular-nums">{c.bookings}{c.active ? <span className="ml-1 rounded-full bg-amber-50 px-1.5 text-[11px] font-semibold text-amber-800">{c.active} open</span> : null}</td>
                    <td className="px-3 py-3 text-gray-700">{c.lastService}</td>
                    <td className="px-3 py-3 text-gray-500">{short(c.lastBooked)}</td>
                    <td className="px-5 py-3 text-right font-semibold tabular-nums">{formatMoney(c.spent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="space-y-2 md:hidden">
            {data.data.map((c) => (
              <li key={c.id}><button type="button" onClick={() => setOpen(c)} className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 text-left shadow-sm"><UserAvatar name={c.name ?? "Customer"} size={40} /><span className="min-w-0 flex-1"><span className="block truncate font-semibold text-gray-900">{c.name ?? "Customer"}</span><span className="block text-xs text-gray-500">{c.bookings} booking{c.bookings === 1 ? "" : "s"} · last {short(c.lastBooked)}</span></span><span className="font-semibold tabular-nums">{formatMoney(c.spent)}</span></button></li>
            ))}
          </ul>
          {pages > 1 && <div className="flex items-center justify-center gap-3 text-sm"><button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-full border border-gray-200 px-4 py-1.5 font-semibold disabled:opacity-40">Previous</button><span className="text-gray-500">Page {page} of {pages}</span><button type="button" disabled={page >= pages} onClick={() => setPage(page + 1)} className="rounded-full border border-gray-200 px-4 py-1.5 font-semibold disabled:opacity-40">Next</button></div>}
        </>
      )}
      <CustomerDrawer customer={open} onClose={() => setOpen(null)} />
    </div>
  );
}
