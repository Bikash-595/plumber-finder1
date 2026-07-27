"use client";

import Link from "next/link";
import { use } from "react";
import { notFound } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { plumbers } from "@/data/plumbers";
import TeamMemberAbout from "@/components/plumber/team-member/TeamMemberAbout";
import TeamMemberCertificates from "@/components/plumber/team-member/TeamMemberCertificates";
import TeamMemberHero from "@/components/plumber/team-member/TeamMemberHero";
import TeamMemberJourney from "@/components/plumber/team-member/TeamMemberJourney";
import TeamMemberSidebar from "@/components/plumber/team-member/TeamMemberSidebar";
import TeamMemberSpecialties from "@/components/plumber/team-member/TeamMemberSpecialties";

export const dynamic = "force-dynamic";

export default function TeamMemberProfilePage({ params }: { params: Promise<{ id: string; memberId: string }> }) {
  const { id, memberId } = use(params);
  const plumber = plumbers.find((item) => item.id === id);
  const member = plumber?.teamMembers?.find((item) => item.id === memberId);
  if (!plumber || !member) notFound();

  return <main className="min-h-screen bg-[#f7f9fc]">
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href={`/plumber/${plumber.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#0b1f3b] transition hover:text-[#b59a00]"><FaArrowLeft /> Back to {plumber.companyName}</Link>
          <div className="mt-5">
            <TeamMemberHero plumber={plumber} member={member} />
          </div>

         <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
           <div className="space-y-7">
             <TeamMemberAbout plumber={plumber} member={member} />
             <TeamMemberSpecialties plumber={plumber} member={member} />
             <TeamMemberJourney plumber={plumber} member={member} />
             <TeamMemberCertificates plumber={plumber} member={member} />
         </div>
        <TeamMemberSidebar plumber={plumber} member={member} />
      </div>
    </div>
  </main>;
}
