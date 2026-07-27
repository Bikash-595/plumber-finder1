
// import Image from "next/image";
// import Link from "next/link";
// import { Plumber } from "./types";
// import { FaStar, FaCheckCircle, FaClock, FaUsers, FaMapMarkerAlt, FaImages, FaVideo } from "react-icons/fa";

// interface Props {
//   plumbers: Plumber[];
// }

// export default function PlumberCardList({ plumbers }: Props) {
//   return (
//     <div className="space-y-4">
//       {plumbers.map((plumber) => (
//         <Link
//           key={plumber.id}
//           href={`/plumber/${plumber.id}`}
//           className="block rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-md"
//         >
//           <div className="flex flex-col sm:flex-row gap-5">
//             {/* Company Logo */}
//             <div className="relative h-24 w-24 rounded-full overflow-hidden flex-shrink-0">
//               <Image
//                 src={plumber.logo}
//                 alt={plumber.companyName}
//                 fill
//                 className="object-cover"
//               />
//             </div>

//             {/* Main Info */}
//             <div className="flex-1">
//               <div className="flex flex-wrap items-center justify-between gap-2">
//                 <div>
//                   <div className="flex items-center gap-2">
//                     <h3 className="text-lg font-bold text-gray-900">{plumber.companyName}</h3>
//                     {plumber.isVerified && <FaCheckCircle className="h-4 w-4 text-[#FFD60A]" />}
//                   </div>
//                   <div className="flex items-center gap-2 mt-1 flex-wrap">
//                     <FaStar className="h-4 w-4 text-[#FFD60A]" />
//                     <span className="font-medium">{plumber.rating}</span>
//                     <span className="text-gray-500">({plumber.reviewCount} reviews)</span>
//                     <span className="text-gray-400">•</span>
//                     <span className="flex items-center gap-1 text-gray-600">
//                       <FaMapMarkerAlt className="h-3 w-3" />
//                       {plumber.location}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-xl font-bold text-[#FFD60A]">{plumber.priceRange}</div>
//                   <div className="text-sm text-gray-500">{plumber.responseTime} response</div>
//                 </div>
//               </div>

//               <p className="mt-2 text-sm text-gray-600 line-clamp-2">{plumber.description}</p>

//               {/* Services Tags */}
//               <div className="mt-3 flex flex-wrap gap-2">
//                 {plumber.services.slice(0, 3).map((s) => (
//                   <span key={s} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
//                     {s}
//                   </span>
//                 ))}
//                 {plumber.services.length > 3 && (
//                   <span className="text-xs text-gray-400">+{plumber.services.length - 3}</span>
//                 )}
//               </div>

//               {/* Bottom Row: Team Size, Emergency Badge, Media Preview */}
//               <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
//                 <div className="flex items-center gap-1">
//                   <FaUsers className="h-3 w-3" />
//                   <span>{plumber.teamSize} plumbers</span>
//                 </div>
//                 {plumber.isEmergency && (
//                   <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
//                     🚨 24/7 Emergency
//                   </span>
//                 )}
//                 {/* Media badge with counts */}
//                 {plumber.media && (plumber.media.images.length > 0 || plumber.media.videos.length > 0) && (
//                   <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-blue-700">
//                     {plumber.media.images.length > 0 && <FaImages className="h-3 w-3" />}
//                     {plumber.media.videos.length > 0 && <FaVideo className="h-3 w-3" />}
//                     {plumber.media.images.length + plumber.media.videos.length}
//                   </span>
//                 )}
//               </div>
//             </div>

//             {/* Optional: Small thumbnail preview of first image (if available) */}
//             {plumber.media?.images?.[0] && (
//               <div className="hidden sm:block relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
//                 <Image
//                   src={plumber.media.images[0]}
//                   alt="Preview"
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//             )}
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// }




// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { Plumber } from "./types";
// import { FaStar, FaCheckCircle, FaMapMarkerAlt, FaTag, FaImage, FaVideo } from "react-icons/fa";

// interface Props {
//   plumbers: Plumber[];
// }

// export default function PlumberCardList({ plumbers }: Props) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       {plumbers.map((plumber) => {
//         const displayImage = plumber.media?.images?.[0] || plumber.logo;
//         const hasDiscount = !!plumber.discount;
//         const distance = plumber.distance || Math.floor(Math.random() * 30) + 1; // fallback

//         return (
//           <Link
//             key={plumber.id}
//             href={`/plumber/${plumber.id}`}
//             className="group block rounded-2xl border border-gray-200 bg-white overflow-hidden transition hover:shadow-lg hover:-translate-y-1"
//           >
//             {/* Image section (larger) */}
//             <div className="relative h-48 w-full bg-gray-100">
//               <Image
//                 src={displayImage}
//                 alt={plumber.companyName}
//                 fill
//                 className="object-cover transition group-hover:scale-105 duration-300"
//               />
//               {/* Discount badge (top-right) */}
//               {hasDiscount && (
//                 <div className="absolute top-3 right-3 z-10 rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white shadow-md flex items-center gap-1">
//                   <FaTag className="h-2 w-2" />
//                   {plumber.discount}
//                 </div>
//               )}
//               {/* Distance badge (bottom-left) */}
//               <div className="absolute bottom-3 left-3 z-10 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm flex items-center gap-1">
//                 <FaMapMarkerAlt className="h-2 w-2" />
//                 {distance} mi away
//               </div>
//             </div>

