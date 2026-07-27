// import type { TeamMemberProfileProps } from "./types";

// export default function TeamMemberJourney({ plumber, member }: TeamMemberProfileProps) { const firstName = member.name.split(" ")[0]; const careerStartYear = new Date().getFullYear() - member.experience; const companyStartYear = Math.max(careerStartYear + 1, plumber.established); return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-2xl font-bold text-slate-900">Experience journey</h2><p className="mt-2 text-sm text-slate-500">A snapshot of {firstName}&apos;s professional path.</p><div className="mt-6"><JourneyItem year={careerStartYear} title="Started professional plumbing work" detail={`Began building hands-on experience in ${member.specialties[0]?.toLowerCase() ?? "plumbing service"}.`} /><JourneyItem year={companyStartYear} title={`Joined ${plumber.companyName}`} detail={`Became part of a local team serving customers across ${plumber.location}.`} /><JourneyItem year="Today" title={member.role} detail={`Provides ${member.specialties.slice(0, 2).join(" and ").toLowerCase()} support with a focus on quality and safety.`} last /></div></section>; }

// function JourneyItem({ year, title, detail, last = false }: { year: string | number; title: string; detail: string; last?: boolean }) { return <div className="relative pb-7 pl-24 last:pb-0"><span className="absolute left-0 top-0.5 text-sm font-bold text-[#b59a00]">{year}</span>{!last && <span className="absolute left-[77px] top-7 h-[calc(100%-8px)] w-px bg-slate-200" />}<span className="absolute left-[72px] top-1.5 h-3 w-3 rounded-full bg-[#FFD60A] ring-4 ring-[#FFD60A]/20" /><h3 className="font-bold text-slate-800">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{detail}</p></div>; }














import type { TeamMemberProfileProps } from "./types";

export default function TeamMemberJourney({
  plumber,
  member,
}: TeamMemberProfileProps) {
  const firstName = member.name.split(" ")[0];
  const currentYear = new Date().getFullYear();
  const careerStartYear = member.careerStartYear ?? currentYear - member.experience;
  const companyStartYear = member.joinedCompanyYear ?? Math.max(careerStartYear + 1, plumber.established);
  const monthLabel = (month?: number) => month ? new Date(2000, month - 1).toLocaleString("en-US", { month: "short" }) : "";

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold text-slate-900">
        Experience journey
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        A snapshot of {firstName}&apos;s professional path.
      </p>

      <div className="mt-6">
        <JourneyItem
          year={`${monthLabel(member.careerStartMonth)} ${careerStartYear}`.trim()}
          title="Started professional plumbing work"
          detail={`Began building hands-on experience in ${
            member.specialties[0]?.toLowerCase() ?? "plumbing service"
          }.`}
        />

        <JourneyItem
          year={`${monthLabel(member.joinedCompanyMonth)} ${companyStartYear}`.trim()}
          title={`Joined ${plumber.companyName}`}
          detail={`Became part of a local team serving customers across ${plumber.location}.`}
        />

        <JourneyItem
          year="Today"
          title={member.role}
          detail={`Provides ${member.specialties
            .slice(0, 2)
            .join(" and ")
            .toLowerCase()} support with a focus on quality and safety.`}
          last
        />
      </div>
    </section>
  );
}

type JourneyItemProps = {
  year: string | number;
  title: string;
  detail: string;
  last?: boolean;
};

function JourneyItem({
  year,
  title,
  detail,
  last = false,
}: JourneyItemProps) {
  return (
    <div className="relative pb-7 pl-24 last:pb-0">
      <span className="absolute left-0 top-0.5 text-sm font-bold text-[#b59a00]">
        {year}
      </span>

      {!last && (
        <span className="absolute left-[77px] top-7 h-[calc(100%-8px)] w-px bg-slate-200" />
      )}

      <span className="absolute left-[72px] top-1.5 h-3 w-3 rounded-full bg-[#FFD60A] ring-4 ring-[#FFD60A]/20" />

      <h3 className="font-bold text-slate-800">{title}</h3>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {detail}
      </p>
    </div>
  );
}
