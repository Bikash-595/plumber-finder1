import { FaAward, FaCheckCircle, FaIdCard, FaReply, FaShieldAlt, FaStar, FaTools } from "react-icons/fa";
import type { ServicePage } from "@/components/find/companyListing";
import type { Plumber } from "@/components/find/types";
import { replyTime, serviceSectionIds } from "./sectionIds";

/** Reasons to trust this provider for this job — only the ones that are actually true for them. */
export default function ServiceWhyUs({ plumber, service }: { plumber: Plumber; service: ServicePage }) {
  const reply = replyTime(plumber.responseTime);
  const reasons = [
    plumber.isVerified && { icon: FaCheckCircle, title: "Verified by Plumber Finder", text: "Their account and business details were checked by our team." },
    plumber.licenseNumber && { icon: FaIdCard, title: "Licensed", text: `License number ${plumber.licenseNumber}.` },
    plumber.insurance && { icon: FaShieldAlt, title: "Insured", text: plumber.insurance },
    plumber.yearsInBusiness > 0 && { icon: FaAward, title: `${plumber.yearsInBusiness}+ years of experience`, text: "Years of jobs like yours." },
    plumber.reviewCount > 0 && { icon: FaStar, title: `${plumber.rating.toFixed(1)} out of 5`, text: `From ${plumber.reviewCount} customer review${plumber.reviewCount === 1 ? "" : "s"} on Plumber Finder.` },
    service.warranty && { icon: FaTools, title: "Work guaranteed", text: service.warranty },
    reply && { icon: FaReply, title: "Quick to reply", text: `Usually replies ${reply.toLowerCase().startsWith("within") ? reply.toLowerCase() : `in ${reply}`}.` },
  ].filter(Boolean) as { icon: typeof FaAward; title: string; text: string }[];
  if (!reasons.length && !service.highlights.length) return null;
  return (
    <section id={serviceSectionIds.why} aria-labelledby="why-heading" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 id="why-heading" className="text-xl font-extrabold text-[#0b1f3b] sm:text-2xl">Why choose {plumber.companyName}</h2>
      {service.highlights.length > 0 && (
        <ul className="mt-4 space-y-2">
          {service.highlights.map((item) => <li key={item} className="flex items-start gap-2.5 rounded-2xl bg-[#FFD60A]/10 px-4 py-3 text-sm font-semibold text-gray-900"><FaStar className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#a68600]" aria-hidden />{item}</li>)}
        </ul>
      )}
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {reasons.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-start gap-3 rounded-2xl border border-gray-100 p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFD60A]/20 text-[#0b1f3b]"><Icon className="h-4 w-4" aria-hidden /></span>
            <span><span className="block text-sm font-bold text-gray-900">{title}</span><span className="block text-sm text-gray-600">{text}</span></span>
          </li>
        ))}
      </ul>
    </section>
  );
}
