

// import Image from "next/image";
// import Link from "next/link";
// import { Plumber } from "./types";
// import { FaStar, FaCheckCircle, FaClock, FaUsers } from "react-icons/fa";

// interface Props {
//   plumbers: Plumber[];
// }

// export default function PlumberCardGrid({ plumbers }: Props) {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {plumbers.map((plumber) => (
//         <Link
//           key={plumber.id}
//           href={`/plumber/${plumber.id}`}
//           className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-lg hover:-translate-y-1"
//         >
//           <div className="flex items-start gap-4">
//             <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
//               <Image
//                 src={plumber.logo}
//                 alt={plumber.companyName}
//                 fill
//                 className="object-cover"
//               />
//             </div>
//             <div className="flex-1">
//               <div className="flex items-center gap-2">
//                 <h3 className="font-bold text-gray-900">{plumber.companyName}</h3>
//                 {plumber.isVerified && <FaCheckCircle className="h-4 w-4 text-[#FFD60A]" />}
//               </div>
//               <div className="flex items-center gap-1 mt-1">
//                 <FaStar className="h-3 w-3 text-[#FFD60A]" />
//                 <span className="text-sm font-medium">{plumber.rating}</span>
//                 <span className="text-xs text-gray-500">({plumber.reviewCount})</span>
//               </div>
//             </div>
//           </div>
//           <div className="mt-3 flex flex-wrap gap-1">
//             {plumber.services.slice(0, 2).map((s) => (
//               <span key={s} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
//                 {s}
//               </span>
//             ))}
//             {plumber.services.length > 2 && (
//               <span className="text-xs text-gray-400">+{plumber.services.length - 2}</span>
//             )}
//           </div>
//           <div className="mt-3 flex items-center justify-between text-sm">
//             <span className="font-bold text-[#FFD60A]">{plumber.priceRange}</span>
//             <span className="flex items-center gap-1 text-gray-500">
//               <FaClock className="h-3 w-3" />
//               {plumber.responseTime}
//             </span>
//           </div>
//           <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
//             <FaUsers className="h-3 w-3" />
//             <span>{plumber.teamSize} plumbers</span>
//           </div>
//           {plumber.isEmergency && (
//             <div className="mt-2 rounded-full bg-red-100 px-2 py-0.5 text-center text-xs font-semibold text-red-600">
//               🚨 Emergency 24/7
//             </div>
//           )}
//         </Link>
//       ))}
//     </div>
//   );
// }

















// // components/find/PlumberCardGrid.tsx
// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { Plumber } from "./types";
// import { FaCheckCircle, FaMapMarkerAlt, FaTag, FaImage, FaVideo, FaClock, FaUsers } from "react-icons/fa";
// import StarRating from "@/components/ui/StarRating";

// interface Props {
//   plumbers: Plumber[];
// }

// export default function PlumberCardGrid({ plumbers }: Props) {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {plumbers.map((plumber) => {
//         const displayImage = plumber.media?.images?.[0] || plumber.logo;
//         const hasDiscount = !!plumber.discount;
//         const distance = plumber.distance || Math.floor(Math.random() * 30) + 1; // fallback if not provided

