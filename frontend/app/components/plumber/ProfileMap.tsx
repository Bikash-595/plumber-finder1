// import { Plumber } from "../find/types";

// export default function ProfileMap({ plumber }: { plumber: Plumber }) {
//   return (
//     <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
//       <h2 className="text-xl font-bold text-gray-900 mb-4">Service Areas</h2>
//       <div className="relative h-64 w-full rounded-xl overflow-hidden">
//         <iframe
//           src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316bbafdcd%3A0x1f1d0d5f8a9b6b5f!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1610000000000!5m2!1sen!2sus`}
//           width="100%"
//           height="100%"
//           style={{ border: 0 }}
//           allowFullScreen
//           loading="lazy"
//         ></iframe>
//       </div>
//       <div className="mt-3 flex flex-wrap gap-1">
//         {plumber.serviceAreas.map((area) => (
//           <span key={area} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
//             {area}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }













"use client";

import { useState } from "react";
import { Plumber } from "@/components/find/types";
import { FaMapPin } from "react-icons/fa";

export default function ProfileMap({ plumber }: { plumber: Plumber }) {
  const [isMapVisible, setIsMapVisible] = useState(false);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Service Areas</h2>
      <div className="relative h-64 w-full rounded-xl overflow-hidden mb-4">
        {isMapVisible ? (
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316bbafdcd%3A0x1f1d0d5f8a9b6b5f!2s${encodeURIComponent(plumber.location)}!5e0!3m2!1sen!2sus!4v1610000000000!5m2!1sen!2sus`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${plumber.companyName} service area map`}
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsMapVisible(true)}
            className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gray-100 text-center text-gray-700 transition hover:bg-gray-200"
          >
            <FaMapPin className="h-8 w-8 text-[#f7672c]" />
            <span className="text-sm font-semibold">Load service area map</span>
            <span className="max-w-xs text-xs text-gray-500">Google Maps is loaded only when you need it.</span>
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {plumber.serviceAreas.map((area) => (
          <span key={area} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
            <FaMapPin className="h-2 w-2 text-[#FFD60A]" />
            {area}
          </span>
        ))}
      </div>
    </div>
  );
}
