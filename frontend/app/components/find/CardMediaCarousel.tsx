"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { displayableImage } from "./companyListing";
import { youtubeId } from "./media";
import type { Plumber } from "./types";

type Slide = { kind: "image" | "video" | "youtube"; src: string };

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300/api";
const IMAGE_MS = 3500;
const VIDEO_MS = 8000;
// Gallery fetched once per company per page visit, shared by every card that shows it.
const galleryCache = new Map<string, Promise<Slide[]>>();


function toSlide(src: string, kind?: "image" | "video"): Slide | null {
  if (!src) return null;
  if (youtubeId(src)) return { kind: "youtube", src };
  if (kind === "video" || src.startsWith("data:video/") || /\.(mp4|webm|mov)(\?|$)/i.test(src)) return { kind: "video", src };
  const image = displayableImage(src);
  return image ? { kind: "image", src: image } : null;
}

/** A live company's or freelancer's gallery (photos and videos), loaded when its card is first on screen. */
function loadGallery(plumber: Plumber): Promise<Slide[]> {
  if (!plumber.providerType || !/^[a-f0-9]{24}$/i.test(plumber.id)) return Promise.resolve([]);
  const key = `${plumber.providerType}:${plumber.id}`;
  if (!galleryCache.has(key)) {
    const path = plumber.providerType === "company" ? "companies" : "freelancers";
    galleryCache.set(key, fetch(`${API_BASE}/${path}/gallery/public/${plumber.id}`)
      .then((response) => (response.ok ? response.json() : { data: [] }))
      .then(({ data }: { data?: { media: string; mediaKind?: "image" | "video" }[] }) => (data ?? []).map((item) => toSlide(item.media, item.mediaKind)).filter((slide): slide is Slide => Boolean(slide)))
      .catch(() => []));
  }
  return galleryCache.get(key)!;
}

/**
 * The card's picture: every photo and video of the plumber, changing on its own (videos play muted).
 * It only runs while the card is on screen, pauses on hover, and stays still for reduced-motion users.
 */
export default function CardMediaCarousel({ plumber, sizes }: { plumber: Plumber; sizes: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [gallery, setGallery] = useState<Slide[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const base = [...(plumber.media?.images ?? []).map((src) => toSlide(src, "image")), ...(plumber.media?.videos ?? []).map((src) => toSlide(src, "video"))];
  const slides = [...base, ...gallery].filter((slide, position, all): slide is Slide => Boolean(slide) && all.findIndex((other) => other?.src === slide!.src) === position);
  if (!slides.length) {
    const logo = displayableImage(plumber.logo);
    if (logo) slides.push({ kind: "image", src: logo });
  }
  const current = slides.length ? index % slides.length : 0;
  const slide = slides[current];

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    loadGallery(plumber).then((items) => { if (!cancelled && items.length) setGallery(items); });
    return () => { cancelled = true; };
  }, [visible, plumber]);

  useEffect(() => {
    if (!visible || paused || slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setIndex((value) => value + 1), slide?.kind === "image" ? IMAGE_MS : VIDEO_MS);
    return () => window.clearTimeout(timer);
  }, [visible, paused, slides.length, current, slide?.kind]);

  const go = (event: React.MouseEvent, position: number) => {
    // The card is a link; the dots only change the picture.
    event.preventDefault();
    event.stopPropagation();
    setIndex(position);
  };

  return (
    <div ref={ref} className="absolute inset-0" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} data-slides={slides.length}>
      {slides.map((item, position) => {
        const active = position === current;
        // Images stay mounted (fading); videos only play while shown.
        if (item.kind === "image") {
          return <Image key={item.src} src={item.src} alt={active ? plumber.companyName : ""} fill sizes={sizes} loading={position === 0 ? undefined : "lazy"} className={`object-cover transition-opacity duration-700 group-hover:scale-105 ${active ? "opacity-100" : "opacity-0"}`} />;
        }
        if (!active || !visible) return null;
        if (item.kind === "video") {
          return <video key={item.src} src={item.src} autoPlay muted loop playsInline preload="metadata" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />;
        }
        const id = youtubeId(item.src)!;
        return (
          <iframe key={item.src} src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&modestbranding=1&rel=0`} title={`${plumber.companyName} video`} allow="autoplay; encrypted-media; picture-in-picture" tabIndex={-1} className="pointer-events-none absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 border-0" />
        );
      })}
      {!slides.length && <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">No image</div>}
      {slide && slide.kind !== "image" && <span className="pointer-events-none absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white"><FaPlay className="h-2 w-2" /> Video</span>}
      {slides.length > 1 && (
        <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 rounded-full bg-black/40 px-1.5 py-1">
          {slides.slice(0, 8).map((item, position) => (
            <button key={item.src} type="button" aria-label={`Show ${item.kind === "image" ? "photo" : "video"} ${position + 1} of ${slides.length}`} onClick={(event) => go(event, position)} className={`h-1.5 rounded-full transition-all ${position === current ? "w-3 bg-white" : "w-1.5 bg-white/60"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
