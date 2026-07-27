"use client";

import { useEffect, useRef } from "react";

const journey = [
  {
    year: "2022",
    title: "The Genesis",
    description:
      "PlumberFinder launched in New York to simplify how homeowners find trusted plumbing professionals.",
    highlights: ["2,500+ Jobs", "4.9★ Rating", "60 Technicians"],
    users:
      "Enabled homeowners to instantly connect with verified plumbers, reducing emergency response time.",
    companies:
      "Helped local plumbers gain visibility and consistent job opportunities.",
    icon: "🚀",
  },
  {
    year: "2023",
    title: "National Expansion",
    description:
      "Expanded into major cities, building a reliable and scalable service network.",
    highlights: ["20+ Cities", "8,000+ Customers", "200+ Partners"],
    users:
      "Provided wider access to trusted services across multiple cities with consistent quality.",
    companies:
      "Allowed plumbing firms to scale operations and receive verified leads.",
    icon: "🗺️",
  },
  {
    year: "2024",
    title: "Concierge Experience",
    description:
      "Introduced AI-powered diagnostics and premium concierge services.",
    highlights: ["AI Integration", "Luxury Clients", "Smart Diagnostics"],
    users:
      "Delivered predictive maintenance and high-end service experience for homeowners.",
    companies:
      "Enabled companies to offer premium services and increase revenue per client.",
    icon: "🏆",
  },
  {
    year: "2025",
    title: "Global Vision",
    description:
      "Preparing for international expansion and sustainable plumbing solutions.",
    highlights: ["UK & Canada", "Eco Solutions", "Live Diagnostics"],
    users:
      "Introduced eco-friendly plumbing options and remote consultation services.",
    companies:
      "Opened global opportunities and advanced tools for service providers.",
    icon: "🌍",
  },
  {
    year: "2026",
    title: "Next-Gen Platform (Our Vision)",
    description:
      "Transforming into a fully intelligent platform powered by automation, AI, and real-time service ecosystems.",
    highlights: ["Full Automation", "AI Matching", "Global Network"],
    users:
      "Users will experience instant booking, real-time technician tracking, and zero-hassle service.",
    companies:
      "Companies will gain AI-driven leads, performance analytics, and global exposure.",
    icon: "⚡",
  },
];

export default function AboutJourney() {
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
      className="mt-24 rounded-3xl bg-white border border-gray-200 shadow-xl px-6 md:px-16 py-20 opacity-0 transition-all duration-700"
    >
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-block px-4 py-1 rounded-full bg-[#FFD60A]/10 text-[#FFD60A] text-sm font-semibold mb-4">
          Our Journey & Vision
        </span>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Past Growth. Future Innovation.
        </h2>

        <p className="mt-4 text-gray-600 leading-relaxed text-sm md:text-base">
          From solving real-world problems to building a next-generation service platform.
        </p>
      </div>

      {/* TIMELINE */}
      <div className="relative mt-20 md:mt-24">

        {/* CENTER LINE (desktop only) */}
        <div className="hidden md:block absolute left-1/2 top-0 h-full w-[3px] bg-gray-200 -translate-x-1/2" />

        <div className="space-y-16 md:space-y-24">
          {journey.map((item, idx) => {
            const isLeft = idx % 2 === 0;

            return (
              <div key={idx} className="relative grid md:grid-cols-2 items-center">

                {/* CARD */}
                <div
                  className={`
                    w-full
                    ${isLeft ? "md:pr-16" : "md:pl-16 md:col-start-2"}
                  `}
                >
                  <div className="flex flex-col h-full text-left bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl p-6 md:p-7 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    
                    {/* YEAR */}
                    <div className="text-[#FFD60A] font-bold text-lg md:text-xl">
                      {item.year}
                    </div>

                    {/* TITLE */}
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mt-1">
                      {item.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="mt-3 text-gray-600 text-sm md:text-base">
                      {item.description}
                    </p>

                    {/* HIGHLIGHTS */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.highlights.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 px-3 py-1 rounded-full border text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* USERS */}
                    <div className="mt-5 text-sm text-gray-700">
                      <strong>For Users:</strong> {item.users}
                    </div>

                    {/* COMPANIES */}
                    <div className="mt-2 text-sm text-gray-700">
                      <strong>For Companies:</strong> {item.companies}
                    </div>

                    {/* BUTTON CENTERED */}
                    <div className="mt-auto pt-6 flex justify-center">
                      <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
                        Learn More
                      </button>
                    </div>

                  </div>
                </div>

                {/* ICON (desktop only) */}
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 z-10">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#FFD60A] text-black text-xl border-4 border-white shadow-xl">
                    {item.icon}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}