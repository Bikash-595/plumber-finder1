"use client";

import Image from "next/image";
import Link from "next/link";
import BlogEngagement from "@/components/blog/BlogEngagement";
import BlogFaqs from "@/components/blog/BlogFaqs";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import type { ArticleMarkup, ArticlePlumber, ArticlePost } from "./articleTypes";

/** The article itself, its media, FAQs, and likes / comments. */
export default function ArticleBody({ plumber, post, article, featuredVideo, galleryImages }: { plumber: ArticlePlumber; post: ArticlePost; article: ArticleMarkup; featuredVideo: string | undefined; galleryImages: string[] }) {
  return (
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

          {/* The article's own FAQs (written with the post), then likes, dislikes, and comments. */}
          <BlogFaqs faqs={post.faqs ?? []} />
          <BlogEngagement postPath={post.id ? `${plumber.providerType ?? "company"}/${post.id}` : `demo/${plumber.id}--${post.slug}`} postTitle={post.title} />
        </article>
  );
}
