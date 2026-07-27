"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { saveProfileDraft } from "./profileStore";
import type { ProfileField } from "./SectionForm";
import LocalMediaUpload from "./LocalMediaUpload";

type Props = { section: string; title: string; description: string; itemName: string; fields: ProfileField[]; initial?: Record<string, string | boolean> };

export default function CollectionForm({ section, title, description, itemName, fields, initial }: Props) {
  const itemSchema = z.object(Object.fromEntries(fields.map((field) => [field.name, field.type === "checkbox" ? z.boolean() : z.string().trim().max(5000)])));
  const schema = z.object({ items: z.array(itemSchema).min(1) });
  const blank = Object.fromEntries(fields.map((field) => [field.name, field.type === "checkbox" ? false : ""]));
  const form = useForm<{ items: Record<string, string | boolean>[] }>({ resolver: zodResolver(schema), defaultValues: { items: [initial ?? blank] } });
  const { fields: rows, append, remove } = useFieldArray({ control: form.control, name: "items" });
  const [notice, setNotice] = useState("");
  const persist = (draft: boolean) => form.handleSubmit((values) => setNotice(saveProfileDraft(section, values, draft)))();

  return <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">


    <p className="text-xs font-bold uppercase tracking-wider text-[#0b1f3b]">Business Profile</p>

    <h1 className="mt-2 text-2xl font-bold text-gray-900">{title}</h1>

    <p className="mt-2 text-sm text-gray-500">{description}</p>

    <form onSubmit={form.handleSubmit((values) => setNotice(saveProfileDraft(section, values)))} className="mt-7 space-y-5">
    
      {rows.map((row, index) => <article key={row.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">{itemName} {index + 1}</h2>{rows.length > 1 && <button type="button" onClick={() => remove(index)} className="text-sm font-bold text-red-600">Delete</button>}</div>
          
        <div className="grid gap-4 md:grid-cols-2">{fields.map((field) => <label key={field.name} className={field.type === "textarea" || field.type === "image" || field.type === "video" || field.type === "media" ? "md:col-span-2" : ""}><span className="text-sm font-semibold text-gray-700">{field.label}</span>{field.type === "textarea" ? <textarea rows={4} {...form.register(`items.${index}.${field.name}`)} className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]" /> : field.type === "checkbox" ? <input type="checkbox" {...form.register(`items.${index}.${field.name}`)} className="ml-3 h-4 w-4 accent-[#0b1f3b]" /> : field.type === "image" || field.type === "video" || field.type === "media" ? <LocalMediaUpload label="" kind={field.type} value={String(form.watch(`items.${index}.${field.name}`) ?? "")} onChange={(value) => form.setValue(`items.${index}.${field.name}`, value)} /> : <input type={field.type ?? "text"} {...form.register(`items.${index}.${field.name}`)} className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]" />}</label>)}</div>
      </article>)}
      <button type="button" onClick={() => append(blank)} className="rounded-xl border border-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-[#0b1f3b] hover:bg-[#0b1f3b] hover:text-white">+ Add {itemName}</button>
      {notice && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{notice}</p>}
      <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5"><button type="submit" className="rounded-xl bg-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-white">Save changes</button><button type="button" onClick={() => persist(true)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700">Save as draft</button><button type="button" onClick={() => { form.reset(); setNotice(""); }} className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-500">Cancel</button></div>
    </form>
  </section>;
}
