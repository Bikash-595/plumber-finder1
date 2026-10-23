"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiRequest } from "@/components/utils/apiClient";
import WeeklyHoursEditor, { hoursPayload, initialWeeklyHours, withAllDays, type HoursRow } from "@/components/company-dashboard/business-profile/WeeklyHoursEditor";

type OpeningHours = { weeklyHours?: HoursRow[]; availability24x7?: boolean; emergencyHours?: string; holidayHours?: string; specialClosures?: string };
const loginMessage = "Please log in with your freelancer account to set your hours.";
const notes = [
  { name: "emergencyHours", label: "Emergency Hours", placeholder: "e.g. Call any time for burst pipes" },
  { name: "holidayHours", label: "Holiday Hours", placeholder: "e.g. Closed on public holidays" },
  { name: "specialClosures", label: "Special Closures", placeholder: "e.g. Away 1–7 August" },
] as const;

/** The freelancer's working week, saved to /api/freelancers/opening-hours and shown on the public profile. */
export default function FreelancerOpeningHoursForm() {
  const [rows, setRows] = useState<HoursRow[]>(initialWeeklyHours);
  const [values, setValues] = useState({ availability24x7: false, emergencyHours: "", holidayHours: "", specialClosures: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiRequest<OpeningHours | null>("/freelancers/opening-hours", { loginMessage })
      .then(({ data }) => {
        if (cancelled || !data) return;
        setRows(withAllDays(data.weeklyHours));
        setValues({ availability24x7: Boolean(data.availability24x7), emergencyHours: data.emergencyHours ?? "", holidayHours: data.holidayHours ?? "", specialClosures: data.specialClosures ?? "" });
      })
      .catch((error) => { if (!cancelled) setNotice({ tone: "error", text: error instanceof Error ? error.message : "Unable to load your hours." }); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const save = async (body: OpeningHours, success: string) => {
    setSaving(true);
    setNotice(null);
    try {
      await apiRequest("/freelancers/opening-hours", { method: "PUT", body, loginMessage });
      setNotice({ tone: "ok", text: success });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Unable to save your hours." });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    save({ ...values, weeklyHours: hoursPayload(rows) }, "Opening hours saved. They now show on your public profile.");
  };

  const handleClear = () => {
    if (!window.confirm("Clear all your opening hours?")) return;
    setRows(initialWeeklyHours);
    setValues({ availability24x7: false, emergencyHours: "", holidayHours: "", specialClosures: "" });
    save({ weeklyHours: [], availability24x7: false, emergencyHours: "", holidayHours: "", specialClosures: "" }, "Opening hours cleared.");
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Opening Hours</h2>
      <p className="mt-1 text-sm text-gray-500">Set the days and times you work. Customers see them on your profile with an &ldquo;Open now&rdquo; badge.</p>
      <form onSubmit={handleSubmit} className="mt-6">
        <fieldset disabled={loading} className="space-y-6 disabled:opacity-60">
          <WeeklyHoursEditor rows={rows} onChange={setRows} />
          <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
            <input type="checkbox" checked={values.availability24x7} onChange={(event) => setValues((current) => ({ ...current, availability24x7: event.target.checked }))} className="h-4 w-4 accent-[#0b1f3b]" />
            Available 24/7 for emergencies
          </label>
          <div className="grid gap-4 md:grid-cols-3">
            {notes.map((note) => (
              <label key={note.name}>
                <span className="text-sm font-semibold text-gray-700">{note.label}</span>
                <textarea rows={3} value={values[note.name]} placeholder={note.placeholder} onChange={(event) => setValues((current) => ({ ...current, [note.name]: event.target.value }))} className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]" />
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
            <button type="submit" disabled={saving} className="rounded-xl bg-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">{saving ? "Saving…" : "Save hours"}</button>
            <button type="button" onClick={handleClear} disabled={saving} className="rounded-xl px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-60">Clear hours</button>
          </div>
        </fieldset>
      </form>
      {notice && <p role={notice.tone === "ok" ? "status" : "alert"} className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${notice.tone === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{notice.text}</p>}
    </section>
  );
}
