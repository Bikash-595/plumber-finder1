"use client";

import { useState } from "react";
import { saveProfileDraft } from "./profileStore";
import LocalMediaUpload from "./LocalMediaUpload";
import FaqListEditor, { cleanFaqs, type FaqItem } from "./FaqListEditor";
import BlogStatsPanel from "@/components/blog/BlogStatsPanel";
import { toFormValues } from "./companyApi";
import { ExampleCard, NoticeMessage, SavedItemsList, useSavedItems } from "./SavedItems";

type Blog = {
  title: string; category: string; excerpt: string; content: string; coverImage: string;
  author: string; publishDate: string; tags: string; status: "draft" | "published";
  faqs: FaqItem[];
};

const emptyBlog: Blog = { title: "", category: "Maintenance tips", excerpt: "", content: "", coverImage: "", author: "", publishDate: "", tags: "", status: "draft", faqs: [] };
const seedBlog: Blog = { title: "Emergency Plumbing: What to Do First", category: "Emergency advice", excerpt: "Simple steps homeowners can take before a plumber arrives.", content: "Turn off the water supply if it is safe to do so, move valuables away from the affected area, and contact a licensed plumber.", coverImage: "", author: "Dallas Rapid Plumbers", publishDate: "", tags: "emergency, plumbing", status: "draft", faqs: [] };

type Props = {
  /** Backend endpoint; freelancers use "/freelancers/blogs". */
  apiEndpoint?: string;
  /** Key for drafts saved on this device. */
  draftKey?: string;
  /** Start with an empty form instead of the example article. */
  startEmpty?: boolean;
};

