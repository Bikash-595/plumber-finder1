"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEnvelope, FaLock, FaPhoneAlt } from "react-icons/fa";
import Drawer from "@/components/dashboard/ui/Drawer";
import StatusPill from "@/components/dashboard/ui/StatusPill";
import MessageButton from "@/components/messages/MessageButton";
import { Stars } from "@/components/reviews/Stars";
import { formatMoney } from "../companyApi";
import { stageLabel } from "../jobs/jobStages";
import { operationsApi, visitDate, type CustomerDetail, type CustomerRow } from "../operationsApi";

const tones: Record<string, "info" | "success" | "warning" | "danger" | "neutral" | "violet"> = { pending: "warning", scheduled: "info", in_progress: "violet", awaiting_confirmation: "warning", completed: "success", disputed: "danger", cancelled: "neutral", declined: "neutral" };

/** One customer: contact (once you've accepted a booking), totals, every booking with you, and their reviews. */
export default function CustomerDrawer({ customer, onClose }: { customer: CustomerRow | null; onClose: () => void }) {
  const [detail, setDetail] = useState<{ id: string; data: CustomerDetail } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!customer) return;
    let cancelled = false;
    operationsApi.customer(customer.id).then(({ data }) => { if (!cancelled) setDetail({ id: customer.id, data }); }).catch((caught: Error) => { if (!cancelled) setError(caught.message); });
    return () => { cancelled = true; };
  }, [customer]);
  const data = detail?.id === customer?.id ? detail?.data : null;
  const latestOpen = data?.bookings.find((b) => b.status !== "declined");

  return (
    <Drawer open={Boolean(customer)} onClose={onClose} title={customer?.name ?? "Customer"} subtitle={customer ? `Customer since ${new Date(customer.firstBooked).toLocaleDateString("en-US", { month: "long", year: "numeric" })}` : undefined}>
      {customer && (
        <div className="space-y-6">
          <dl className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-gray-50 p-3"><dt className="text-xs text-gray-500">Bookings</dt><dd className="text-xl font-bold tabular-nums">{customer.bookings}</dd></div>
            <div className="rounded-xl bg-gray-50 p-3"><dt className="text-xs text-gray-500">Completed</dt><dd className="text-xl font-bold tabular-nums">{customer.completed}</dd></div>
            <div className="rounded-xl bg-emerald-50 p-3"><dt className="text-xs text-emerald-800">Spent</dt><dd className="text-xl font-bold tabular-nums text-emerald-900">{formatMoney(customer.spent)}</dd></div>
          </dl>
          {customer.contactVisible ? (
            <div className="space-y-1.5 text-sm">
              {customer.phone && <a href={`tel:${customer.phone}`} className="flex items-center gap-2 font-semibold text-[#0b1f3b] hover:underline"><FaPhoneAlt className="h-3 w-3" />{customer.phone}</a>}
              {customer.email && <a href={`mailto:${customer.email}`} className="flex items-center gap-2 break-all text-[#0b1f3b] hover:underline"><FaEnvelope className="h-3 w-3" />{customer.email}</a>}
            </div>
          ) : <p className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-600"><FaLock className="h-3 w-3" />Contact details are shared once you accept one of their bookings.</p>}
          {latestOpen && <MessageButton base="/companies" bookingId={latestOpen._id} label="Message customer" />}
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Bookings</h3>
            {!data ? <div className="mt-2 h-24 animate-pulse rounded-xl bg-gray-100" /> : (
              <ul className="mt-2 divide-y divide-gray-100 rounded-xl border border-gray-200">
                {data.bookings.map((b) => (
                  <li key={b._id}>
                    <Link href={`/company-dashboard/bookings?booking=${b._id}`} className="flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-50">
                      <span className="min-w-0 flex-1"><span className="block truncate font-semibold text-gray-900">{b.service}</span><span className="block text-xs text-gray-500"><span className="font-mono">{b.reference}</span> · {visitDate(b.scheduledDate)}</span></span>
                      {b.price ? <span className="text-sm font-semibold tabular-nums">{formatMoney(b.price * (b.quantity ?? 1))}</span> : null}
                      <StatusPill tone={tones[b.status] ?? "neutral"}>{stageLabel[b.status] ?? (b.status === "pending" ? "New request" : "Declined")}</StatusPill>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
          {data && data.reviews.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Their reviews of you</h3>
              <ul className="mt-2 space-y-2">{data.reviews.map((r) => <li key={r._id} className="rounded-xl border border-gray-200 p-3 text-sm"><Stars value={r.rating} size="h-3 w-3" />{r.title && <p className="mt-1 font-semibold text-gray-900">{r.title}</p>}<p className="text-gray-700">{r.body}</p>{!r.reply && <Link href="/company-dashboard/business-profile/reviews" className="mt-1 inline-block text-xs font-semibold text-[#8a7300] hover:underline">Reply →</Link>}</li>)}</ul>
            </section>
          )}
        </div>
      )}
    </Drawer>
  );
}
