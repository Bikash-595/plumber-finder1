import Link from "next/link";
import { FaCheck, FaTrash } from "react-icons/fa";
import type { Notification } from "@/components/utils/userApi";
import { timeAgo } from "../ui/format";
import { toneClasses } from "../ui/tones";
import { notificationTypes } from "./notificationTypes";

/** One notification row: type icon, title, message, time, and read/delete actions. */
export default function NotificationItem({ notification, onRead, onDelete }: { notification: Notification; onRead: () => void; onDelete: () => void }) {
  const type = notificationTypes[notification.type] ?? notificationTypes.system;
  return (
    <li className={`group relative flex gap-4 px-5 py-4 transition sm:px-6 ${notification.read ? "bg-white" : "bg-[#FFD60A]/[0.06]"}`}>
      {!notification.read && <span className="absolute left-0 top-0 h-full w-1 bg-[#FFD60A]" aria-hidden />}
      <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toneClasses[type.tone].icon}`}>{type.icon}</span>
      <div className="min-w-0 flex-1">
        <p className={`text-sm ${notification.read ? "font-medium text-gray-700" : "font-bold text-gray-900"}`}>
          {notification.title}
          {!notification.read && <span className="sr-only"> (unread)</span>}
        </p>
        {notification.message && <p className="mt-0.5 text-sm text-gray-600">{notification.message}</p>}
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs text-gray-500">
          <time dateTime={notification.createdAt}>{timeAgo(notification.createdAt)}</time>
          {notification.link && <><span aria-hidden>·</span><Link href={notification.link} onClick={notification.read ? undefined : onRead} className="font-semibold text-[#0b1f3b] hover:underline">View</Link></>}
        </p>
      </div>
      <div className="flex shrink-0 items-start gap-1 opacity-100 transition sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
        {!notification.read && (
          <button type="button" onClick={onRead} aria-label="Mark as read" title="Mark as read" className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"><FaCheck className="h-3.5 w-3.5" /></button>
        )}
        <button type="button" onClick={onDelete} aria-label="Delete notification" title="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600"><FaTrash className="h-3.5 w-3.5" /></button>
      </div>
    </li>
  );
}
