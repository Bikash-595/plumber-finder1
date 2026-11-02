"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { providerApi } from "@/components/bookings/bookingsApi";
import Drawer from "@/components/dashboard/ui/Drawer";
import StatusPill from "@/components/dashboard/ui/StatusPill";
import MessageButton from "@/components/messages/MessageButton";
import { formatMoney } from "../companyApi";
import { operationsApi, visitDate, type Job, type JobNote } from "../operationsApi";
import { growthApi, type TeamMember } from "../growthApi";
import JobNotes from "./JobNotes";
import { jobStages, stageLabel } from "./jobStages";

const historyLabel: Record<string, string> = { pending: "Request received", scheduled: "Accepted", in_progress: "Started", awaiting_confirmation: "Marked as done", completed: "Completed", disputed: "Customer reported a problem", cancelled: "Cancelled", declined: "Declined" };

/** Everything about one job: customer and contact, actions to move it on, messages, private notes and history. */
export default function JobDrawer({ jobId, onClose, onChanged }: { jobId: string | null; onClose: () => void; onChanged: () => void }) {
  const [state, setState] = useState<{ id: string; job: Job; notes: JobNote[] } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [cancelReason, setCancelReason] = useState<string | null>(null);
  const [team, setTeam] = useState<TeamMember[] | null>(null);
  useEffect(() => { if (jobId && !team) growthApi.team().then(setTeam).catch(() => setTeam([])); }, [jobId, team]);
  const assign = async (memberId: string) => {
    if (!job) return;
    try { const { data } = await growthApi.assign(job._id, memberId || null); setState((s) => s && { ...s, job: data }); onChanged(); } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not assign."); }
  };
  useEffect(() => {
    if (!jobId) return;
    let cancelled = false;
    operationsApi.job(jobId).then(({ data }) => { if (!cancelled) { const { notes, ...job } = data; setState({ id: jobId, job: job as Job, notes }); setError(""); } }).catch((caught: Error) => { if (!cancelled) setError(caught.message); });
    return () => { cancelled = true; };
  }, [jobId]);
  const current = state?.id === jobId ? state : null;
  const job = current?.job;

  const move = async (action: "start" | "complete" | "cancel", body: Record<string, string> = {}) => {
    if (!job) return;
    if (action === "complete" && !window.confirm("Mark this job as done? The customer will be asked to confirm.")) return;
    setBusy(true);
    try { const { data } = await providerApi.respond("/companies", job._id, action, body); setState((s) => s && { ...s, job: data }); setCancelReason(null); onChanged(); } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not update the job."); } finally { setBusy(false); }
  };
  const tone = jobStages.find((s) => s.key === job?.status)?.tone ?? "neutral";

  return (
    <Drawer open={Boolean(jobId)} onClose={onClose} title={job?.service ?? "Job"} subtitle={job ? <span className="font-mono">{job.reference}</span> : undefined}
      footer={job && (job.status === "scheduled" || job.status === "in_progress") && (
        cancelReason !== null ? (
          <div className="flex flex-wrap gap-2">
            <input value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Reason (the customer will see it)" aria-label="Cancellation reason" className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm" />
            <button type="button" disabled={busy || cancelReason.trim().length < 3} onClick={() => move("cancel", { reason: cancelReason.trim() })} className="rounded-xl bg-red-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-50">Cancel job</button>
            <button type="button" onClick={() => setCancelReason(null)} className="px-2 text-sm font-semibold text-gray-600">Keep</button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {job.status === "scheduled" && <button type="button" disabled={busy} onClick={() => move("start")} className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-800 disabled:opacity-60">Start job</button>}
            <button type="button" disabled={busy} onClick={() => move("complete")} className="rounded-full bg-[#0b1f3b] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">Mark as done</button>
            <button type="button" disabled={busy} onClick={() => setCancelReason("")} className="ml-auto rounded-full px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Cancel…</button>
          </div>
        )
      )}>
      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {!job ? <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />)}</div> : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2"><StatusPill tone={tone}>{stageLabel[job.status] ?? job.status}</StatusPill>{job.price ? <span className="text-lg font-bold tabular-nums text-gray-900">{formatMoney(job.price * (job.quantity ?? 1))}</span> : null}</div>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Visit</dt><dd className="font-medium text-gray-900">{visitDate(job.scheduledDate, { weekday: "long", month: "long", day: "numeric" })}{job.timeSlot ? ` · ${job.timeSlot}` : ""}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Customer</dt><dd className="font-medium text-gray-900">{job.customerName ?? "Customer"}</dd></div>
            {job.contactVisible && (
              <div className="space-y-1 sm:col-span-2">
                {job.phone && <a href={`tel:${job.phone}`} className="flex items-center gap-2 font-semibold text-[#0b1f3b] hover:underline"><FaPhoneAlt className="h-3 w-3" />{job.phone}</a>}
                {job.customerEmail && <a href={`mailto:${job.customerEmail}`} className="flex items-center gap-2 break-all text-[#0b1f3b] hover:underline"><FaEnvelope className="h-3 w-3" />{job.customerEmail}</a>}
                {job.address && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-700 hover:underline"><FaMapMarkerAlt className="h-3 w-3" />{job.address}</a>}
              </div>
            )}
            {job.details && <div className="sm:col-span-2"><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Customer&apos;s notes</dt><dd className="whitespace-pre-line text-gray-800">{job.details}</dd></div>}
            {job.disputeReason && <div className="rounded-xl bg-red-50 p-3 sm:col-span-2"><dt className="text-xs font-semibold uppercase text-red-700">Problem reported</dt><dd className="text-red-900">{job.disputeReason}</dd></div>}
          </dl>
          {job.status === "pending" ? <Link href={`/company-dashboard/bookings?booking=${job._id}`} className="inline-block rounded-full bg-[#0b1f3b] px-4 py-2 text-sm font-bold text-white">Accept or decline this request</Link>
            : <div className="flex flex-wrap items-center gap-2"><MessageButton base="/companies" bookingId={job._id} label="Message customer" />{!["completed", "cancelled"].includes(job.status) && <Link href={`/company-dashboard/quotes?booking=${job._id}`} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#0b1f3b] hover:bg-gray-50">Create a quote</Link>}</div>}
          {job.status !== "pending" && (
            <label className="block text-sm font-medium text-gray-700">Technician
              <select value={job.assignedTo?.member ?? ""} onChange={(e) => assign(e.target.value)} disabled={!team} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm">
                <option value="">Not assigned</option>
                {team?.map((m) => <option key={m._id} value={m._id}>{m.name}{m.role ? ` — ${m.role}` : ""}</option>)}
              </select>
              {team && team.length === 0 && <span className="mt-1 block text-xs text-gray-500"><Link href="/company-dashboard/business-profile/team" className="font-semibold underline">Add your team</Link> to assign jobs.</span>}
            </label>
          )}
          <JobNotes jobId={job._id} notes={current!.notes} onChange={(notes) => setState((s) => s && { ...s, notes })} />
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">History</h3>
            <ol className="mt-2 space-y-2 border-l-2 border-gray-100 pl-4 text-sm">
              {job.history.map((entry, i) => <li key={i}><span className="font-semibold text-gray-900">{historyLabel[entry.status] ?? entry.status}</span> <span className="text-xs text-gray-500">· {entry.by === "provider" ? "You" : entry.by === "customer" ? "Customer" : entry.by === "admin" ? "Plumber Finder" : "System"} · {new Date(entry.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>{entry.note && <span className="block text-gray-600">“{entry.note}”</span>}</li>)}
            </ol>
          </section>
        </div>
      )}
    </Drawer>
  );
}
