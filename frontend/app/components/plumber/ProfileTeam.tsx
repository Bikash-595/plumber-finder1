"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { Plumber } from "@/components/find/types";

export default function ProfileTeam({ plumber }: { plumber: Plumber }) {
  const members = plumber.teamMembers ?? [];
  const carouselRef = useRef<HTMLDivElement>(null);

  const moveCarousel = (direction: 1 | -1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const distance = carousel.clientWidth / 2;
    const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 8;
    if (direction === 1 && atEnd) {
      carousel.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      carousel.scrollBy({ left: direction * distance, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (members.length < 3) return;
    const interval = window.setInterval(() => moveCarousel(1), 5000);
    return () => window.clearInterval(interval);
  }, [members.length]);

  if (!members.length) return null;

  return <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0b1f3b]">Meet the people behind the work</p><h2 className="mt-1 text-xl font-bold text-gray-900">Our Team</h2><p className="mt-1 text-sm text-gray-500">Get to know the licensed professionals at {plumber.companyName}.</p></div>
      <div className="flex gap-2"><CarouselButton label="Previous team members" onClick={() => moveCarousel(-1)}><FaChevronLeft /></CarouselButton><CarouselButton label="Next team members" onClick={() => moveCarousel(1)}><FaChevronRight /></CarouselButton></div>
    </div>
    <div ref={carouselRef} className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {members.map((member) => <Link key={member.id} href={`/plumber/${plumber.id}/team/${member.id}`} className="group flex min-w-[calc(100%-1rem)] snap-start overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 text-left transition hover:-translate-y-0.5 hover:border-[#FFD60A] hover:shadow-md sm:min-w-[calc(50%-0.5rem)]">
        <div className="h-32 w-28 shrink-0 bg-gray-200"><img src={member.photo || plumber.logo} alt={`${member.name} at ${plumber.companyName}`} className="h-full w-full object-cover" /></div>
        <div className="min-w-0 p-4"><p className="text-base font-bold text-gray-900">{member.name}</p><p className="mt-0.5 text-sm font-semibold text-[#0b1f3b]">{member.role}</p><p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">{member.specialties.join(" · ")}</p><span className="mt-3 inline-block text-xs font-bold text-[#b59a00] group-hover:underline">View profile →</span></div>
      </Link>)}
    </div>
  </section>;
}

function CarouselButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-label={label} onClick={onClick} className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 text-gray-700 transition hover:border-[#FFD60A] hover:bg-[#FFD60A]/10">{children}</button>;
}
