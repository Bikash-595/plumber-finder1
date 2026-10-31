"use client";

import { useState, type FormEvent } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import LocalMediaUpload from "@/components/company-dashboard/business-profile/LocalMediaUpload";
import { readStoredUser, storeUser } from "@/components/utils/auth";
import { userApi, type Profile } from "@/components/utils/userApi";
import Notice from "../ui/Notice";
import Panel from "../ui/Panel";
import { errorText, fieldClass } from "./profileOptions";

/** Photo, name and phone numbers. The email is fixed (it identifies the account). */
export default function PersonalInfoForm({ profile, onSaved }: { profile: Profile; onSaved: (profile: Profile) => void }) {
  const initial = { name: profile.name, phone: profile.phone ?? "", altPhone: profile.altPhone ?? "", avatarUrl: profile.avatarUrl ?? "" };
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const dirty = (Object.keys(initial) as (keyof typeof initial)[]).some((key) => form[key] !== initial[key]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const { data } = await userApi.saveProfile(form);
      // Keep the navbar name/avatar in step with the saved profile.
      const stored = readStoredUser();
      if (stored) storeUser({ ...stored, name: data.name, avatarUrl: data.avatarUrl || stored.avatarUrl });
      window.dispatchEvent(new Event("storage"));
      onSaved(data);
      setNotice({ tone: "success", text: "Personal details saved." });
    } catch (caught) {
      setNotice({ tone: "error", text: errorText(caught, "Could not save your details.") });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel title="Personal information" description="Plumbers see your name and phone number on your bookings.">
      <form onSubmit={submit} className="space-y-5">
        <LocalMediaUpload label="Profile photo" value={form.avatarUrl} onChange={(avatarUrl) => setForm({ ...form, avatarUrl })} />
        <label className="block text-sm font-medium text-gray-700">Full name <span className="text-red-500">*</span>
          <input type="text" required maxLength={120} autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={fieldClass} />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-gray-700">Mobile phone
            <input type="tel" maxLength={40} autoComplete="tel" placeholder="(512) 555-0100" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={fieldClass} />
          </label>
          <label className="block text-sm font-medium text-gray-700">Other phone <span className="font-normal text-gray-400">(optional)</span>
            <input type="tel" maxLength={40} placeholder="Work or landline" value={form.altPhone} onChange={(e) => setForm({ ...form, altPhone: e.target.value })} className={fieldClass} />
          </label>
        </div>
        <label className="block text-sm font-medium text-gray-700">Email address
          <span className="relative block">
            <input type="email" value={profile.email} readOnly className={`${fieldClass} cursor-not-allowed bg-gray-50 pr-28 text-gray-500`} />
            {profile.emailVerified === false
              ? <span className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 text-xs font-semibold text-amber-700"><FaExclamationCircle className="h-3 w-3" />Not verified</span>
              : <span className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 text-xs font-semibold text-emerald-700"><FaCheckCircle className="h-3 w-3" />Verified</span>}
          </span>
          <span className="mt-1 block text-xs text-gray-500">Contact support to change the email on your account.</span>
        </label>
        {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving || !dirty} className="rounded-full bg-[#FFD60A] px-6 py-2.5 text-sm font-bold text-[#0b1f3b] shadow-sm transition hover:brightness-95 disabled:opacity-50">{saving ? "Saving…" : "Save changes"}</button>
          {dirty && <button type="button" onClick={() => { setForm(initial); setNotice(null); }} className="text-sm font-semibold text-gray-500 hover:text-gray-800">Discard</button>}
        </div>
      </form>
    </Panel>
  );
}
