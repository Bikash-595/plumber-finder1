"use client";

import Link from "next/link";
import { Plumber } from "@/components/find/types";
import LatestArticleCard from "@/components/plumber/LatestArticleCard";
import { plumberHref } from "@/components/find/companyListing";

interface ProfileBlogSectionProps {
  plumber: Plumber;
}

export default function ProfileBlogSection({ plumber }: ProfileBlogSectionProps) {
  if (!plumber.blogs || plumber.blogs.length === 0) return null;

  return (
    <section id="blogs" className="scroll-mt-24 rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Latest Articles</h2>
          <p className="mt-1 text-sm text-gray-600">Recent blog posts from {plumber.companyName}.</p>
        </div>
        <Link href={`${plumberHref(plumber)}/blogs`} className="text-sm font-medium text-[#b59a00] hover:underline">
          View all {plumber.blogs.length > 2 ? `(${plumber.blogs.length})` : ""}
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5">
        {plumber.blogs.slice(0, 2).map((post) => (
          <LatestArticleCard
            key={post.slug}
            post={post}
            href={`${plumberHref(plumber)}/blog/${post.slug}`}
          />
        ))}
      </div>
    </section>
  );
}
