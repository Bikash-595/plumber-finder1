"use client";

import { FaHeart, FaTrash } from "react-icons/fa";

export default function SavedPage() {
  const savedPlumbers = [
    {
      id: 1,
      name: "Elite Los Angeles Plumbing",
      rating: 4.8,
      reviews: 124,
      expertise: "Emergency & Repairs",
      image: "https://api.dicebear.com/8.x/avataaars/svg?seed=plumber1",
    },
    {
      id: 2,
      name: "Premier New York Services",
      rating: 4.9,
      reviews: 98,
      expertise: "Installation & Maintenance",
      image: "https://api.dicebear.com/8.x/avataaars/svg?seed=plumber2",
    },
    {
      id: 3,
      name: "Modern Chicago Plumbing",
      rating: 4.7,
      reviews: 156,
      expertise: "Residential & Commercial",
      image: "https://api.dicebear.com/8.x/avataaars/svg?seed=plumber3",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Saved Plumbers</h1>
        <p className="mt-2 text-gray-600">Your favorite plumbers and services.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {savedPlumbers.map((plumber) => (
          <div key={plumber.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <img
                src={plumber.image}
                alt={plumber.name}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <button className="text-red-600 hover:bg-red-50 rounded-lg p-2">
                <FaHeart className="h-5 w-5" />
              </button>
            </div>
            <h3 className="mt-4 font-bold text-gray-900">{plumber.name}</h3>
            <p className="mt-1 text-sm text-gray-600">{plumber.expertise}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">⭐ {plumber.rating}</span>
              <span className="text-sm text-gray-500">({plumber.reviews} reviews)</span>
            </div>
            <button className="mt-4 w-full rounded-lg bg-[#FFD60A] px-4 py-2 font-medium text-gray-900 hover:bg-[#FFD60A]/90 transition">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
