"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaBell, FaCalendarCheck, FaCheckDouble, FaCommentDots, FaStar, FaTrash } from "react-icons/fa";
import EmptyState from "@/components/dashboard/ui/EmptyState";
import FilterTabs from "@/components/dashboard/ui/FilterTabs";
import LoadMore from "@/components/dashboard/ui/LoadMore";
import Notice from "@/components/dashboard/ui/Notice";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import { SkeletonRows } from "@/components/dashboard/ui/Skeleton";
import { dayLabel } from "@/components/dashboard/ui/format";
import { notificationsChanged, providerApi, timeAgo, type AccountNotice, type ProviderBase } from "./bookingsApi";

type Filter = "all" | "unread" | AccountNotice["type"];
const kinds: Record<AccountNotice["type"], { label: string; icon: React.ReactNode; tone: string; cta: string }> = {
  booking: { label: "Bookings", icon: <FaCalendarCheck className="h-4 w-4" />, tone: "bg-blue-50 text-blue-700", cta: "View booking" },
  review: { label: "Reviews", icon: <FaStar className="h-4 w-4" />, tone: "bg-[#FFD60A]/25 text-[#8a7300]", cta: "View review" },
  comment: { label: "Comments", icon: <FaCommentDots className="h-4 w-4" />, tone: "bg-orange-50 text-[#c2410c]", cta: "View comment" },
  system: { label: "Account", icon: <FaBell className="h-4 w-4" />, tone: "bg-gray-100 text-gray-600", cta: "Open" },
};

/** Groups rows (newest first) under Today / Yesterday / … in one pass. */
function byDay(items: AccountNotice[]) {
  const groups: { label: string; items: AccountNotice[] }[] = [];
  for (const item of items) {
    const label = dayLabel(item.createdAt);
    if (groups.at(-1)?.label === label) groups.at(-1)!.items.push(item);
    else groups.push({ label, items: [item] });
  }
  return groups;
}

/**
 * A company's or freelancer's notifications: booking requests (with Accept / Decline), job updates, reviews and
 * account messages — filtered by type, grouped by day, and loaded a page at a time.
 */
