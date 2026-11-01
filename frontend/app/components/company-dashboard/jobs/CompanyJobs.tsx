"use client";

import { useCallback, useState } from "react";
import { FaBriefcase, FaColumns, FaList } from "react-icons/fa";
import EmptyState from "@/components/dashboard/ui/EmptyState";
import Notice from "@/components/dashboard/ui/Notice";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import SearchBox from "@/components/dashboard/ui/SearchBox";
import { SkeletonRows } from "@/components/dashboard/ui/Skeleton";
import { toneClasses } from "@/components/dashboard/ui/tones";
import { useCompanyData } from "../companyApi";
import { operationsApi, type JobsPage } from "../operationsApi";
import JobCard from "./JobCard";
import JobDrawer from "./JobDrawer";
import { jobStages } from "./jobStages";

/** /company-dashboard/jobs — accepted jobs on a board by stage (or as a list), with a drawer for each job. */
export default function CompanyJobs() {
  const [q, setQ] = useState("");
  const [view, setView] = useState<"board" | "cancelled">("board");
  const [open, setOpen] = useState<string | null>(null);
  const key = `company-jobs-${view}-${q}`;
  const { data, error, loading, reload } = useCompanyData<JobsPage>(key, () => operationsApi.jobs({ q, stage: view === "cancelled" ? "cancelled" : undefined }));
  const onSearch = useCallback((value: string) => setQ(value), []);
  const jobs = data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader icon={FaBriefcase} title="Jobs" description="Work you've accepted, from scheduled to completed. Open a job to start it, mark it done, message the customer or add private notes."
        actions={<div className="flex rounded-full border border-gray-200 bg-white p-1 text-sm font-semibold">
          <button type="button" aria-pressed={view === "board"} onClick={() => setView("board")} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${view === "board" ? "bg-[#0b1f3b] text-white" : "text-gray-600"}`}><FaColumns className="h-3 w-3" />Board</button>
          <button type="button" aria-pressed={view === "cancelled"} onClick={() => setView("cancelled")} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${view === "cancelled" ? "bg-[#0b1f3b] text-white" : "text-gray-600"}`}><FaList className="h-3 w-3" />Cancelled{data?.counts ? ` (${data.counts.cancelled})` : ""}</button>
        </div>} />
      <SearchBox label="Search jobs" placeholder="Customer, service, address or BK- code" value={q} onChange={onSearch} />
      <Notice>{error}</Notice>

      {loading ? <SkeletonRows rows={2} className="h-40" /> : jobs.length === 0 ? (
        <EmptyState icon={FaBriefcase} title={q ? "No matching jobs" : view === "cancelled" ? "No cancelled jobs" : "No jobs yet"} text={view === "board" && !q ? "Accept a booking request and it becomes a job here." : undefined} action={view === "board" && !q ? { label: "See booking requests", href: "/company-dashboard/leads" } : undefined} />
      ) : view === "cancelled" ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{jobs.map((job) => <JobCard key={job._id} job={job} onOpen={() => setOpen(job._id)} />)}</div>
      ) : (
        <div className="-mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible">
          {jobStages.map((stage) => {
            const column = jobs.filter((job) => job.status === stage.key);
            return (
              <section key={stage.key} aria-label={stage.label} className="w-72 shrink-0 snap-start rounded-2xl bg-gray-100/70 p-3 lg:w-auto">
                <header className="mb-3 flex items-center justify-between px-1">
                  <span className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${toneClasses[stage.tone].dot}`} /><h2 className="text-sm font-bold text-gray-900">{stage.label}</h2></span>
                  <span className="rounded-full bg-white px-2 text-xs font-bold tabular-nums text-gray-600">{data?.counts?.[stage.key] ?? column.length}</span>
                </header>
                <p className="mb-2 px-1 text-[11px] text-gray-500">{stage.hint}</p>
                <div className="space-y-2">
                  {column.length ? column.map((job) => <JobCard key={job._id} job={job} onOpen={() => setOpen(job._id)} />) : <p className="rounded-xl border border-dashed border-gray-300 px-3 py-6 text-center text-xs text-gray-400">Nothing here</p>}
                </div>
              </section>
            );
          })}
        </div>
      )}
      {data?.nextCursor && <p className="text-center text-xs text-gray-500">Showing the {jobs.length} most recent jobs. Search to find older ones.</p>}
      <JobDrawer jobId={open} onClose={() => setOpen(null)} onChanged={reload} />
    </div>
  );
}
