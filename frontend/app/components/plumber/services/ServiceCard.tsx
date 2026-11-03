import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaBolt, FaCalendarCheck, FaCamera, FaCheckCircle, FaClock, FaPlay, FaShieldAlt, FaStar } from "react-icons/fa";
import type { ServiceDetail } from "@/components/find/types";
import { bookService, serviceIcon, splitPrice } from "./serviceVisuals";

/**
 * One service as a clean, still card: photo on top (or a YouTube still, or the service's icon), then the
 * category, name, short description, time / what's included / guarantee, the price, and Book + Details.
 * It is a size container, so it fits a phone's half-width column (buttons stack) as well as a wide grid.
 * `bookOnPage`: Book fills in this page's booking form; otherwise it opens the service page's form.
 */
export default function ServiceCard({ service, href, bookOnPage = true }: { service: ServiceDetail; href?: string; bookOnPage?: boolean }) {
  const price = splitPrice(service.price);
  const photos = service.photoCount ?? (service.image ? 1 : 0);
  const videos = service.videoCount ?? 0;
  const Media = href ? Link : "div";
  const book = "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-[#FFD60A] px-3 text-xs font-extrabold text-[#0b1f3b] hover:bg-[#f5c400]";
  return (
    <article className={`@container flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ${service.featured ? "border-2 border-[#FFD60A]" : "border border-gray-200"}`}>
      <Media href={href ?? ""} tabIndex={href ? -1 : undefined} aria-hidden={href ? true : undefined} className="relative block aspect-[4/3] overflow-hidden bg-[#0b1f3b]">
        {service.image ? (
          <Image src={service.image} alt="" fill sizes="(max-width: 640px) 50vw, 33vw" unoptimized={service.image.startsWith("data:")} className="object-cover" />
        ) : service.poster ? (
          // YouTube's stills have black bars above and below the picture, so they're zoomed in to crop them.
          // eslint-disable-next-line @next/next/no-img-element -- YouTube stills come from i.ytimg.com
          <img src={service.poster} alt="" className="h-full w-full scale-[1.34] object-cover" />
        ) : (
          <span className="absolute inset-0 grid place-items-center bg-[linear-gradient(150deg,#0b1f3b_0%,#17345a_100%)]">
            <span className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-[#FFD60A] @[15rem]:h-16 @[15rem]:w-16">{serviceIcon(`${service.name} ${service.category ?? ""}`, "h-6 w-6 text-[#0b1f3b] @[15rem]:h-7 @[15rem]:w-7")}</span>
          </span>
        )}
        <span className="absolute left-2 top-2 flex flex-wrap gap-1">
          {service.featured && <span className="inline-flex items-center gap-1 rounded-full bg-[#FFD60A] px-2 py-0.5 text-[10px] font-extrabold text-[#0b1f3b]"><FaStar className="h-2 w-2" /> Featured</span>}
          {service.emergency && <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-extrabold text-white"><FaBolt className="h-2 w-2" /> 24/7</span>}
        </span>
        {(photos > 1 || videos > 0) && (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-2 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-bold text-white" aria-label={`${photos} photos, ${videos} videos`}>
            {photos > 0 && <span className="inline-flex items-center gap-1"><FaCamera className="h-2.5 w-2.5" /> {photos}</span>}
            {videos > 0 && <span className="inline-flex items-center gap-1"><FaPlay className="h-2 w-2" /> {videos}</span>}
          </span>
        )}
      </Media>

      <div className="flex flex-1 flex-col p-3 @[15rem]:p-4">
        {service.category && <p className="truncate text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#a68600]">{service.category}</p>}
        <h3 className="mt-0.5 line-clamp-2 text-sm font-extrabold leading-snug text-[#0b1f3b] @[15rem]:text-base">
          {href ? <Link href={href} className="hover:underline">{service.name}</Link> : service.name}
        </h3>
        {service.description && <p className="mt-1 hidden text-[13px] leading-5 text-gray-600 @[15rem]:line-clamp-2">{service.description}</p>}
        <ul className="mt-2 space-y-1 text-[11px] font-semibold text-gray-600 @[15rem]:text-xs">
          {service.duration && <li className="flex items-center gap-1.5"><FaClock className="h-2.5 w-2.5 shrink-0 text-gray-400" aria-hidden /> <span className="truncate">{service.duration}</span></li>}
          {service.includes.length > 0 && <li className="flex items-center gap-1.5"><FaCheckCircle className="h-2.5 w-2.5 shrink-0 text-emerald-600" aria-hidden /> <span className="truncate">{service.includes.length} included</span></li>}
          {service.warranty && <li className="flex items-center gap-1.5"><FaShieldAlt className="h-2.5 w-2.5 shrink-0 text-emerald-600" aria-hidden /> <span className="truncate">{service.warranty}</span></li>}
        </ul>

        <div className="mt-auto pt-3">
          <div className="border-t border-gray-100 pt-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">{price?.prefix ? "Starting from" : price ? "Price" : "Pricing"}</p>
            {price ? (
              <p className="flex items-baseline gap-0.5 text-[#0b1f3b]"><span className="text-xs font-bold">$</span><span className="text-xl font-black tabular-nums tracking-tight @[15rem]:text-2xl">{price.amount.toLocaleString("en-US")}</span>{price.suffix && <span className="text-xs font-semibold text-gray-500">{price.suffix}</span>}</p>
            ) : <p className="text-base font-extrabold text-[#0b1f3b]">{service.price || "Free quote"}</p>}
          </div>
          <div className="mt-3 grid gap-2 @[15rem]:grid-cols-2">
            {!bookOnPage && href
              ? <Link href={`${href}#booking`} aria-label={`Book ${service.name}`} className={book}><FaCalendarCheck className="h-3 w-3" aria-hidden /> Book</Link>
              : <button type="button" onClick={() => bookService(service.name)} aria-label={`Book ${service.name}`} className={book}><FaCalendarCheck className="h-3 w-3" aria-hidden /> Book</button>}
            {href && <Link href={href} aria-label={`${service.name} — details, photos and videos`} className="inline-flex min-h-10 items-center justify-center gap-1 rounded-xl border border-gray-200 px-3 text-xs font-bold text-[#0b1f3b] hover:border-[#0b1f3b]">Details <FaArrowRight className="h-2.5 w-2.5" aria-hidden /></Link>}
          </div>
        </div>
      </div>
    </article>
  );
}
