"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaBell, FaCalendarCheck, FaCheckDouble, FaTrash } from "react-icons/fa";
import AdminSectionPage from "@/components/AdminSectionPage";
import { ADMIN_NOTIFICATIONS_CHANGED } from "@/components/AdminNotificationBell";
import { adminApi, type AdminNotice } from "@/lib/adminApi";

const changed = () => window.dispatchEvent(new Event(ADMIN_NOTIFICATIONS_CHANGED));
const fmt = (value: string) => new Date(value).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

/** Admin inbox: every new booking and every accept / decline / cancel / complete, shared by all admins. */
export default function AdminNotificationsPage() {
  const [items, setItems] = useState<AdminNotice[] | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [error, setError] = useState("");
  const load = useCallback(() => adminApi.notifications().then(({ data }) => { setItems(data); setError(""); }).catch((caught: Error) => setError(caught.message)), []);
  useEffect(() => { load(); }, [load]);

  const update = (next: AdminNotice[]) => { setItems(next); changed(); };
  const markRead = async (item: AdminNotice) => {
    if (item.read) return;
    await adminApi.markNotificationRead(item._id).catch(() => undefined);
    update((items ?? []).map((n) => (n._id === item._id ? { ...n, read: true } : n)));
  };
  const markAll = async () => { await adminApi.markAllNotificationsRead().catch((caught: Error) => setError(caught.message)); update((items ?? []).map((n) => ({ ...n, read: true }))); };
  const remove = async (item: AdminNotice) => { await adminApi.removeNotification(item._id).catch((caught: Error) => setError(caught.message)); update((items ?? []).filter((n) => n._id !== item._id)); };

  const unread = items?.filter((n) => !n.read).length ?? 0;
  const visible = (items ?? []).filter((n) => filter === "all" || !n.read);

  return (
    <AdminSectionPage title="Notifications" description="New bookings and every booking decision across the platform.">
      <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2" role="tablist">
            {(["all", "unread"] as const).map((value) => (
              <button key={value} type="button" role="tab" aria-selected={filter === value} onClick={() => setFilter(value)} className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${filter === value ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}>
                {value === "all" ? `All${items ? ` (${items.length})` : ""}` : `Unread (${unread})`}
              </button>
            ))}
          </div>
          {unread > 0 && <button type="button" onClick={markAll} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"><FaCheckDouble className="h-3.5 w-3.5" /> Mark all as read</button>}
        </div>
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {!items && !error && <p className="py-8 text-center text-sm text-gray-500">Loading…</p>}
        {items && visible.length === 0 && <p className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">{filter === "unread" ? "You're all caught up." : "No notifications yet. New bookings appear here."}</p>}
        <ul className="space-y-2">
          {visible.map((item) => (
            <li key={item._id} className={`flex gap-3 rounded-xl border p-4 ${item.read ? "border-gray-200" : "border-[#FFD60A] bg-[#FFD60A]/10"}`}>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${item.type === "booking" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}`} aria-hidden>{item.type === "booking" ? <FaCalendarCheck className="h-4 w-4" /> : <FaBell className="h-4 w-4" />}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900">{item.title}{!item.read && <span className="ml-2 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">NEW</span>}</p>
                {item.message && <p className="mt-0.5 text-sm text-gray-600">{item.message}</p>}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span>{fmt(item.createdAt)}</span>
                  {item.link && <Link href={item.link} onClick={() => markRead(item)} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-bold text-[#0b1f3b] hover:bg-gray-50">View booking</Link>}
                  {!item.read && <button type="button" onClick={() => markRead(item)} className="rounded-lg px-2 py-1.5 font-semibold text-gray-600 hover:bg-gray-100">Mark as read</button>}
                </div>
              </div>
              <button type="button" onClick={() => remove(item)} aria-label={`Delete notification: ${item.title}`} className="self-start rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600"><FaTrash className="h-3.5 w-3.5" /></button>
            </li>
          ))}
        </ul>
      </div>
    </AdminSectionPage>
  );
}
