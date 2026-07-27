// import type { TeamMemberProfileProps } from "./types";

// export default function TeamMemberAbout({ plumber, member }: TeamMemberProfileProps) { const firstName = member.name.split(" ")[0]; return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b59a00]">Professional profile</p><h2 className="mt-2 text-2xl font-bold text-slate-900">About {firstName}</h2><p className="mt-4 leading-7 text-slate-600">{member.bio}</p><p className="mt-4 leading-7 text-slate-600">As part of the {plumber.companyName} team, {firstName} helps customers with clear guidance, careful workmanship, and dependable service from the first visit through final testing.</p></section>; }












import type { TeamMemberProfileProps } from "./types";

export default function TeamMemberAbout({
  plumber,
  member,
}: TeamMemberProfileProps) {
  const firstName = member.name.split(" ")[0];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b59a00]">
        Professional profile
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-900">
        About {firstName}
      </h2>

      <p className="mt-4 leading-7 text-slate-600">{member.bio}</p>

      <p className="mt-4 leading-7 text-slate-600">
        As part of the {plumber.companyName} team, {firstName} helps customers
        with clear guidance, careful workmanship, and dependable service from
        the first visit through final testing.
      </p>
    </section>
  );
}