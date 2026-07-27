// import { FaCertificate } from "react-icons/fa";
// import type { TeamMemberProfileProps } from "./types";

// export default function TeamMemberCertificates({ member }: TeamMemberProfileProps) { return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-2xl font-bold text-slate-900">Certificates & training</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{member.certificates.map((certificate) => <div key={certificate} className="flex gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100"><FaCertificate className="mt-0.5 text-xl text-[#b59a00]" /><div><p className="font-semibold text-slate-800">{certificate}</p><p className="mt-1 text-xs leading-5 text-slate-500">Professional training recorded for this team member.</p></div></div>)}</div></section>; }



















import { FaCertificate } from "react-icons/fa";
import type { TeamMemberProfileProps } from "./types";

export default function TeamMemberCertificates({
  member,
}: TeamMemberProfileProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold text-slate-900">
        Certificates &amp; training
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {member.certificates.map((certificate) => (
          <div
            key={certificate}
            className="flex gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100"
          >
            <FaCertificate className="mt-0.5 text-xl text-[#b59a00]" />

            <div>
              <p className="font-semibold text-slate-800">
                {certificate}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Professional training recorded for this team member.
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}