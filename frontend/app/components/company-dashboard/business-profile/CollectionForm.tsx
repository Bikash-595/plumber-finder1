"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { saveProfileDraft } from "./profileStore";
import type { ProfileField } from "./SectionForm";
import LocalMediaUpload from "./LocalMediaUpload";
import { companyApi, toFormValues } from "./companyApi";

type Props = {
  section: string;
  title: string;
  description: string;
  itemName: string;
  fields: ProfileField[];
  initial?: Record<string, string | boolean>;
  /** e.g. "/companies/services". When set, items load from and save to the backend. */
  apiEndpoint?: string;
};
type Row = Record<string, string | boolean> & { _id?: string };
type Notice = { tone: "success" | "error"; text: string } | null;

const isUploadField = (field: ProfileField) => field.type === "image" || field.type === "video" || field.type === "media";

export default function CollectionForm({ section, title, description, itemName, fields, initial, apiEndpoint }: Props) {
  const itemSchema = z.object({
    _id: z.string().optional(),
    // Uploaded images/videos are stored as data URLs, so they need a much larger limit than text.
    ...Object.fromEntries(fields.map((field) => [field.name, field.type === "checkbox" ? z.boolean() : isUploadField(field) ? z.string().max(6_000_000) : z.string().trim().max(5000)])),
  });
  const schema = z.object({ items: z.array(itemSchema).min(apiEndpoint ? 0 : 1) });
  const blank = Object.fromEntries(fields.map((field) => [field.name, field.type === "checkbox" ? false : ""]));
  const form = useForm<{ items: Row[] }>({ resolver: zodResolver(schema), defaultValues: { items: apiEndpoint ? [] : [initial ?? blank] } });
  const { fields: rows, append, remove } = useFieldArray({ control: form.control, name: "items", keyName: "rowKey" });
  const [notice, setNotice] = useState<Notice>(null);
  const [loading, setLoading] = useState(Boolean(apiEndpoint));
  const [saving, setSaving] = useState(false);
  // Ids that exist on the server, so removed rows can be deleted on save.
  const savedIds = useRef<string[]>([]);

  useEffect(() => {
    if (!apiEndpoint) return;
    companyApi<Row[]>(apiEndpoint)
      .then(({ data }) => {
        savedIds.current = data.map((item) => String(item._id));
        const fieldNames = fields.map((field) => field.name);
        form.reset({ items: data.map((item) => ({ ...blank, ...toFormValues(item, fieldNames), _id: String(item._id) })) });
      })
      .catch((error: Error) => setNotice({ tone: "error", text: error.message }))
      .finally(() => setLoading(false));
    // Load once per endpoint; `fields`/`blank` are recreated every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiEndpoint, form]);

  const saveToApi = async (items: Row[]) => {
    if (!apiEndpoint) return;
    setSaving(true);
    setNotice(null);
    try {
      const keptIds = items.map((item) => item._id).filter(Boolean) as string[];
      for (const id of savedIds.current.filter((savedId) => !keptIds.includes(savedId))) {
        await companyApi(`${apiEndpoint}/${id}`, { method: "DELETE" });
      }
      // One request per item keeps each body small even when items carry photos.
      for (const [index, { _id, ...values }] of items.entries()) {
        if (_id) {
          await companyApi(`${apiEndpoint}/${_id}`, { method: "PUT", body: values });
        } else {
          const { data } = await companyApi<Row>(apiEndpoint, { method: "POST", body: values });
          form.setValue(`items.${index}._id`, String(data._id));
        }
      }
      savedIds.current = form.getValues("items").map((item) => item._id).filter(Boolean) as string[];
      form.reset(form.getValues()); // "Cancel" now returns to what is saved.
      setNotice({ tone: "success", text: "Changes saved to your public profile." });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Unable to save changes." });
    } finally {
      setSaving(false);
    }
  };

  const submit = form.handleSubmit((values) => (apiEndpoint ? saveToApi(values.items) : setNotice({ tone: "success", text: saveProfileDraft(section, values) })));
  const saveDraft = form.handleSubmit((values) => setNotice({ tone: "success", text: saveProfileDraft(section, values, true) }));
  const canDelete = apiEndpoint ? true : rows.length > 1;

  return <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
    <p className="text-xs font-bold uppercase tracking-wider text-[#0b1f3b]">Business Profile</p>
    <h1 className="mt-2 text-2xl font-bold text-gray-900">{title}</h1>
    <p className="mt-2 text-sm text-gray-500">{description}</p>

    <form onSubmit={submit} className="mt-7 space-y-5">
      {loading && <p className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">Loading your saved {itemName.toLowerCase()}s…</p>}
      {!loading && rows.length === 0 && <p className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">No {itemName.toLowerCase()}s yet. Add your first one below.</p>}

      {rows.map((row, index) => <article key={row.rowKey} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">{itemName} {index + 1}</h2>{canDelete && <button type="button" onClick={() => remove(index)} className="text-sm font-bold text-red-600">Delete</button>}</div>
        <div className="grid gap-4 md:grid-cols-2">{fields.map((field) => <label key={field.name} className={field.type === "textarea" || isUploadField(field) ? "md:col-span-2" : ""}><span className="text-sm font-semibold text-gray-700">{field.label}</span>{field.type === "textarea" ? <textarea rows={4} {...form.register(`items.${index}.${field.name}`)} className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]" /> : field.type === "checkbox" ? <input type="checkbox" {...form.register(`items.${index}.${field.name}`)} className="ml-3 h-4 w-4 accent-[#0b1f3b]" /> : isUploadField(field) ? <LocalMediaUpload label="" kind={field.type as "image" | "video" | "media"} value={String(form.watch(`items.${index}.${field.name}`) ?? "")} onChange={(value) => form.setValue(`items.${index}.${field.name}`, value)} /> : <input type={field.type ?? "text"} {...form.register(`items.${index}.${field.name}`)} className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]" />}</label>)}</div>
      </article>)}

      <button type="button" onClick={() => append(blank)} className="rounded-xl border border-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-[#0b1f3b] hover:bg-[#0b1f3b] hover:text-white">+ Add {itemName}</button>
      {notice && <p className={`rounded-lg px-3 py-2 text-sm font-medium ${notice.tone === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{notice.text}</p>}
      <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5"><button type="submit" disabled={saving || loading} className="rounded-xl bg-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button><button type="button" onClick={saveDraft} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700">Save as draft</button><button type="button" onClick={() => { form.reset(); setNotice(null); }} className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-500">Cancel</button></div>
    </form>
  </section>;
}
