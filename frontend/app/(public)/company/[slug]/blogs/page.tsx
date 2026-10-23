import PlumberBlogsPage from "../../../plumber/[id]/blogs/page";

export const dynamic = "force-dynamic";

/** /company/<slug>/blogs — same page as /plumber/<id>/blogs. */
export default async function CompanyBlogsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PlumberBlogsPage params={Promise.resolve({ id: slug })} />;
}
