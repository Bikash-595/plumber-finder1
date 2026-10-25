"use client";

import { FormEvent, useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import { companyApi } from "./companyApi";
import { NoticeMessage, type Notice } from "./SavedItems";
import WeeklyHoursEditor, { hoursPayload, initialWeeklyHours, weekDays, withAllDays, type HoursRow } from "./WeeklyHoursEditor";

type Hours = { weeklyHours?: HoursRow[]; availability24x7?: boolean; dailyHours?: string; emergencyHours?: string; holidayHours?: string; specialClosures?: string };
type Props = {
  /** "/companies/opening-hours" or "/freelancers/opening-hours". */
  apiEndpoint: string;
  /** Companies: before saving here, start from the hours given in the Add Company wizard. */
  wizardFallback?: boolean;
};

const blankNotes = { availability24x7: false, dailyHours: "", emergencyHours: "", holidayHours: "", specialClosures: "" };
const noteFields = [
  { name: "dailyHours", label: "Daily schedule note", placeholder: "e.g. Lunch break 1–2 PM, last booking 5 PM" },
  { name: "emergencyHours", label: "Emergency hours", placeholder: "e.g. Call any time for burst pipes" },
  { name: "holidayHours", label: "Holiday hours", placeholder: "e.g. Closed on public holidays" },
  { name: "specialClosures", label: "Special closures", placeholder: "e.g. Closed 24–26 December" },
] as const;

const set = (days: string[], opensAt: string, closesAt: string): HoursRow[] => initialWeeklyHours.map((row) => (days.includes(row.day) ? { ...row, isOpen: true, opensAt, closesAt } : { ...row, isOpen: false }));
const presets = [
  { label: "Mon–Fri, 8 AM–6 PM", rows: () => set(["monday", "tuesday", "wednesday", "thursday", "friday"], "08:00", "18:00") },
  { label: "Mon–Sat, 8 AM–6 PM", rows: () => set(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"], "08:00", "18:00") },
  { label: "Every day, 24 hours", rows: () => set(weekDays.map(({ day }) => day), "00:00", "23:59") },
];

/** "08:00" → "8:00 AM". */
function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
const describe = (row?: HoursRow) => (!row?.isOpen ? "Closed" : row.opensAt === "00:00" && row.closesAt === "23:59" ? "Open 24 hours" : `${formatTime(row.opensAt)} – ${formatTime(row.closesAt)}`);

/**
 * The days and times the business works each week, plus notes (daily schedule, emergencies,
 * holidays). Saved: a weekly summary with Edit and Delete. Shown on the public profile with "Open now".
 */
export default function OpeningHoursForm({ apiEndpoint, wizardFallback = false }: Props) {
  const [rows, setRows] = useState<HoursRow[]>(initialWeeklyHours);
  const [notes, setNotes] = useState(blankNotes);
  const [saved, setSaved] = useState<Hours | null>(null);
  const [mode, setMode] = useState<"loading" | "view" | "edit">("loading");
  const [fromWizard, setFromWizard] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);

  const load = (data: Hours) => {
    setRows(withAllDays(data.weeklyHours));
    setNotes({ availability24x7: Boolean(data.availability24x7), dailyHours: data.dailyHours ?? "", emergencyHours: data.emergencyHours ?? "", holidayHours: data.holidayHours ?? "", specialClosures: data.specialClosures ?? "" });
  };

  useEffect(() => {
    companyApi<Hours | null>(apiEndpoint)
      .then(async ({ data }) => {
        if (data) { setSaved(data); load(data); setMode("view"); return; }
        // Nothing saved here yet: start from the Add Company wizard's hours, if any.
        if (wizardFallback) {
          const wizard = await companyApi<{ weeklyHours?: HoursRow[]; formData?: Record<string, string | undefined> }>("/companies/onboarding").catch(() => null);
          const form = wizard?.data.formData ?? {};
          if (wizard?.data.weeklyHours?.length || form.dailyHours || form.emergencyHours) {
            // The wizard stores 24/7 as text ("Yes"/"No").
            load({ ...form, weeklyHours: wizard?.data.weeklyHours, availability24x7: /^(yes|true)$/i.test(form.availability24x7 ?? "") });
            setFromWizard(true);
          }
        }
        setMode("edit");
      })
      .catch((error: Error) => { setNotice({ tone: "error", text: error.message }); setMode("edit"); });
  }, [apiEndpoint, wizardFallback]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const bad = rows.find((row) => row.isOpen && (!row.opensAt || !row.closesAt || row.opensAt === row.closesAt));
    if (bad) return setNotice({ tone: "error", text: `Check ${weekDays.find((day) => day.day === bad.day)?.label}'s times: opening and closing must be different.` });
    setBusy(true);
    setNotice(null);
    try {
      const { data } = await companyApi<Hours>(apiEndpoint, { method: "PUT", body: { ...notes, weeklyHours: hoursPayload(rows) } });
      setSaved(data);
      load(data);
      setFromWizard(false);
      setMode("view");
      setNotice({ tone: "success", text: saved ? "Opening hours updated." : "Opening hours saved to your public profile." });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Unable to save your hours." });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete your opening hours? This cannot be undone.")) return;
    setBusy(true);
    try {
      await companyApi(apiEndpoint, { method: "DELETE" });
      setSaved(null);
      setRows(initialWeeklyHours);
      setNotes(blankNotes);
      setMode("edit");
      setNotice({ tone: "success", text: "Opening hours deleted." });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Unable to delete." });
    } finally {
      setBusy(false);
    }
  };

  const savedRows = withAllDays(saved?.weeklyHours);
  const openDays = savedRows.filter((row) => row.isOpen).length;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <p className="text-xs font-bold uppercase tracking-wider text-[#0b1f3b]">Business Profile</p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">Opening Hours</h1>
      <p className="mt-2 max-w-3xl text-sm text-gray-500">The days you work each week and your times each day. Customers see them on your profile with an &ldquo;Open now&rdquo; badge.</p>

      {mode === "loading" && <p className="mt-7 rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">Loading your opening hours…</p>}

      {mode === "view" && saved && (
        <div className="mt-7 rounded-xl border border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-bold text-gray-900">Saved opening hours <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">Live on your profile</span></p>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setMode("edit"); setNotice(null); }} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50">Edit</button>
              <button type="button" onClick={remove} disabled={busy} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-60">Delete</button>
            </div>
          </div>
          <div className="grid gap-6 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500"><FaClock className="text-[#FFD60A]" /> {openDays ? `Open ${openDays} day${openDays === 1 ? "" : "s"} a week` : "No days set"}</p>
              <dl className="mt-2 divide-y divide-gray-100">
                {weekDays.map(({ day, label }) => {
                  const row = savedRows.find((item) => item.day === day);
                  return <div key={day} className="flex justify-between gap-4 py-2 text-sm"><dt className="font-medium text-gray-700">{label}</dt><dd className={row?.isOpen ? "font-semibold text-gray-900" : "text-gray-400"}>{saved.weeklyHours?.length ? describe(row) : "Not set"}</dd></div>;
                })}
              </dl>
            </div>
            <dl className="space-y-3">
              <div className="rounded-lg bg-gray-50 p-3"><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Emergencies</dt><dd className="mt-1 text-sm text-gray-900">{saved.availability24x7 ? "Available 24/7" : "Not 24/7"}</dd></div>
              {noteFields.map(({ name, label }) => saved[name] ? <div key={name} className="rounded-lg bg-gray-50 p-3"><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt><dd className="mt-1 whitespace-pre-line text-sm text-gray-900">{saved[name]}</dd></div> : null)}
            </dl>
          </div>
        </div>
      )}

      {mode === "edit" && (
        <form onSubmit={submit} noValidate className="mt-7 space-y-6">
          <fieldset disabled={busy} className="space-y-6">
            {fromWizard && <p className="rounded-lg bg-[#FFD60A]/10 px-3 py-2 text-xs font-medium text-[#0b1f3b]">Filled in from your Add Company details. Check them and press Save to manage your hours here.</p>}
            <div>
              <p className="text-sm font-semibold text-gray-700">Quick start</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {presets.map((preset) => <button key={preset.label} type="button" onClick={() => setRows(preset.rows())} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-[#FFD60A]">{preset.label}</button>)}
                <button type="button" onClick={() => setRows(initialWeeklyHours)} className="rounded-full px-3 py-1.5 text-xs font-semibold text-gray-500 hover:underline">Clear all days</button>
              </div>
            </div>
            <WeeklyHoursEditor rows={rows} onChange={setRows} description="Tick each day you work and set your opening and closing times. Closing earlier than opening means you work past midnight." />
            <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
              <input type="checkbox" checked={notes.availability24x7} onChange={(event) => setNotes((current) => ({ ...current, availability24x7: event.target.checked }))} className="h-4 w-4 accent-[#0b1f3b]" />
              Available 24/7 for emergencies
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              {noteFields.map((note) => (
                <label key={note.name}>
                  <span className="text-sm font-semibold text-gray-700">{note.label}</span>
                  <textarea rows={2} value={notes[note.name]} placeholder={note.placeholder} onChange={(event) => setNotes((current) => ({ ...current, [note.name]: event.target.value }))} className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]" />
                </label>
              ))}
            </div>
          </fieldset>
          <NoticeMessage notice={notice} />
          <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
            <button type="submit" disabled={busy} className="rounded-xl bg-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#17345a] disabled:opacity-60">{busy ? "Saving…" : saved ? "Update" : "Save"}</button>
            {saved && <button type="button" onClick={() => { load(saved); setMode("view"); setNotice(null); }} className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50">Cancel</button>}
          </div>
        </form>
      )}
      {mode === "view" && <div className="mt-4"><NoticeMessage notice={notice} /></div>}
    </section>
  );
}
