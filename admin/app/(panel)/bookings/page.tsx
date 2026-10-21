"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminSectionPage from "@/components/AdminSectionPage";
import { DataTable, FilterBar, Pager, Panel, StatusBadge, useAdminQuery } from "@/components/AdminData";
import { adminApi, formatDate, type BookingStatus } from "@/lib/adminApi";

const statuses = [{ value: "all", label: "All" }, { value: "pending", label: "Pending" }, { value: "scheduled", label: "Scheduled" }, { value: "completed", label: "Completed" }, { value: "cancelled", label: "Cancelled" }];
// Mirrors the backend rules: completed and cancelled are final.
const actions: Record<BookingStatus, { label: string; status: Exclude<BookingStatus, "pending">; tone: string }[]> = {
  pending: [{ label: "Schedule", status: "scheduled", tone: "bg-blue-600 text-white" }, { label: "Cancel", status: "cancelled", tone: "border border-red-200 text-red-600" }],
  scheduled: [{ label: "Complete", status: "completed", tone: "bg-emerald-600 text-white" }, { label: "Cancel", status: "cancelled", tone: "border border-red-200 text-red-600" }],
  completed: [],
  cancelled: [],
};

function BookingsManager() {
  const params = useSearchParams();
  const initial = params.get("status");
  const [status, setStatus] = useState(statuses.some((s) => s.value === initial) ? initial! : "all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { data, error, setError, loading, reload } = useAdminQuery(`bookings|${status}|${search}|${page}`, () => adminApi.bookings({ status: status === "all" ? undefined : status, search, page }));

  const change = async (id: string, next: Exclude<BookingStatus, "pending">) => {
    if (next === "cancelled" && !window.confirm("Cancel this booking? The customer will be notified.")) return;
    setBusyId(id);
    try { await adminApi.setBookingStatus(id, next); await reload(); } catch (caught) { setError(caught instanceof Error ? caught.message : "Update failed."); } finally { setBusyId(null); }
  };

  return (
    <Panel title="All bookings" description="Move bookings forward. Customers are notified of every change.">
      <FilterBar search={search} onSearch={(value) => { setSearch(value); setPage(1); }} status={status} onStatus={(value) => { setStatus(value); setPage(1); }} statuses={statuses} placeholder="Search plumber, service, or address…" />
      <DataTable head={["Customer", "Plumber", "Service", "Date", "Source", "Status", "Actions"]} loading={loading} error={error} empty={!data?.data.length}>
        {data?.data.map((booking) => (
          <tr key={booking._id} className="border-b border-gray-100 align-top hover:bg-gray-50">
            <td className="px-4 py-3"><p className="font-medium text-gray-900">{booking.user?.name ?? "Deleted account"}</p><p className="text-xs text-gray-500">{booking.user?.email}</p></td>
            <td className="px-4 py-3 text-gray-700">{booking.providerName}</td>
            <td className="px-4 py-3 text-gray-700">{booking.service}{booking.address && <p className="text-xs text-gray-500">{booking.address}</p>}</td>
            <td className="px-4 py-3 text-gray-600">{booking.scheduledDate ? formatDate(booking.scheduledDate) : "Flexible"}{booking.timeSlot && <p className="text-xs text-gray-500">{booking.timeSlot}</p>}<p className="text-xs text-gray-400">Sent {formatDate(booking.createdAt)}</p></td>
            <td className="px-4 py-3 capitalize text-gray-600">{booking.source}</td>
            <td className="px-4 py-3"><StatusBadge value={booking.status} /></td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                {actions[booking.status].length ? actions[booking.status].map((action) => (
                  <button key={action.label} type="button" disabled={busyId === booking._id} onClick={() => change(booking._id, action.status)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50 ${action.tone}`}>{action.label}</button>
                )) : <span className="text-xs text-gray-400">Final</span>}
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
      {data && <Pager page={data.page} limit={data.limit} total={data.total} onPage={setPage} />}
    </Panel>
  );
}

export default function AdminBookingsPage() {
  return (
    <AdminSectionPage title="Bookings" description="Every customer booking request and checkout order on the platform.">
      <Suspense fallback={null}><BookingsManager /></Suspense>
    </AdminSectionPage>
  );
}
