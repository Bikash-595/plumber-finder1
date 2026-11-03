"use client";

import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import { FaCamera, FaChevronLeft, FaChevronRight, FaPlay, FaVideo, FaWrench } from "react-icons/fa";
import { youtubeId, youtubeThumbnail } from "@/components/find/media";

type Item = { kind: "image"; src: string } | { kind: "video"; src: string; youtube: string | null };
const shortsId = (url: string) => url.match(/youtube\.com\/shorts\/([\w-]{11})/)?.[1] ?? null;

/**
 * The service's photos and videos: a large stage with arrows, and thumbnails underneath (arrow keys work too).
 * YouTube videos load only when someone presses play; uploaded clips play in place.
 */
export default function ServiceGallery({ images, videos = [], name }: { images: string[]; videos?: string[]; name: string }) {
  const items: Item[] = [...images.map((src) => ({ kind: "image" as const, src })), ...videos.map((src) => ({ kind: "video" as const, src, youtube: youtubeId(src) ?? shortsId(src) }))];
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState<number | null>(null);
  if (!items.length) {
    return (
      <div className="relative grid aspect-[16/9] place-items-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1f3b] via-[#17345a] to-[#0b1f3b]">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#FFD60A]/10" aria-hidden />
        <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-white/5" aria-hidden />
        <FaWrench className="h-20 w-20 text-[#FFD60A]/80" aria-hidden />
      </div>
    );
  }
  const go = (next: number) => { setIndex((next + items.length) % items.length); setPlaying(null); };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") go(index - 1);
    if (event.key === "ArrowRight") go(index + 1);
  };
  const current = items[index];
  const photoCount = images.length;
  return (
    <div>
      <div tabIndex={0} onKeyDown={onKey} role="region" aria-roledescription="carousel" aria-label={`${name} photos and videos`} className="group relative aspect-[16/9] overflow-hidden rounded-3xl bg-gray-950 outline-none ring-[#FFD60A] focus-visible:ring-4">
        {current.kind === "image" ? (
          <Image key={current.src} src={current.src} alt={`${name} — photo ${index + 1}`} fill priority={index === 0} sizes="(max-width: 1024px) 100vw, 60vw" unoptimized={current.src.startsWith("data:")} className="object-cover" />
        ) : current.youtube ? (
          playing === index ? (
            <iframe src={`https://www.youtube-nocookie.com/embed/${current.youtube}?autoplay=1&rel=0&modestbranding=1`} title={`${name} video`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="absolute inset-0 h-full w-full border-0" />
          ) : (
            <button type="button" onClick={() => setPlaying(index)} aria-label={`Play ${name} video`} className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnails come from i.ytimg.com */}
              <img src={youtubeThumbnail(current.youtube)} alt="" className="h-full w-full object-cover" />
              <span className="absolute inset-0 grid place-items-center bg-black/25"><span className="grid h-20 w-20 place-items-center rounded-full bg-white/95 text-[#0b1f3b] shadow-2xl"><FaPlay className="ml-1 h-7 w-7" /></span></span>
            </button>
          )
        ) : (
          <video key={current.src} src={current.src} controls playsInline preload="metadata" className="absolute inset-0 h-full w-full bg-black object-contain" />
        )}
        {current.kind === "image" && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" aria-hidden />}
        {items.length > 1 && (
          <>
            <button type="button" onClick={() => go(index - 1)} aria-label="Previous" className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#0b1f3b] shadow-lg hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"><FaChevronLeft /></button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Next" className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#0b1f3b] shadow-lg hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"><FaChevronRight /></button>
          </>
        )}
        <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white" aria-live="polite">
          {current.kind === "image" ? <FaCamera className="h-3 w-3" aria-hidden /> : <FaVideo className="h-3 w-3" aria-hidden />} {index + 1} / {items.length}
        </span>
      </div>
      {items.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
          {items.map((item, i) => (
            <li key={i}>
              <button type="button" onClick={() => go(i)} aria-label={item.kind === "image" ? `Show photo ${i + 1}` : `Show video ${i - photoCount + 1}`} aria-current={i === index} className={`relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-900 ${i === index ? "ring-2 ring-[#FFD60A] ring-offset-2" : "opacity-70 hover:opacity-100"}`}>
                {item.kind === "image" ? <Image src={item.src} alt="" fill sizes="120px" unoptimized={item.src.startsWith("data:")} className="object-cover" />
                  // eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnails come from i.ytimg.com
                  : item.youtube ? <img src={youtubeThumbnail(item.youtube)} alt="" className="h-full w-full object-cover" />
                  : <video src={item.src.startsWith("data:") ? item.src : `${item.src}#t=0.5`} preload="metadata" muted playsInline className="pointer-events-none h-full w-full object-cover" />}
                {item.kind === "video" && <span className="absolute inset-0 grid place-items-center bg-black/30"><FaPlay className="ml-0.5 h-3.5 w-3.5 text-white" /></span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
