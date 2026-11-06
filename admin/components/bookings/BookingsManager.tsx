"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable, FilterBar, Pager, Panel, StatusBadge, useAdminQuery } from "@/components/AdminData";
import { adminApi, formatDate, type BookingStatus } from "@/lib/adminApi";
import BookingDrawer from "./BookingDrawer";
import { statuses, statusLabels } from "./bookingLabels";

export default function BookingsManager() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("status");
  const openId = params.get("booking");
  const [status, setStatus] = useState(statuses.some((s) => s.value === initial) ? initial! : "all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useAdminQuery(`bookings|${status}|${search}|${page}`, () => adminApi.bookings({ status: status === "all" ? undefined : status, search, page }));
  const counts = data?.counts;
  const open = (id: string | null) => router.replace(id ? `/bookings?booking=${id}` : "/bookings", { scroll: false });

  return (
    <Panel title="All bookings" description="Every booking between customers and plumbers. Plumbers accept or decline their own requests; you can step in for any booking.">
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {statuses.slice(1).map((item) => (
          <button key={item.value} type="button" onClick={() => { setStatus(item.value); setPage(1); }} className={`rounded-xl border p-3 text-left transition hover:shadow-sm ${status === item.value ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 bg-white"}`}>
            <p className="text-xl font-bold">{counts ? counts[item.value as BookingStatus] : "–"}</p>
            <p className={`text-xs font-semibold ${status === item.value ? "text-white/80" : "text-gray-500"}`}>{item.label}</p>
          </button>
        ))}
      </div>
      <FilterBar search={search} onSearch={(value) => { setSearch(value); setPage(1); }} status={status} onStatus={(value) => { setStatus(value); setPage(1); }} statuses={statuses} placeholder="Search reference, customer, plumber, service…" />
      <DataTable head={["Reference", "Customer", "Plumber", "Service", "Visit", "Status", ""]} loading={loading} error={error} empty={!data?.data.length}>
        {data?.data.map((booking) => (
          <tr key={booking._id} onClick={() => open(booking._id)} className="cursor-pointer border-b border-gray-100 align-top hover:bg-gray-50">
            <td className="px-4 py-3"><p className="font-mono text-xs font-semibold text-gray-700">{booking.reference ?? "—"}</p><p className="text-xs text-gray-400">{formatDate(booking.createdAt)}</p></td>
            <td className="px-4 py-3"><p className="font-medium text-gray-900">{booking.user?.name ?? booking.customerName ?? "Deleted account"}</p><p className="text-xs text-gray-500">{booking.user?.email ?? booking.customerEmail}</p></td>
            <td className="px-4 py-3 text-gray-700">{booking.providerName}<p className="text-xs capitalize text-gray-500">{booking.providerType}{booking.providerAccount ? "" : " · sample"}</p></td>
            <td className="px-4 py-3 text-gray-700">{booking.service}{booking.address && <p className="text-xs text-gray-500">{booking.address}</p>}</td>
            <td className="px-4 py-3 text-gray-600">{booking.scheduledDate ? formatDate(booking.scheduledDate) : "Flexible"}{booking.timeSlot && <p className="text-xs text-gray-500">{booking.timeSlot}</p>}</td>
            <td className="px-4 py-3"><StatusBadge value={booking.status} label={statusLabels[booking.status]} /></td>
            <td className="px-4 py-3 text-right"><button type="button" onClick={(event) => { event.stopPropagation(); open(booking._id); }} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-white">View</button></td>
          </tr>
        ))}
      </DataTable>
      {data && <Pager page={data.page} limit={data.limit} total={data.total} onPage={setPage} />}
      {openId && <BookingDrawer key={openId} id={openId} onClose={() => open(null)} onChanged={reload} />}
    </Panel>
  );
}
