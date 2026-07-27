"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AboutHero() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden rounded-3xl shadow-xl">

      {/* 🔥 BACKGROUND IMAGE (FIXED) */}
      <div className="absolute inset-0">
        <Image
          src="/images/plumber-bg.jpg" // ✅ MUST exist in public/images/
          alt="Plumber"
          fill
          sizes="100vw"
          priority
          loading="eager"
          className="object-cover scale-105 animate-[zoom_20s_linear_infinite]"
        />
      </div>

      {/* 🔥 DARK GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />

      {/* 🔥 GLOW EFFECT */}
      <div className="absolute top-0 right-0 h-72 w-72 bg-[#FFD60A]/20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-0 h-72 w-72 bg-[#FFD60A]/10 blur-3xl rounded-full" />

      {/* 🔥 CONTENT CARD */}
      <div className="relative z-10 flex items-center justify-center px-6 py-16 md:py-24">
        <div className="w-full max-w-4xl text-center backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">

          {/* TAG */}
          <span className="inline-block px-4 py-1 rounded-full bg-[#FFD60A]/20 text-[#FFD60A] text-sm font-semibold mb-5">
            ✨ Welcome to PlumberFinder
          </span>

          {/* TITLE */}
          <h1
            ref={titleRef}
            className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-white opacity-0"
          >
            Redefining the <span className="text-[#FFD60A]">Intersection</span>
            <br />
            of Essential Services & Luxury Standards
          </h1>

          {/* DESCRIPTION */}
          <p className="mt-6 text-gray-200 text-base md:text-lg max-w-2xl mx-auto">
            Precision isn’t just a goal – it’s our foundation. We connect homeowners with elite technicians who respect your space.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/find"
              className="rounded-full bg-[#FFD60A] px-6 py-3 text-sm font-semibold text-black shadow-lg hover:scale-105 transition"
            >
              Find a Plumber
            </Link>

            <Link
              href="/contact"
              className="rounded-full border border-white/30 bg-white/10 backdrop-blur px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition"
            >
              Contact Us
            </Link>
          </div>

          {/* FEATURES */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-[#FFD60A] rounded-full" />
              <span className="text-gray-300">24/7 Emergency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-[#FFD60A] rounded-full" />
              <span className="text-gray-300">Verified Experts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-[#FFD60A] rounded-full" />
              <span className="text-gray-300">100% Guarantee</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
