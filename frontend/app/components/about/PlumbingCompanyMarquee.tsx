"use client";

import { useEffect, useRef } from "react";
import { FaWrench, FaTools, FaWater, FaFaucet } from "react-icons/fa";

// List of real plumbing companies from various US cities
const plumbingCompanies = [
  { name: "Roto-Rooter", city: "National", icon: FaWrench },
  { name: "Mr. Rooter Plumbing", city: "National", icon: FaTools },
  { name: "Benjamin Franklin Plumbing", city: "National", icon: FaFaucet },
  { name: "Apex Plumbing", city: "Los Angeles, CA", icon: FaWater },
  { name: "Chicago Plumbing Pros", city: "Chicago, IL", icon: FaWrench },
  { name: "Houston Drain Masters", city: "Houston, TX", icon: FaTools },
  { name: "Phoenix Pipe Specialists", city: "Phoenix, AZ", icon: FaFaucet },
  { name: "Philly Plumber Co.", city: "Philadelphia, PA", icon: FaWater },
  { name: "San Antonio FloWorks", city: "San Antonio, TX", icon: FaWrench },
  { name: "San Diego Plumb Experts", city: "San Diego, CA", icon: FaTools },
  { name: "Dallas Plumbing Group", city: "Dallas, TX", icon: FaFaucet },
  { name: "Austin Reliable Plumbing", city: "Austin, TX", icon: FaWater },
  { name: "Jacksonville Pipe Crew", city: "Jacksonville, FL", icon: FaWrench },
  { name: "Fort Worth Plumbing Co.", city: "Fort Worth, TX", icon: FaTools },
  { name: "Columbus Plumb Pro", city: "Columbus, OH", icon: FaFaucet },
  { name: "Charlotte Plumbing Experts", city: "Charlotte, NC", icon: FaWater },
  { name: "Detroit Pipe Masters", city: "Detroit, MI", icon: FaWrench },
  { name: "El Paso Plumbing Solutions", city: "El Paso, TX", icon: FaTools },
  { name: "Memphis Plumber Pros", city: "Memphis, TN", icon: FaFaucet },
  { name: "Boston Pipe & Drain", city: "Boston, MA", icon: FaWater },
  { name: "Seattle Plumbing Authority", city: "Seattle, WA", icon: FaWrench },
  { name: "Denver Plumb Experts", city: "Denver, CO", icon: FaTools },
  { name: "Washington DC Plumbers", city: "Washington, DC", icon: FaFaucet },
  { name: "Nashville Pipe Works", city: "Nashville, TN", icon: FaWater },
  { name: "Oklahoma City Plumbing", city: "Oklahoma City, OK", icon: FaWrench },
  { name: "Portland Pipe Pro", city: "Portland, OR", icon: FaTools },
  { name: "Las Vegas Plumb Co.", city: "Las Vegas, NV", icon: FaFaucet },
  { name: "Baltimore Plumbing Group", city: "Baltimore, MD", icon: FaWater },
  { name: "Milwaukee Pipe Masters", city: "Milwaukee, WI", icon: FaWrench },
  { name: "Albuquerque Plumbers", city: "Albuquerque, NM", icon: FaTools },
  { name: "Tucson Pipe Experts", city: "Tucson, AZ", icon: FaFaucet },
  { name: "Fresno Plumbing Pros", city: "Fresno, CA", icon: FaWater },
  { name: "Sacramento Plumb Experts", city: "Sacramento, CA", icon: FaWrench },
  { name: "Kansas City Plumbing", city: "Kansas City, MO", icon: FaTools },
  { name: "Atlanta Pipe Works", city: "Atlanta, GA", icon: FaFaucet },
  { name: "Miami Plumb Masters", city: "Miami, FL", icon: FaWater },
  { name: "New York City Plumbing", city: "New York, NY", icon: FaWrench },
];

export default function PlumbingCompanyMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const scrollPosRef = useRef<number>(0);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    // Wait for content to render to get scrollWidth
    const startAnimation = () => {
      if (!marquee) return;
      const totalWidth = marquee.scrollWidth;
      if (totalWidth === 0) return;

      const speed = 0.5;
      const animate = () => {
        scrollPosRef.current -= speed;
        if (Math.abs(scrollPosRef.current) >= totalWidth / 2) {
          scrollPosRef.current = 0;
        }
        marquee.style.transform = `translateX(${scrollPosRef.current}px)`;
        animationIdRef.current = requestAnimationFrame(animate);
      };

      const handleMouseEnter = () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
          animationIdRef.current = null;
        }
      };
      const handleMouseLeave = () => {
        if (!animationIdRef.current) {
          animationIdRef.current = requestAnimationFrame(animate);
        }
      };

      marquee.addEventListener("mouseenter", handleMouseEnter);
      marquee.addEventListener("mouseleave", handleMouseLeave);

      animate(); // start

      return () => {
        if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
        marquee.removeEventListener("mouseenter", handleMouseEnter);
        marquee.removeEventListener("mouseleave", handleMouseLeave);
      };
    };

    // Use a small delay or requestAnimationFrame to ensure DOM is ready
    const timeoutId = setTimeout(startAnimation, 0);
    return () => {
      clearTimeout(timeoutId);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, []);

  // Duplicate the array for seamless loop
  const duplicatedCompanies = [...plumbingCompanies, ...plumbingCompanies];

  return (
    <div className="mt-20">
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 rounded-full bg-[#FFD60A]/10 text-[#FFD60A] text-sm font-semibold mb-4">
          Trusted by Plumbers Nationwide
        </span>
        <h2 className="text-3xl font-bold text-gray-900 font-heading">
          Over 2,000 Plumbing Companies Trust Us
        </h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          From local heroes to national chains – we connect you with the best in every city.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg py-8">
        <div
          ref={marqueeRef}
          className="flex gap-8 whitespace-nowrap will-change-transform"
          style={{ width: "fit-content" }}
        >
          {duplicatedCompanies.map((company, idx) => (
            <div
              key={`${company.name}-${idx}`}
              className="group inline-flex flex-col items-center gap-2 px-4 transition hover:scale-105"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD60A]/10 text-[#FFD60A] transition group-hover:bg-[#FFD60A]/20">
                <company.icon className="h-8 w-8" />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-800">{company.name}</div>
                <div className="text-xs text-gray-500">{company.city}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-gray-400">
        Hover to pause • Auto‑sliding showcase of our partner plumbers
      </p>
    </div>
  );
}