import Link from "next/link";
import type { Notification } from "@/components/utils/userApi";
import Panel from "../ui/Panel";
import { Skeleton } from "../ui/Skeleton";
import { timeAgo } from "../ui/format";
import { toneClasses } from "../ui/tones";
import { notificationTypes } from "../notifications/notificationTypes";

/** The five newest notifications. */
export default function RecentActivity({ items }: { items?: Notification[] }) {
  return (
    <Panel title="Recent activity" action={<Link href="/dashboard/notifications" className="text-sm font-semibold text-[#8a7300] hover:underline">View all →</Link>}>
      {!items ? <div className="space-y-3"><Skeleton className="h-12" /><Skeleton className="h-12" /><Skeleton className="h-12" /></div> : items.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-500">No activity yet. Save a plumber or send a booking request to get started.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => {
            const type = notificationTypes[item.type] ?? notificationTypes.system;
            const body = (
              <>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toneClasses[type.tone].icon}`}>{type.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm ${item.read ? "font-medium text-gray-700" : "font-bold text-gray-900"}`}>{item.title}</p>
                  {item.message && <p className="line-clamp-1 text-sm text-gray-500">{item.message}</p>}
                </div>
                <time dateTime={item.createdAt} className="shrink-0 text-xs text-gray-400">{timeAgo(item.createdAt)}</time>
              </>
            );
            return <li key={item._id}>{item.link ? <Link href={item.link} className="flex items-start gap-3 rounded-lg hover:bg-gray-50">{body}</Link> : <div className="flex items-start gap-3">{body}</div>}</li>;
          })}
        </ul>
      )}
    </Panel>
  );
}