//         return (
//           <Link
//             key={plumber.id}
//             href={`/plumber/${plumber.id}`}
//             className="group block rounded-2xl border border-gray-200 bg-white overflow-hidden transition hover:shadow-lg hover:-translate-y-1"
//           >
//             {/* Image section */}
//             <div className="relative h-48 w-full bg-gray-100">
//               <Image
//                 src={displayImage}
//                 alt={plumber.companyName}
//                 fill
//                 className="object-cover transition group-hover:scale-105 duration-300"
//               />
//               {hasDiscount && (
//                 <div className="absolute top-3 right-3 z-10 rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white shadow-md flex items-center gap-1">
//                   <FaTag className="h-2 w-2" />
//                   {plumber.discount}
//                 </div>
//               )}
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
//                     <h3 className="font-bold text-gray-900 line-clamp-1">{plumber.companyName}</h3>
//                     {plumber.isVerified && <FaCheckCircle className="h-4 w-4 text-[#FFD60A] flex-shrink-0" />}
//                   </div>
//                   <div className="flex items-center gap-2 mt-1 flex-wrap">
//                     {/* ⭐ Improved rating display with stars */}
//                     <div className="flex items-center gap-1">
//                       <StarRating rating={plumber.rating} size={12} />
//                       <span className="text-sm font-medium text-gray-800">{plumber.rating}</span>
//                       <span className="text-xs text-gray-500">({plumber.reviewCount})</span>
//                     </div>
//                     <span className="text-gray-300">•</span>
//                     <span className="text-xs text-gray-600">{plumber.location.split(',')[0]}</span>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-lg font-bold text-[#FFD60A]">{plumber.priceRange}</div>
//                   <div className="text-xs text-gray-500 flex items-center gap-1 justify-end">
//                     <FaClock className="h-3 w-3" />
//                     {plumber.responseTime}
//                   </div>
//                 </div>
//               </div>

//               {/* Services tags */}
//               <div className="mt-3 flex flex-wrap gap-1">
//                 {plumber.services.slice(0, 2).map((s) => (
//                   <span key={s} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
//                     {s}
//                   </span>
//                 ))}
//                 {plumber.services.length > 2 && (
//                   <span className="text-xs text-gray-400">+{plumber.services.length - 2}</span>
//                 )}
//               </div>

//               {/* Bottom row: media, emergency, team size */}
//               <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
//                 <div className="flex items-center gap-2">
//                   {plumber.media && (plumber.media.images.length > 0 || plumber.media.videos.length > 0) && (
//                     <span className="flex items-center gap-1">
//                       {plumber.media.images.length > 0 && <FaImage className="h-3 w-3" />}
//                       {plumber.media.videos.length > 0 && <FaVideo className="h-3 w-3" />}
//                       <span>{plumber.media.images.length + plumber.media.videos.length}</span>
//                     </span>
//                   )}
//                   {plumber.isEmergency && (
//                     <span className="rounded-full bg-red-100 px-2 py-0.5 font-semibold text-red-600">
//                       🚨 24/7
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <FaUsers className="h-3 w-3" />
//                   <span>{plumber.teamSize}</span>
//                 </div>
//               </div>
//             </div>
//           </Link>
//         );
//       })}
//     </div>
//   );
// }
































// // components/find/PlumberCardGrid.tsx
// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { Plumber } from "./types";
// import { FaCheckCircle, FaMapMarkerAlt, FaTag, FaImage, FaVideo, FaClock, FaUsers } from "react-icons/fa";
// import StarRating from "@/components/ui/StarRating";

// interface Props {
//   plumbers: Plumber[];
// }

// export default function PlumberCardGrid({ plumbers }: Props) {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {plumbers.map((plumber) => {
//         const displayImage = plumber.media?.images?.[0] || plumber.logo;
//         const hasDiscount = !!plumber.discount;
//         const distance = plumber.distance || Math.floor(Math.random() * 30) + 1;

