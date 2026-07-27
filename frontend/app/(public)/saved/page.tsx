// app/saved/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaTrashAlt, FaStar, FaTag } from "react-icons/fa";

interface SavedItem {
  id: string;
  companyName: string;
  rating: number;
  reviewCount: number;
  image: string;
  priceRange: string;
  discount?: string;
  location: string;
}

// Mock saved data – replace with real API call
const mockSaved: SavedItem[] = [
  {
    id: "1",
    companyName: "Premier New York Plumbing",
    rating: 4.5,
    reviewCount: 342,
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    priceRange: "$99 diag",
    discount: "15% off first service",
    location: "New York, NY",
  },
  {
    id: "2",
    companyName: "Elite Los Angeles Plumbing",
    rating: 4.8,
    reviewCount: 287,
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    priceRange: "$120/hr",
    discount: "20% off emergency calls",
    location: "Los Angeles, CA",
  },
  {
    id: "4",
    companyName: "Windy City Plumbers",
    rating: 4.9,
    reviewCount: 67,
    image: "https://randomuser.me/api/portraits/women/89.jpg",
    priceRange: "$120/hour",
    discount: "Free estimate & 15% off",
    location: "Chicago, IL",
  },
];

export default function SavedPage() {
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setSaved(mockSaved);
      setLoading(false);
    }, 500);
  }, []);

  const removeItem = (id: string) => {
    setSaved((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center">Loading saved deals...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Saved Deals</h1>
            <p className="text-gray-600">Your favorite plumbing companies and offers</p>
          </div>
          <Link
            href="/find"
            className="rounded-full bg-[#FFD60A] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-105"
          >
            + Find More
          </Link>
        </div>

        {saved.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <FaHeart className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-3 text-gray-500">You haven&apos;t saved any plumbers yet.</p>
            <Link
              href="/find"
              className="mt-4 inline-block rounded-full bg-[#FFD60A] px-6 py-2 text-sm font-semibold text-white transition hover:brightness-105"
            >
              Browse Plumbers
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute right-3 top-3 z-10 text-gray-400 transition hover:text-red-500"
                  aria-label="Remove from saved"
                >
                  <FaTrashAlt className="h-4 w-4" />
                </button>
                <Link href={`/plumber/${item.id}`}>
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full">
                      <Image
                        src={item.image}
                        alt={item.companyName}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{item.companyName}</h3>
                      <div className="flex items-center gap-1">
                        <FaStar className="h-3 w-3 text-[#FFD60A]" />
                        <span className="text-sm font-medium">{item.rating}</span>
                        <span className="text-xs text-gray-500">({item.reviewCount})</span>
                      </div>
                      <p className="text-xs text-gray-500">{item.location}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[#FFD60A]">{item.priceRange}</span>
                    {item.discount && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                        <FaTag className="h-2 w-2" />
                        {item.discount}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}