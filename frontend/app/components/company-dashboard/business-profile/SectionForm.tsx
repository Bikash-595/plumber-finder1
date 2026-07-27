"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { saveProfileDraft } from "./profileStore";
import { readStoredUser } from "@/components/utils/auth";
import LocalMediaUpload, { type MediaKind } from "./LocalMediaUpload";

export type ProfileField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "url" | "email" | "number" | "date" | "tel" | "checkbox" | MediaKind;
  placeholder?: string;
};

type Props = {
  section: string;
  title: string;
  description: string;
  fields: ProfileField[];
  defaults: Record<string, string | boolean>;
  apiEndpoint?: string;
};

export default function SectionForm({ section, title, description, fields, defaults, apiEndpoint }: Props) {
  const schema = z.object(Object.fromEntries(fields.map((field) => [
    field.name,
    field.type === "checkbox" ? z.boolean() : field.type === "image" ? z.string().max(1_250_000) : z.string().trim().max(5000),
  ])));
  const form = useForm<Record<string, string | boolean>>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!apiEndpoint) return;
    const token = readStoredUser()?.accessToken;
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300/api"}${apiEndpoint}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => { if (payload?.data) form.reset({ ...defaults, ...payload.data }); })
      .catch(() => undefined);
  }, [apiEndpoint, form, defaults]);

  const persist = (draft: boolean) => form.handleSubmit(async (values) => {
    if (!apiEndpoint || draft) {
      setNotice(saveProfileDraft(section, values, draft));
      return;
    }
    const token = readStoredUser()?.accessToken;
    if (!token) return setNotice("Please log in with your company account before saving.");
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300/api"}${apiEndpoint}`;
    try {
      let response = await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(values) });
      if (response.status === 404) {
        response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(values) });
      }
      const payload = await response.json();
      setNotice(response.ok ? "Changes saved to the database." : payload.message || `Unable to save changes (${response.status}).`);
    } catch {
      setNotice("Cannot reach the backend. Start it with: cd backend && npm run dev");
    }
  })();

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <p className="text-xs font-bold uppercase tracking-wider text-[#0b1f3b]">Business Profile</p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-2 max-w-3xl text-sm text-gray-500">{description}</p>
      <form onSubmit={(event) => { event.preventDefault(); persist(false); }} className="mt-7 space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field.name} className={field.type === "textarea" || field.type === "image" || field.type === "video" || field.type === "media" ? "md:col-span-2" : ""}>
              <span className="text-sm font-semibold text-gray-700">{field.label}</span>
              {field.type === "textarea" ? (
                <textarea rows={5} placeholder={field.placeholder} {...form.register(field.name)} className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30" />
              ) : field.type === "checkbox" ? (
                <input type="checkbox" {...form.register(field.name)} className="ml-3 h-4 w-4 accent-[#0b1f3b]" />
              ) : field.type === "image" || field.type === "video" || field.type === "media" ? (
                <LocalMediaUpload label="" kind={field.type} value={String(form.watch(field.name) ?? "")} onChange={(value) => form.setValue(field.name, value, { shouldDirty: true })} />
              ) : (
                <input type={field.type ?? "text"} placeholder={field.placeholder} {...form.register(field.name)} className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30" />
              )}
              {form.formState.errors[field.name] && <span className="mt-1 block text-xs text-red-600">Please enter a valid {field.label.toLowerCase()}.</span>}
            </label>
          ))}
        </div>
        {notice && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{notice}</p>}
        <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
          <button type="submit" className="rounded-xl bg-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#17345a]">Save changes</button>
          <button type="button" onClick={() => persist(true)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">Save as draft</button>
          <button type="button" onClick={() => { form.reset(defaults); setNotice(""); }} className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </section>
  );
}
