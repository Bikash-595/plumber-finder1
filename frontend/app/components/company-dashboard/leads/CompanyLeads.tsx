"use client";

import { useCallback, useState } from "react";
import { FaAddressBook, FaClock, FaInbox, FaTrophy } from "react-icons/fa";
import EmptyState from "@/components/dashboard/ui/EmptyState";
import FilterTabs from "@/components/dashboard/ui/FilterTabs";
import LoadMore from "@/components/dashboard/ui/LoadMore";
import Notice from "@/components/dashboard/ui/Notice";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import SearchBox from "@/components/dashboard/ui/SearchBox";
import { SkeletonRows } from "@/components/dashboard/ui/Skeleton";
import KpiCard from "../ui/KpiCard";
import { operationsApi, type Lead, type LeadsPage, type LeadStage } from "../operationsApi";
import { useCompanyData } from "../companyApi";
import LeadCard from "./LeadCard";
import SignalsStrip from "./SignalsStrip";

const stages: { value: LeadStage; label: string }[] = [{ value: "new", label: "New" }, { value: "won", label: "Won" }, { value: "lost", label: "Lost" }];

/** /company-dashboard/leads — booking requests as a pipeline (new → won / lost) and anonymous interest signals. */
export default function CompanyLeads() {
  const [stage, setStage] = useState<LeadStage>("new");
  const [q, setQ] = useState("");
  const key = `company-leads-${stage}-${q}`;
  const { data, error, loading } = useCompanyData<LeadsPage>(key, () => operationsApi.leads({ stage, q }));
  const [more, setMore] = useState<{ key: string; items: Lead[]; cursor: string | null; busy: boolean }>({ key: "", items: [], cursor: null, busy: false });
  const extra = more.key === key ? more : { key, items: [], cursor: data?.nextCursor ?? null, busy: false };
  const cursor = extra.items.length ? extra.cursor : data?.nextCursor ?? null;
  const loadMore = async () => {
    setMore({ ...extra, busy: true });
    try { const page = await operationsApi.leads({ stage, q, cursor }); setMore({ key, items: [...extra.items, ...page.data], cursor: page.nextCursor, busy: false }); } catch { setMore({ ...extra, busy: false }); }
  };
  const onSearch = useCallback((value: string) => setQ(value), []);
  const items = [...(data?.data ?? []), ...extra.items];
  const summary = data?.summary;

  return (
    <div className="space-y-6">
      <PageHeader icon={FaAddressBook} title="Leads" description="Every booking request, from new to won or lost. Answer new ones quickly — customers often book whoever replies first." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="New leads" icon={FaInbox} tone="warning" loading={loading} value={data?.counts?.new ?? "–"} hint="Waiting for your reply" />
        <KpiCard label="Average wait" icon={FaClock} tone="info" loading={loading} value={summary ? `${summary.avgWaitingHours} h` : "–"} hint="For leads still waiting" />
        <KpiCard label="Win rate" icon={FaTrophy} tone="success" loading={loading} value={summary?.winRate === null || !summary ? "—" : `${summary.winRate}%`} hint={`Requests accepted, last ${summary?.days ?? 30} days`} />
        <KpiCard label="Requests" icon={FaAddressBook} tone="brand" loading={loading} value={summary?.requests ?? "–"} hint={`Last ${summary?.days ?? 30} days`} />
      </div>
      {data?.signals && <SignalsStrip values={data.signals} days={summary?.days ?? 30} />}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs label="Lead stage" value={stage} onChange={setStage} options={stages.map((s) => ({ ...s, count: data?.counts?.[s.value] }))} />
        <SearchBox label="Search leads" placeholder="Customer, service or BK- code" value={q} onChange={onSearch} />
      </div>
      <Notice>{error}</Notice>
      {loading ? <SkeletonRows rows={3} className="h-28" /> : items.length === 0 ? (
        <EmptyState icon={FaAddressBook} title={q ? "No matching leads" : stage === "new" ? "No new leads right now" : `No ${stage} leads yet`} text={stage === "new" ? "When a customer sends you a booking request, it appears here and in your notifications." : undefined} action={stage === "new" ? { label: "Improve your profile", href: "/company-dashboard/profile" } : undefined} />
      ) : (
        <div className="space-y-3">
          {items.map((lead) => <LeadCard key={lead._id} lead={lead} />)}
          <LoadMore hasMore={Boolean(cursor)} loading={extra.busy} onClick={loadMore} shown={items.length} noun="leads" />
        </div>
      )}
    </div>
  );
}
