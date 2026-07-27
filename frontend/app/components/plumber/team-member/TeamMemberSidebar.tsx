// import Link from "next/link";
// import { FaBriefcase, FaClock, FaMapMarkerAlt, FaShieldAlt, FaUserTie } from "react-icons/fa";
// import type { TeamMemberProfileProps } from "./types";

// export default function TeamMemberSidebar({ plumber, member }: TeamMemberProfileProps) { return <aside className="space-y-5 lg:sticky lg:top-6 lg:h-fit"><section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-slate-900">Professional details</h2><div className="mt-6 space-y-5"><Detail icon={<FaBriefcase />} label="Experience" value={`${member.experience}+ years in the trade`} /><Detail icon={<FaUserTie />} label="Current role" value={member.role} /><Detail icon={<FaClock />} label="Availability" value={member.availability} />{member.licenseNumber && <Detail icon={<FaShieldAlt />} label="License number" value={member.licenseNumber} />}<Detail icon={<FaMapMarkerAlt />} label="Service area" value={plumber.location} /></div></section><section className="rounded-3xl bg-[#FFD60A] p-6 text-slate-900 shadow-sm"><p className="text-sm font-bold uppercase tracking-wide text-slate-700">Need plumbing help?</p><h2 className="mt-2 text-xl font-extrabold">Book the {plumber.companyName} team</h2><p className="mt-2 text-sm leading-6 text-slate-700">Choose a convenient time and the company will confirm the right professional for your job.</p><Link href={`/book-plumber?plumber=${plumber.id}`} className="mt-5 block rounded-full bg-[#0f2a4d] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#173e63]">Request a booking</Link></section></aside>; }

// function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="flex gap-3"><span className="mt-0.5 text-[#b59a00]">{icon}</span><div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-medium leading-5 text-slate-800">{value}</p></div></div>; }














import Link from "next/link";
import {
  FaBriefcase,
  FaClock,
  FaFolderOpen,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaUserTie,
} from "react-icons/fa";
import type { TeamMemberProfileProps } from "./types";

export default function TeamMemberSidebar({
  plumber,
  member,
}: TeamMemberProfileProps) {
  const experience = `${member.experience} year${member.experience === 1 ? "" : "s"}${member.experienceMonths ? ` ${member.experienceMonths} month${member.experienceMonths === 1 ? "" : "s"}` : ""}`;
  return (
    <aside className="space-y-5 lg:sticky lg:top-6 lg:h-fit">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Professional details
        </h2>

        <div className="mt-6 space-y-5">
          <Detail
            icon={<FaBriefcase />}
            label="Experience"
            value={`${experience} in the trade`}
          />

          <Detail icon={<FaFolderOpen />} label="Projects" value={`${member.projectsCompleted ?? plumber.projects.length} completed${member.projectsInvolved ? ` · ${member.projectsInvolved} involved` : ""}`} />

          <Detail
            icon={<FaUserTie />}
            label="Current role"
            value={member.role}
          />

          <Detail
            icon={<FaClock />}
            label="Availability"
            value={member.availability}
          />

          {member.licenseNumber && (
            <Detail
              icon={<FaShieldAlt />}
              label="License number"
              value={member.licenseNumber}
            />
          )}

          <Detail
            icon={<FaMapMarkerAlt />}
            label="Service area"
            value={plumber.location}
          />
        </div>
      </section>

      <section className="rounded-3xl bg-[#FFD60A] p-6 text-slate-900 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-slate-700">
          Need plumbing help?
        </p>

        <h2 className="mt-2 text-xl font-extrabold">
          Book the {plumber.companyName} team
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-700">
          Choose a convenient time and the company will confirm the right
          professional for your job.
        </p>

        <Link
          href={`/book-plumber?plumber=${plumber.id}`}
          className="mt-5 block rounded-full bg-[#0f2a4d] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#173e63]"
        >
          Request a booking
        </Link>
      </section>
    </aside>
  );
}

type DetailProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function Detail({ icon, label, value }: DetailProps) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-[#b59a00]">{icon}</span>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium leading-5 text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}
