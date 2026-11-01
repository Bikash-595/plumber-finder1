"use client";

import { useState } from "react";
import SettingToggle from "@/components/dashboard/settings/SettingToggle";
import Notice from "@/components/dashboard/ui/Notice";
import Panel from "@/components/dashboard/ui/Panel";
import { companyApi, type CompanySettings } from "../companyApi";

const options: { key: keyof CompanySettings["preferences"]; label: string; description: string }[] = [
  { key: "emailNewBooking", label: "New booking requests", description: "An email as soon as a customer asks to book you" },
  { key: "emailBookingUpdates", label: "Job updates", description: "When a customer cancels, confirms a finished job, or reports a problem" },
  { key: "emailNewReview", label: "New reviews", description: "When a customer reviews you on PlumberFinder" },
];

/** Email preferences — each switch saves at once (in-app notifications always arrive). */
export default function NotificationPrefs({ preferences, onSaved }: { preferences: CompanySettings["preferences"]; onSaved: (preferences: CompanySettings["preferences"]) => void }) {
  const [error, setError] = useState("");
  const toggle = async (key: keyof CompanySettings["preferences"]) => {
    const next = { ...preferences, [key]: !preferences[key] };
    onSaved(next);
    setError("");
    try { await companyApi.savePreferences({ [key]: next[key] }); } catch (caught) { onSaved(preferences); setError(caught instanceof Error ? caught.message : "Could not save."); }
  };
  return (
    <Panel title="Email notifications" description="In-app notifications always arrive; choose which ones also come by email." bodyClassName="divide-y divide-gray-100">
      {options.map((option) => <SettingToggle key={option.key} label={option.label} description={option.description} checked={preferences[option.key]} onChange={() => toggle(option.key)} />)}
      {error && <div className="p-4"><Notice>{error}</Notice></div>}
    </Panel>
  );
}
