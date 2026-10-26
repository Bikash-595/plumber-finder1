import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowRight, FaCalendarAlt, FaClock, FaTag } from "react-icons/fa";
import BlogEngagement from "@/components/blog/BlogEngagement";
import BlogFaqs from "@/components/blog/BlogFaqs";
import BlogViewCount from "@/components/blog/BlogViewCount";
import { displayableImage, textToArticleHtml } from "@/components/find/companyListing";

export const dynamic = "force-dynamic";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300/api";
type PlatformPost = { id: string; slug: string; title: string; category?: string; excerpt: string; content: string; coverImage?: string; author?: string; publishDate?: string; tags?: string[]; faqs?: { question: string; answer: string }[]; readTime: number };
type Props = { params: Promise<{ slug: string }> };

async function loadPost(slug: string): Promise<PlatformPost | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/platform/${encodeURIComponent(slug)}`, { cache: "no-store" });
    return response.ok ? (await response.json()).data : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await loadPost((await params).slug);
  if (!post) return { title: "Article not found", robots: { index: false } };
  const image = displayableImage(post.coverImage);
  return {
    title: post.title,
    description: post.excerpt.slice(0, 160),
    alternates: { canonical: `/blogs/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article", images: image.startsWith("http") ? [image] : undefined },
  };
}

/** One of Plumber Finder's own articles: content, FAQs, likes and comments. */
export default async function PlatformBlogPostPage({ params }: Props) {
  const post = await loadPost((await params).slug);
  if (!post) notFound();
  const image = displayableImage(post.coverImage) || "/Plumber.png";
  const date = post.publishDate ? new Date(post.publishDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }) : "";

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="border-b border-slate-200 bg-[#eef3fb]">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link href="/blogs" className="hover:text-[#f7672c]">Blogs</Link><span aria-hidden>/</span><span className="truncate text-slate-800">{post.title}</span>
          </nav>
          <div className="mt-8 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#FFD60A] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#0b1f3b]">Plumber Finder</span>
            {post.category && <span className="rounded-full bg-[#0f1b36] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white">{post.category}</span>}
          </div>
          <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">{post.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
            <span className="font-bold text-slate-900">{post.author || "Plumber Finder Team"}</span>
            {date && <span className="inline-flex items-center gap-2"><FaCalendarAlt aria-hidden /> {date}</span>}
            <span className="inline-flex items-center gap-2"><FaClock aria-hidden /> {post.readTime} min read</span>
            <BlogViewCount postPath={`platform/${post.id}`} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative aspect-[16/8] overflow-hidden rounded-3xl bg-slate-100 shadow-xl">
          <Image src={image} alt={post.title} fill priority sizes="(min-width: 1024px) 960px, 100vw" className="object-cover" />
        </div>
        <article className="mx-auto mt-10 max-w-3xl">
          <div className="text-lg leading-8 text-slate-700 [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-slate-950 [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_h4]:mb-2 [&_h4]:mt-6 [&_h4]:font-bold [&_li]:mb-2 [&_p]:mb-6 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6" dangerouslySetInnerHTML={{ __html: textToArticleHtml(post.content) }} />
          {(post.tags?.length ?? 0) > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2"><FaTag className="text-slate-400" aria-hidden />{post.tags!.map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{tag}</span>)}</div>
          )}
          <BlogFaqs faqs={post.faqs ?? []} />
          <BlogEngagement postPath={`platform/${post.id}`} postTitle={post.title} />
          <section className="mt-8 rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
            <h2 className="text-2xl font-black">Need a trusted plumber?</h2>
            <p className="mt-2 text-white/80">Compare verified companies and independent plumbers near you, then book in minutes.</p>
            <Link href="/find" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#f7672c] px-5 py-3 text-sm font-bold text-white hover:bg-[#de5520]">Find plumbers <FaArrowRight aria-hidden /></Link>
          </section>
        </article>
      </div>
    </main>
  );
}
