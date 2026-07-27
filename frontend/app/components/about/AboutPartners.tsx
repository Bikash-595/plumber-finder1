"use client";

import Image from "next/image";
import { useState } from "react";
import PlumbingCompanyMarquee from "./PlumbingCompanyMarquee";

const partners = [
  {
    name: "HomeAdvisor",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/HomeAdvisor_logo.png",
  },
  {
    name: "Angi",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Angi_logo.png",
  },
  {
    name: "Thumbtack",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Thumbtack_logo.png",
  },
  {
    name: "Nextdoor",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Nextdoor_logo.png",
  },
  {
    name: "Yelp",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Yelp_Logo.png",
  },
];

export default function AboutPartners() {
  const [errorImages, setErrorImages] = useState<Record<string, boolean>>({});

  return (
    <>
      <section className="mt-20 rounded-3xl bg-white border border-gray-200 shadow-lg p-8 md:p-12">

        {/* HEADER */}
        <div className="text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-[#FFD60A]/10 text-[#FFD60A] text-sm font-semibold mb-4">
            Trusted Partners
          </span>

          <h2 className="text-3xl font-bold text-gray-900">
            We&apos;re in Good Company
          </h2>

          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Trusted platforms helping us deliver quality service.
          </p>
        </div>

        {/* LOGO GRID */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

          {partners.map((partner) => (
            <div
              key={partner.name}
              className="group flex h-24 items-center justify-center rounded-xl border border-gray-100 bg-gray-50/50 p-4 hover:shadow-md hover:border-[#FFD60A]/30 transition"
            >
              <div className="relative h-12 w-full">

                {!errorImages[partner.name] ? (
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-contain grayscale group-hover:grayscale-0 transition"
                    onError={() =>
                      setErrorImages((prev) => ({
                        ...prev,
                        [partner.name]: true,
                      }))
                    }
                  />
                ) : (
                  <span className="text-sm text-gray-500">
                    {partner.name}
                  </span>
                )}

              </div>
            </div>
          ))}

        </div>

      </section>

      <PlumbingCompanyMarquee />
    </>
  );
}