export default function CompanyBlogForm({ apiEndpoint = "/companies/blogs", draftKey = "blogs", startEmpty = false }: Props) {
  const [blog, setBlog] = useState<Blog>(emptyBlog);
  const saved = useSavedItems(apiEndpoint, { singular: "blog post" });
  const update = (name: Exclude<keyof Blog, "faqs">, value: string) => setBlog((current) => ({ ...current, [name]: value }));
  // A publish date in the future schedules the post: it stays off the public profile until then.
  const today = new Date().toISOString().slice(0, 10);
  const scheduled = saved.items.filter((item) => item.status === "published" && item.publishDate && String(item.publishDate).slice(0, 10) > today);
  const save = async (status: Blog["status"]) => {
    const { faqs, error } = cleanFaqs(blog.faqs);
    if (error) return saved.setNotice({ tone: "error", text: error });
    const value = { ...blog, status, faqs };
    setBlog(value);
    saveProfileDraft(draftKey, { items: [value] }, status === "draft"); // keep a local copy as before
    const isScheduled = status === "published" && value.publishDate && value.publishDate > today;
    await saved.save(value, isScheduled
      ? `Scheduled: this article appears on your public profile on ${value.publishDate}. Use “Publish now” to show it today.`
      : status === "published" ? "Article published on your public profile." : "Draft saved. Publish it when you are ready.");
  };
  const startNew = () => { setBlog(emptyBlog); saved.setEditingId(null); saved.setNotice(null); };

  return <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
    <p className="text-xs font-bold uppercase tracking-wider text-[#0b1f3b]">Content manager</p>
    <h2 className="mt-2 text-2xl font-bold text-gray-900">Write a company blog</h2>
    <p className="mt-2 text-sm text-gray-500">Create helpful articles that build trust and appear on your public company profile.</p>
    {scheduled.length > 0 && (
      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4" role="status">
        <p className="text-sm font-bold text-amber-900">{scheduled.length === 1 ? "1 article is scheduled" : `${scheduled.length} articles are scheduled`} and not on your public profile yet</p>
        <ul className="mt-2 space-y-2">
          {scheduled.map((item) => (
            <li key={item._id} className="flex flex-col gap-2 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
              <span>“{String(item.title)}” — appears on {String(item.publishDate).slice(0, 10)}</span>
              <button type="button" onClick={() => saved.patch(item._id, { publishDate: today }, `“${String(item.title)}” is now live on your public profile.`)} className="shrink-0 rounded-lg bg-[#0b1f3b] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#17345a]">Publish now</button>
            </li>
          ))}
        </ul>
      </div>
    )}
    <BlogStatsPanel refreshKey={saved.items.length} />
    <SavedItemsList title="Your articles" items={saved.items} editingId={saved.editingId}
      describe={(item) => ({ heading: String(item.title), meta: [item.category, item.publishDate ? String(item.publishDate).slice(0, 10) : ""].filter(Boolean).join(" · "), badge: item.status !== "published" ? "Draft — not public" : item.publishDate && new Date(String(item.publishDate)) > new Date() ? `Scheduled for ${String(item.publishDate).slice(0, 10)}` : "Published" })}
      onEdit={(item) => { setBlog({ ...emptyBlog, ...toFormValues(item, Object.keys(emptyBlog).filter((key) => key !== "faqs")), faqs: Array.isArray(item.faqs) ? (item.faqs as FaqItem[]) : [] } as Blog); saved.setEditingId(item._id); saved.setNotice(null); }}
      onDelete={(id) => { saved.remove(id); if (saved.editingId === id) setBlog(emptyBlog); }} />
    {/* The example disappears once there is a saved article or the form is being filled in. */}
    {!startEmpty && !saved.loading && !saved.items.length && !saved.editingId && JSON.stringify(blog) === JSON.stringify(emptyBlog) && <ExampleCard itemName="article"><p className="font-semibold text-gray-900">{seedBlog.title}</p><p className="mt-1 text-sm text-gray-600">{seedBlog.excerpt}</p></ExampleCard>}
    {saved.editingId && <p className="mt-4 rounded-lg bg-[#FFD60A]/15 px-3 py-2 text-sm font-medium text-[#0b1f3b]">Editing “{blog.title}”. <button type="button" onClick={startNew} className="font-bold underline">Write a new article instead</button></p>}
    <form onSubmit={(event) => { event.preventDefault(); save("published"); }} className="mt-7 space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="md:col-span-2"><span className="text-sm font-semibold text-gray-700">Article title</span><input required value={blog.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. How to prevent frozen pipes" className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]" /></label>
        <label><span className="text-sm font-semibold text-gray-700">Category</span><select value={blog.category} onChange={(e) => update("category", e.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]"><option>Maintenance tips</option><option>Emergency advice</option><option>Company news</option><option>Water heaters</option><option>Drain cleaning</option><option>Customer stories</option></select></label>
        <label><span className="text-sm font-semibold text-gray-700">Author</span><input required value={blog.author} onChange={(e) => update("author", e.target.value)} placeholder="Company or author name" className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]" /></label>
        <label><span className="text-sm font-semibold text-gray-700">Publish date</span><input type="date" value={blog.publishDate} onChange={(e) => update("publishDate", e.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]" />
          {blog.publishDate && blog.publishDate > today
            ? <span className="mt-1 block text-xs font-semibold text-amber-700">Future date: the article stays hidden until {blog.publishDate}.</span>
            : <span className="mt-1 block text-xs text-gray-500">Leave empty to publish today. A future date schedules the article.</span>}
        </label>
        <label><span className="text-sm font-semibold text-gray-700">Tags</span><input value={blog.tags} onChange={(e) => update("tags", e.target.value)} placeholder="leaks, maintenance, homeowner" className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]" /></label>
        <div className="md:col-span-2"><LocalMediaUpload label="Cover image" value={blog.coverImage} onChange={(value) => update("coverImage", value)} /></div>
        <label className="md:col-span-2"><span className="text-sm font-semibold text-gray-700">Short summary</span><textarea required rows={3} value={blog.excerpt} onChange={(e) => update("excerpt", e.target.value)} placeholder="Write a short description for the blog listing." className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]" /></label>
        <label className="md:col-span-2"><span className="text-sm font-semibold text-gray-700">Article content</span><span className="ml-2 text-xs text-gray-400">Blank line = new paragraph · “## ” starts a heading · “- ” starts a bullet</span><textarea required rows={12} value={blog.content} onChange={(e) => update("content", e.target.value)} placeholder="Write your article here. Use short paragraphs and clear advice." className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm leading-6 outline-none focus:border-[#FFD60A]" /></label>
        <div className="md:col-span-2"><FaqListEditor value={blog.faqs} onChange={(faqs) => setBlog((current) => ({ ...current, faqs }))} /></div>
      </div>
      <NoticeMessage notice={saved.notice} />
      <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5"><button type="submit" disabled={saved.saving} className="rounded-xl bg-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">{saved.saving ? "Saving…" : "Publish article"}</button><button type="button" onClick={() => save("draft")} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700">Save as draft</button><button type="button" onClick={startNew} className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-500">Clear form</button></div>
    </form>
  </section>;
}
