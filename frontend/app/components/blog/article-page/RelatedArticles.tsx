"use client";

import Link from "next/link";
import LatestArticleCard from "@/components/plumber/LatestArticleCard";
import { FaArrowRight } from "react-icons/fa";
import type { RelatedPost } from "./articleTypes";

/** More articles to read next. */
export default function RelatedArticles({ relatedPosts }: { relatedPosts: RelatedPost[] }) {
  return (
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
              {relatedPosts.map(({ plumberId, href, post: relatedPost }) => (
                <LatestArticleCard
                  key={`${plumberId}-${relatedPost.slug}`}
                  post={relatedPost}
                  href={`${href}/blog/${relatedPost.slug}`}
                />
              ))}
            </div>
          </div>
        </section>
  );
}
