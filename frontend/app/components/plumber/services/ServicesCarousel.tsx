"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay } from "react-icons/fa";
import type { ServiceDetail } from "@/components/find/types";
import ServiceCard from "./ServiceCard";

const AUTOPLAY_MS = 5000;

/**
 * Two service cards at a time on every screen (like the gallery) that move on by themselves every few seconds.
 * Swipe or use the arrows and dots; it pauses on hover, while focused, when the tab is hidden, and for
 * people who prefer reduced motion. Native scroll-snap does the sliding, so touch swiping just works.
 */
export default function ServicesCarousel({ services, hrefFor }: { services: ServiceDetail[]; hrefFor: (service: ServiceDetail) => string | undefined }) {
  const track = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [stopped, setStopped] = useState(false);

  // Cards per view comes from the layout (CSS), so it's measured rather than guessed.
  const measure = useCallback(() => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return { perView: 1, step: 0 };
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = card.offsetWidth + gap;
    return { perView: Math.max(1, Math.round((el.clientWidth + gap) / step)), step };
  }, []);

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const { perView, step } = measure();
    const total = Math.max(1, services.length - perView + 1);
    setPages(total);
    setPage(step ? Math.min(total - 1, Math.round(el.scrollLeft / step)) : 0);
  }, [measure, services.length]);

  const goTo = useCallback((target: number) => {
    const el = track.current;
    if (!el) return;
    const { perView, step } = measure();
    const total = Math.max(1, services.length - perView + 1);
    const next = ((target % total) + total) % total;
    el.scrollTo({ left: next * step, behavior: "smooth" });
  }, [measure, services.length]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    el.addEventListener("scroll", sync, { passive: true });
    return () => { observer.disconnect(); el.removeEventListener("scroll", sync); };
  }, [sync]);

  useEffect(() => {
    if (stopped || hovered || focused || pages < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => { if (!document.hidden) goTo(page + 1); }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [stopped, hovered, focused, pages, page, goTo]);

  const arrow = "grid h-10 w-10 place-items-center rounded-full bg-white text-[#0b1f3b] shadow ring-1 ring-gray-200 hover:bg-[#0b1f3b] hover:text-white disabled:opacity-30";
  return (
    <div role="region" aria-roledescription="carousel" aria-label="Services" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setFocused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false); }}>
      <ul ref={track} className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-1 pb-2 pt-1 [scrollbar-width:none] @2xl:gap-5 [&::-webkit-scrollbar]:hidden">
        {services.map((service, index) => (
          <li key={service.id} aria-roledescription="slide" aria-label={`${index + 1} of ${services.length}`} className="w-[calc(50%-0.375rem)] shrink-0 snap-start @2xl:w-[calc(50%-0.625rem)]">
            <ServiceCard service={service} href={hrefFor(service)} />
          </li>
        ))}
      </ul>
      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Choose slide">
            {Array.from({ length: pages }, (_, i) => (
              <button key={i} type="button" role="tab" aria-selected={i === page} aria-label={`Show slide ${i + 1}`} onClick={() => goTo(i)} className={`h-2 rounded-full ${i === page ? "w-7 bg-[#0b1f3b]" : "w-2 bg-gray-300 hover:bg-gray-400"}`} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setStopped(!stopped)} aria-label={stopped ? "Play slideshow" : "Pause slideshow"} className="grid h-9 w-9 place-items-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-[#0b1f3b]">{stopped ? <FaPlay className="h-3 w-3" /> : <FaPause className="h-3 w-3" />}</button>
            <button type="button" onClick={() => goTo(page - 1)} aria-label="Previous services" className={arrow}><FaChevronLeft className="h-3.5 w-3.5" /></button>
            <button type="button" onClick={() => goTo(page + 1)} aria-label="Next services" className={arrow}><FaChevronRight className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
