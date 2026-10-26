"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaBell, FaCalendarCheck, FaCheckDouble, FaTrash } from "react-icons/fa";
import { notificationsChanged, providerApi, timeAgo, type AccountNotice, type ProviderBase } from "./bookingsApi";

/** A company's or freelancer's notifications: new booking requests (with Accept / Decline), cancellations, and admin decisions. */
export default function AccountNotifications({ base }: { base: ProviderBase }) {
  const [items, setItems] = useState<AccountNotice[] | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [error, setError] = useState("");

  const load = useCallback(() => providerApi.notifications(base).then(({ data }) => { setItems(data); setError(""); }).catch((caught: Error) => setError(caught.message)), [base]);
  useEffect(() => { load(); }, [load]);

  const changed = (next: AccountNotice[]) => { setItems(next); notificationsChanged(); };
  const markRead = async (item: AccountNotice) => {
    if (item.read) return;
    await providerApi.markRead(base, item._id).catch(() => undefined);
    changed((items ?? []).map((n) => (n._id === item._id ? { ...n, read: true } : n)));
  };
  const markAll = async () => {
    await providerApi.markAllRead(base).catch((caught: Error) => setError(caught.message));
    changed((items ?? []).map((n) => ({ ...n, read: true })));
  };
  const remove = async (item: AccountNotice) => {
    await providerApi.removeNotification(base, item._id).catch((caught: Error) => setError(caught.message));
    changed((items ?? []).filter((n) => n._id !== item._id));
  };

  const unread = items?.filter((n) => !n.read).length ?? 0;
  const visible = (items ?? []).filter((n) => filter === "all" || !n.read);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">New booking requests, cancellations, and updates from Plumber Finder.</p>
        </div>
        {unread > 0 && <button type="button" onClick={markAll} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"><FaCheckDouble className="h-3.5 w-3.5" /> Mark all as read</button>}
      </div>

      <div className="flex gap-2" role="tablist">
        {(["all", "unread"] as const).map((value) => (
          <button key={value} type="button" role="tab" aria-selected={filter === value} onClick={() => setFilter(value)} className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${filter === value ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}>
            {value === "all" ? `All${items ? ` (${items.length})` : ""}` : `Unread (${unread})`}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
      {!items && !error && <p className="py-10 text-center text-sm text-gray-500">Loading notifications…</p>}
      {items && visible.length === 0 && <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">{filter === "unread" ? "You're all caught up." : "No notifications yet. You'll be notified here when a customer books you."}</div>}

      <ul className="space-y-2">
        {visible.map((item) => (
          <li key={item._id} className={`flex gap-3 rounded-2xl border p-4 transition ${item.read ? "border-gray-200 bg-white" : "border-[#FFD60A] bg-[#FFD60A]/10"}`}>
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${item.type === "booking" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}`} aria-hidden>{item.type === "booking" ? <FaCalendarCheck className="h-4 w-4" /> : <FaBell className="h-4 w-4" />}</span>
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 font-semibold text-gray-900">{item.title}{!item.read && <span className="rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">NEW</span>}</p>
              {item.message && <p className="mt-0.5 text-sm text-gray-600">{item.message}</p>}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span>{timeAgo(item.createdAt)}</span>
                {item.link && (
                  <Link href={item.link} onClick={() => markRead(item)} className={`rounded-lg px-3 py-1.5 font-bold ${item.actionRequired ? "bg-emerald-600 text-white hover:bg-emerald-700" : "border border-gray-200 bg-white text-[#0b1f3b] hover:bg-gray-50"}`}>
                    {item.actionRequired ? "Accept or decline" : "View booking"}
                  </Link>
                )}
                {!item.read && <button type="button" onClick={() => markRead(item)} className="rounded-lg px-2 py-1.5 font-semibold text-gray-600 hover:bg-white">Mark as read</button>}
              </div>
            </div>
            <button type="button" onClick={() => remove(item)} aria-label={`Delete notification: ${item.title}`} className="self-start rounded-lg p-2 text-gray-400 hover:bg-white hover:text-red-600"><FaTrash className="h-3.5 w-3.5" /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}
