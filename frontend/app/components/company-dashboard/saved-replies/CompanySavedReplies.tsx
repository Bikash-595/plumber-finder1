"use client";

import { useState, type FormEvent } from "react";
import { FaBolt, FaPen, FaTrash } from "react-icons/fa";
import EmptyState from "@/components/dashboard/ui/EmptyState";
import Notice from "@/components/dashboard/ui/Notice";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import Panel from "@/components/dashboard/ui/Panel";
import { SkeletonRows } from "@/components/dashboard/ui/Skeleton";
import { useCompanyData } from "../companyApi";
import { growthApi, type SavedReply } from "../growthApi";

const field = "mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";
const categories: { value: SavedReply["category"]; label: string }[] = [{ value: "message", label: "Message" }, { value: "follow-up", label: "Follow-up" }, { value: "decline", label: "Declining" }, { value: "other", label: "Other" }];
const starters = [
  { title: "On my way", body: "Hi! I'm on my way and should be with you in about 20 minutes.", category: "message" as const },
  { title: "Quote sent", body: "I've sent your quote — you can accept it from your PlumberFinder bookings. Any questions, just reply here.", category: "follow-up" as const },
  { title: "Fully booked", body: "Thanks for asking us! We're fully booked on that date — could another day work for you?", category: "decline" as const },
];

/** /company-dashboard/saved-replies — message templates you can insert in one click. */
export default function CompanySavedReplies() {
  const { data, error, loading, reload } = useCompanyData("company-saved-replies", growthApi.savedReplies);
  const [form, setForm] = useState<{ id?: string; title: string; body: string; category: SavedReply["category"] }>({ title: "", body: "", category: "message" });
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const run = async (action: () => Promise<unknown>, text: string) => {
    try { await action(); setNotice({ tone: "success", text }); await reload(); } catch (caught) { setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Something went wrong." }); }
  };
  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    const body = { title: form.title.trim(), body: form.body.trim(), category: form.category };
    await run(() => (form.id ? growthApi.updateReply(form.id, body) : growthApi.addReply(body)), form.id ? "Reply updated." : "Reply saved.");
    setForm({ title: "", body: "", category: "message" });
  };
  return (
    <div className="space-y-6">
      <PageHeader icon={FaBolt} title="Saved replies" description="Answers you send often. Insert them in one click when messaging a customer." />
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Panel title={form.id ? "Edit reply" : "New reply"}>
          <form onSubmit={save} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Name<input value={form.title} maxLength={60} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. On my way" className={field} /></label>
            <label className="block text-sm font-medium text-gray-700">Message<textarea rows={5} maxLength={1000} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className={field} /><span className="mt-1 block text-right text-xs text-gray-400">{form.body.length}/1000</span></label>
            <label className="block text-sm font-medium text-gray-700">Type<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as SavedReply["category"] })} className={field}>{categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></label>
            <div className="flex gap-2"><button type="submit" disabled={!form.title.trim() || !form.body.trim()} className="rounded-full bg-[#0b1f3b] px-5 py-2 text-sm font-bold text-white disabled:opacity-40">{form.id ? "Save changes" : "Save reply"}</button>{form.id && <button type="button" onClick={() => setForm({ title: "", body: "", category: "message" })} className="text-sm font-semibold text-gray-500">Cancel</button>}</div>
          </form>
        </Panel>
        <div className="space-y-3">
          {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}
          <Notice>{error}</Notice>
          {loading ? <SkeletonRows rows={3} className="h-20" /> : !data?.length ? (
            <div className="space-y-3">
              <EmptyState icon={FaBolt} title="No saved replies yet" text="Start with one of these, or write your own." />
              <div className="flex flex-wrap gap-2">{starters.map((s) => <button key={s.title} type="button" onClick={() => run(() => growthApi.addReply(s), `Added “${s.title}”.`)} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:border-[#FFD60A]">+ {s.title}</button>)}</div>
            </div>
          ) : (
            <ul className="space-y-3">
              {data.map((reply) => (
                <li key={reply._id} className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-2"><p className="min-w-0 flex-1 font-semibold text-gray-900">{reply.title}<span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold capitalize text-gray-600">{reply.category}</span></p>
                    <button type="button" onClick={() => setForm({ id: reply._id, title: reply.title, body: reply.body, category: reply.category })} aria-label={`Edit ${reply.title}`} className="text-gray-400 hover:text-[#0b1f3b]"><FaPen className="h-3 w-3" /></button>
                    <button type="button" onClick={() => { if (window.confirm(`Delete “${reply.title}”?`)) run(() => growthApi.removeReply(reply._id), "Reply deleted."); }} aria-label={`Delete ${reply.title}`} className="text-gray-400 hover:text-red-600"><FaTrash className="h-3 w-3" /></button></div>
                  <p className="mt-1 whitespace-pre-line text-sm text-gray-600">{reply.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
