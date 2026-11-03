import Link from "next/link";
import { FaCalendarAlt } from "react-icons/fa";
import Panel from "@/components/dashboard/ui/Panel";
import type { BookingRow } from "../companyApi";
import { formatMoney } from "../companyApi";
import { dashBase } from "@/components/utils/providerSide";

const date = (value?: string) => (value ? new Date(value).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" }) : "Flexible date");
const ago = (value: string) => { const m = Math.round((Date.now() - new Date(value).getTime()) / 60000); return m < 60 ? `${Math.max(1, m)} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`; };

/** New booking requests (answer fast — customers often book whoever replies first) or the next jobs on the calendar. */
export default function BookingList({ title, rows, kind, empty }: { title: string; rows: BookingRow[]; kind: "requests" | "upcoming"; empty: string }) {
  return (
    <Panel title={title} action={<Link href={`${dashBase()}/bookings`} className="text-sm font-semibold text-[#8a7300] hover:underline">All bookings →</Link>} bodyClassName="">
      {rows.length === 0 ? <p className="px-5 py-8 text-center text-sm text-gray-500 sm:px-6">{empty}</p> : (
        <ul className="divide-y divide-gray-100">
          {rows.map((row) => (
            <li key={row._id}>
              <Link href={`${dashBase()}/bookings?booking=${row._id}`} className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-gray-50 sm:px-6">
                {kind === "upcoming" && row.scheduledDate ? (
                  <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#0b1f3b] text-white">
                    <span className="text-[10px] font-semibold uppercase text-[#FFD60A]">{new Date(row.scheduledDate).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })}</span>
                    <span className="text-lg font-bold leading-none">{new Date(row.scheduledDate).getUTCDate()}</span>
                  </span>
                ) : <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><FaCalendarAlt className="h-4 w-4" /></span>}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-gray-900">{row.service}</span>
                  <span className="block truncate text-xs text-gray-600">{row.customerName ?? "Customer"}{row.reference ? ` · ${row.reference}` : ""}</span>
                  <span className="block text-xs text-gray-500">{kind === "requests" ? `Requested ${ago(row.createdAt)} · for ${date(row.scheduledDate)}` : `${date(row.scheduledDate)}${row.timeSlot ? ` · ${row.timeSlot}` : ""}${row.status === "in_progress" ? " · in progress" : ""}`}</span>
                </span>
                {row.price ? <span className="shrink-0 text-sm font-bold tabular-nums text-gray-900">{formatMoney(row.price * (row.quantity ?? 1))}</span> : null}
                {kind === "requests" && <span className="shrink-0 rounded-full bg-[#0b1f3b] px-3 py-1 text-xs font-bold text-white">Respond</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
