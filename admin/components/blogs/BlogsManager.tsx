"use client";

import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp, FaPlus, FaTrash } from "react-icons/fa";
import { DataTable, FilterBar, Pager, Panel, StatusBadge, useAdminQuery } from "@/components/AdminData";
import { adminApi, formatDate, type BlogFaq, type BlogStats, type PlatformBlog } from "@/lib/adminApi";
import CommentsPanel from "./CommentsPanel";
import Readership from "./Readership";
import { FRONTEND_URL, categories, statuses, field, blank, today, readPhoto, stateOf, type Draft } from "./blogConfig";

export default function BlogsManager() {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useAdminQuery(`blogs|${status}|${search}|${page}`, () => adminApi.blogs({ status: status === "all" ? undefined : status, search, page }));
  const [draft, setDraft] = useState<Draft>(blank);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [commentsFor, setCommentsFor] = useState<PlatformBlog | null>(null);
  const [stats, setStats] = useState<BlogStats | null>(null);
  useEffect(() => { adminApi.blogStats().then(setStats).catch(() => undefined); }, [data]);
  const statOf = (id: string) => stats?.data.find((row) => row._id === id);
  const set = (change: Partial<Draft>) => setDraft((current) => ({ ...current, ...change }));
  const setFaq = (index: number, change: Partial<BlogFaq>) => set({ faqs: draft.faqs.map((faq, i) => (i === index ? { ...faq, ...change } : faq)) });
  const moveFaq = (index: number, delta: number) => { const next = [...draft.faqs]; const [item] = next.splice(index, 1); next.splice(index + delta, 0, item); set({ faqs: next }); };

  const edit = async (post: PlatformBlog) => {
    try {
      const { data: full } = await adminApi.blog(post._id);
      setDraft({ title: full.title, category: full.category ?? "", author: full.author ?? "", publishDate: full.publishDate?.slice(0, 10) ?? "", tags: (full.tags ?? []).join(", "), coverImage: full.coverImage ?? "", excerpt: full.excerpt, content: full.content ?? "", faqs: full.faqs ?? [] });
      setEditingId(post._id);
      setNotice(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
    } catch (caught) { setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Could not open the post." }); }
  };
  const startNew = () => { setDraft(blank); setEditingId(null); setNotice(null); };

  const save = async (publish: boolean) => {
    const faqs = draft.faqs.map((faq) => ({ question: faq.question.trim(), answer: faq.answer.trim() })).filter((faq) => faq.question || faq.answer);
    const incomplete = faqs.findIndex((faq) => !faq.question || !faq.answer);
    if (!draft.title.trim() || !draft.excerpt.trim() || !draft.content.trim()) return setNotice({ tone: "error", text: "Title, summary, and content are required." });
    if (incomplete >= 0) return setNotice({ tone: "error", text: `FAQ ${incomplete + 1} needs both a question and an answer.` });
    setBusy(true);
    try {
      const { data: saved } = await adminApi.saveBlog(editingId, { ...draft, tags: draft.tags.split(",").map((tag) => tag.trim()).filter(Boolean) as unknown as string[], faqs, status: publish ? "published" : "draft", publishDate: draft.publishDate || undefined });
      setEditingId(saved._id);
      setNotice({ tone: "ok", text: publish ? (draft.publishDate > today() ? `Scheduled: it goes live on ${draft.publishDate}.` : "Published on the Plumber Finder blog.") : "Draft saved." });
      await reload();
    } catch (caught) { setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Could not save." }); } finally { setBusy(false); }
  };
  const remove = async (post: PlatformBlog) => {
    if (!window.confirm(`Delete “${post.title}”? Its comments stay hidden with it.`)) return;
    try { await adminApi.deleteBlog(post._id); if (editingId === post._id) startNew(); await reload(); } catch (caught) { setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Could not delete." }); }
  };
  const choosePhoto = async (file?: File) => { if (!file) return; try { set({ coverImage: await readPhoto(file) }); } catch (caught) { setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Could not read the photo." }); } };

  return (
    <div className="space-y-6">
      <Readership stats={stats} />
      <Panel title={editingId ? `Edit “${draft.title || "post"}”` : "Write a Plumber Finder article"} description="Articles appear on the public blog at /blogs, with their FAQs, likes, and comments.">
        {editingId && <button type="button" onClick={startNew} className="mb-3 text-sm font-semibold text-[#0b1f3b] underline">+ Write a new article instead</button>}
        <form onSubmit={(event) => { event.preventDefault(); save(true); }} className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-gray-700 md:col-span-2">Title *<input value={draft.title} onChange={(e) => set({ title: e.target.value })} maxLength={200} placeholder="e.g. How to Choose a Plumber You Can Trust" className={field} /></label>
          <label className="text-sm font-semibold text-gray-700">Category<input list="blog-categories" value={draft.category} onChange={(e) => set({ category: e.target.value })} maxLength={80} className={field} /><datalist id="blog-categories">{categories.map((name) => <option key={name} value={name} />)}</datalist></label>
          <label className="text-sm font-semibold text-gray-700">Author<input value={draft.author} onChange={(e) => set({ author: e.target.value })} maxLength={120} className={field} /></label>
          <label className="text-sm font-semibold text-gray-700">Publish date<input type="date" value={draft.publishDate} onChange={(e) => set({ publishDate: e.target.value })} className={field} /><span className="mt-1 block text-xs font-normal text-gray-500">{draft.publishDate > today() ? `Stays hidden until ${draft.publishDate}.` : "Empty = today. A future date schedules the article."}</span></label>
          <label className="text-sm font-semibold text-gray-700">Tags<input value={draft.tags} onChange={(e) => set({ tags: e.target.value })} placeholder="winter, pipes, maintenance" className={field} /></label>
          <div className="text-sm font-semibold text-gray-700 md:col-span-2">Cover image
            <div className="mt-1 flex flex-wrap items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- uploads are data URLs */}
              {draft.coverImage && <img src={draft.coverImage} alt="" className="h-20 w-36 rounded-lg object-cover" />}
              <input value={draft.coverImage.startsWith("data:") ? "" : draft.coverImage} onChange={(e) => set({ coverImage: e.target.value })} placeholder="https://images.unsplash.com/…" aria-label="Cover image link" className={`${field} mt-0 min-w-0 flex-1`} />
              <label className="cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-[#0b1f3b] hover:bg-gray-50">Upload photo<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => choosePhoto(e.target.files?.[0])} /></label>
              {draft.coverImage && <button type="button" onClick={() => set({ coverImage: "" })} className="text-xs font-bold text-red-600">Remove</button>}
            </div>
          </div>
          <label className="text-sm font-semibold text-gray-700 md:col-span-2">Summary *<textarea rows={2} value={draft.excerpt} onChange={(e) => set({ excerpt: e.target.value })} maxLength={500} placeholder="One or two sentences shown on the blog list and in search results." className={field} /></label>
          <label className="text-sm font-semibold text-gray-700 md:col-span-2">Content * <span className="text-xs font-normal text-gray-400">Blank line = new paragraph · “## ” heading · “- ” bullet</span><textarea rows={12} value={draft.content} onChange={(e) => set({ content: e.target.value })} maxLength={50000} className={`${field} leading-6`} /></label>
          <div className="rounded-xl border border-gray-200 p-4 md:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-bold text-gray-900">Article FAQs <span className="font-normal text-gray-400">({draft.faqs.length}/15)</span></p>
              <button type="button" disabled={draft.faqs.length >= 15} onClick={() => set({ faqs: [...draft.faqs, { question: "", answer: "" }] })} className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#0b1f3b] px-3 py-1.5 text-xs font-bold text-[#0b1f3b] disabled:opacity-40"><FaPlus className="h-2.5 w-2.5" /> Add question</button>
            </div>
            <ol className="mt-3 space-y-3">
              {draft.faqs.map((faq, index) => (
                <li key={index} className="flex gap-2 rounded-lg bg-gray-50 p-3">
                  <div className="min-w-0 flex-1 space-y-2">
                    <input value={faq.question} maxLength={300} onChange={(e) => setFaq(index, { question: e.target.value })} placeholder={`Question ${index + 1}`} aria-label={`Question ${index + 1}`} className={field} />
                    <textarea rows={2} value={faq.answer} maxLength={2000} onChange={(e) => setFaq(index, { answer: e.target.value })} placeholder="Answer" aria-label={`Answer ${index + 1}`} className={field} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <button type="button" disabled={index === 0} onClick={() => moveFaq(index, -1)} aria-label="Move up" className="rounded p-1.5 text-gray-500 hover:bg-white disabled:opacity-30"><FaArrowUp className="h-3 w-3" /></button>
                    <button type="button" disabled={index === draft.faqs.length - 1} onClick={() => moveFaq(index, 1)} aria-label="Move down" className="rounded p-1.5 text-gray-500 hover:bg-white disabled:opacity-30"><FaArrowDown className="h-3 w-3" /></button>
                    <button type="button" onClick={() => set({ faqs: draft.faqs.filter((_, i) => i !== index) })} aria-label="Remove question" className="rounded p-1.5 text-red-600 hover:bg-white"><FaTrash className="h-3 w-3" /></button>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          {notice && <p role={notice.tone === "ok" ? "status" : "alert"} className={`rounded-lg px-3 py-2 text-sm md:col-span-2 ${notice.tone === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{notice.text}</p>}
          <div className="flex flex-wrap gap-2 md:col-span-2">
            <button type="submit" disabled={busy} className="rounded-lg bg-[#0b1f3b] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">{busy ? "Saving…" : "Publish"}</button>
            <button type="button" disabled={busy} onClick={() => save(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700">Save as draft</button>
          </div>
        </form>
      </Panel>

      <Panel title="Plumber Finder articles" description="Your published, scheduled, and draft articles.">
        <FilterBar search={search} onSearch={(value) => { setSearch(value); setPage(1); }} status={status} onStatus={(value) => { setStatus(value); setPage(1); }} statuses={statuses} placeholder="Search title, category, author…" />
        <DataTable head={["Article", "Status", "Views", "Readers", "Updated", ""]} loading={loading} error={error} empty={!data?.data.length}>
          {data?.data.map((post) => {
            const state = stateOf(post);
            return (
              <tr key={post._id} className="border-b border-gray-100 align-top hover:bg-gray-50">
                <td className="px-4 py-3"><p className="font-medium text-gray-900">{post.title}</p><p className="text-xs text-gray-500">{[post.category, (post.faqs?.length ?? 0) ? `${post.faqs!.length} FAQs` : ""].filter(Boolean).join(" · ")}</p></td>
                <td className="px-4 py-3"><StatusBadge value={state.value} label={state.label} /></td>
                <td className="px-4 py-3 font-semibold text-gray-900">{(statOf(post._id)?.views ?? 0).toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-700">{(statOf(post._id)?.readers ?? 0).toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(post.updatedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-2">
                    {state.label === "Published" && <a href={`${FRONTEND_URL}/blogs/${post.slug}`} target="_blank" rel="noreferrer" className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-white">View</a>}
                    {state.label === "Published" && <button type="button" onClick={() => setCommentsFor(post)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-white">Comments</button>}
                    <button type="button" onClick={() => edit(post)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-white">Edit</button>
                    <button type="button" onClick={() => remove(post)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </DataTable>
        {data && <Pager page={data.page} limit={data.limit} total={data.total} onPage={setPage} />}
      </Panel>
      {commentsFor && <CommentsPanel post={commentsFor} onClose={() => setCommentsFor(null)} />}
    </div>
  );
}