//             {/* Content section */}
//             <div className="p-4">
//               <div className="flex items-start justify-between gap-2">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2">
//                     <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{plumber.companyName}</h3>
//                     {plumber.isVerified && <FaCheckCircle className="h-4 w-4 text-[#FFD60A] flex-shrink-0" />}
//                   </div>
//                   <div className="flex items-center gap-2 mt-1 flex-wrap">
//                     <div className="flex items-center gap-1">
//                       <FaStar className="h-4 w-4 text-[#FFD60A]" />
//                       <span className="font-medium text-sm">{plumber.rating}</span>
//                       <span className="text-gray-500 text-xs">({plumber.reviewCount})</span>
//                     </div>
//                     <span className="text-gray-300">•</span>
//                     <span className="text-sm text-gray-600">{plumber.location.split(',')[0]}</span>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-xl font-bold text-[#FFD60A]">{plumber.priceRange}</div>
//                   <div className="text-xs text-gray-500">{plumber.responseTime}</div>
//                 </div>
//               </div>

//               {/* Services (first 3) */}
//               <div className="mt-3 flex flex-wrap gap-1">
//                 {plumber.services.slice(0, 3).map((s) => (
//                   <span key={s} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
//                     {s}
//                   </span>
//                 ))}
//                 {plumber.services.length > 3 && (
//                   <span className="text-xs text-gray-400">+{plumber.services.length - 3}</span>
//                 )}
//               </div>

//               {/* Media indicator & emergency */}
//               <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
//                 <div className="flex items-center gap-2">
//                   {plumber.media && (plumber.media.images.length > 0 || plumber.media.videos.length > 0) && (
//                     <span className="flex items-center gap-1">
//                       {plumber.media.images.length > 0 && <FaImage className="h-3 w-3" />}
//                       {plumber.media.videos.length > 0 && <FaVideo className="h-3 w-3" />}
//                       <span>{plumber.media.images.length + plumber.media.videos.length} media</span>
//                     </span>
//                   )}
//                   {plumber.isEmergency && (
//                     <span className="rounded-full bg-red-100 px-2 py-0.5 font-semibold text-red-600">
//                       🚨 24/7
//                     </span>
//                   )}
//                 </div>
//                 <span className="text-gray-400">{plumber.teamSize} plumbers</span>
//               </div>
//             </div>
//           </Link>
//         );
//       })}
//     </div>
//   );
// }









"use client";

import Image from "next/image";
import Link from "next/link";
import { Plumber } from "./types";
import { FaCheckCircle, FaClock, FaUsers, FaMapMarkerAlt, FaImages, FaVideo, FaTag, FaLocationArrow } from "react-icons/fa";
import StarRating from "@/components/ui/StarRating";

interface Props {
  plumbers: Plumber[];
}

// Helper to format distance
const formatDistance = (miles: number) => {
  if (miles < 1) return `${Math.round(miles * 10) / 10} mi`;
  return `${Math.round(miles)} mi`;
};

export default function PlumberCardList({ plumbers }: Props) {
  return (
    <div className="space-y-4">
      {plumbers.map((plumber) => (
        <Link
          key={plumber.id}
          href={`/plumber/${plumber.id}`}
          className="block rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-md"
        >
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Company Logo */}
            <div className="relative h-24 w-24 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={plumber.logo}
                alt={plumber.companyName}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>

            {/* Main Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-gray-900">{plumber.companyName}</h3>
                    {plumber.isVerified && <FaCheckCircle className="h-4 w-4 text-[#FFD60A]" />}
                    {plumber.discount && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                        <FaTag className="h-2 w-2" /> {plumber.discount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {/* ⭐ Improved rating display with stars */}
                    <div className="flex items-center gap-1">
                      <StarRating rating={plumber.rating} size={14} />
                      <span className="text-sm font-medium text-gray-800">{plumber.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">({plumber.reviewCount} reviews)</span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <FaMapMarkerAlt className="h-3 w-3" />
                      {plumber.location.split(',')[0]}
                    </span>
                    {plumber.distance && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <FaLocationArrow className="h-3 w-3" />
                        {formatDistance(plumber.distance)} away
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-[#FFD60A]">{plumber.priceRange}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-1 justify-end">
                    <FaClock className="h-3 w-3" />
                    {plumber.responseTime}
                  </div>
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{plumber.description}</p>

              {/* Services Tags */}
              <div className="mt-3 flex flex-wrap gap-2">
                {plumber.services.slice(0, 3).map((s) => (
                  <span key={s} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                    {s}
                  </span>
                ))}
                {plumber.services.length > 3 && (
                  <span className="text-xs text-gray-400">+{plumber.services.length - 3}</span>
                )}
              </div>

              {/* Bottom Row: Team Size, Emergency Badge, Media Preview */}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <FaUsers className="h-3 w-3" />
                  <span>{plumber.teamSize} plumbers</span>
                </div>
                {plumber.isEmergency && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                    🚨 24/7 Emergency
                  </span>
                )}
                {/* Media badge with counts */}
                {plumber.media && (plumber.media.images.length > 0 || plumber.media.videos.length > 0) && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-blue-700">
                    {plumber.media.images.length > 0 && <FaImages className="h-3 w-3" />}
                    {plumber.media.videos.length > 0 && <FaVideo className="h-3 w-3" />}
                    {plumber.media.images.length + plumber.media.videos.length}
                  </span>
                )}
              </div>
            </div>

            {/* Optional: Small thumbnail preview of first image (if available) */}
            {plumber.media?.images?.[0] && (
              <div className="hidden sm:block relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={plumber.media.images[0]}
                  alt="Preview"
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
