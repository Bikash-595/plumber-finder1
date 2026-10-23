import BlogPostPage from "../../../../plumber/[id]/blog/[slug]/page";

export const dynamic = "force-dynamic";

/** /company/<slug>/blog/<postSlug> — same page as /plumber/<id>/blog/<slug>. */
export default async function CompanyBlogPostPage({ params }: { params: Promise<{ slug: string; postSlug: string }> }) {
  const { slug, postSlug } = await params;
  return <BlogPostPage params={Promise.resolve({ id: slug, slug: postSlug })} />;
}