export default function AccountNotifications({ base }: { base: ProviderBase }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [state, setState] = useState<{ filter: Filter; items: AccountNotice[]; cursor: string | null; unread: number; byType: Partial<Record<AccountNotice["type"], number>> } | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const query = useCallback((cursor?: string | null) => providerApi.notificationsPage(base, { type: filter === "all" || filter === "unread" ? undefined : filter, unread: filter === "unread", cursor }), [base, filter]);
  const load = useCallback(() => query().then((page) => { setState({ filter, items: page.data, cursor: page.nextCursor, unread: page.unread, byType: page.unreadByType ?? {} }); setError(""); }).catch((caught: Error) => setError(caught.message)), [query, filter]);
  useEffect(() => { load(); }, [load]);

  const current = state?.filter === filter ? state : null;
  const items = current?.items ?? [];
  const update = (change: (rows: AccountNotice[]) => AccountNotice[], unreadDelta = 0, type?: AccountNotice["type"]) => {
    setState((s) => s && { ...s, items: change(s.items), unread: Math.max(0, s.unread + unreadDelta), byType: type ? { ...s.byType, [type]: Math.max(0, (s.byType[type] ?? 0) + unreadDelta) } : s.byType });
    notificationsChanged();
  };
  const markRead = async (item: AccountNotice) => {
    if (item.read) return;
    update((rows) => (filter === "unread" ? rows.filter((n) => n._id !== item._id) : rows.map((n) => (n._id === item._id ? { ...n, read: true } : n))), -1, item.type);
    await providerApi.markRead(base, item._id).catch(() => undefined);
  };
  const markAll = async () => {
    try { await providerApi.markAllRead(base); setState((s) => s && { ...s, items: filter === "unread" ? [] : s.items.map((n) => ({ ...n, read: true })), unread: 0, byType: {} }); notificationsChanged(); } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not update."); }
  };
  const remove = async (item: AccountNotice) => {
    try { await providerApi.removeNotification(base, item._id); update((rows) => rows.filter((n) => n._id !== item._id), item.read ? 0 : -1, item.type); } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not delete."); }
  };
  const more = async () => {
    if (!current?.cursor) return;
    setLoadingMore(true);
    try { const page = await query(current.cursor); setState((s) => s && { ...s, items: [...s.items, ...page.data], cursor: page.nextCursor }); } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not load more."); } finally { setLoadingMore(false); }
  };

  const unread = state?.unread ?? 0;
  const options: { value: Filter; label: string; count?: number }[] = [
    { value: "all", label: "All" },
    { value: "unread", label: "Unread", count: unread },
    ...(Object.keys(kinds) as AccountNotice["type"][]).map((type) => ({ value: type as Filter, label: kinds[type].label, count: state?.byType[type] || undefined })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader icon={FaBell} title="Notifications" description={!state ? "Loading…" : unread ? `${unread} unread — booking requests, job updates, reviews and account messages.` : "You're all caught up."}
        actions={unread > 0 && <button type="button" onClick={markAll} className="inline-flex items-center gap-2 rounded-full bg-[#0b1f3b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#17345a]"><FaCheckDouble className="h-3.5 w-3.5" /> Mark all as read</button>} />
      <FilterTabs label="Filter notifications" value={filter} onChange={setFilter} options={options} />
      <Notice>{error}</Notice>

      {!current && !error ? <SkeletonRows rows={4} className="h-20" /> : items.length === 0 ? (
        <EmptyState icon={FaBell} title={filter === "all" ? "No notifications yet" : "Nothing here"} text={filter === "all" ? "You'll be notified here when a customer books you, confirms a job or leaves a review." : "No notifications match this filter."} />
      ) : (
        <div className="space-y-5">
          {byDay(items).map((group) => (
            <section key={group.label} aria-label={group.label}>
              <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-gray-500">{group.label}</h2>
              <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                {group.items.map((item) => {
                  const kind = kinds[item.type] ?? kinds.system;
                  return (
                    <li key={item._id} className={`group relative flex gap-3 px-4 py-4 sm:px-5 ${item.read ? "" : "bg-[#FFD60A]/[0.07]"}`}>
                      {!item.read && <span className="absolute left-0 top-0 h-full w-1 bg-[#FFD60A]" aria-hidden />}
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${kind.tone}`} aria-hidden>{kind.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm ${item.read ? "font-medium text-gray-700" : "font-bold text-gray-900"}`}>{item.title}{!item.read && <span className="sr-only"> (unread)</span>}</p>
                        {item.message && <p className="mt-0.5 text-sm text-gray-600">{item.message}</p>}
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <time dateTime={item.createdAt}>{timeAgo(item.createdAt)}</time>
                          {item.link && (
                            <Link href={item.link} onClick={() => markRead(item)} className={`rounded-lg px-3 py-1.5 font-bold ${item.actionRequired ? "bg-emerald-600 text-white hover:bg-emerald-700" : "border border-gray-200 bg-white text-[#0b1f3b] hover:bg-gray-50"}`}>
                              {item.actionRequired ? "Accept or decline" : kind.cta}
                            </Link>
                          )}
                          {!item.read && <button type="button" onClick={() => markRead(item)} className="rounded-lg px-2 py-1.5 font-semibold text-gray-600 hover:bg-white">Mark as read</button>}
                        </div>
                      </div>
                      <button type="button" onClick={() => remove(item)} aria-label={`Delete notification: ${item.title}`} className="self-start rounded-lg p-2 text-gray-400 opacity-100 transition hover:bg-white hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"><FaTrash className="h-3.5 w-3.5" /></button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          <LoadMore hasMore={Boolean(current?.cursor)} loading={loadingMore} onClick={more} shown={items.length} noun="notifications" />
        </div>
      )}
    </div>
  );
}
