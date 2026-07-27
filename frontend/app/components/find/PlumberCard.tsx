// components/find/PlumberCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export interface Plumber {
  id: string | number;
  name: string;
  rating: number;
  reviewCount: number;
  image: string;           // path to image (e.g., "/plumber-1.jpg")
  services: string[];      // e.g., ["Leak Repair", "Drain Cleaning"]
  priceInfo: string;       // e.g., "$89 service call"
  availability: string;    // e.g., "Emergency available"
  isVerified?: boolean;
}

interface PlumberCardProps {
  plumber: Plumber;
  onBookClick?: (plumber: Plumber) => void;
}

export default function PlumberCard({ plumber, onBookClick }: PlumberCardProps) {
  const {
    id,
    name,
    rating,
    reviewCount,
    image,
    services,
    priceInfo,
    availability,
    isVerified = false,
  } = plumber;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/10">
      {/* Top row: image + name + rating */}
      <div className="flex gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-white/10">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white/50">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">{name}</h2>
            {isVerified && (
              <span className="rounded-full bg-[color:var(--color-primary-blue)]/20 px-2 py-0.5 text-xs text-[color:var(--color-primary-blue)]">
                ✓ Verified
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-yellow-400">⭐ {rating.toFixed(1)}</span>
            <span className="text-white/60">({reviewCount} reviews)</span>
            <span className="rounded-full bg-[color:var(--color-success-green)]/20 px-2 py-0.5 text-xs text-green-300">
              {availability}
            </span>
          </div>
        </div>
      </div>

      {/* Services tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {services.map((service) => (
          <span
            key={service}
            className="rounded-full bg-white/10 px-3 py-1 text-xs"
          >
            {service}
          </span>
        ))}
      </div>

      {/* Price & booking button */}
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-lg font-bold text-[color:var(--color-alert-orange)]">
          {priceInfo}
        </span>
        <Link
          href={`/plumber/${id}`}
          onClick={(e) => {
            if (onBookClick) {
              e.preventDefault();
              onBookClick(plumber);
            }
          }}
          className="rounded-full bg-[color:var(--color-primary-blue)] px-5 py-2 text-sm font-semibold transition hover:brightness-110"
        >
          View & Book
        </Link>
      </div>
    </div>
  );
}


