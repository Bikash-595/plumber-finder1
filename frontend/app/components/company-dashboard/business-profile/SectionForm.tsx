"use client";

import { FormEvent, useEffect, useState } from "react";
import { readProfileDraft, saveProfileDraft } from "./profileStore";
import LocalMediaUpload, { type MediaKind } from "./LocalMediaUpload";
import { companyApi, toFormValues } from "./companyApi";
import { NoticeMessage, type Notice } from "./SavedItems";

export type ProfileField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "url" | "email" | "number" | "date" | "tel" | "checkbox" | MediaKind;
  placeholder?: string;
  required?: boolean;
};

type Props = {
  section: string;
  title: string;
  description: string;
  fields: ProfileField[];
  /** Example values: shown as hints until the company saves its own (checkbox defaults are real defaults). */
  defaults: Record<string, string | boolean>;
  /** e.g. "/companies/booking". When set, the record loads from and saves to the backend. */
  apiEndpoint?: string;
};
type Values = Record<string, string | boolean>;

const isUploadField = (field: ProfileField) => field.type === "image" || field.type === "video" || field.type === "media";
const inputClass = "mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";
const MAX_TEXT = 5000;

/**
 * A section holding one record per account (profile, overview, service areas, booking, ...).
 * Not saved yet: an empty form with example hints. Saved: a summary with Edit and Delete.
 */
