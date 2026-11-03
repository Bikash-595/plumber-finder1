import Link from "next/link";
import { FaCalendarAlt, FaClock, FaTag } from "react-icons/fa";
import UserAvatar from "@/components/UserAvatar";
import StatusPill from "@/components/dashboard/ui/StatusPill";
import { formatMoney } from "../companyApi";
import { visitDate, waiting, type Lead } from "../operationsApi";
import { dashBase } from "@/components/utils/providerSide";

const stageMeta = { new: { label: "New", tone: "warning" }, won: { label: "Won", tone: "success" }, lost: { label: "Lost", tone: "neutral" } } as const;

/** One booking request: who, what, when they want it, how long it has waited, and the way to answer. */
export default function LeadCard({ lead }: { lead: Lead }) {
  const stage = stageMeta[lead.stage];
  const urgent = lead.stage === "new" && (lead.waitingMinutes ?? 0) > 60;
  return (
    <article className={`flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5 ${urgent ? "border-[#FFD60A]" : "border-gray-200/80"}`}>
      <UserAvatar name={lead.customerName ?? "Customer"} size={44} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-bold text-gray-900">{lead.service}</p>
          <StatusPill tone={stage.tone}>{stage.label}</StatusPill>
          {lead.couponCode && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700"><FaTag className="h-2.5 w-2.5" />{lead.couponCode}</span>}
        </div>
        <p className="text-sm text-gray-600">{lead.customerName ?? "Customer"}{lead.reference ? <span className="font-mono text-xs text-gray-400"> · {lead.reference}</span> : null}</p>
        <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1"><FaCalendarAlt className="h-3 w-3" />{visitDate(lead.scheduledDate)}{lead.timeSlot ? ` · ${lead.timeSlot}` : ""}</span>
          {lead.stage === "new" ? <span className={`inline-flex items-center gap-1 ${urgent ? "font-semibold text-amber-700" : ""}`}><FaClock className="h-3 w-3" />Waiting {waiting(lead.waitingMinutes)}</span>
            : <span>Received {new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>}
        </p>
        {lead.details && <p className="mt-2 line-clamp-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">“{lead.details}”</p>}
        {lead.stage === "lost" && lead.responseNote && <p className="mt-2 text-xs text-gray-500">Reason: {lead.responseNote}</p>}
      </div>
      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
        {lead.price ? <p className="text-lg font-bold tabular-nums text-gray-900">{formatMoney(lead.price * (lead.quantity ?? 1))}</p> : <p className="text-xs text-gray-400">Quote needed</p>}
        <Link href={`${dashBase()}/bookings?booking=${lead._id}`} className={`rounded-full px-4 py-2 text-sm font-bold ${lead.stage === "new" ? "bg-[#0b1f3b] text-white hover:bg-[#17345a]" : "border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>{lead.stage === "new" ? "Accept or decline" : "View booking"}</Link>
      </div>
    </article>
  );
}
