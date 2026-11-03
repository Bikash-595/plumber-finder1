import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaBolt, FaCalendarCheck, FaCamera, FaClock, FaPlay, FaShieldAlt, FaStar } from "react-icons/fa";
import type { ServiceDetail } from "@/components/find/types";
import { bookService, serviceIcon, splitPrice } from "./serviceVisuals";

const frame = "relative block aspect-[16/11] overflow-hidden bg-[#0b1f3b]";

/** The photo area: a link to the service's page when it has one (hidden from screen readers; the name links too). */
function MediaFrame({ href, children }: { href?: string; children: React.ReactNode }) {
  return href ? <Link href={href} tabIndex={-1} aria-hidden className={frame}>{children}</Link> : <div className={frame}>{children}</div>;
}

/**
 * A compact service card: the photo with its price on it, then the category, name, one-line subheading,
 * time and guarantee, and small Book / Details buttons. Still (no motion). Fits a half-width phone column.
 * `bookOnPage`: Book fills in this page's booking form; otherwise it opens the service page's form.
 */
export default function ServiceCard({ service, href, bookOnPage = true }: { service: ServiceDetail; href?: string; bookOnPage?: boolean }) {
  const price = splitPrice(service.price);
  const photos = service.photoCount ?? (service.image ? 1 : 0);
  const videos = service.videoCount ?? 0;
  const summary = service.tagline || service.description;
  const button = "inline-flex h-8 items-center justify-center gap-1 rounded-lg px-2 text-[11px] font-extrabold";
  return (
    <article className={`flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md ${service.featured ? "ring-2 ring-[#FFD60A]" : "ring-1 ring-gray-200"}`}>
      <MediaFrame href={href}>
        {service.image ? (
          <Image src={service.image} alt="" fill sizes="(max-width: 640px) 50vw, 25vw" unoptimized={service.image.startsWith("data:")} className="object-cover" />
        ) : service.poster ? (
          // YouTube's stills have black bars above and below the picture, so they're zoomed in to crop them.
          // eslint-disable-next-line @next/next/no-img-element -- YouTube stills come from i.ytimg.com
          <img src={service.poster} alt="" className="h-full w-full scale-[1.34] object-cover" />
        ) : (
          <span className="absolute inset-0 grid place-items-center bg-[radial-gradient(90%_90%_at_100%_0%,#2a4d7d_0%,transparent_60%),linear-gradient(150deg,#0b1f3b,#14305a)]">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FFD60A] shadow-lg shadow-black/20">{serviceIcon(`${service.name} ${service.category ?? ""}`, "h-5 w-5 text-[#0b1f3b]")}</span>
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/55 to-transparent" aria-hidden />
        <span className="absolute left-2 top-2 flex flex-wrap gap-1">
          {service.featured && <span className="inline-flex items-center gap-1 rounded-full bg-[#FFD60A] px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-[#0b1f3b]"><FaStar className="h-2 w-2" /> Top</span>}
          {service.emergency && <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white"><FaBolt className="h-2 w-2" /> 24/7</span>}
        </span>
        {(photos > 1 || videos > 0) && (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white" aria-label={`${photos} photos, ${videos} videos`}>
            {photos > 0 && <span className="inline-flex items-center gap-0.5"><FaCamera className="h-2 w-2" /> {photos}</span>}
            {videos > 0 && <span className="inline-flex items-center gap-0.5"><FaPlay className="h-1.5 w-1.5" /> {videos}</span>}
          </span>
        )}
        <span className="absolute bottom-2 left-2 rounded-lg bg-white px-2 py-1 text-[#0b1f3b] shadow">
          {price ? <span className="flex items-baseline gap-0.5">{price.prefix && <span className="text-[9px] font-bold uppercase text-gray-500">From</span>}<span className="text-sm font-black tabular-nums">${price.amount.toLocaleString("en-US")}</span>{price.suffix && <span className="text-[10px] font-semibold text-gray-500">{price.suffix}</span>}</span>
            : <span className="text-xs font-extrabold">{service.price || "Free quote"}</span>}
        </span>
      </MediaFrame>

      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        {service.category && <p className="truncate text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#a68600]">{service.category}</p>}
        <h3 className="line-clamp-2 text-[13px] font-extrabold leading-snug text-[#0b1f3b] sm:text-sm">
          {href ? <Link href={href} className="hover:underline">{service.name}</Link> : service.name}
        </h3>
        {summary && <p className="mt-0.5 line-clamp-1 text-[11px] text-gray-500 sm:text-xs">{summary}</p>}
        {(service.duration || service.warranty) && (
          <p className="mt-1.5 flex min-w-0 items-center gap-2 text-[10px] font-semibold text-gray-600 sm:text-[11px]">
            {service.duration && <span className="inline-flex min-w-0 items-center gap-1"><FaClock className="h-2.5 w-2.5 shrink-0 text-gray-400" aria-hidden /><span className="truncate">{service.duration}</span></span>}
            {service.warranty && <span className="inline-flex min-w-0 items-center gap-1 text-emerald-700"><FaShieldAlt className="h-2.5 w-2.5 shrink-0" aria-hidden /><span className="truncate">Guarantee</span></span>}
          </p>
        )}
        <div className={`mt-auto grid gap-1.5 pt-2.5 ${href ? "grid-cols-2" : "grid-cols-1"}`}>
          {!bookOnPage && href
            ? <Link href={`${href}#booking`} aria-label={`Book ${service.name}`} className={`${button} bg-[#FFD60A] text-[#0b1f3b] hover:bg-[#f5c400]`}><FaCalendarCheck className="h-2.5 w-2.5" aria-hidden /> Book</Link>
            : <button type="button" onClick={() => bookService(service.name)} aria-label={`Book ${service.name}`} className={`${button} bg-[#FFD60A] text-[#0b1f3b] hover:bg-[#f5c400]`}><FaCalendarCheck className="h-2.5 w-2.5" aria-hidden /> Book</button>}
          {href && <Link href={href} aria-label={`${service.name} — details, photos and videos`} className={`${button} bg-[#0b1f3b] text-white hover:bg-[#17345a]`}>Details <FaArrowRight className="h-2 w-2" aria-hidden /></Link>}
        </div>
      </div>
    </article>
  );
}
