import Link from "next/link";
import { FaArrowRight, FaCheckCircle, FaClock, FaExclamationTriangle, FaExternalLinkAlt } from "react-icons/fa";
import type { CompanyDashboard } from "../companyApi";
import StrengthRing from "../ui/StrengthRing";
import { dashBase } from "@/components/utils/providerSide";

const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; };

/** Greeting, account status (approval, listing, email) and profile strength at a glance. */
export default function WelcomeHero({ data }: { data: CompanyDashboard }) {
  const { account, listing, strength } = data;
  const chips = [
    account.status === "approved" ? { ok: true, text: "Approved by Plumber Finder" } : account.status === "suspended" ? { ok: false, text: "Account suspended — contact support" } : account.status === "rejected" ? { ok: false, text: "Verification declined — contact support" } : { ok: false, text: "Waiting for approval" },
    listing ? (listing.published ? { ok: true, text: "Listing is live" } : { ok: false, text: "Listing is hidden" }) : { ok: false, text: "No public listing yet" },
    account.emailVerified ? { ok: true, text: "Email verified" } : { ok: false, text: "Verify your email" },
  ];
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#0b1f3b] p-6 text-white shadow-lg sm:p-8">
      <span aria-hidden className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#FFD60A]/10" />
      <span aria-hidden className="absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-white/5" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#FFD60A]">{greeting()}</p>
          <h1 className="mt-1 truncate text-2xl font-bold sm:text-3xl">{listing?.name ?? account.companyName ?? "Your company"}</h1>
          <ul className="mt-3 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <li key={chip.text} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${chip.ok ? "bg-white/10 text-white" : "bg-[#FFD60A] text-[#0b1f3b]"}`}>
                {chip.ok ? <FaCheckCircle className="h-3 w-3 text-emerald-300" /> : chip.text.startsWith("Waiting") ? <FaClock className="h-3 w-3" /> : <FaExclamationTriangle className="h-3 w-3" />}{chip.text}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            {listing?.slug && <a href={listing.url ?? `/company/${listing.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#FFD60A] px-4 py-2 text-sm font-bold text-[#0b1f3b] hover:brightness-95">View public profile <FaExternalLinkAlt className="h-3 w-3" /></a>}
            <Link href={`${dashBase()}/bookings`} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold hover:bg-white/10">Manage bookings <FaArrowRight className="h-3 w-3" /></Link>
          </div>
        </div>
        <Link href={`${dashBase()}/profile`} className="flex items-center gap-4 rounded-2xl bg-white p-4 text-gray-900 shadow-md transition hover:-translate-y-0.5">
          <StrengthRing percent={strength.percent} size={84} />
          <span>
            <span className="block text-xs font-bold uppercase tracking-wide text-gray-500">Profile strength</span>
            <span className="block text-lg font-bold">{strength.level}</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#8a7300]">{strength.percent >= 100 ? "Your profile is complete" : "Improve your profile"} <FaArrowRight className="h-2.5 w-2.5" /></span>
          </span>
        </Link>
      </div>
    </section>
  );
}
