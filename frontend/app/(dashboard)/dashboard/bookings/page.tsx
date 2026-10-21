"use client";

import Link from "next/link";
import { useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import SignInPrompt from "@/components/dashboard/SignInPrompt";
import { useUserData } from "@/components/dashboard/useUserData";
import { formatDate, formatMoney, userApi, type Booking } from "@/components/utils/userApi";

const filters: { label: string; value: Booking["status"] | "all" }[] = [
  { label: "All", value: "all" }, { label: "Pending", value: "pending" }, { label: "Scheduled", value: "scheduled" },
  { label: "Completed", value: "completed" }, { label: "Cancelled", value: "cancelled" },
];

const getStatusColor = (status: Booking["status"]) => {
  switch (status) {
    case "completed": return "bg-green-50 text-green-700 border-green-200";
    case "scheduled": return "bg-blue-50 text-blue-700 border-blue-200";
    case "pending": return "bg-amber-50 text-amber-700 border-amber-200";
    default: return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

const getStatusIcon = (status: Booking["status"]) => {
  switch (status) {
    case "completed": return <FaCheckCircle className="h-4 w-4" />;
    case "scheduled": return <FaCalendarAlt className="h-4 w-4" />;
    case "pending": return <FaClock className="h-4 w-4" />;
    default: return <FaTimesCircle className="h-4 w-4" />;
  }
};

export default function BookingsPage() {
  const { signedIn, data: bookings, setData, error, setError, loading } = useUserData(userApi.bookings);
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  if (!signedIn) return <SignInPrompt what="your bookings" />;

  const cancel = async (booking: Booking) => {
    if (!window.confirm(`Cancel your ${booking.service} booking with ${booking.providerName}?`)) return;
    setBusyId(booking._id);
    try {
      const { data } = await userApi.cancelBooking(booking._id);
      setData(bookings?.map((item) => (item._id === data._id ? data : item)));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not cancel the booking.");
    } finally {
      setBusyId(null);
    }
  };

  const visible = (bookings ?? []).filter((booking) => filter === "all" || booking.status === filter);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-gray-600">View and manage your plumbing service bookings.</p>
        </div>
        <Link href="/book-plumber" className="rounded-full bg-[#FFD60A] px-5 py-2.5 text-sm font-semibold text-[#0b1f3b] hover:brightness-95">+ New booking</Link>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {filters.map(({ label, value }) => (
          <button key={value} type="button" onClick={() => setFilter(value)} aria-pressed={filter === value}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold ${filter === value ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}>
            {label}{bookings ? ` (${value === "all" ? bookings.length : bookings.filter((booking) => booking.status === value).length})` : ""}
          </button>
        ))}
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">{error}</p>}
      {loading && <p className="py-8 text-center text-gray-500">Loading bookings…</p>}
      {!loading && visible.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
          {bookings?.length ? "No bookings with this status." : "You have no bookings yet. Send a request from any plumber's profile."}
        </div>
      )}

      <div className="space-y-4">
        {visible.map((booking) => (
          <div key={booking._id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-gray-900">{booking.providerName}</h3>
                <p className="mt-1 text-sm text-gray-600">{booking.service}{booking.quantity > 1 ? ` × ${booking.quantity}` : ""}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCalendarAlt className="h-4 w-4 text-[#FFD60A]" />
                    {booking.scheduledDate ? formatDate(booking.scheduledDate) : `Requested ${formatDate(booking.createdAt)}`}
                  </div>
                  {booking.timeSlot && (
                    <div className="flex items-center gap-2 text-sm text-gray-600"><FaClock className="h-4 w-4 text-[#FFD60A]" />{booking.timeSlot}</div>
                  )}
                  {booking.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-600"><FaMapMarkerAlt className="h-4 w-4 text-[#FFD60A]" />{booking.address}</div>
                  )}
                </div>
              </div>
              <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
                <div className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  {booking.status}
                </div>
                {booking.price !== undefined && booking.price !== null && <p className="text-2xl font-bold text-gray-900">{formatMoney(booking.price * booking.quantity)}</p>}
              </div>
            </div>

            {expanded === booking._id && (
              <dl className="mt-4 grid gap-2 rounded-lg bg-gray-50 p-4 text-sm text-gray-700 sm:grid-cols-2">
                <div><dt className="font-semibold">Booked via</dt><dd>{booking.source === "checkout" ? "Cart checkout" : "Booking request"}</dd></div>
                <div><dt className="font-semibold">Sent</dt><dd>{formatDate(booking.createdAt)}</dd></div>
                {booking.phone && <div><dt className="font-semibold">Phone</dt><dd>{booking.phone}</dd></div>}
                {booking.details && <div className="sm:col-span-2"><dt className="font-semibold">Notes</dt><dd className="whitespace-pre-line">{booking.details}</dd></div>}
              </dl>
            )}

            <div className="mt-4 flex gap-3 border-t border-gray-100 pt-4">
              <button type="button" onClick={() => setExpanded(expanded === booking._id ? null : booking._id)} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                {expanded === booking._id ? "Hide Details" : "View Details"}
              </button>
              {(booking.status === "pending" || booking.status === "scheduled") && (
                <button type="button" disabled={busyId === booking._id} onClick={() => cancel(booking)} className="flex-1 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60">
                  {busyId === booking._id ? "Cancelling…" : "Cancel Booking"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
