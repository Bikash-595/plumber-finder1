"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaBookOpen, FaClock, FaEnvelope, FaSearch, FaStar } from "react-icons/fa";
import { plumbers } from "@/data/plumbers";
import { BlogPost } from "@/components/find/types";
import LatestArticleCard from "@/components/plumber/LatestArticleCard";

const BLOGS_PER_PAGE = 9;

const BLOG_CATEGORIES = [
  {
    key: "maintenance",
    title: "Maintenance",
    description: "Prevent repairs with simple home plumbing habits.",
  },
  {
    key: "emergency",
    title: "Emergency",
    description: "Fast decisions for leaks, burst pipes, and flooding.",
  },
  {
    key: "water-heaters",
    title: "Water Heaters",
    description: "Replacement, efficiency, and tankless planning.",
  },
  {
    key: "drain-sewer",
    title: "Drain & Sewer",
    description: "Clog prevention, sewer warning signs, and inspections.",
  },
  {
    key: "home-upgrades",
    title: "Upgrades",
    description: "Fixtures, remodels, smart devices, and renovations.",
  },
  {
    key: "seasonal",
    title: "Seasonal",
    description: "Prepare for cold snaps, heat, storms, and heavy usage.",
  },
];

type BlogFeedItem = {
  plumberId: string;
  companyName: string;
  companyRating: number;
  post: BlogPost;
};

type BlogCategoryKey = "all" | (typeof BLOG_CATEGORIES)[number]["key"];

function getCategoryForPost(post: BlogPost): Exclude<BlogCategoryKey, "all"> {
  const haystack = `${post.title} ${post.summary} ${post.content}`.toLowerCase();

  if (/emergency|burst|leak|urgent|flood/.test(haystack)) return "emergency";
  if (/heater|hot water|tankless/.test(haystack)) return "water-heaters";
  if (/drain|sewer|clog|pipe blockage/.test(haystack)) return "drain-sewer";
  if (/upgrade|fixture|renovation|smart home/.test(haystack)) return "home-upgrades";
  if (/winter|summer|season|freeze|cold weather/.test(haystack)) return "seasonal";

  return "maintenance";
}

function getBlogFeed(): BlogFeedItem[] {
  return plumbers
    .flatMap((plumber) =>
      (plumber.blogs ?? []).map((post) => ({
        plumberId: plumber.id,
        companyName: plumber.companyName,
        companyRating: plumber.rating,
        post,
      }))
    )
    .sort((a, b) => Date.parse(b.post.date) - Date.parse(a.post.date));
}

