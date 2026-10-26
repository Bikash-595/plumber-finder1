"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const SLIDE_MS = 5000;
const arrow = "grid h-8 w-8 place-items-center rounded-full bg-white/85 text-[#0b1f3b] shadow transition hover:bg-[#FFD60A]";

/**
 * Profile header banner: the cover photos fade from one to the next on their own (with a slow zoom),
 * pausing while hovered. Dots and arrows switch photos; with one photo it is a still banner.
 */
export default function CoverSlideshow({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;
  const go = (next: number) => setIndex((next + count) % count);

  useEffect(() => {
    if (count < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  if (!count) return null;
  return (
    <div className="group absolute inset-0" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carousel" aria-label={`${name} cover photos`}>
      {images.map((src, i) => (
        <div key={`${i}-${src.slice(-24)}`} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`} aria-hidden={i !== index}>
          <Image src={src} alt={i === index ? `${name} cover photo ${i + 1} of ${count}` : ""} fill priority={i === 0} sizes="(max-width: 1024px) 100vw, 66vw" className={`object-cover transition-transform ease-linear ${i === index ? "scale-110 duration-[6000ms]" : "scale-100 duration-0"} motion-reduce:scale-100`} />
        </div>
      ))}
      {count > 1 && (
        <>
          <button type="button" onClick={() => go(index - 1)} aria-label="Previous cover photo" className={`${arrow} absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 opacity-0 group-hover:opacity-100 focus:opacity-100 sm:grid`}><FaChevronLeft className="h-3 w-3" /></button>
          <button type="button" onClick={() => go(index + 1)} aria-label="Next cover photo" className={`${arrow} absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 opacity-0 group-hover:opacity-100 focus:opacity-100 sm:grid`}><FaChevronRight className="h-3 w-3" /></button>
          <div className="absolute bottom-3 right-3 z-10 flex gap-1.5 rounded-full bg-black/35 px-2 py-1.5 backdrop-blur-sm sm:right-5">
            {images.map((_, i) => (
              <button key={i} type="button" onClick={() => go(i)} aria-label={`Show cover photo ${i + 1}`} aria-current={i === index} className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-white" : "w-1.5 bg-white/60 hover:bg-white"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
