"use client";

export const dynamic = "force-dynamic";

import { use, useEffect, useMemo, useState } from "react";
import { notFound } from "next/navigation";
import { plumbers } from "@/data/plumbers";
import { usePlumber } from "@/components/plumber/usePlumber";
import { useBlogViews } from "@/components/blog/useBlogViews";
import { plumberHref } from "@/components/find/companyListing";

import ArticleBody from "@/components/blog/article-page/ArticleBody";
import ArticleHero from "@/components/blog/article-page/ArticleHero";
import ArticleSidebar from "@/components/blog/article-page/ArticleSidebar";
import ArticleToc from "@/components/blog/article-page/ArticleToc";
import RelatedArticles from "@/components/blog/article-page/RelatedArticles";
import { buildArticleMarkup, getCategory } from "@/components/blog/article-page/articleMarkup";

// A plumber's blog article (sections in components/blog/article-page).
export default function BlogPostPage({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id, slug } = use(params);
  // Demo plumber or live company (its posts are escaped into safe HTML by the mapper).
  const plumber = usePlumber(id);
  const post = plumber?.blogs?.find((b) => b.slug === slug);
  // Live count of reads (this visit is counted once); demo posts start from their sample number until it loads.
  const counted = useBlogViews(plumber && post ? (post.id ? `${plumber.providerType ?? "company"}/${post.id}` : `demo/${plumber.id}--${post.slug}`) : null);

  const article = useMemo(() => buildArticleMarkup(post?.content ?? ""), [post?.content]);
  const relatedPosts = useMemo(() => {
    const sources = plumber && !plumbers.some((entry) => entry.id === plumber.id) ? [plumber, ...plumbers] : plumbers;
    const allPosts = sources.flatMap((entry) =>
      (entry.blogs ?? []).map((blogPost) => ({ plumberId: entry.id, href: plumberHref(entry), post: blogPost }))
    );

    const samePlumber = allPosts.filter(
      (entry) => entry.plumberId === plumber?.id && entry.post.slug !== post?.slug
    );
    const others = allPosts.filter((entry) => entry.plumberId !== plumber?.id);

    return [...samePlumber, ...others]
      .filter((entry, index, array) => index === array.findIndex((item) => item.post.slug === entry.post.slug && item.plumberId === entry.plumberId))
      .slice(0, 3);
  }, [plumber, post?.slug]);

  const [activeSection, setActiveSection] = useState(article.toc[0]?.id ?? "");
  const [email, setEmail] = useState("");
  // Share links use the page address, known only in the browser (set after loading so server and browser HTML match).
  const [currentUrl, setCurrentUrl] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => setCurrentUrl(window.location.href.split("#")[0]), 0);
    return () => window.clearTimeout(timer);
  }, []);

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

  if (plumber === undefined) return <main className="min-h-screen bg-white" aria-busy="true" />;
  if (!plumber || !post) return notFound();

  const category = getCategory(post.title, post.summary);
  const featuredVideo = post.video || plumber.media?.videos?.[0];
  const galleryImages = [post.image, ...(plumber.media?.images ?? [])]
    .filter((image, index, array) => image && array.indexOf(image) === index)
    .slice(0, 4);
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
      <ArticleHero plumber={plumber} post={post} counted={counted} category={category} featuredVideo={featuredVideo} />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[270px_minmax(0,1fr)_300px] lg:px-8">
        <ArticleToc article={article} activeSection={activeSection} shareLinks={shareLinks} scrollToSection={scrollToSection} />
        <ArticleBody plumber={plumber} post={post} article={article} featuredVideo={featuredVideo} galleryImages={galleryImages} />
        <ArticleSidebar plumber={plumber} post={post} email={email} setEmail={setEmail} />
      </section>
      {relatedPosts.length > 0 && <RelatedArticles relatedPosts={relatedPosts} />}
    </main>
  );
}
