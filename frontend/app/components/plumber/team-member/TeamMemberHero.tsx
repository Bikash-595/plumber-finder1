// import { FaBriefcase, FaCertificate, FaStar } from "react-icons/fa";
// import type { TeamMemberProfileProps } from "./types";

// export default function TeamMemberHero({ plumber, member }: TeamMemberProfileProps) {
//   return <section className="overflow-hidden rounded-3xl bg-[#0f2a4d] text-white shadow-xl"><div className="relative overflow-hidden px-6 py-8 sm:px-10 sm:py-11"><div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#FFD60A]/15 blur-3xl" /><div className="absolute -bottom-36 left-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" /><div className="relative flex flex-col gap-7 md:flex-row md:items-center"><img src={member.photo || plumber.logo} alt={member.name} className="h-36 w-36 rounded-3xl border-4 border-white/25 object-cover shadow-2xl" /><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#FFD60A]">Professional at {plumber.companyName}</p><h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{member.name}</h1><p className="mt-3 text-xl font-medium text-slate-200">{member.role}</p><div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold">{member.availability}</span><span className="rounded-full border border-white/20 px-3 py-1.5 text-sm font-semibold">Serving {plumber.location}</span></div></div></div></div><div className="relative grid border-t border-white/10 bg-black/10 sm:grid-cols-3"><HeroStat icon={<FaBriefcase />} label="Industry experience" value={`${member.experience}+ years`} /><HeroStat icon={<FaCertificate />} label="Professional training" value={`${member.certificates.length} credentials`} /><HeroStat icon={<FaStar />} label="Company experience" value={`${plumber.yearsInBusiness}+ years`} /></div></section>;
// }

// function HeroStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="flex items-center gap-3 px-6 py-4 sm:px-10"><span className="text-[#FFD60A]">{icon}</span><div><p className="text-xs font-semibold uppercase tracking-wide text-white/55">{label}</p><p className="mt-0.5 font-bold text-white">{value}</p></div></div>; }










import { FaBriefcase, FaCertificate, FaFolderOpen } from "react-icons/fa";
import type { TeamMemberProfileProps } from "./types";

export default function TeamMemberHero({
  plumber,
  member,
}: TeamMemberProfileProps) {
  const experience = `${member.experience} year${member.experience === 1 ? "" : "s"}${member.experienceMonths ? ` ${member.experienceMonths} month${member.experienceMonths === 1 ? "" : "s"}` : ""}`;
  const projectCount = member.projectsCompleted ?? plumber.projects.length;
  return (
    <section className="overflow-hidden rounded-3xl bg-[#0f2a4d] text-white shadow-xl">
      <div className="relative overflow-hidden px-6 py-8 sm:px-10 sm:py-11">
        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#FFD60A]/15 blur-3xl" />

        <div className="absolute -bottom-36 left-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative flex flex-col gap-7 md:flex-row md:items-center">
          <img
            src={member.photo || plumber.logo}
            alt={member.name}
            className="h-36 w-36 rounded-3xl border-4 border-white/25 object-cover shadow-2xl"
          />

          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#FFD60A]">
              Professional at {plumber.companyName}
            </p>

            <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {member.name}
            </h1>

            <p className="mt-3 text-xl font-medium text-slate-200">
              {member.role}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold">
                {member.availability}
              </span>

              <span className="rounded-full border border-white/20 px-3 py-1.5 text-sm font-semibold">
                Serving {plumber.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative grid border-t border-white/10 bg-black/10 sm:grid-cols-3">
        <HeroStat
          icon={<FaBriefcase />}
          label="Industry experience"
          value={experience}
        />

        <HeroStat
          icon={<FaFolderOpen />}
          label="Projects completed"
          value={`${projectCount} projects`}
        />

        <HeroStat
          icon={<FaCertificate />}
          label="Professional training"
          value={`${member.certificates.length} credentials`}
        />
      </div>
    </section>
  );
}

type HeroStatProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function HeroStat({ icon, label, value }: HeroStatProps) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 sm:px-10">
      <span className="text-[#FFD60A]">{icon}</span>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-white/55">
          {label}
        </p>

        <p className="mt-0.5 font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
