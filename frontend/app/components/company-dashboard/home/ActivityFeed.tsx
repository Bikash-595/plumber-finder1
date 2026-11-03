import Link from "next/link";
import { FaBell, FaCalendarCheck, FaCommentDots, FaStar } from "react-icons/fa";
import Panel from "@/components/dashboard/ui/Panel";
import { timeAgo } from "@/components/dashboard/ui/format";
import type { NoticeRow } from "../companyApi";
import { dashBase } from "@/components/utils/providerSide";

const icons = { booking: FaCalendarCheck, review: FaStar, comment: FaCommentDots, system: FaBell };

/** The latest notifications. */
export default function ActivityFeed({ items }: { items: NoticeRow[] }) {
  return (
    <Panel title="Recent activity" action={<Link href={`${dashBase()}/notifications`} className="text-sm font-semibold text-[#8a7300] hover:underline">All →</Link>} bodyClassName="">
      {items.length === 0 ? <p className="px-5 py-6 text-sm text-gray-500 sm:px-6">Nothing yet. Booking requests and reviews will show up here.</p> : (
        <ul className="divide-y divide-gray-100">
          {items.map((item) => {
            const Icon = icons[item.type] ?? FaBell;
            const body = (
              <>
                <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.read ? "bg-gray-100 text-gray-500" : "bg-[#FFD60A]/25 text-[#5c4d00]"}`}><Icon className="h-3.5 w-3.5" /></span>
                <span className="min-w-0 flex-1"><span className={`block truncate text-sm ${item.read ? "text-gray-700" : "font-bold text-gray-900"}`}>{item.title}</span>{item.message && <span className="block truncate text-xs text-gray-500">{item.message}</span>}</span>
                <time dateTime={item.createdAt} className="shrink-0 text-xs text-gray-400">{timeAgo(item.createdAt)}</time>
              </>
            );
            return <li key={item._id}>{item.link ? <Link href={item.link} className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50 sm:px-6">{body}</Link> : <div className="flex items-start gap-3 px-5 py-3 sm:px-6">{body}</div>}</li>;
          })}
        </ul>
      )}
    </Panel>
  );
}
