"use client";

import { useState, type FormEvent } from "react";
import { FaCommentDots, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { userApi, type ContactMethod, type ContactTime, type Profile } from "@/components/utils/userApi";
import Notice from "../ui/Notice";
import Panel from "../ui/Panel";
import { contactMethods, contactTimes, errorText, fieldClass, languages } from "./profileOptions";

const methodIcons = { phone: FaPhoneAlt, sms: FaCommentDots, email: FaEnvelope };

/** How and when plumbers should reach you, and someone else they can call to get in. */
export default function ContactPreferencesForm({ profile, onSaved }: { profile: Profile; onSaved: (profile: Profile) => void }) {
  const initial = {
    preferredContact: (profile.preferredContact ?? "") as ContactMethod | "",
    contactTime: (profile.contactTime ?? "") as ContactTime | "",
    language: profile.language ?? "",
    alternateContactName: profile.alternateContactName ?? "",
    alternateContactPhone: profile.alternateContactPhone ?? "",
  };
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const dirty = (Object.keys(initial) as (keyof typeof initial)[]).some((key) => form[key] !== initial[key]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (form.preferredContact && form.preferredContact !== "email" && !profile.phone) return setNotice({ tone: "error", text: "Add a mobile phone in Personal information first, so plumbers can call or text you." });
    if (form.alternateContactName && !form.alternateContactPhone) return setNotice({ tone: "error", text: "Add a phone number for your alternate contact." });
    setSaving(true);
    setNotice(null);
    try {
      // Empty choices are sent as null so they are cleared on the server.
      const { data } = await userApi.saveProfile({
        name: profile.name,
        preferredContact: form.preferredContact || null,
        contactTime: form.contactTime || null,
        language: form.language || null,
        alternateContactName: form.alternateContactName || null,
        alternateContactPhone: form.alternateContactPhone || null,
      });
      onSaved(data);
      setNotice({ tone: "success", text: "Contact preferences saved." });
    } catch (caught) {
      setNotice({ tone: "error", text: errorText(caught, "Could not save your preferences.") });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel title="Contact preferences" description="Shared with the plumber when you book, so they reach you the way you like.">
      <form onSubmit={submit} className="space-y-5">
        <fieldset>
          <legend className="text-sm font-medium text-gray-700">Best way to reach you</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {contactMethods.map((method) => {
              const Icon = methodIcons[method.value];
              const checked = form.preferredContact === method.value;
              return (
                <label key={method.value} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${checked ? "border-[#0b1f3b] bg-[#0b1f3b]/5 ring-1 ring-[#0b1f3b]" : "border-gray-200 hover:border-gray-300"}`}>
                  <input type="radio" name="preferredContact" value={method.value} checked={checked} onChange={() => setForm({ ...form, preferredContact: method.value })} className="sr-only" />
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${checked ? "bg-[#0b1f3b] text-[#FFD60A]" : "bg-gray-100 text-gray-500"}`}><Icon className="h-4 w-4" /></span>
                  <span><span className="block text-sm font-semibold text-gray-900">{method.label}</span><span className="block text-xs text-gray-500">{method.hint}</span></span>
                </label>
              );
            })}
          </div>
          {form.preferredContact && <button type="button" onClick={() => setForm({ ...form, preferredContact: "" })} className="mt-2 text-xs font-semibold text-gray-500 hover:text-gray-800">No preference</button>}
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-gray-700">Best time to contact
            <select value={form.contactTime} onChange={(e) => setForm({ ...form, contactTime: e.target.value as ContactTime | "" })} className={fieldClass}>
              <option value="">No preference</option>
              {contactTimes.map((time) => <option key={time.value} value={time.value}>{time.label}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-gray-700">Preferred language
            <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className={fieldClass}>
              <option value="">No preference</option>
              {languages.map((language) => <option key={language}>{language}</option>)}
            </select>
          </label>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-900">Alternate contact <span className="font-normal text-gray-400">(optional)</span></p>
          <p className="text-xs text-gray-500">Someone the plumber can call if they can&apos;t reach you — a family member, tenant or property manager.</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-gray-700">Name
              <input maxLength={120} value={form.alternateContactName} onChange={(e) => setForm({ ...form, alternateContactName: e.target.value })} placeholder="e.g. Sam (tenant)" className={fieldClass} />
            </label>
            <label className="block text-sm font-medium text-gray-700">Phone
              <input type="tel" maxLength={40} value={form.alternateContactPhone} onChange={(e) => setForm({ ...form, alternateContactPhone: e.target.value })} className={fieldClass} />
            </label>
          </div>
        </div>

        {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}
        <button type="submit" disabled={saving || !dirty} className="rounded-full bg-[#FFD60A] px-6 py-2.5 text-sm font-bold text-[#0b1f3b] shadow-sm transition hover:brightness-95 disabled:opacity-50">{saving ? "Saving…" : "Save preferences"}</button>
      </form>
    </Panel>
  );
}