export default function BlogsPage() {
  const blogFeed = useMemo(() => getBlogFeed(), []);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategoryKey>("all");
  const [visibleCount, setVisibleCount] = useState(BLOGS_PER_PAGE);
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");

  const filteredBlogFeed = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return blogFeed.filter(({ post, companyName }) => {
      const matchesCategory = selectedCategory === "all" || getCategoryForPost(post) === selectedCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${post.title} ${post.summary} ${companyName}`.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [blogFeed, query, selectedCategory]);

  const [featuredPost, ...remainingPosts] = filteredBlogFeed;
  const visibleBlogs = remainingPosts.slice(0, visibleCount);
  const hasMoreBlogs = visibleCount < remainingPosts.length;

  return (
    <main className="min-h-screen bg-gray-50 text-slate-950 dark:bg-gray-50 dark:text-slate-950">
      <section className="border-b border-slate-200 bg-[#f2f6fb] dark:border-slate-200 dark:bg-[#f2f6fb]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-slate-600 shadow-sm dark:border-slate-200 dark:bg-slate-50 dark:text-slate-700">
                <FaBookOpen className="text-[#f7672c]" /> Plumber Finder Journal
              </span>
              <h1 className="mt-6 text-4xl font-black leading-[1.02] text-slate-950 sm:text-5xl lg:text-6xl dark:text-slate-950">
                Practical plumbing insights for smarter decisions.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-700">
                Premium guides, cost breakdowns, maintenance checklists, and company-backed advice designed for fast reading and better booking confidence.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  [`${blogFeed.length}+`, "articles"],
                  [`${plumbers.length}`, "verified companies"],
                  ["4.8", "avg. expert rating"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-200 dark:bg-slate-50">
                    <p className="text-2xl font-black text-[#f7672c]">{value}</p>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {blogFeed[0] && (
              <Link
                href={`/plumber/${blogFeed[0].plumberId}/blog/${blogFeed[0].post.slug}`}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/80 transition hover:-translate-y-1 dark:border-slate-200 dark:bg-white dark:shadow-black/30"
              >
                <div className="relative h-72 overflow-hidden bg-slate-100 sm:h-96 dark:bg-slate-100">
                  <Image
                    src={blogFeed[0].post.image}
                    alt={blogFeed[0].post.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 560px, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-950 shadow-sm dark:bg-white/95 dark:text-slate-950">
                    Featured
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
                    <span className="inline-flex items-center gap-2"><FaClock /> {blogFeed[0].post.readTime} min read</span>
                    <span className="inline-flex items-center gap-2"><FaStar className="text-[#f7672c]" /> {blogFeed[0].companyRating}</span>
                  </div>
                  <h2 className="mt-4 text-3xl font-black leading-tight text-slate-950 transition group-hover:text-[#f7672c] dark:text-slate-950">
                    {blogFeed[0].post.title}
                  </h2>
                  <p className="mt-3 line-clamp-2 text-slate-600 dark:text-slate-700">{blogFeed[0].post.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#f7672c]">
                    Read featured guide <FaArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-200 dark:bg-white">
          <div className="relative">
            <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisibleCount(BLOGS_PER_PAGE);
              }}
              placeholder="Search guides, costs, repairs, water heaters..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#f7672c] dark:border-slate-200 dark:bg-slate-50 dark:text-slate-950"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setVisibleCount(BLOGS_PER_PAGE);
              }}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                selectedCategory === "all"
                  ? "bg-slate-950 text-white dark:bg-slate-950 dark:text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-50 dark:text-slate-700 dark:hover:bg-white/10"
              }`}
            >
              All
            </button>
            {BLOG_CATEGORIES.map((category) => (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(category.key);
                  setVisibleCount(BLOGS_PER_PAGE);
                }}
                key={category.key}
                title={category.description}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                  selectedCategory === category.key
                    ? "bg-[#f7672c] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-50 dark:text-slate-700 dark:hover:bg-white/10"
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>

        {featuredPost && (
          <div className="mt-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#f7672c]">Latest insights</p>
                <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-slate-950">All Articles</h2>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-500">{filteredBlogFeed.length} result{filteredBlogFeed.length === 1 ? "" : "s"}</p>
            </div>

            <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleBlogs.map(({ plumberId, post }) => (
                <LatestArticleCard
                  key={`${plumberId}-${post.slug}`}
                  post={post}
                  href={`/plumber/${plumberId}/blog/${post.slug}`}
                />
              ))}
            </div>
          </div>
        )}

        {filteredBlogFeed.length === 0 && (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-200 dark:bg-slate-50">
            <p className="text-lg font-bold text-slate-950 dark:text-slate-950">No posts found</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-700">Try a different search or category.</p>
          </div>
        )}

        {hasMoreBlogs && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + BLOGS_PER_PAGE)}
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-[#f7672c] dark:bg-slate-950 dark:text-white"
            >
              Load More
            </button>
          </div>
        )}
      </section>

      <section className="border-t border-slate-200 bg-[#f2f6fb] py-12 dark:border-slate-200 dark:bg-[#f2f6fb]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_420px] lg:items-center lg:px-8">
          <div>
            <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[#f7672c]">
              <FaEnvelope /> Newsletter
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-950 dark:text-slate-950">Get better maintenance decisions in your inbox.</h2>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-700">
              Weekly practical guides, seasonal checklists, and cost-saving ideas from verified plumbing professionals.
            </p>
          </div>
          <form
            className="flex flex-col gap-3 sm:flex-row"
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
              className="h-12 min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-5 text-sm text-slate-900 outline-none transition focus:border-[#f7672c] dark:border-slate-200 dark:bg-slate-50 dark:text-slate-950"
            />
            <button type="submit" className="h-12 rounded-full bg-[#f7672c] px-6 text-sm font-bold text-white transition hover:bg-[#de5520]">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
