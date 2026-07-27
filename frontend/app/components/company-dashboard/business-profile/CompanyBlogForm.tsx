"use client";

import { useState } from "react";
import { saveProfileDraft } from "./profileStore";
import LocalMediaUpload from "./LocalMediaUpload";

type Blog = {
  title: string; category: string; excerpt: string; content: string; coverImage: string;
  author: string; publishDate: string; tags: string; status: "draft" | "published";
};

const emptyBlog: Blog = { title: "", category: "Maintenance tips", excerpt: "", content: "", coverImage: "", author: "", publishDate: "", tags: "", status: "draft" };
const seedBlog: Blog = { title: "Emergency Plumbing: What to Do First", category: "Emergency advice", excerpt: "Simple steps homeowners can take before a plumber arrives.", content: "Turn off the water supply if it is safe to do so, move valuables away from the affected area, and contact a licensed plumber.", coverImage: "", author: "Dallas Rapid Plumbers", publishDate: "", tags: "emergency, plumbing", status: "draft" };

export default function CompanyBlogForm() {
  const [blog, setBlog] = useState<Blog>(seedBlog);
  const [notice, setNotice] = useState("");
  const update = (name: keyof Blog, value: string) => setBlog((current) => ({ ...current, [name]: value }));
  const save = (status: Blog["status"]) => {
    const value = { ...blog, status };
    setBlog(value);
    setNotice(saveProfileDraft("blogs", { items: [value] }, status === "draft"));
  };

  return <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
    <p className="text-xs font-bold uppercase tracking-wider text-[#0b1f3b]">Content manager</p>
    <h2 className="mt-2 text-2xl font-bold text-gray-900">Write a company blog</h2>
    <p className="mt-2 text-sm text-gray-500">Create helpful articles that build trust and appear on your public company profile.</p>
    <form onSubmit={(event) => { event.preventDefault(); save("published"); }} className="mt-7 space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="md:col-span-2"><span className="text-sm font-semibold text-gray-700">Article title</span><input required value={blog.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. How to prevent frozen pipes" className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]" /></label>
        <label><span className="text-sm font-semibold text-gray-700">Category</span><select value={blog.category} onChange={(e) => update("category", e.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]"><option>Maintenance tips</option><option>Emergency advice</option><option>Company news</option><option>Water heaters</option><option>Drain cleaning</option><option>Customer stories</option></select></label>
        <label><span className="text-sm font-semibold text-gray-700">Author</span><input required value={blog.author} onChange={(e) => update("author", e.target.value)} placeholder="Company or author name" className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]" /></label>
        <label><span className="text-sm font-semibold text-gray-700">Publish date</span><input type="date" value={blog.publishDate} onChange={(e) => update("publishDate", e.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]" /></label>
        <label><span className="text-sm font-semibold text-gray-700">Tags</span><input value={blog.tags} onChange={(e) => update("tags", e.target.value)} placeholder="leaks, maintenance, homeowner" className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]" /></label>
        <div className="md:col-span-2"><LocalMediaUpload label="Cover image" value={blog.coverImage} onChange={(value) => update("coverImage", value)} /></div>
        <label className="md:col-span-2"><span className="text-sm font-semibold text-gray-700">Short summary</span><textarea required rows={3} value={blog.excerpt} onChange={(e) => update("excerpt", e.target.value)} placeholder="Write a short description for the blog listing." className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]" /></label>
        <label className="md:col-span-2"><span className="text-sm font-semibold text-gray-700">Article content</span><textarea required rows={12} value={blog.content} onChange={(e) => update("content", e.target.value)} placeholder="Write your article here. Use short paragraphs and clear advice." className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm leading-6 outline-none focus:border-[#FFD60A]" /></label>
      </div>
      {notice && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{notice}</p>}
      <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5"><button type="submit" className="rounded-xl bg-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-white">Publish article</button><button type="button" onClick={() => save("draft")} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700">Save as draft</button><button type="button" onClick={() => { setBlog(emptyBlog); setNotice(""); }} className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-500">Clear form</button></div>
    </form>
  </section>;
}
