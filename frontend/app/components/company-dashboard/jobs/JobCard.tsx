import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { formatMoney } from "../companyApi";
import { visitDate, type Job } from "../operationsApi";

/** A job on the board: service, customer, visit date, address and value. Opens the job drawer. */
export default function JobCard({ job, onOpen }: { job: Job; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="block w-full rounded-xl border border-gray-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#FFD60A] hover:shadow-md">
      <p className="truncate text-sm font-bold text-gray-900">{job.service}</p>
      <p className="truncate text-xs text-gray-600">{job.customerName ?? "Customer"}<span className="font-mono text-gray-400"> · {job.reference}</span></p>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500"><FaCalendarAlt className="h-3 w-3 shrink-0" />{visitDate(job.scheduledDate)}{job.timeSlot ? ` · ${job.timeSlot}` : ""}</p>
      {job.address && <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-gray-500"><FaMapMarkerAlt className="h-3 w-3 shrink-0" /><span className="truncate">{job.address}</span></p>}
      {job.price ? <p className="mt-2 text-sm font-bold tabular-nums text-gray-900">{formatMoney(job.price * (job.quantity ?? 1))}</p> : null}
    </button>
  );
}
