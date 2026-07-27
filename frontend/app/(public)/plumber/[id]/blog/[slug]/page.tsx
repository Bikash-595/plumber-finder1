"use client";

export const dynamic = "force-dynamic";

import { use, useEffect, useMemo, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaCommentDots,
  FaEnvelope,
  FaEye,
  FaFacebookF,
  FaLinkedinIn,
  FaPlay,
  FaShareAlt,
  FaStar,
  FaTwitter,
  FaUserTie,
} from "react-icons/fa";
import { plumbers } from "@/data/plumbers";
import LatestArticleCard from "@/components/plumber/LatestArticleCard";

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function buildArticleMarkup(rawHtml: string): { html: string; toc: TocItem[] } {
  const counts: Record<string, number> = {};
  const toc: TocItem[] = [];

  let html = rawHtml.replace(/<(h[2-4])>([\s\S]*?)<\/\1>/gi, (_, tag: string, inner: string) => {
    const text = inner.replace(/<[^>]*>/g, "").trim();
    const normalizedTag = tag.toLowerCase();

    if (!text) return `<${normalizedTag}>${inner}</${normalizedTag}>`;

    const base = slugify(text) || "section";
    counts[base] = (counts[base] ?? 0) + 1;
    const id = counts[base] === 1 ? base : `${base}-${counts[base]}`;

    toc.push({
      id,
      text,
      level: Number(normalizedTag.replace("h", "")) as TocItem["level"],
    });

    const headingClasses =
      normalizedTag === "h2"
        ? "scroll-mt-28 mt-12 mb-4 text-3xl font-extrabold leading-tight text-slate-950 dark:text-slate-950"
        : normalizedTag === "h3"
          ? "scroll-mt-28 mt-9 mb-3 text-2xl font-bold leading-snug text-slate-900 dark:text-slate-900"
          : "scroll-mt-28 mt-7 mb-2 text-xl font-bold leading-snug text-slate-900 dark:text-slate-900";

    return `<${normalizedTag} id="${id}" class="${headingClasses}">${inner}</${normalizedTag}>`;
  });

  html = html
    .replace(/<p>/g, '<p class="mb-6 text-lg leading-8 text-slate-700 dark:text-slate-700">')
    .replace(/<ul>/g, '<ul class="mb-7 list-disc space-y-2 pl-6 text-lg leading-8 text-slate-700 dark:text-slate-700">')
    .replace(/<ol>/g, '<ol class="mb-7 list-decimal space-y-2 pl-6 text-lg leading-8 text-slate-700 dark:text-slate-700">')
    .replace(/<blockquote>/g, '<blockquote class="my-8 rounded-2xl border-l-4 border-[#f7672c] bg-orange-50 p-6 text-xl font-medium leading-8 text-slate-900 dark:bg-orange-500/10 dark:text-slate-900">')
    .replace(/<a /g, '<a class="font-semibold text-[#f7672c] underline-offset-4 hover:underline" ');

  return { html, toc };
}

function getCategory(title: string, summary: string) {
  const text = `${title} ${summary}`.toLowerCase();

  if (/emergency|burst|flood|urgent/.test(text)) return "Emergency Plumbing";
  if (/heater|hot water|tankless/.test(text)) return "Water Heating";
  if (/drain|sewer|clog/.test(text)) return "Drain & Sewer";
  if (/upgrade|fixture|renovation/.test(text)) return "Home Upgrades";

  return "Maintenance Guide";
}

