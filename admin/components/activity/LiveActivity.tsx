"use client";

import { useState } from "react";
import { Pager, useAdminQuery } from "@/components/AdminData";
import { adminApi, type ActivityEvent } from "@/lib/adminApi";
import ActivityList from "./ActivityList";
import { eventLabels, field } from "./activityFormat";

export default function LiveActivity() {
  const [event, setEvent] = useState("all");
  const [page, setPage] = useState(1);
  const { data, error, loading } = useAdminQuery(`recent|${event}|${page}`, () => adminApi.recentActivity({ event: event === "all" ? undefined : event, page }));
  return (
    <>
      <select value={event} onChange={(e) => { setEvent(e.target.value); setPage(1); }} aria-label="Activity type" className={field}>
        <option value="all">Everything</option>
        {(Object.keys(eventLabels) as ActivityEvent[]).map((key) => <option key={key} value={key}>{eventLabels[key]}</option>)}
      </select>
      <div className="mt-4">
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {loading && !data ? <p className="py-6 text-center text-sm text-gray-500">Loading…</p> : <ActivityList items={data?.data ?? []} showPlumber />}
      </div>
      {data && <Pager page={data.page} limit={data.limit} total={data.total} onPage={setPage} />}
    </>
  );
}
