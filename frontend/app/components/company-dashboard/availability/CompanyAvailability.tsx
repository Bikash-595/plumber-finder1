"use client";

import { useState } from "react";
import { FaCalendarTimes, FaPauseCircle } from "react-icons/fa";
import SettingToggle from "@/components/dashboard/settings/SettingToggle";
import Notice from "@/components/dashboard/ui/Notice";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import Panel from "@/components/dashboard/ui/Panel";
import { SkeletonRows } from "@/components/dashboard/ui/Skeleton";
import { useCompanyData } from "../companyApi";
import { growthApi, type Availability } from "../growthApi";
import TimeOffList from "./TimeOffList";

const field = "mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";

function AvailabilityForm({ initial, onSaved }: { initial: Availability; onSaved: (a: Availability) => void }) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const save = async () => {
    setBusy(true);
    setNotice(null);
    try {
      const { data, message } = await growthApi.saveAvailability({ acceptingBookings: form.acceptingBookings, pauseMessage: form.pauseMessage, maxJobsPerDay: Number(form.maxJobsPerDay) || 0, minNoticeDays: Number(form.minNoticeDays) || 0, timeOff: form.timeOff.map(({ start, end, reason }) => ({ start: start.slice(0, 10), end: end.slice(0, 10), reason })) });
      onSaved(data);
      setForm(data);
      setNotice({ tone: "success", text: message ?? "Saved." });
    } catch (caught) { setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Could not save." }); } finally { setBusy(false); }
  };
  return (
    <div className="space-y-6">
      <Panel title={<span className="flex items-center gap-2"><FaPauseCircle className="h-4 w-4 text-[#b39200]" />New booking requests</span>} bodyClassName="">
        <SettingToggle label="Accepting new bookings" description="Turn off when you're too busy — your profile stays visible, but customers can't send requests." checked={form.acceptingBookings} onChange={() => setForm({ ...form, acceptingBookings: !form.acceptingBookings })} />
        {!form.acceptingBookings && (
          <label className="block border-t border-gray-100 px-5 py-4 text-sm font-medium text-gray-700 sm:px-6">Message for customers
            <input value={form.pauseMessage} maxLength={200} onChange={(e) => setForm({ ...form, pauseMessage: e.target.value })} placeholder="e.g. We're fully booked until March 3 — please check back soon." className={field} />
          </label>
        )}
      </Panel>
      <Panel title="Capacity and notice">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">Most jobs per day
            <input type="number" min={0} max={100} value={form.maxJobsPerDay} onChange={(e) => setForm({ ...form, maxJobsPerDay: Number(e.target.value) })} className={field} />
            <span className="mt-1 block text-xs text-gray-500">When a day is full, customers are asked to pick another. 0 = no limit.</span>
          </label>
          <label className="text-sm font-medium text-gray-700">Minimum notice (days)
            <input type="number" min={0} max={30} value={form.minNoticeDays} onChange={(e) => setForm({ ...form, minNoticeDays: Number(e.target.value) })} className={field} />
            <span className="mt-1 block text-xs text-gray-500">0 = same-day requests are fine.</span>
          </label>
        </div>
      </Panel>
      <Panel title={<span className="flex items-center gap-2"><FaCalendarTimes className="h-4 w-4 text-[#b39200]" />Days off</span>} description="Shown on your schedule; customers can't request these dates.">
        <TimeOffList periods={form.timeOff} onChange={(timeOff) => setForm({ ...form, timeOff })} />
      </Panel>
      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}
      <div className="sticky bottom-0 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur">
        <button type="button" onClick={save} disabled={busy || !dirty} className="rounded-full bg-[#FFD60A] px-6 py-2.5 text-sm font-bold text-[#0b1f3b] disabled:opacity-50">{busy ? "Saving…" : "Save availability"}</button>
        {dirty ? <button type="button" onClick={() => setForm(initial)} className="text-sm font-semibold text-gray-500">Discard changes</button> : <span className="text-xs text-gray-400">All changes saved</span>}
      </div>
    </div>
  );
}

/** /company-dashboard/availability — when customers can book you. */
export default function CompanyAvailability() {
  const { data, error, loading, setData } = useCompanyData("company-availability", growthApi.availability);
  return (
    <div className="space-y-6">
      <PageHeader icon={FaCalendarTimes} title="Availability" description="Control when customers can book you: pause new requests, block days off, cap jobs per day and set minimum notice." />
      <Notice>{error}</Notice>
      {loading || !data ? <SkeletonRows rows={3} className="h-32" /> : <AvailabilityForm key={JSON.stringify(data)} initial={data} onSaved={setData} />}
    </div>
  );
}