//         return (
//           <Link
//             key={plumber.id}
//             href={`/plumber/${plumber.id}`}
//             className="group block rounded-2xl border border-gray-200 bg-white overflow-hidden transition hover:shadow-lg hover:-translate-y-1"
//           >
//             {/* Image section */}
//             <div className="relative h-48 w-full bg-gray-100">
//               <Image
//                 src={displayImage}
//                 alt={plumber.companyName}
//                 fill
//                 className="object-cover transition group-hover:scale-105 duration-300"
//               />
//               {hasDiscount && (
//                 <div className="absolute top-3 right-3 z-10 rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white shadow-md flex items-center gap-1">
//                   <FaTag className="h-2 w-2" />
//                   {plumber.discount}
//                 </div>
//               )}
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
//                     <h3 className="font-bold text-gray-900 line-clamp-1">{plumber.companyName}</h3>
//                     {plumber.isVerified && <FaCheckCircle className="h-4 w-4 text-[#FFD60A] flex-shrink-0" />}
//                   </div>
//                   <div className="flex items-center gap-2 mt-1 flex-wrap">
//                     <div className="flex items-center gap-1">
//                       <StarRating rating={plumber.rating} size={12} />
//                       <span className="text-sm font-medium text-gray-800">{plumber.rating}</span>
//                       <span className="text-xs text-gray-500">({plumber.reviewCount})</span>
//                     </div>
//                     <span className="text-gray-300">•</span>
//                     <span className="text-xs text-gray-600">
//                       {plumber.location?.split(',')[0] || plumber.city || ''}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-lg font-bold text-[#FFD60A]">{plumber.priceRange}</div>
//                   <div className="text-xs text-gray-500 flex items-center gap-1 justify-end">
//                     <FaClock className="h-3 w-3" />
//                     {plumber.responseTime}
//                   </div>
//                 </div>
//               </div>

//               {/* Services tags */}
//               <div className="mt-3 flex flex-wrap gap-1">
//                 {plumber.services.slice(0, 2).map((s) => (
//                   <span key={s} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
//                     {s}
//                   </span>
//                 ))}
//                 {plumber.services.length > 2 && (
//                   <span className="text-xs text-gray-400">+{plumber.services.length - 2}</span>
//                 )}
//               </div>

//               {/* Bottom row: media, emergency, team size */}
//               <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
//                 <div className="flex items-center gap-2">
//                   {plumber.media && (plumber.media.images.length > 0 || plumber.media.videos.length > 0) && (
//                     <span className="flex items-center gap-1">
//                       {plumber.media.images.length > 0 && <FaImage className="h-3 w-3" />}
//                       {plumber.media.videos.length > 0 && <FaVideo className="h-3 w-3" />}
//                       <span>{plumber.media.images.length + plumber.media.videos.length}</span>
//                     </span>
//                   )}
//                   {plumber.isEmergency && (
//                     <span className="rounded-full bg-red-100 px-2 py-0.5 font-semibold text-red-600">
//                       🚨 24/7
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <FaUsers className="h-3 w-3" />
//                   <span>{plumber.teamSize}</span>
//                 </div>
//               </div>
//             </div>
//           </Link>
//         );
//       })}
//     </div>
//   );
// }



















// components/find/PlumberCardGrid.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Plumber } from "./types";
import { FaCheckCircle, FaMapMarkerAlt, FaTag, FaImage, FaVideo, FaClock, FaUsers } from "react-icons/fa";
import StarRating from "@/components/ui/StarRating";

interface Props {
  plumbers: Plumber[];
}

