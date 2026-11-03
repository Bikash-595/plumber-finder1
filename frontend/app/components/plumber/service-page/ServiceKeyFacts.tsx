import { FaBolt, FaCamera, FaClock, FaLayerGroup, FaReply, FaShieldAlt, FaStar, FaTag } from "react-icons/fa";
import type { ServicePage } from "@/components/find/companyListing";
import type { Plumber } from "@/components/find/types";
import { replyTime, serviceSectionIds } from "./sectionIds";

/** The facts customers compare first: price, time, guarantee, availability, response, rating, media. */
export default function ServiceKeyFacts({ plumber, service }: { plumber: Plumber; service: ServicePage }) {
  const facts = [
    { icon: FaTag, label: "Price", value: service.price || "Free quote" },
    service.duration && { icon: FaClock, label: "Typical time", value: service.duration },
    { icon: FaShieldAlt, label: "Guarantee", value: service.warranty || "Ask before booking" },
    service.category && { icon: FaLayerGroup, label: "Category", value: service.category },
    { icon: FaBolt, label: "Availability", value: service.emergency ? "24/7 emergencies" : "Scheduled visits" },
    replyTime(plumber.responseTime) && { icon: FaReply, label: "Usually replies", value: replyTime(plumber.responseTime)! },
    plumber.reviewCount > 0 && { icon: FaStar, label: "Rating", value: `${plumber.rating.toFixed(1)} / 5 · ${plumber.reviewCount}` },
    (service.images.length > 0 || service.videos.length > 0) && { icon: FaCamera, label: "Photos & videos", value: `${service.images.length} photo${service.images.length === 1 ? "" : "s"}${service.videos.length ? ` · ${service.videos.length} video${service.videos.length === 1 ? "" : "s"}` : ""}` },
  ].filter(Boolean) as { icon: typeof FaTag; label: string; value: string }[];
  return (
    <section id={serviceSectionIds.facts} aria-labelledby="facts-heading" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 id="facts-heading" className="text-xl font-extrabold text-[#0b1f3b] sm:text-2xl">At a glance</h2>
      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl bg-gray-50 p-3.5 ring-1 ring-inset ring-gray-100">
            <Icon className="h-4 w-4 text-[#a68600]" aria-hidden />
            <dt className="mt-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</dt>
            <dd className="mt-0.5 text-sm font-extrabold leading-snug text-[#0b1f3b]">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
