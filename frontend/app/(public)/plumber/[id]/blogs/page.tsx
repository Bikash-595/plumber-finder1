"use client";

import Link from "next/link";
import { use } from "react";
import { notFound } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { plumberHref } from "@/components/find/companyListing";
import LatestArticleCard from "@/components/plumber/LatestArticleCard";
import { usePlumber } from "@/components/plumber/usePlumber";

export const dynamic = "force-dynamic";

/** Every published article from one company or freelancer. */
export default function PlumberBlogsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const plumber = usePlumber(id);
  if (plumber === undefined) return <main className="min-h-screen bg-gray-50" aria-busy="true" />;
  if (!plumber) return notFound();
  const href = plumberHref(plumber);
  const posts = plumber.blogs ?? [];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href={href} className="inline-flex items-center gap-2 text-sm font-bold text-[#0b1f3b] transition hover:text-[#b59a00]"><FaArrowLeft /> Back to {plumber.companyName}</Link>
        <h1 className="mt-5 text-3xl font-bold text-gray-900">Articles by {plumber.companyName}</h1>
        <p className="mt-2 text-sm text-gray-600">{posts.length ? `${posts.length} published article${posts.length === 1 ? "" : "s"}.` : "No articles published yet."}</p>
        {posts.length > 0 && (
          <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {posts.map((post) => <LatestArticleCard key={post.slug} post={post} href={`${href}/blog/${post.slug}`} />)}
          </div>
        )}
      </div>
    </main>
  );
}
