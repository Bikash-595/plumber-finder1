"use client";

import Image from "next/image";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const arrow = "grid h-8 w-8 place-items-center rounded-full bg-white/85 text-[#0b1f3b] shadow transition hover:bg-[#FFD60A]";

/**
 * Profile header banner: a still cover photo. With several photos, the arrows and dots switch between them
 * (no automatic sliding, fading or zooming). With one photo it is a plain banner.
 */
export default function CoverSlideshow({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const go = (next: number) => setIndex((next + count) % count);

  if (!count) return null;
  const current = images[Math.min(index, count - 1)];
  return (
    <div className="group absolute inset-0" aria-roledescription={count > 1 ? "carousel" : undefined} aria-label={`${name} cover photos`}>
      <Image key={current} src={current} alt={`${name} cover photo${count > 1 ? ` ${index + 1} of ${count}` : ""}`} fill priority sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
      {count > 1 && (
        <>
          <button type="button" onClick={() => go(index - 1)} aria-label="Previous cover photo" className={`${arrow} absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 opacity-0 group-hover:opacity-100 focus:opacity-100 sm:grid`}><FaChevronLeft className="h-3 w-3" /></button>
          <button type="button" onClick={() => go(index + 1)} aria-label="Next cover photo" className={`${arrow} absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 opacity-0 group-hover:opacity-100 focus:opacity-100 sm:grid`}><FaChevronRight className="h-3 w-3" /></button>
          <div className="absolute bottom-3 right-3 z-10 flex gap-1.5 rounded-full bg-black/35 px-2 py-1.5 backdrop-blur-sm sm:right-5">
            {images.map((_, i) => (
              <button key={i} type="button" onClick={() => go(i)} aria-label={`Show cover photo ${i + 1}`} aria-current={i === index} className={`h-1.5 rounded-full ${i === index ? "w-5 bg-white" : "w-1.5 bg-white/60 hover:bg-white"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
