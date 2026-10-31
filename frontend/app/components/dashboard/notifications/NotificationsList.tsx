"use client";

import { useState } from "react";
import { FaBell, FaCheckDouble } from "react-icons/fa";
import { userApi, type Notification, type NotificationPageExtra } from "@/components/utils/userApi";
import SignInPrompt from "../SignInPrompt";
import { usePagedList } from "../useUserData";
import EmptyState from "../ui/EmptyState";
import FilterTabs from "../ui/FilterTabs";
import LoadMore from "../ui/LoadMore";
import Notice from "../ui/Notice";
import PageHeader from "../ui/PageHeader";
import { SkeletonRows } from "../ui/Skeleton";
import { dayLabel } from "../ui/format";
import NotificationItem from "./NotificationItem";
import { notificationTypes } from "./notificationTypes";

type Filter = "all" | "unread" | Notification["type"];
const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  ...(["booking", "order", "offer", "comment", "system"] as const).map((type) => ({ value: type, label: notificationTypes[type].label })),
];

/** Groups rows (already newest first) under "Today", "Yesterday", … in one pass. */
function byDay(items: Notification[]) {
  const groups: { label: string; items: Notification[] }[] = [];
  for (const item of items) {
    const label = dayLabel(item.createdAt);
    if (groups.at(-1)?.label === label) groups.at(-1)!.items.push(item);
    else groups.push({ label, items: [item] });
  }
  return groups;
}

/** The customer's notifications, used by /notifications and /dashboard/notifications. */
export default function NotificationsList() {
  const [filter, setFilter] = useState<Filter>("all");
  const params = { unread: filter === "unread", type: filter === "all" || filter === "unread" ? undefined : filter };
  const list = usePagedList<Notification, NotificationPageExtra>(`notifications?${filter}`, (cursor) => userApi.notificationsPage({ ...params, cursor }));

  if (!list.signedIn) return <SignInPrompt what="your notifications" />;

  const unread = list.extra.unreadCount ?? 0;
  // Optimistic: change the screen first, put it back if the server says no.
  const change = async (action: () => Promise<unknown>, next: (items: Notification[]) => Notification[], unreadCount: number) => {
    const before = { items: list.items, unreadCount: unread };
    list.update(next, { unreadCount: Math.max(0, unreadCount) });
    try { await action(); } catch (caught) {
      list.update(() => before.items, { unreadCount: before.unreadCount });
      list.setError(caught instanceof Error ? caught.message : "Could not update notifications.");
    }
  };
  const markRead = (item: Notification) => change(() => userApi.markNotificationRead(item._id), (items) => items.map((row) => (row._id === item._id ? { ...row, read: true } : row)), unread - 1);
  const remove = (item: Notification) => change(() => userApi.deleteNotification(item._id), (items) => items.filter((row) => row._id !== item._id), unread - (item.read ? 0 : 1));
  const markAll = () => change(userApi.markAllNotificationsRead, (items) => (filter === "unread" ? [] : items.map((row) => ({ ...row, read: true }))), 0);

  return (
    <div className="space-y-6">
      <PageHeader icon={FaBell} title="Notifications"
        description={list.loading ? "Loading…" : unread > 0 ? `You have ${unread} unread notification${unread === 1 ? "" : "s"}.` : "You're all caught up."}
        actions={unread > 0 && <button type="button" onClick={markAll} className="inline-flex items-center gap-2 rounded-full bg-[#0b1f3b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#17345a]"><FaCheckDouble className="h-3.5 w-3.5" /> Mark all as read</button>} />

      <FilterTabs label="Filter notifications" value={filter} onChange={setFilter} options={filters.map((option) => (option.value === "unread" ? { ...option, count: unread } : option))} />
      <Notice>{list.error}</Notice>

      {list.loading ? <SkeletonRows rows={4} className="h-16" /> : list.items.length === 0 ? (
        <EmptyState icon={FaBell} title={filter === "all" ? "No notifications yet" : "Nothing here"} text={filter === "all" ? "Booking replies, order updates and offers will appear here." : "No notifications match this filter."} />
      ) : (
        <div className="space-y-5">
          {byDay(list.items).map((group) => (
            <section key={group.label} aria-label={group.label}>
              <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-gray-500">{group.label}</h2>
              <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                {group.items.map((item) => <NotificationItem key={item._id} notification={item} onRead={() => markRead(item)} onDelete={() => remove(item)} />)}
              </ul>
            </section>
          ))}
          <LoadMore hasMore={list.hasMore} loading={list.loadingMore} onClick={list.loadMore} shown={list.items.length} noun="notifications" />
        </div>
      )}
    </div>
  );
}
