// import { FaCheckCircle } from "react-icons/fa";
// import type { TeamMemberProfileProps } from "./types";

// export default function TeamMemberSpecialties({ member }: TeamMemberProfileProps) { const firstName = member.name.split(" ")[0]; return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-2xl font-bold text-slate-900">Specialties</h2><p className="mt-2 text-sm text-slate-500">The services and project types {firstName} focuses on.</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{member.specialties.map((specialty) => <div key={specialty} className="flex items-center gap-3 rounded-2xl border border-[#FFD60A]/25 bg-[#FFD60A]/10 p-4"><FaCheckCircle className="shrink-0 text-[#b59a00]" /><span className="font-semibold text-slate-800">{specialty}</span></div>)}</div></section>; }

















import { FaCheckCircle } from "react-icons/fa";
import type { TeamMemberProfileProps } from "./types";

export default function TeamMemberSpecialties({
  member,
}: TeamMemberProfileProps) {
  const firstName = member.name.split(" ")[0];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold text-slate-900">Specialties</h2>

      <p className="mt-2 text-sm text-slate-500">
        The services and project types {firstName} focuses on.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {member.specialties.map((specialty) => (
          <div
            key={specialty}
            className="flex items-center gap-3 rounded-2xl border border-[#FFD60A]/25 bg-[#FFD60A]/10 p-4"
          >
            <FaCheckCircle className="shrink-0 text-[#b59a00]" />

            <span className="font-semibold text-slate-800">
              {specialty}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}