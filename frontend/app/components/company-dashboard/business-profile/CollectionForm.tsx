"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { readProfileDraft, saveProfileDraft } from "./profileStore";
import type { ProfileField } from "./SectionForm";
import LocalMediaUpload from "./LocalMediaUpload";
import { companyApi, toFormValues } from "./companyApi";
import { ExampleCard, NoticeMessage, type Notice } from "./SavedItems";

type Props = {
  section: string;
  title: string;
  description: string;
  itemName: string;
  fields: ProfileField[];
  /** Example record shown (read-only) until the first real one is added. */
  initial?: Record<string, string | boolean>;
  /** e.g. "/companies/services". When set, records load from and save to the backend; otherwise they stay on this device. */
  apiEndpoint?: string;
};
type Values = Record<string, string | boolean>;
type SavedRecord = Record<string, unknown> & { _id: string };

const isUploadField = (field: ProfileField) => field.type === "image" || field.type === "video" || field.type === "media";
const inputClass = "mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";
const MAX_TEXT = 5000;

/**
 * One form per record: fill it in and press Add to save a record; saved records are listed below with
 * Edit and Delete. Used by every list section (services, gallery, reviews, team, FAQs, offers, ...).
 */
export default function CollectionForm({ section, title, description, itemName, fields, initial, apiEndpoint }: Props) {
  const blank: Values = Object.fromEntries(fields.map((field) => [field.name, field.type === "checkbox" ? false : ""]));
  const fieldNames = fields.map((field) => field.name);
  const [records, setRecords] = useState<SavedRecord[]>([]);
  const [values, setValues] = useState<Values>(blank);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<Notice>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const noun = itemName.toLowerCase();

  useEffect(() => {
    if (!apiEndpoint) {
      setRecords(readProfileDraft<{ items: SavedRecord[] }>(section, { items: [] }).items.filter((item) => item._id));
      setLoading(false);
      return;
    }
    companyApi<SavedRecord[]>(apiEndpoint)
      .then(({ data }) => setRecords(data))
      .catch((error: Error) => setNotice({ tone: "error", text: error.message }))
      .finally(() => setLoading(false));
  }, [apiEndpoint, section]);

  // The example disappears as soon as there is a real record or the company starts typing one.
  const startedTyping = fields.some((field) => values[field.name] !== blank[field.name]);
  const showExample = Boolean(initial) && !loading && records.length === 0 && !startedTyping && !editingId;

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
    }
    setErrors(found);
    return !Object.keys(found).length;
  };

  const resetForm = () => { setValues(blank); setEditingId(null); setErrors({}); };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return setNotice({ tone: "error", text: "Please fix the highlighted fields." });
    setSaving(true);
    setNotice(null);
    try {
      let saved: SavedRecord;
      if (!apiEndpoint) {
        saved = { ...values, _id: editingId ?? `local-${Date.now()}` };
      } else if (editingId) {
        saved = (await companyApi<SavedRecord>(`${apiEndpoint}/${editingId}`, { method: "PUT", body: values })).data;
      } else {
        saved = (await companyApi<SavedRecord>(apiEndpoint, { method: "POST", body: values })).data;
      }
      const next = editingId ? records.map((record) => (record._id === editingId ? saved : record)) : [...records, saved];
      setRecords(next);
      if (!apiEndpoint) saveProfileDraft(section, { items: next });
      setNotice({ tone: "success", text: editingId ? `${itemName} updated.` : `${itemName} added${apiEndpoint ? " to your public profile" : ""}.` });
      resetForm();
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : `Unable to save the ${noun}.` });
    } finally {
      setSaving(false);
    }
  };

  const edit = (record: SavedRecord) => {
    setValues({ ...blank, ...toFormValues(record, fieldNames) });
    setEditingId(record._id);
    setErrors({});
    setNotice(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const remove = async (record: SavedRecord) => {
    if (!window.confirm(`Delete this ${noun}? This cannot be undone.`)) return;
    try {
      if (apiEndpoint) await companyApi(`${apiEndpoint}/${record._id}`, { method: "DELETE" });
      const next = records.filter((item) => item._id !== record._id);
      setRecords(next);
      if (!apiEndpoint) saveProfileDraft(section, { items: next });
      if (editingId === record._id) resetForm();
      setNotice({ tone: "success", text: `${itemName} deleted.` });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : `Unable to delete the ${noun}.` });
    }
  };

  return <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
    <p className="text-xs font-bold uppercase tracking-wider text-[#0b1f3b]">Business Profile</p>
    <h1 className="mt-2 text-2xl font-bold text-gray-900">{title}</h1>
    <p className="mt-2 text-sm text-gray-500">{description}</p>

    <form ref={formRef} onSubmit={submit} noValidate className="mt-7 scroll-mt-24 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-bold text-gray-900">{editingId ? `Edit ${noun}` : `Add a ${noun}`}</h2>
        {editingId && <span className="rounded-full bg-[#FFD60A]/20 px-3 py-1 text-xs font-bold text-[#0b1f3b]">Editing a saved {noun}</span>}
      </div>
      <fieldset disabled={loading || saving} className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => {
          const value = values[field.name];
          const placeholder = field.placeholder ?? (typeof initial?.[field.name] === "string" && !isUploadField(field) ? `e.g. ${initial[field.name]}` : undefined);
          const error = errors[field.name];
          return <label key={field.name} className={field.type === "textarea" || isUploadField(field) ? "md:col-span-2" : field.type === "checkbox" ? "flex items-center gap-3 self-end pb-2" : ""}>
            <span className="text-sm font-semibold text-gray-700">{field.label}{field.required && <span className="text-red-500"> *</span>}</span>
            {field.type === "textarea" ? <textarea rows={4} value={String(value ?? "")} placeholder={placeholder} onChange={(e) => update(field.name, e.target.value)} aria-invalid={Boolean(error)} className={inputClass} />
              : field.type === "checkbox" ? <input type="checkbox" checked={Boolean(value)} onChange={(e) => update(field.name, e.target.checked)} className="h-4 w-4 accent-[#0b1f3b]" />
              : isUploadField(field) ? <LocalMediaUpload label="" kind={field.type as "image" | "video" | "media"} value={String(value ?? "")} onChange={(next) => update(field.name, next)} />
              : <input type={field.type ?? "text"} value={String(value ?? "")} placeholder={placeholder} onChange={(e) => update(field.name, e.target.value)} aria-invalid={Boolean(error)} className={inputClass} />}
            {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
          </label>;
        })}
      </fieldset>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" disabled={saving || loading} className="rounded-xl bg-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#17345a] disabled:opacity-60">{saving ? "Saving…" : editingId ? `Update ${noun}` : `Add ${noun}`}</button>
        {(editingId || startedTyping) && <button type="button" onClick={() => { resetForm(); setNotice(null); }} className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-500 hover:bg-white">{editingId ? "Cancel edit" : "Clear form"}</button>}
      </div>
    </form>

    <div className="mt-4"><NoticeMessage notice={notice} /></div>

    <div className="mt-6">
      <h2 className="text-sm font-bold text-gray-900">Saved {noun}s {!loading && <span className="font-medium text-gray-400">({records.length})</span>}</h2>
      {loading && <p className="mt-3 rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">Loading your saved {noun}s…</p>}
      {showExample && initial && <ExampleCard itemName={noun}><RecordSummary record={initial} fields={fields} /></ExampleCard>}
      {!loading && !records.length && !showExample && <p className="mt-3 rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">No {noun}s saved yet. Use the form above to add your first one.</p>}
      <ul className="mt-3 grid gap-3 lg:grid-cols-2">
        {records.map((record) => (
          <li key={record._id} className={`flex flex-col gap-3 rounded-xl border p-4 ${editingId === record._id ? "border-[#FFD60A] bg-[#FFD60A]/10" : "border-gray-200 bg-white"}`}>
            <RecordSummary record={record} fields={fields} />
            <div className="flex gap-2 border-t border-gray-100 pt-3">
              <button type="button" onClick={() => edit(record)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50">{editingId === record._id ? "Editing…" : "Edit"}</button>
              <button type="button" onClick={() => remove(record)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>;
}

const isDisplayableMedia = (value: string) => value.startsWith("data:image/") || /^https?:\/\//.test(value) || value.startsWith("/");

/** A saved record as a compact card: picture, title, details, and yes/no flags. */
function RecordSummary({ record, fields }: { record: Record<string, unknown>; fields: ProfileField[] }) {
  const text = (value: unknown) => (Array.isArray(value) ? value.join(", ") : typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value) ? value.slice(0, 10) : value === null || value === undefined ? "" : String(value));
  const media = fields.filter(isUploadField).map((field) => text(record[field.name])).find((value) => value && isDisplayableMedia(value) && !value.startsWith("data:video/"));
  const textFields = fields.filter((field) => !isUploadField(field) && field.type !== "checkbox" && text(record[field.name]));
  const [headingField, ...rest] = textFields;
  const flags = fields.filter((field) => field.type === "checkbox" && record[field.name] === true);

  return <div className="flex min-w-0 gap-3">
    {media && <img src={media} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />}
    <div className="min-w-0">
      <p className="break-words font-semibold text-gray-900">{headingField ? text(record[headingField.name]) : "Untitled"}</p>
      {rest.slice(0, 4).map((field) => <p key={field.name} className="mt-0.5 line-clamp-2 break-words text-xs text-gray-500"><span className="font-semibold text-gray-600">{field.label}:</span> {text(record[field.name])}</p>)}
      {flags.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{flags.map((field) => <span key={field.name} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">{field.label}</span>)}</div>}
    </div>
  </div>;
}