export default function SectionForm({ section, title, description, fields, defaults, apiEndpoint }: Props) {
  // Blank form: checkboxes keep their defaults; text fields start empty (examples become placeholders).
  const blank: Values = Object.fromEntries(fields.map((field) => [field.name, field.type === "checkbox" ? Boolean(defaults[field.name]) : ""]));
  const [values, setValues] = useState<Values>(apiEndpoint ? blank : { ...blank, ...defaults });
  const [saved, setSaved] = useState<Values | null>(null);
  const [mode, setMode] = useState<"loading" | "view" | "edit">(apiEndpoint ? "loading" : "edit");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!apiEndpoint) {
      // Drafts kept on this device (sections that aren't connected to the backend yet).
      Promise.resolve().then(() => setValues((current) => readProfileDraft(section, current)));
      return;
    }
    companyApi<Record<string, unknown> | null>(apiEndpoint)
      .then(({ data }) => {
        if (!data) return setMode("edit");
        const loaded = { ...blank, ...toFormValues(data, fields.map((field) => field.name)) };
        setSaved(loaded);
        setValues(loaded);
        setMode("view");
      })
      .catch((error: Error) => { setNotice({ tone: "error", text: error.message }); setMode("edit"); });
    // Load once per endpoint; `blank`/`fields` are recreated every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiEndpoint, section]);

  const update = (name: string, value: string | boolean) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const found: Record<string, string> = {};
    for (const field of fields) {
      const value = values[field.name];
      if (field.required && (typeof value !== "string" || !value.trim())) found[field.name] = `${field.label} is required.`;
      else if (typeof value === "string" && !isUploadField(field) && value.length > MAX_TEXT) found[field.name] = `${field.label} must be ${MAX_TEXT} characters or fewer.`;
      else if (field.type === "number" && typeof value === "string" && value.trim() && !Number.isFinite(Number(value))) found[field.name] = `${field.label} must be a number.`;
      else if (field.type === "email" && typeof value === "string" && value.trim() && !/^\S+@\S+\.\S+$/.test(value)) found[field.name] = `${field.label} must be a valid email.`;
    }
    setErrors(found);
    return !Object.keys(found).length;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return setNotice({ tone: "error", text: "Please fix the highlighted fields." });
    if (!apiEndpoint) return setNotice({ tone: "success", text: saveProfileDraft(section, values) });
    setBusy(true);
    setNotice(null);
    try {
      const { data } = await companyApi<Record<string, unknown>>(apiEndpoint, { method: "PUT", body: values });
      const stored = { ...blank, ...toFormValues(data, fields.map((field) => field.name)) };
      setNotice({ tone: "success", text: saved ? `${title} updated.` : `${title} saved to your public profile.` });
      setSaved(stored);
      setValues(stored);
      setMode("view");
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Unable to save changes." });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!apiEndpoint || !window.confirm(`Delete your saved ${title.toLowerCase()}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const response = await companyApi(apiEndpoint, { method: "DELETE" });
      setSaved(null);
      setValues(blank);
      setMode("edit");
      setNotice({ tone: "success", text: response.message ?? `${title} deleted.` });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Unable to delete." });
    } finally {
      setBusy(false);
    }
  };

  const hint = (field: ProfileField) => field.placeholder ?? (apiEndpoint && typeof defaults[field.name] === "string" && defaults[field.name] && !isUploadField(field) ? `e.g. ${defaults[field.name]}` : undefined);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <p className="text-xs font-bold uppercase tracking-wider text-[#0b1f3b]">Business Profile</p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-2 max-w-3xl text-sm text-gray-500">{description}</p>

      {mode === "loading" && <p className="mt-7 rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">Loading your saved details…</p>}

      {mode === "view" && saved && (
        <div className="mt-7 rounded-xl border border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-bold text-gray-900">Saved {title.toLowerCase()} <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">Live on your profile</span></p>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setMode("edit"); setNotice(null); }} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50">Edit</button>
              <button type="button" onClick={remove} disabled={busy} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-60">Delete</button>
            </div>
          </div>
          <dl className="grid gap-x-6 gap-y-4 p-4 sm:grid-cols-2">
            {fields.map((field) => {
              const value = saved[field.name];
              return (
                <div key={field.name} className={field.type === "textarea" || isUploadField(field) ? "sm:col-span-2" : ""}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{field.label}</dt>
                  <dd className="mt-1 whitespace-pre-line break-words text-sm text-gray-900">
                    {field.type === "checkbox" ? (value ? "Yes" : "No")
                      : isUploadField(field) ? (typeof value === "string" && value && !value.startsWith("data:video/") ? <img src={value} alt="" className="h-20 w-20 rounded-lg object-cover" /> : value ? "Uploaded" : <span className="text-gray-400">Not set</span>)
                      : value ? String(value) : <span className="text-gray-400">Not set</span>}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      )}

      {mode === "edit" && (
        <form onSubmit={submit} noValidate className="mt-7 space-y-6">
          {apiEndpoint && !saved && <p className="rounded-lg bg-[#FFD60A]/10 px-3 py-2 text-xs font-medium text-[#0b1f3b]">Example values are shown in grey. Replace them with your own details and press Save.</p>}
          <fieldset disabled={busy} className="grid gap-5 md:grid-cols-2">
            {fields.map((field) => {
              const error = errors[field.name];
              const value = values[field.name];
              return (
                <label key={field.name} className={field.type === "textarea" || isUploadField(field) ? "md:col-span-2" : field.type === "checkbox" ? "flex items-center gap-3 self-end pb-2" : ""}>
                  <span className="text-sm font-semibold text-gray-700">{field.label}{field.required && <span className="text-red-500"> *</span>}</span>
                  {field.type === "textarea" ? <textarea rows={5} name={field.name} placeholder={hint(field)} value={String(value ?? "")} onChange={(e) => update(field.name, e.target.value)} aria-invalid={Boolean(error)} className={inputClass} />
                    : field.type === "checkbox" ? <input type="checkbox" name={field.name} checked={Boolean(value)} onChange={(e) => update(field.name, e.target.checked)} className="h-4 w-4 accent-[#0b1f3b]" />
                    : isUploadField(field) ? <LocalMediaUpload label="" kind={field.type as MediaKind} value={String(value ?? "")} onChange={(next) => update(field.name, next)} />
                    : <input type={field.type ?? "text"} name={field.name} placeholder={hint(field)} value={String(value ?? "")} onChange={(e) => update(field.name, e.target.value)} aria-invalid={Boolean(error)} className={inputClass} />}
                  {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
                </label>
              );
            })}
          </fieldset>
          <NoticeMessage notice={notice} />
          <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
            <button type="submit" disabled={busy} className="rounded-xl bg-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#17345a] disabled:opacity-60">{busy ? "Saving…" : saved ? "Update" : apiEndpoint ? "Save" : "Save changes"}</button>
            {saved && <button type="button" onClick={() => { setValues(saved); setErrors({}); setMode("view"); setNotice(null); }} className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50">Cancel</button>}
            {!apiEndpoint && <button type="button" onClick={() => setNotice({ tone: "success", text: saveProfileDraft(section, values, true) })} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">Save as draft</button>}
          </div>
        </form>
      )}
      {mode === "view" && <div className="mt-4"><NoticeMessage notice={notice} /></div>}
    </section>
  );
}
