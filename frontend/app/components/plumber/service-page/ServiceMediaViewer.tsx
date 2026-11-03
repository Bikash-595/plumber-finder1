"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaThLarge, FaTimes } from "react-icons/fa";
import MediaThumb from "./MediaThumb";
import type { MediaItem } from "./serviceMedia";

/**
 * Full-screen viewer: every photo and video in a grid ("View all"), or one at a time with arrows.
 * Escape closes; arrow keys move.
 */
export default function ServiceMediaViewer({ items, name, start, onClose }: { items: MediaItem[]; name: string; start: number | "grid"; onClose: () => void }) {
  const [index, setIndex] = useState<number | null>(start === "grid" ? null : start);
  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (index !== null && event.key === "ArrowRight") setIndex((index + 1) % items.length);
      if (index !== null && event.key === "ArrowLeft") setIndex((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = overflow; window.removeEventListener("keydown", onKey); };
  }, [index, items.length, onClose]);
  const current = index === null ? null : items[index];
  const round = "grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20";
  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-black/95" role="dialog" aria-modal="true" aria-label={`${name} photos and videos`}>
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-white/80">
        <span className="truncate">{current ? `${current.kind === "image" ? "Photo" : "Video"} ${index! + 1} of ${items.length}` : `All photos and videos · ${items.length}`}</span>
        <div className="flex gap-2">
          {current && items.length > 1 && <button type="button" onClick={() => setIndex(null)} aria-label="Show all" className={round}><FaThLarge className="h-4 w-4" /></button>}
          <button type="button" onClick={onClose} aria-label="Close" className={round}><FaTimes className="h-5 w-5" /></button>
        </div>
      </div>
      {current ? (
        <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-6 sm:px-16">
          {current.kind === "image" ? <div className="relative h-full w-full max-w-5xl"><Image key={current.src} src={current.src} alt={`${name} photo`} fill sizes="100vw" unoptimized={current.src.startsWith("data:")} className="object-contain" /></div>
            : current.youtube ? <iframe key={current.src} src={`https://www.youtube-nocookie.com/embed/${current.youtube}?autoplay=1&rel=0&modestbranding=1`} title={`${name} video`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="aspect-video w-full max-w-5xl rounded-lg border-0" />
            : <video key={current.src} src={current.src} controls autoPlay playsInline className="max-h-full w-full max-w-5xl rounded-lg bg-black" />}
          {items.length > 1 && (
            <>
              <button type="button" onClick={() => setIndex((index! - 1 + items.length) % items.length)} aria-label="Previous" className={`${round} absolute left-2 top-1/2 -translate-y-1/2 sm:left-4`}><FaChevronLeft /></button>
              <button type="button" onClick={() => setIndex((index! + 1) % items.length)} aria-label="Next" className={`${round} absolute right-2 top-1/2 -translate-y-1/2 sm:right-4`}><FaChevronRight /></button>
            </>
          )}
        </div>
      ) : (
        <ul className="grid flex-1 auto-rows-min grid-cols-2 gap-2 overflow-y-auto p-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, i) => (
            <li key={i}><button type="button" onClick={() => setIndex(i)} aria-label={`Open ${item.kind === "image" ? "photo" : "video"} ${i + 1}`} className="relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-900"><MediaThumb item={item} sizes="(max-width: 640px) 50vw, 25vw" /></button></li>
          ))}
        </ul>
      )}
    </div>
  );
}