export default function PlumberCardGrid({ plumbers }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      {plumbers.map((plumber) => {
        const displayImage = plumber.media?.images?.[0] || plumber.logo || "";
        const hasDiscount = !!plumber.discount;
        const fallbackDistance = (Number(plumber.id) % 30) + 1;
        const distance = plumber.distance || fallbackDistance;

        return (
          <Link
            key={plumber.id}
            href={`/plumber/${plumber.id}`}
            className="group block min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg sm:rounded-2xl"
          >
            {/* Image section */}
            <div className="relative h-32 w-full bg-gray-100 sm:h-44 lg:h-48">
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt={plumber.companyName || "Company"}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition group-hover:scale-105 duration-300"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                  No image
                </div>
              )}
              {hasDiscount && (
                <div className="absolute right-2 top-2 z-10 max-w-[calc(100%-1rem)] truncate rounded-full bg-green-500 px-2 py-1 text-[10px] font-bold text-white shadow-md sm:right-3 sm:top-3 sm:text-xs">
                  <FaTag className="h-2 w-2" />
                  {plumber.discount}
                </div>
              )}
              <div className="absolute bottom-2 left-2 z-10 flex max-w-[calc(100%-1rem)] items-center gap-1 truncate rounded-full bg-black/60 px-2 py-1 text-[10px] text-white backdrop-blur-sm sm:bottom-3 sm:left-3 sm:text-xs">
                <FaMapMarkerAlt className="h-2 w-2" />
                {distance} mi away
              </div>
            </div>

            {/* Content section */}
            <div className="p-3 sm:p-4">
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="line-clamp-1 text-sm font-bold text-gray-900 sm:text-base">{plumber.companyName || "Unknown"}</h3>
                    {plumber.isVerified && <FaCheckCircle className="h-3.5 w-3.5 shrink-0 text-[#FFD60A] sm:h-4 sm:w-4" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <div className="flex items-center gap-1">
                      <StarRating rating={plumber.rating ?? 0} size={12} />
                      <span className="text-sm font-medium text-gray-800">{plumber.rating ?? 0}</span>
                      <span className="text-xs text-gray-500">({plumber.reviewCount ?? 0})</span>
                    </div>
                    <span className="hidden text-gray-300 sm:inline">•</span>
                    <span className="hidden text-xs text-gray-600 sm:inline">
                      {plumber.location?.split(",")[0] || plumber.city || ""}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 sm:block sm:text-right">
                  <div className="text-sm font-bold text-[#FFD60A] sm:text-lg">{plumber.priceRange || ""}</div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 sm:justify-end sm:text-xs">
                    <FaClock className="h-3 w-3" />
                    {plumber.responseTime || ""}
                  </div>
                </div>
              </div>

              {/* Services tags */}
              <div className="mt-2 flex flex-wrap gap-1 sm:mt-3">
                {(plumber.services ?? []).slice(0, 2).map((s) => (
                  <span key={s} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                    {s}
                  </span>
                ))}
                {(plumber.services ?? []).length > 2 && (
                  <span className="text-xs text-gray-400">+{(plumber.services ?? []).length - 2}</span>
                )}
              </div>

              {/* Bottom row: media, emergency, team size */}
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500 sm:mt-3 sm:text-xs">
                <div className="flex min-w-0 items-center gap-2">
                  {plumber.media &&
                    ((plumber.media.images?.length ?? 0) > 0 || (plumber.media.videos?.length ?? 0) > 0) && (
                      <span className="flex items-center gap-1">
                        {(plumber.media.images?.length ?? 0) > 0 && <FaImage className="h-3 w-3" />}
                        {(plumber.media.videos?.length ?? 0) > 0 && <FaVideo className="h-3 w-3" />}
                        <span>{(plumber.media.images?.length ?? 0) + (plumber.media.videos?.length ?? 0)}</span>
                      </span>
                    )}
                  {plumber.isEmergency && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 font-semibold text-red-600">
                      🚨 24/7
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <FaUsers className="h-3 w-3" />
                  <span>{plumber.teamSize ?? 0}</span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}






// // components/find/PlumberCardGrid.tsx
// "use client";

// import { useState, useRef, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Plumber } from "./types";
// import { FaCheckCircle, FaMapMarkerAlt, FaTag, FaImage, FaVideo, FaClock, FaUsers, FaPlay } from "react-icons/fa";
// import StarRating from "@/components/ui/StarRating";

// interface Props {
//   plumbers: Plumber[];
// }

// // Helper to format distance
// const formatDistance = (miles: number) => {
//   if (miles < 1) return `${Math.round(miles * 10) / 10} mi`;
//   return `${Math.round(miles)} mi`;
// };

// export default function PlumberCardGrid({ plumbers }: Props) {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {plumbers.map((plumber) => {
//         const images = plumber.media?.images || [];
//         const videos = plumber.media?.videos || [];
//         const hasMultipleImages = images.length > 1;
//         const hasVideo = videos.length > 0;
//         const discount = plumber.discount;
//         const distance = plumber.distance || Math.floor(Math.random() * 30) + 1;

//         // Carousel state for this card
//         const [currentIndex, setCurrentIndex] = useState(0);
//         const [isPaused, setIsPaused] = useState(false);
//         const intervalRef = useRef<NodeJS.Timeout | null>(null);

//         // Auto‑slide only if multiple images
//         useEffect(() => {
//           if (!hasMultipleImages) return;
//           if (isPaused) {
//             if (intervalRef.current) clearInterval(intervalRef.current);
//             return;
//           }
//           intervalRef.current = setInterval(() => {
//             setCurrentIndex((prev) => (prev + 1) % images.length);
//           }, 4000);
//           return () => {
//             if (intervalRef.current) clearInterval(intervalRef.current);
//           };
//         }, [images.length, isPaused, hasMultipleImages]);

//         const currentImage = images[currentIndex] || plumber.logo;

//         return (
//           <Link
//             key={plumber.id}
//             href={`/plumber/${plumber.id}`}
//             className="group block rounded-2xl border border-gray-200 bg-white overflow-hidden transition hover:shadow-lg hover:-translate-y-1"
//             onMouseEnter={() => setIsPaused(true)}
//             onMouseLeave={() => setIsPaused(false)}
//           >
//             {/* Image / Carousel section */}
//             <div className="relative h-48 w-full bg-gray-100">
//               <Image
//                 src={currentImage}
//                 alt={plumber.companyName}
//                 fill
//                 className="object-cover transition group-hover:scale-105 duration-300"
//               />
//               {/* Discount badge */}
//               {discount && (
//                 <div className="absolute top-3 right-3 z-10 rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white shadow-md flex items-center gap-1">
//                   <FaTag className="h-2 w-2" />
//                   {discount}
//                 </div>
//               )}
//               {/* Distance badge */}
//               <div className="absolute bottom-3 left-3 z-10 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm flex items-center gap-1">
//                 <FaMapMarkerAlt className="h-2 w-2" />
//                 {formatDistance(distance)} away
//               </div>
//               {/* Carousel dots (if multiple images) */}
//               {hasMultipleImages && (
//                 <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 flex gap-1">
//                   {images.map((_, idx) => (
//                     <button
//                       key={idx}
//                       className={`h-1.5 w-1.5 rounded-full transition-all ${
//                         idx === currentIndex ? "bg-white w-3" : "bg-white/50"
//                       }`}
//                       onClick={(e) => {
//                         e.preventDefault();
//                         setCurrentIndex(idx);
//                       }}
//                     />
//                   ))}
//                 </div>
//               )}
//               {/* Video indicator overlay */}
//               {hasVideo && (
//                 <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
//                   <div className="rounded-full bg-black/60 p-2">
//                     <FaPlay className="h-6 w-6 text-white" />
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Content section */}
//             <div className="p-4">
//               <div className="flex items-start justify-between gap-2">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2">
//                     <h3 className="font-bold text-gray-900 line-clamp-1">{plumber.companyName}</h3>
//                     {plumber.isVerified && <FaCheckCircle className="h-4 w-4 text-[#FFD60A] flex-shrink-0" />}
//                   </div>
//                   <div className="flex items-center gap-2 mt-1 flex-wrap">
//                     <StarRating rating={plumber.rating} size={12} />
//                     <span className="text-xs text-gray-500">({plumber.reviewCount})</span>
//                     <span className="text-gray-300">•</span>
//                     <span className="text-xs text-gray-600">{plumber.location.split(',')[0]}</span>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-lg font-bold text-[#FFD60A]">{plumber.priceRange}</div>
//                   <div className="text-xs text-gray-500 flex items-center gap-1 justify-end">
//                     <FaClock className="h-3 w-3" />
//                     {plumber.responseTime}
//                   </div>
//                 </div>
//               </div>

//               {/* Services tags */}
//               <div className="mt-3 flex flex-wrap gap-1">
//                 {plumber.services.slice(0, 2).map((s) => (
//                   <span key={s} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
//                     {s}
//                   </span>
//                 ))}
//                 {plumber.services.length > 2 && (
//                   <span className="text-xs text-gray-400">+{plumber.services.length - 2}</span>
//                 )}
//               </div>

//               {/* Bottom row: media counts, emergency, team size */}
//               <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
//                 <div className="flex items-center gap-2">
//                   {(images.length > 0 || videos.length > 0) && (
//                     <span className="flex items-center gap-1">
//                       {images.length > 0 && <FaImage className="h-3 w-3" />}
//                       {videos.length > 0 && <FaVideo className="h-3 w-3" />}
//                       <span>{images.length + videos.length}</span>
//                     </span>
//                   )}
//                   {plumber.isEmergency && (
//                     <span className="rounded-full bg-red-100 px-2 py-0.5 font-semibold text-red-600">
//                       🚨 24/7
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <FaUsers className="h-3 w-3" />
//                   <span>{plumber.teamSize}</span>
//                 </div>
//               </div>
//             </div>
//           </Link>
//         );
//       })}
//     </div>
//   );
// }









// "use client";

// import { useState, useRef, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   FaCheckCircle,
//   FaMapMarkerAlt,
//   FaTag,
//   FaImage,
//   FaVideo,
//   FaClock,
//   FaUsers,
//   FaPlay,
// } from "react-icons/fa";
// import StarRating from "@/components/ui/StarRating";

// export default function PlumberCard({ plumber }: any) {
//   const images = plumber.media?.images || [];
//   const videos = plumber.media?.videos || [];

//   const hasMultipleImages = images.length > 1;
//   const hasVideo = videos.length > 0;

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   // ✅ Optimized auto-slide
//   useEffect(() => {
//     if (!hasMultipleImages || isPaused) return;

//     intervalRef.current = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % images.length);
//     }, 4000);

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [isPaused, images.length, hasMultipleImages]);

//   const currentImage = images[currentIndex] || plumber.logo;

//   return (
//     <Link
//       href={`/plumber/${plumber.id}`}
//       className="group block rounded-2xl border bg-white overflow-hidden hover:shadow-lg"
//       onMouseEnter={() => setIsPaused(true)}
//       onMouseLeave={() => setIsPaused(false)}
//     >
//       {/* IMAGE */}
//       <div className="relative h-48 w-full bg-gray-100">
//         <Image
//           src={currentImage}
//           alt={plumber.companyName}
//           fill
//           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//           className="object-cover"
//           quality={60}
//           loading="lazy"
//         />

//         {/* Discount */}
//         {plumber.discount && (
//           <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
//             {plumber.discount}
//           </div>
//         )}

//         {/* Distance */}
//         <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
//           {plumber.distance || "Nearby"}
//         </div>

//         {/* Dots */}
//         {hasMultipleImages && (
//           <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
//             {images.map((_: any, idx: number) => (
//               <button
//                 key={idx}
//                 onClick={(e) => {
//                   e.preventDefault();
//                   setCurrentIndex(idx);
//                 }}
//                 className={`h-1.5 w-1.5 rounded-full ${
//                   idx === currentIndex ? "bg-white w-3" : "bg-white/50"
//                 }`}
//               />
//             ))}
//           </div>
//         )}

//         {/* Video overlay */}
//         {hasVideo && (
//           <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100">
//             <FaPlay className="text-white text-xl" />
//           </div>
//         )}
//       </div>

//       {/* CONTENT */}
//       <div className="p-4">
//         <h3 className="font-bold">{plumber.companyName}</h3>

//         <div className="flex items-center gap-2 text-xs text-gray-500">
//           <StarRating rating={plumber.rating} size={12} />
//           <span>({plumber.reviewCount})</span>
//         </div>

//         <div className="mt-2 text-xs text-gray-600">
//           {plumber.services?.slice(0, 2).join(", ")}
//         </div>

//         <div className="mt-3 flex justify-between text-xs text-gray-500">
//           <span>{images.length + videos.length} media</span>
//           <span>{plumber.teamSize}</span>
//         </div>
//       </div>
//     </Link>
//   );
// }
