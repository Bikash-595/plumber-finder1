import { FaCheck } from "react-icons/fa";
import type { ServicePage } from "@/components/find/companyListing";
import type { Plumber } from "@/components/find/types";
import { serviceSectionIds } from "./sectionIds";

const money = (amount?: number) => (amount ? `$${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "");

/** How this service is priced, in plain words, and what protects the customer on Plumber Finder. */
function explain(service: ServicePage, name: string) {
  switch (service.priceType) {
    case "fixed": return { headline: `${money(service.priceAmount)} fixed price`, text: `${name} charges one fixed price for this job as described. If they find something extra once they're on site, they'll explain it and ask before doing more.` };
    case "from": return { headline: `From ${money(service.priceAmount)}`, text: `This is the starting price for a straightforward job. The final price depends on what's involved — for example access, parts and the size of the job — and ${name} confirms it with you before work starts.` };
    case "hourly": return { headline: `${money(service.priceAmount)} per hour`, text: `You pay for the time spent on the job${service.duration ? ` (typically ${service.duration})` : ""}. Parts and materials may be extra; ${name} tells you before using them.` };
    case "free": return { headline: "Free", text: `${name} offers this at no charge.` };
    case "quote": return { headline: "Free quote", text: `Every job is different, so ${name} looks at yours first — from your description, photos or a visit — and gives you a price before any work begins.` };
    default: return { headline: service.price || "Price on request", text: `${name} confirms the price with you before any work begins.` };
  }
}

export default function ServicePricing({ plumber, service }: { plumber: Plumber; service: ServicePage }) {
  const { headline, text } = explain(service, plumber.companyName);
  const points = [
    "The price is agreed before work starts — no surprises.",
    `For bigger jobs, ${plumber.companyName} can send an itemised quote you accept online from your bookings.`,
    "You confirm the job is finished before it's marked complete.",
    (plumber.offers?.length ?? 0) > 0 && "Current offers and coupon codes can be applied when you book.",
  ].filter(Boolean) as string[];
  return (
    <section id={serviceSectionIds.pricing} aria-labelledby="pricing-heading" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 id="pricing-heading" className="text-xl font-extrabold text-[#0b1f3b] sm:text-2xl">How pricing works</h2>
      <div className="mt-4 grid gap-5 md:grid-cols-[minmax(0,14rem)_1fr] md:items-start">
        <div className="rounded-2xl bg-[#0b1f3b] p-5 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FFD60A]">This service</p>
          <p className="mt-1 text-2xl font-black leading-tight">{headline}</p>
          {service.duration && <p className="mt-1 text-sm text-white/70">Typical time: {service.duration}</p>}
        </div>
        <div>
          <p className="text-[15px] leading-7 text-gray-700">{text}</p>
          <ul className="mt-4 space-y-2">
            {points.map((point) => <li key={point} className="flex items-start gap-2.5 text-sm text-gray-700"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100"><FaCheck className="h-2.5 w-2.5 text-emerald-700" aria-hidden /></span>{point}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
