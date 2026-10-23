import TeamMemberProfilePage from "../../../../plumber/[id]/team/[memberId]/page";

export const dynamic = "force-dynamic";

/** /company/<slug>/team/<memberId> — same page as /plumber/<id>/team/<memberId>. */
export default async function CompanyTeamMemberPage({ params }: { params: Promise<{ slug: string; memberId: string }> }) {
  const { slug, memberId } = await params;
  return <TeamMemberProfilePage params={Promise.resolve({ id: slug, memberId })} />;
}
