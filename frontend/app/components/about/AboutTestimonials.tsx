"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    name: "Jennifer Lopez",
    role: "Homeowner, NYC",
    text: "PlumberFinder changed my life. I had a burst pipe at 2 AM, and within 20 minutes a master plumber arrived. The work was impeccable – they even cleaned up like it never happened.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    name: "Michael Chen",
    role: "Property Manager, LA",
    text: "Managing 50+ units used to be a nightmare. Now I book all my plumbing needs through PlumberFinder. The dashboard, transparent pricing, and quality of work are unmatched.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    name: "Robert Williams",
    role: "Plumbing Company Owner",
    text: "Joining PlumberFinder as an Elite Partner brought us 30% more leads. Their vetting process ensures only serious customers reach us. Highly recommended.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

export default function AboutTestimonials() {
  const [current, setCurrent] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleImageError = (idx: number) => {
    setImgErrors((prev) => ({ ...prev, [idx]: true }));
  };

  const currentTestimonial = testimonials[current];

  return (
    <section className="mt-20 rounded-3xl bg-white border border-gray-200 shadow-lg p-8 md:p-12">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-[#FFD60A]/10 text-[#FFD60A] text-sm font-semibold mb-4">
          Testimonials
        </span>
        <h2 className="text-3xl font-bold text-gray-900 font-heading">
          What Our Community Says
        </h2>
      </div>

      <div className="relative mt-12 max-w-3xl mx-auto">
        <FaQuoteLeft className="absolute -top-6 left-0 text-6xl text-[#FFD60A]/20" />
        <div className="text-center">
          <div className="flex justify-center gap-1 text-[#FFD60A] mb-4">
            {[...Array(currentTestimonial.rating)].map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>
          <p className="text-gray-700 text-lg italic">
            “{currentTestimonial.text}”
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {!imgErrors[current] ? (
                <Image
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                  onError={() => handleImageError(current)}
                  priority={current === 0}
                />
              ) : (
                <span className="text-gray-500 text-lg font-bold">
                  {currentTestimonial.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-900">
                {currentTestimonial.name}
              </div>
              <div className="text-sm text-gray-500">
                {currentTestimonial.role}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 w-2 rounded-full transition ${
                idx === current ? "bg-[#FFD60A] w-6" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}