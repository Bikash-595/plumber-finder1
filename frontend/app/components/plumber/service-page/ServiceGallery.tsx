"use client";

import Image from "next/image";
import { useEffect, useState, type KeyboardEvent } from "react";
import { FaCamera, FaChevronLeft, FaChevronRight, FaExpand, FaPlay, FaThLarge, FaVideo, FaWrench } from "react-icons/fa";
import { youtubeThumbnail } from "@/components/find/media";
import MediaThumb from "./MediaThumb";
import ServiceMediaViewer from "./ServiceMediaViewer";
import { serviceMedia } from "./serviceMedia";

const AUTOPLAY_MS = 4000;

/**
 * The service's photos and videos, like the profile gallery: a large stage that moves on by itself every few
 * seconds (paused on hover, while a video plays, when the tab is hidden, and for reduced motion), thumbnails,
 * and "View all" for a full-screen grid. YouTube loads only when someone presses play.
 */
export default function ServiceGallery({ images, videos = [], name }: { images: string[]; videos?: string[]; name: string }) {
  const items = serviceMedia(images, videos);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const [viewer, setViewer] = useState<number | "grid" | null>(null);
  const go = (next: number) => { setIndex((next + items.length) % items.length); setPlaying(null); };

  useEffect(() => {
    if (items.length < 2 || hovered || playing !== null || viewer !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => { if (!document.hidden) setIndex((i) => (i + 1) % items.length); }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [items.length, hovered, playing, viewer]);

  if (!items.length) {
    return (
      <div className="relative grid aspect-[16/9] place-items-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1f3b] via-[#17345a] to-[#0b1f3b]">
        <FaWrench className="h-16 w-16 text-[#FFD60A]/80" aria-hidden />
      </div>
    );
  }
  const onKey = (event: KeyboardEvent) => { if (event.key === "ArrowLeft") go(index - 1); if (event.key === "ArrowRight") go(index + 1); };
  const current = items[index];
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div tabIndex={0} onKeyDown={onKey} role="region" aria-roledescription="carousel" aria-label={`${name} photos and videos`} className="group relative aspect-[16/9] overflow-hidden rounded-3xl bg-gray-950 outline-none ring-[#FFD60A] focus-visible:ring-4">
        {current.kind === "image" ? (
          <button type="button" onClick={() => setViewer(index)} aria-label="Open photo full screen" className="absolute inset-0 cursor-zoom-in">
            <Image key={current.src} src={current.src} alt={`${name} — photo ${index + 1}`} fill priority={index === 0} sizes="(max-width: 1024px) 100vw, 60vw" unoptimized={current.src.startsWith("data:")} className="object-cover" />
          </button>
        ) : current.youtube ? (
          playing === index ? (
            <iframe src={`https://www.youtube-nocookie.com/embed/${current.youtube}?autoplay=1&rel=0&modestbranding=1`} title={`${name} video`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="absolute inset-0 h-full w-full border-0" />
          ) : (
            <button type="button" onClick={() => setPlaying(index)} aria-label={`Play ${name} video`} className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnails come from i.ytimg.com */}
              <img src={youtubeThumbnail(current.youtube)} alt="" className="h-full w-full scale-[1.34] object-cover" />
              <span className="absolute inset-0 grid place-items-center bg-black/25"><span className="grid h-20 w-20 place-items-center rounded-full bg-white/95 text-[#0b1f3b] shadow-2xl"><FaPlay className="ml-1 h-7 w-7" /></span></span>
            </button>
          )
        ) : (
          <video key={current.src} src={current.src} controls playsInline preload="metadata" onPlay={() => setPlaying(index)} onPause={() => setPlaying(null)} className="absolute inset-0 h-full w-full bg-black object-contain" />
        )}
        {items.length > 1 && (
          <>
            <button type="button" onClick={() => go(index - 1)} aria-label="Previous" className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#0b1f3b] shadow-lg hover:bg-white"><FaChevronLeft /></button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Next" className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#0b1f3b] shadow-lg hover:bg-white"><FaChevronRight /></button>
          </>
        )}
        <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white" aria-live="polite">
          {current.kind === "image" ? <FaCamera className="h-3 w-3" aria-hidden /> : <FaVideo className="h-3 w-3" aria-hidden />} {index + 1} / {items.length}
        </span>
        <div className="absolute bottom-3 right-3 flex gap-2">
          {current.kind === "image" && <button type="button" onClick={() => setViewer(index)} aria-label="Full screen" className="grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white hover:bg-black/75"><FaExpand className="h-3.5 w-3.5" /></button>}
          {items.length > 1 && <button type="button" onClick={() => setViewer("grid")} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-bold text-[#0b1f3b] shadow hover:bg-[#FFD60A]"><FaThLarge className="h-3 w-3" aria-hidden /> View all {items.length}</button>}
        </div>
      </div>
      {items.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item, i) => (
            <li key={i} className="w-20 shrink-0 sm:w-24">
              <button type="button" onClick={() => go(i)} aria-label={item.kind === "image" ? `Show photo ${i + 1}` : `Show video ${i - images.length + 1}`} aria-current={i === index} className={`relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-900 ${i === index ? "ring-2 ring-[#FFD60A] ring-offset-2" : "opacity-70 hover:opacity-100"}`}>
                <MediaThumb item={item} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {viewer !== null && <ServiceMediaViewer items={items} name={name} start={viewer} onClose={() => setViewer(null)} />}
    </div>
  );
}