export default function BlogPostPage({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id, slug } = use(params);
  const plumber = plumbers.find((p) => p.id === id);
  const post = plumber?.blogs?.find((b) => b.slug === slug);

  const article = useMemo(() => buildArticleMarkup(post?.content ?? ""), [post?.content]);
  const relatedPosts = useMemo(() => {
    const allPosts = plumbers.flatMap((entry) =>
      (entry.blogs ?? []).map((blogPost) => ({ plumberId: entry.id, post: blogPost }))
    );

    const samePlumber = allPosts.filter(
      (entry) => entry.plumberId === plumber?.id && entry.post.slug !== post?.slug
    );
    const others = allPosts.filter((entry) => entry.plumberId !== plumber?.id);

    return [...samePlumber, ...others]
      .filter((entry, index, array) => index === array.findIndex((item) => item.post.slug === entry.post.slug && item.plumberId === entry.plumberId))
      .slice(0, 3);
  }, [plumber?.id, post?.slug]);

  const [activeSection, setActiveSection] = useState(article.toc[0]?.id ?? "");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      const sectionNodes = article.toc
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => Boolean(el));

      const current = sectionNodes.find((node) => {
        const rect = node.getBoundingClientRect();
        return rect.top <= 128 && rect.bottom > 128;
      });

      if (current) setActiveSection(current.id);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [article.toc]);

  if (!plumber || !post) return notFound();

  const category = getCategory(post.title, post.summary);
  const featuredVideo = post.video || plumber.media?.videos?.[0];
  const galleryImages = [post.image, ...(plumber.media?.images ?? [])]
    .filter((image, index, array) => image && array.indexOf(image) === index)
    .slice(0, 4);
  const currentUrl = typeof window === "undefined" ? "" : window.location.href;
  const encodedUrl = encodeURIComponent(currentUrl || "");
  const encodedTitle = encodeURIComponent(post.title);
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const y = section.getBoundingClientRect().top + window.scrollY - 112;
    window.scrollTo({ top: y, behavior: "smooth" });
    setActiveSection(sectionId);
  };

  return (
    <main className="min-h-screen bg-white text-slate-950 dark:bg-white dark:text-slate-950">
      <section className="border-b border-slate-200 bg-[#eef3fb] dark:border-slate-200 dark:bg-[#eef3fb]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-500">
            <Link href="/blogs" className="transition hover:text-[#f7672c]">Blogs</Link>
            <span aria-hidden>/</span>
            <Link href={`/plumber/${plumber.id}`} className="transition hover:text-[#f7672c]">{plumber.companyName}</Link>
            <span aria-hidden>/</span>
            <span className="truncate text-slate-800 dark:text-slate-700">{post.title}</span>
          </nav>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#0f1b36] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white dark:bg-slate-950 dark:text-white">
                  {category}
                </span>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-[#c64d1f] dark:bg-orange-500/15 dark:text-[#c64d1f]">
                  SEO Guide
                </span>
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.02] text-slate-950 sm:text-5xl lg:text-6xl dark:text-slate-950">
                {post.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl dark:text-slate-700">
                {post.summary}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <div className="relative h-14 w-14 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm dark:border-slate-200 dark:bg-slate-100">
                  <Image src={plumber.logo || "/Plumber.png"} alt={post.author} fill sizes="56px" className="object-cover" />
                </div>
                <div>
                  <p className="font-bold text-slate-950 dark:text-slate-950">{post.author}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">{plumber.companyName}</p>
                </div>
                <div className="hidden h-9 w-px bg-slate-200 sm:block dark:bg-slate-100" />
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-500">
                  <span className="inline-flex items-center gap-2"><FaCalendarAlt /> {post.date}</span>
                  <span className="inline-flex items-center gap-2"><FaClock /> {post.readTime} min read</span>
                  <span className="inline-flex items-center gap-2"><FaEye /> {post.readCount.toLocaleString()} views</span>
                </div>
              </div>
            </div>

            <div className="relative min-h-[340px] overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-2xl shadow-slate-200/70 dark:border-slate-200 dark:bg-slate-100 dark:shadow-black/30">
              <Image src={post.image} alt={post.title} fill priority sizes="(min-width: 1024px) 460px, 100vw" className="object-cover" />
              {featuredVideo && (
                <a
                  href="#featured-video"
                  className="absolute bottom-5 left-5 inline-flex items-center gap-3 rounded-full bg-white/95 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg backdrop-blur transition hover:scale-[1.02] dark:bg-white/95 dark:text-slate-950"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7672c] text-white">
                    <FaPlay className="ml-0.5 h-3.5 w-3.5" />
                  </span>
                  Watch guide
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[270px_minmax(0,1fr)_300px] lg:px-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-200 dark:bg-slate-50">
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-500">Contents</h2>
              <ol className="mt-4 space-y-1 text-sm">
                {article.toc.length === 0 && <li className="text-slate-500">Article overview</li>}
                {article.toc.map((item, index) => (
                  <li key={item.id} className={item.level === 3 ? "pl-4" : item.level === 4 ? "pl-8" : ""}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={`flex w-full items-start gap-2 rounded-xl px-3 py-2 text-left transition ${
                        activeSection === item.id
                          ? "bg-slate-950 text-white dark:bg-slate-950 dark:text-white"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-700 dark:hover:bg-white/10"
                      }`}
                    >
                      <span className="text-xs font-black">{index + 1}</span>
                      <span>{item.text}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-200 dark:bg-slate-50">
              <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-500">
                <FaShareAlt /> Share
              </p>
              <div className="mt-4 flex gap-2">
                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share on X" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-[#f7672c] dark:bg-slate-950 dark:text-white"><FaTwitter /></a>
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-[#f7672c] dark:bg-slate-950 dark:text-white"><FaFacebookF /></a>
                <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-[#f7672c] dark:bg-slate-950 dark:text-white"><FaLinkedinIn /></a>
              </div>
            </div>
          </div>
        </aside>

        <article className="min-w-0">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 dark:border-slate-200 dark:bg-white">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Response goal", plumber.responseTime],
                ["Avg. cost", `$${plumber.averageCost}`],
                ["Warranty", plumber.warranty],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-50">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-500">{label}</p>
                  <p className="mt-2 text-xl font-black text-slate-950 dark:text-slate-950">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8" dangerouslySetInnerHTML={{ __html: article.html }} />

            <section className="my-10 rounded-3xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-400/20 dark:bg-orange-500/10">
              <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[#c64d1f] dark:text-[#c64d1f]">
                <FaCheckCircle /> Pro takeaway
              </p>
              <p className="mt-3 text-xl font-bold leading-8 text-slate-950 dark:text-slate-950">
                The fastest way to avoid expensive plumbing repairs is to combine early diagnosis, clear pricing, and a licensed team that documents the work before and after completion.
              </p>
            </section>

            {galleryImages.length > 1 && (
              <section className="my-10">
                <h2 className="text-3xl font-black text-slate-950 dark:text-slate-950">Visual Guide</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {galleryImages.map((image, index) => (
                    <div key={image} className={`relative overflow-hidden rounded-2xl bg-slate-100 ${index === 0 ? "h-72 sm:col-span-2" : "h-56"}`}>
                      <Image src={image} alt={`${post.title} visual ${index + 1}`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 hover:scale-105" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="my-10">
              <h2 className="text-3xl font-black text-slate-950 dark:text-slate-950">Cost &amp; Decision Matrix</h2>
              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-200">
                <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                  <thead className="bg-slate-950 text-white dark:bg-slate-950 dark:text-white">
                    <tr>
                      <th className="px-5 py-4 font-bold">Scenario</th>
                      <th className="px-5 py-4 font-bold">Best Action</th>
                      <th className="px-5 py-4 font-bold">Why It Matters</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white dark:divide-white/10 dark:bg-white">
                    {[
                      ["Slow drain or recurring clog", "Schedule camera inspection", "Prevents repeat visits and hidden sewer issues."],
                      ["Visible leak or water stain", "Shut off water and book repair", "Limits property damage and mold risk."],
                      ["Aging fixture or heater", "Compare repair vs replacement", "Improves efficiency and long-term value."],
                    ].map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell) => (
                          <td key={cell} className="px-5 py-4 text-slate-700 dark:text-slate-700">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {featuredVideo && (
              <section id="featured-video" className="my-10 scroll-mt-28">
                <h2 className="text-3xl font-black text-slate-950 dark:text-slate-950">Featured Video</h2>
                <div className="mt-5 aspect-video overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-xl dark:border-slate-200">
                  <iframe
                    src={featuredVideo}
                    title={`${post.title} video`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </section>
            )}

            <section className="my-10 grid gap-4 sm:grid-cols-3">
              {[
                ["92%", "homeowners prefer transparent upfront estimates"],
                ["24h", "is the ideal window to address visible leaks"],
                ["3x", "higher risk when recurring clogs are ignored"],
              ].map(([stat, text]) => (
                <div key={stat} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-200 dark:bg-slate-50">
                  <p className="text-4xl font-black text-[#f7672c]">{stat}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-700">{text}</p>
                </div>
              ))}
            </section>

            <section className="my-10 rounded-3xl bg-slate-950 p-6 text-white sm:p-8 dark:bg-slate-950 dark:text-white">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-3xl font-black">Need a trusted plumber?</h2>
                  <p className="mt-2 max-w-2xl text-white/80 dark:text-white/80">
                    Compare verified companies, project history, pricing signals, and customer feedback before you book.
                  </p>
                </div>
                <Link href="/find" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#f7672c] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#de5520]">
                  Find plumbers <FaArrowRight />
                </Link>
              </div>
            </section>
          </section>

          {plumber.faqs && plumber.faqs.length > 0 && (
            <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-200 dark:bg-white">
              <h2 className="text-3xl font-black text-slate-950 dark:text-slate-950">FAQs</h2>
              <div className="mt-5 divide-y divide-slate-200 dark:divide-white/10">
                {plumber.faqs.slice(0, 4).map((faq) => (
                  <details key={faq.question} className="group py-4">
                    <summary className="cursor-pointer list-none text-lg font-bold text-slate-950 transition group-open:text-[#f7672c] dark:text-slate-950">
                      {faq.question}
                    </summary>
                    <p className="mt-3 leading-7 text-slate-600 dark:text-slate-700">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-200 dark:bg-white">
            <h2 className="flex items-center gap-3 text-3xl font-black text-slate-950 dark:text-slate-950">
              <FaCommentDots className="text-[#f7672c]" /> Comments
            </h2>
            <div className="mt-5 space-y-4">
              {(post.comments.length ? post.comments : [{ name: "Avery M.", comment: "Clear and practical advice. The checklist made it much easier to understand what to ask before booking.", date: post.date }]).map((item) => (
                <div key={`${item.name}-${item.date}`} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-50">
                  <p className="font-bold text-slate-950 dark:text-slate-950">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.date}</p>
                  <p className="mt-3 leading-7 text-slate-700 dark:text-slate-700">{item.comment}</p>
                </div>
              ))}
            </div>
            <form
              className="mt-5"
              onSubmit={(event) => {
                event.preventDefault();
                setComment("");
              }}
            >
              <label htmlFor="comment" className="text-sm font-bold text-slate-700 dark:text-slate-700">Add a comment</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 outline-none transition focus:border-[#f7672c] dark:border-slate-200 dark:bg-slate-50 dark:text-slate-950"
                placeholder="Share your question or experience"
              />
              <button type="submit" className="mt-3 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-[#f7672c] dark:bg-slate-950 dark:text-white">
                Post comment
              </button>
            </form>
          </section>
        </article>

        <aside className="space-y-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-200 dark:bg-white">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-100">
              <Image src={plumber.logo || "/Plumber.png"} alt={plumber.companyName} fill sizes="64px" className="object-cover" />
            </div>
            <h2 className="mt-4 text-xl font-black text-slate-950 dark:text-slate-950">{plumber.companyName}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-700">{plumber.description}</p>
            <div className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-700">
              <FaStar className="text-[#f7672c]" /> {plumber.rating} rating
            </div>
            <Link href={`/plumber/${plumber.id}`} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f7672c] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#de5520]">
              View profile <FaArrowRight />
            </Link>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm dark:border-slate-200 dark:bg-slate-950 dark:text-white">
            <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-orange-200 dark:text-orange-200">
              <FaEnvelope /> Newsletter
            </p>
            <h2 className="mt-3 text-2xl font-black">Smarter home maintenance</h2>
            <p className="mt-3 text-sm leading-6 text-white/80 dark:text-white/80">
              Get seasonal checklists, cost guides, and repair tips in your inbox.
            </p>
            <form
              className="mt-5"
              onSubmit={(event) => {
                event.preventDefault();
                if (!email) return;
                window.location.href = `/contact?email=${encodeURIComponent(email)}`;
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                className="w-full rounded-full border border-white/20 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:ring-2 focus:ring-[#f7672c]"
              />
              <button type="submit" className="mt-3 w-full rounded-full bg-[#f7672c] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#de5520]">
                Subscribe
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-200 dark:bg-white">
            <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-500">
              <FaUserTie /> Author
            </p>
            <p className="mt-3 text-lg font-black text-slate-950 dark:text-slate-950">{post.author}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-700">
              Field-tested advice from a plumbing professional focused on clear estimates, safe repairs, and long-lasting systems.
            </p>
          </section>
        </aside>
      </section>

      {relatedPosts.length > 0 && (
        <section className="border-t border-slate-200 bg-gray-50 py-14 dark:border-slate-200 dark:bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#f7672c]">Keep reading</p>
                <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-slate-950">Related Posts</h2>
              </div>
              <Link href="/blogs" className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition hover:text-[#f7672c] dark:text-slate-700">
                View all blogs <FaArrowRight />
              </Link>
            </div>
            <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedPosts.map(({ plumberId, post: relatedPost }) => (
                <LatestArticleCard
                  key={`${plumberId}-${relatedPost.slug}`}
                  post={relatedPost}
                  href={`/plumber/${plumberId}/blog/${relatedPost.slug}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
