import ProjectDetailPage from "../../../../plumber/[id]/projects/[projectId]/page";

export const dynamic = "force-dynamic";

/** /company/<slug>/projects/<projectId> — same page as /plumber/<id>/projects/<projectId>. */
export default async function CompanyProjectPage({ params }: { params: Promise<{ slug: string; projectId: string }> }) {
  const { slug, projectId } = await params;
  return <ProjectDetailPage params={Promise.resolve({ id: slug, projectId })} />;
}
