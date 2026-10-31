"use client";

import Link from "next/link";
import { useState } from "react";
import { FaCalendarAlt, FaChevronDown, FaClock, FaMapMarkerAlt, FaPhoneAlt, FaTag } from "react-icons/fa";
import { formatDate, formatMoney, type Booking } from "@/components/utils/userApi";
import StatusPill from "../ui/StatusPill";
import BookingTimeline from "./BookingTimeline";
import { bookingStatus, bookingTotal, canCancel } from "./bookingStatus";

const providerHref = (booking: Booking) => `/plumber/${encodeURIComponent(booking.providerId)}`;

/** One booking: who, what, when, price and status, with details and the timeline on demand. */
export default function BookingCard({ booking, busy, onCancel }: { booking: Booking; busy: boolean; onCancel: (booking: Booking) => void }) {
  const [open, setOpen] = useState(false);
  const status = bookingStatus[booking.status];
  const total = bookingTotal(booking);

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone={status.tone} icon={status.icon}>{status.label}</StatusPill>
            {booking.reference && <span className="font-mono text-xs text-gray-500">{booking.reference}</span>}
          </div>
          <h3 className="mt-2 text-lg font-bold text-gray-900">{booking.service}{booking.quantity > 1 ? ` × ${booking.quantity}` : ""}</h3>
          <Link href={providerHref(booking)} className="text-sm font-semibold text-[#0b1f3b] hover:underline">{booking.providerName}</Link>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-600">
            <li className="flex items-center gap-1.5"><FaCalendarAlt className="h-3.5 w-3.5 text-[#b39200]" />{booking.scheduledDate ? formatDate(booking.scheduledDate) : "Date to be confirmed"}</li>
            {booking.timeSlot && <li className="flex items-center gap-1.5"><FaClock className="h-3.5 w-3.5 text-[#b39200]" />{booking.timeSlot}</li>}
            {booking.address && <li className="flex min-w-0 items-center gap-1.5"><FaMapMarkerAlt className="h-3.5 w-3.5 shrink-0 text-[#b39200]" /><span className="truncate">{booking.address}</span></li>}
          </ul>
        </div>

        <div className="flex items-end justify-between gap-3 sm:flex-col sm:items-end">
          {total !== null ? (
            <div className="text-left sm:text-right">
              {booking.discountAmount ? <p className="text-xs text-gray-400 line-through">{formatMoney((booking.originalPrice ?? booking.price ?? 0) * booking.quantity)}</p> : null}
              <p className="text-2xl font-bold tabular-nums text-gray-900">{formatMoney(total)}</p>
            </div>
          ) : <p className="text-sm font-medium text-gray-500">Quote on request</p>}
          {booking.couponCode && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700"><FaTag className="h-2.5 w-2.5" />{booking.couponCode}{booking.couponLabel ? ` · ${booking.couponLabel}` : ""}</span>}
        </div>
      </div>

      {booking.status === "pending" && <p className="mx-5 mb-4 rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-800 sm:mx-6">Waiting for {booking.providerName} to accept. You&apos;ll get a notification as soon as they reply.</p>}
      {booking.responseNote && (
        <p className={`mx-5 mb-4 rounded-xl px-4 py-2.5 text-sm sm:mx-6 ${booking.status === "declined" || booking.status === "cancelled" ? "bg-red-50 text-red-800" : "bg-blue-50 text-blue-800"}`}>
          <span className="font-semibold">{booking.status === "declined" ? "Reason: " : booking.status === "cancelled" ? "Cancellation reason: " : `Message from ${booking.providerName}: `}</span>{booking.responseNote}
        </p>
      )}

      {open && (
        <div className="grid gap-6 border-t border-gray-100 bg-gray-50/60 px-5 py-5 sm:grid-cols-2 sm:px-6">
          <dl className="space-y-3 text-sm">
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Booked via</dt><dd className="text-gray-900">{booking.source === "checkout" ? "Cart checkout" : "Booking request"}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Sent</dt><dd className="text-gray-900">{formatDate(booking.createdAt)}</dd></div>
            {booking.phone && <div><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Phone</dt><dd className="flex items-center gap-1.5 text-gray-900"><FaPhoneAlt className="h-3 w-3 text-gray-400" />{booking.phone}</dd></div>}
            {booking.details && <div><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Your notes</dt><dd className="whitespace-pre-line text-gray-900">{booking.details}</dd></div>}
          </dl>
          {booking.history?.length ? (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Timeline</p>
              <BookingTimeline history={booking.history} />
            </div>
          ) : null}
        </div>
      )}

      <footer className="flex flex-wrap gap-2 border-t border-gray-100 px-5 py-3 sm:px-6">
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100">
          {open ? "Hide details" : "View details"} <FaChevronDown className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`} />
        </button>
        {booking.status === "completed" && <Link href={`${providerHref(booking)}#reviews`} className="rounded-full px-3 py-1.5 text-sm font-semibold text-[#0b1f3b] hover:bg-[#FFD60A]/20">Write a review</Link>}
        {(booking.status === "completed" || booking.status === "cancelled" || booking.status === "declined") && (
          <Link href={`/book-plumber?plumber=${encodeURIComponent(booking.providerId)}`} className="rounded-full px-3 py-1.5 text-sm font-semibold text-[#0b1f3b] hover:bg-[#FFD60A]/20">{booking.status === "declined" ? "Try again" : "Book again"}</Link>
        )}
        {booking.status === "declined" && <Link href="/find" className="rounded-full px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100">Find another plumber</Link>}
        {canCancel(booking) && (
          <button type="button" disabled={busy} onClick={() => onCancel(booking)} className="ml-auto rounded-full px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60">
            {busy ? "Cancelling…" : "Cancel booking"}
          </button>
        )}
      </footer>
    </article>
  );
}
