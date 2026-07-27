"use client";

import { useState } from "react";

export default function ContactMap() {
  const [isMapVisible, setIsMapVisible] = useState(false);

  return (
    <div className="rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-lg">
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 font-heading flex items-center gap-2">
          <span>📍</span> Find Us
        </h2>
        <p className="text-sm text-gray-500">Visit our headquarters or find a plumber near you.</p>
      </div>
      <div className="relative h-80 w-full">
        {isMapVisible ? (
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316bbafdcd%3A0x1f1d0d5f8a9b6b5f!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1610000000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Plumber Finder headquarters map"
            className="grayscale-[20%]"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsMapVisible(true)}
            className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gray-100 text-center text-gray-700 transition hover:bg-gray-200"
          >
            <span className="text-3xl">📍</span>
            <span className="text-sm font-semibold">Load map</span>
            <span className="max-w-xs text-xs text-gray-500">Google Maps loads after interaction to keep the page fast.</span>
          </button>
        )}
      </div>
    </div>
  );
}
