"use client";

import Link from "next/link";

export default function AboutCta() {
  return (
    <section className="relative mt-24 overflow-hidden rounded-3xl border border-gray-200 shadow-xl">

      {/* 🔥 SOFT BACKGROUND GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFD60A]/10 via-white to-[#B1A606]/10" />

      {/* 🔥 REDUCED GLOW */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#FFD60A]/10 blur-3xl rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#B1A606]/10 blur-3xl rounded-full" />

      {/* CONTENT */}
      <div className="relative z-10 px-6 py-12 md:px-12 md:py-16 text-center">

        {/* BADGE */}
        <span className="inline-block mb-4 px-4 py-1 rounded-full bg-gray-900 text-white text-xs font-semibold">
          🚀 Get Started Today
        </span>

        {/* HEADING */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-heading">
          Ready to Experience the{" "}
          <span className="text-[#FFD60A]">PlumberFinder Difference?</span>
        </h2>

        {/* DESCRIPTION */}
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          Join thousands of homeowners who trust us for reliable plumbing services.
          Or grow your business by connecting with high-quality leads.
        </p>

        {/* BUTTONS */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">

          {/* PRIMARY BUTTON (FIXED COLOR) */}
          <Link
            href="/find"
              className="rounded-full bg-[#FFD60A] px-6 py-3 text-sm font-semibold text-black shadow-md transition hover:bg-[#e6c200]"
          >
            Find a Plumber →
          </Link>

          {/* SECONDARY BUTTON */}
          <Link
            href="/signup"
              className="rounded-full bg-[#FFD60A] px-6 py-3 text-sm font-semibold text-black shadow-md transition hover:bg-[#e6c200]"
          >
            List Your Business →
          </Link>
        </div>

        {/* TRUST */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs md:text-sm text-gray-600">

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#FFD60A]" />
            <span>24/7 Emergency Support</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#FFD60A]" />
            <span>Verified Professionals</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#FFD60A]" />
            <span>No Hidden Charges</span>
          </div>

        </div>

      </div>
    </section>
  );
}