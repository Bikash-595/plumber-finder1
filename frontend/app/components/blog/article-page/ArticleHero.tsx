"use client";

import Image from "next/image";
import Link from "next/link";
import { formatCount } from "@/components/blog/useBlogViews";
import { plumberHref } from "@/components/find/companyListing";
import { FaCalendarAlt, FaClock, FaEye, FaPlay } from "react-icons/fa";
import type { ArticleCategory, ArticlePlumber, ArticlePost, ArticleViews } from "./articleTypes";

/** The article's header: category, title, author, date, reading time, reads and the cover. */
export default function ArticleHero({ plumber, post, counted, category, featuredVideo }: { plumber: ArticlePlumber; post: ArticlePost; counted: ArticleViews; category: ArticleCategory; featuredVideo: string | undefined }) {
  return (
        <section className="border-b border-slate-200 bg-[#eef3fb] dark:border-slate-200 dark:bg-[#eef3fb]">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-500">
              <Link href="/blogs" className="transition hover:text-[#f7672c]">Blogs</Link>
              <span aria-hidden>/</span>
              <Link href={plumberHref(plumber)} className="transition hover:text-[#f7672c]">{plumber.companyName}</Link>
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
                    <span className="inline-flex items-center gap-2" title={counted ? `${counted.readers.toLocaleString()} readers` : undefined}><FaEye /> {formatCount(counted?.views ?? post.readCount)} views</span>
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
  );
}
