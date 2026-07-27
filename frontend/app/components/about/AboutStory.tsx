"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function AboutStory() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const current = sectionRef.current;

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

    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mt-20 rounded-3xl bg-white border border-gray-200 shadow-lg overflow-hidden opacity-0 transition-all duration-700"
    >
      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT */}
        <div className="p-8 md:p-12">
          <span className="inline-block px-3 py-1 rounded-full bg-[#FFD60A]/10 text-[#FFD60A] text-sm font-semibold mb-4">
            Our Story
          </span>

          <h2 className="text-3xl font-bold text-gray-900 font-heading">
            Born from Frustration, Built with Purpose
          </h2>

          <p className="mt-4 text-gray-600 leading-relaxed">
            PlumberFinder didn’t start in a boardroom. It started in a flooded
            basement during a holiday weekend. We realized that finding a
            master technician who respects your home’s architecture shouldn’t
            be a gamble.
          </p>

          <p className="mt-4 text-gray-600 leading-relaxed">
            We built a concierge service that puts every professional through a
            rigorous architectural lens, ensuring that every repair is an
            upgrade in quality and precision.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-white bg-gray-200"
                />
              ))}
            </div>

            <p className="text-sm text-gray-500">
              Trusted by{" "}
              <strong className="text-gray-900">10,000+</strong> homeowners
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative h-64 md:h-auto bg-gradient-to-br from-[#FFD60A]/20 to-[#B1A606]/20">
          <Image
            src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800&auto=format"
            alt="Plumber working"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover mix-blend-multiply"
            priority
          />
        </div>
      </div>
    </section>
  );
}
