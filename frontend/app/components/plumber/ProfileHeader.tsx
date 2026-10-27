// import Image from "next/image";
// import { Plumber } from "../find/types";
// import { FaStar, FaCheckCircle, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe } from "react-icons/fa";

// export default function ProfileHeader({ plumber }: { plumber: Plumber }) {
//   return (
//     <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
//       <div className="flex flex-col sm:flex-row gap-6">
//         <div className="relative h-32 w-32 rounded-full overflow-hidden">
//           <Image src={plumber.image} alt={plumber.name} fill className="object-cover" />
//         </div>
//         <div className="flex-1">
//           <div className="flex flex-wrap items-center justify-between gap-2">
//             <div>
//               <div className="flex items-center gap-2">
//                 <h1 className="text-2xl font-bold text-gray-900">{plumber.companyName}</h1>
//                 {plumber.isVerified && <FaCheckCircle className="h-5 w-5 text-[#FFD60A]" />}
//               </div>
//               <div className="flex items-center gap-2 mt-1">
//                 <FaStar className="text-[#FFD60A]" />
//                 <span className="font-semibold">{plumber.rating}</span>
//                 <span className="text-gray-500">({plumber.reviewCount} reviews)</span>
//                 <span className="text-gray-400">•</span>
//                 <span className="flex items-center gap-1 text-gray-600">
//                   <FaMapMarkerAlt className="h-3 w-3" />
//                   {plumber.location}
//                 </span>
//               </div>
//             </div>
//             {plumber.isEmergency && (
//               <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
//                 🚨 24/7 Emergency
//               </span>
//             )}
//           </div>
//           <p className="mt-3 text-gray-700">{plumber.description}</p>
//           <div className="mt-4 flex flex-wrap gap-4 text-sm">
//             <a href={`tel:${plumber.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-[#FFD60A]">
//               <FaPhone className="h-4 w-4" />
//               {plumber.phone}
//             </a>
//             <a href={`mailto:${plumber.email}`} className="flex items-center gap-2 text-gray-600 hover:text-[#FFD60A]">
//               <FaEnvelope className="h-4 w-4" />
//               {plumber.email}
//             </a>
//             {plumber.website && (
//               <a href={plumber.website} target="_blank" className="flex items-center gap-2 text-gray-600 hover:text-[#FFD60A]">
//                 <FaGlobe className="h-4 w-4" />
//                 Website
//               </a>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }











// import Image from "next/image";
// import { Plumber } from "@/components/find/types";
// import { FaStar, FaCheckCircle, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaUsers, FaUserTie } from "react-icons/fa";

// export default function ProfileHeader({ plumber }: { plumber: Plumber }) {
//   return (
//     <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
//       <div className="flex flex-col sm:flex-row gap-6">
//         <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
//           <Image src={plumber.logo} alt={plumber.companyName} fill className="object-cover" />
//         </div>
//         <div className="flex-1">
//           <div className="flex flex-wrap items-center justify-between gap-2">
//             <div>
//               <div className="flex items-center gap-2">
//                 <h1 className="text-2xl font-bold text-gray-900">{plumber.companyName}</h1>
//                 {plumber.isVerified && <FaCheckCircle className="h-5 w-5 text-[#FFD60A]" />}
//               </div>
//               <div className="flex items-center gap-2 mt-1 flex-wrap">
//                 <FaStar className="text-[#FFD60A]" />
//                 <span className="font-semibold">{plumber.rating}</span>
//                 <span className="text-gray-500">({plumber.reviewCount} reviews)</span>
//                 <span className="text-gray-400">•</span>
//                 <span className="flex items-center gap-1 text-gray-600">
//                   <FaMapMarkerAlt className="h-3 w-3" /> {plumber.location}
//                 </span>
//               </div>
//             </div>
//             {plumber.isEmergency && (
//               <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
//                 🚨 24/7 Emergency
//               </span>
//             )}
//           </div>
//           <p className="mt-3 text-gray-700">{plumber.description}</p>
//           <div className="mt-4 flex flex-wrap gap-4 text-sm">
//             <div className="flex items-center gap-1 text-gray-500">
//               <FaUserTie className="h-4 w-4" />
//               <span>Owner: {plumber.ownerName}</span>
//             </div>
//             <div className="flex items-center gap-1 text-gray-500">
//               <FaUsers className="h-4 w-4" />
//               <span>{plumber.teamSize} licensed plumbers</span>
//             </div>
//             <a href={`tel:${plumber.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-[#FFD60A]">
//               <FaPhone className="h-4 w-4" /> {plumber.phone}
//             </a>
//             <a href={`mailto:${plumber.email}`} className="flex items-center gap-2 text-gray-600 hover:text-[#FFD60A]">
//               <FaEnvelope className="h-4 w-4" /> {plumber.email}
//             </a>
//             {plumber.website && (
//               <a href={plumber.website} target="_blank" className="flex items-center gap-2 text-gray-600 hover:text-[#FFD60A]">
//                 <FaGlobe className="h-4 w-4" /> Website
//               </a>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }








// import Image from "next/image";
// import { Plumber } from "@/components/find/types";
// import {
//   FaStar,
//   FaCheckCircle,
//   FaMapMarkerAlt,
//   FaPhone,
//   FaEnvelope,
//   FaGlobe,
//   FaUsers,
//   FaUserTie,
// } from "react-icons/fa";

// export default function ProfileHeader({ plumber }: { plumber: Plumber }) {
//   return (
//     <div className="rounded-2xl bg-white p-6 shadow-md border border-gray-200">
//       <div className="flex flex-col sm:flex-row gap-6">
        
//         {/* Logo */}
//         <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border">
//           <Image
//             src={plumber.logo}
//             alt={plumber.companyName}
//             fill
//             sizes="128px"
//             className="object-cover"
//           />
//         </div>

//         {/* Content */}
//         <div className="flex-1">
          
//           {/* Top Section */}
//           <div className="flex flex-wrap items-start justify-between gap-3">
            
//             {/* Name + Rating */}
//             <div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 <h1 className="text-2xl font-bold text-black">
//                   {plumber.companyName}
//                 </h1>

//                 {plumber.isVerified && (
//                   <FaCheckCircle className="h-5 w-5 text-yellow-500" />
//                 )}
//               </div>

//               {/* Rating + Location */}
//               <div className="flex items-center gap-3 mt-2 flex-wrap text-black">
//                 <div className="flex items-center gap-1">
//                   <FaStar className="text-yellow-500" />
//                   <span className="font-semibold">
//                     {plumber.rating}
//                   </span>
//                   <span className="text-sm">
//                     ({plumber.reviewCount} reviews)
//                   </span>
//                 </div>

//                 <span>•</span>

//                 <div className="flex items-center gap-1">
//                   <FaMapMarkerAlt className="h-4 w-4" />
//                   <span>{plumber.location}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Emergency Badge */}
//             {plumber.isEmergency && (
//               <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
//                 🚨 24/7 Emergency
//               </span>
//             )}
//           </div>

//           {/* Description */}
//           <p className="mt-4 text-black leading-relaxed">
//             {plumber.description}
//           </p>

//           {/* Info Section */}
//           <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-black">
            
//             <div className="flex items-center gap-2">
//               <FaUserTie />
//               <span>Owner: {plumber.ownerName}</span>
//             </div>

//             <div className="flex items-center gap-2">
//               <FaUsers />
//               <span>{plumber.teamSize} licensed plumbers</span>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="mt-6 flex flex-wrap gap-3">
            
//             <a
//               href={`tel:${plumber.phone}`}
//               className="flex items-center gap-2 px-4 py-2 rounded-lg border text-black hover:bg-gray-100 transition"
//             >
//               <FaPhone />
//               Call
//             </a>

//             <a
//               href={`mailto:${plumber.email}`}
//               className="flex items-center gap-2 px-4 py-2 rounded-lg border text-black hover:bg-gray-100 transition"
//             >
//               <FaEnvelope />
//               Email
//             </a>

//             {plumber.website && (
//               <a
//                 href={plumber.website}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center gap-2 px-4 py-2 rounded-lg border text-black hover:bg-gray-100 transition"
//               >
//                 <FaGlobe />
//                 Website
//               </a>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }








// import Image from "next/image";
// import { Plumber } from "@/components/find/types";
// import {
//   FaStar,
//   FaCheckCircle,
//   FaMapMarkerAlt,
//   FaPhone,
//   FaEnvelope,
//   FaGlobe,
//   FaUsers,
//   FaUserTie,
//   FaFacebook,
//   FaTwitter,
//   FaInstagram,
//   FaLinkedin,
// } from "react-icons/fa";

// export default function ProfileHeader({ plumber }: { plumber: Plumber }) {
//   return (
//     <div className="rounded-2xl bg-white p-6 shadow-md border border-gray-200">
//       <div className="flex flex-col sm:flex-row gap-6">
        
//         {/* Logo */}
//         <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border">
//           <Image
//             src={plumber.logo}
//             alt={plumber.companyName}
//             fill
//             sizes="128px"
//             className="object-cover"
//           />
//         </div>

//         {/* Content */}
//         <div className="flex-1">
          
//           {/* Top Section */}
//           <div className="flex flex-wrap items-start justify-between gap-3">
            
//             {/* Name + Rating */}
//             <div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 <h1 className="text-2xl font-bold text-gray-800">
//                   {plumber.companyName}
//                 </h1>

//                 {plumber.isVerified && (
//                   <FaCheckCircle className="h-5 w-5 text-[#FFD60A]" />
//                 )}
//               </div>

//               {/* Rating + Location */}
//               <div className="flex items-center gap-3 mt-2 flex-wrap text-gray-600">
//                 <div className="flex items-center gap-1">
//                   <FaStar className="text-[#FFD60A]" />
//                   <span className="font-semibold text-gray-800">
//                     {plumber.rating}
//                   </span>
//                   <span className="text-sm text-gray-500">
//                     ({plumber.reviewCount} reviews)
//                   </span>
//                 </div>

//                 <span className="text-gray-300">•</span>

//                 <div className="flex items-center gap-1">
//                   <FaMapMarkerAlt className="h-4 w-4 text-gray-500" />
//                   <span className="text-gray-600">{plumber.location}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Emergency Badge */}
//             {plumber.isEmergency && (
//               <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
//                 🚨 24/7 Emergency
//               </span>
//             )}
//           </div>

//           {/* Description */}
//           <p className="mt-4 text-gray-600 leading-relaxed">
//             {plumber.description}
//           </p>

//           {/* Info Section */}
//           <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-600">
            
//             <div className="flex items-center gap-2">
//               <FaUserTie className="text-gray-500" />
//               <span>Owner: <span className="text-gray-800 font-medium">{plumber.ownerName}</span></span>
//             </div>

//             <div className="flex items-center gap-2">
//               <FaUsers className="text-gray-500" />
//               <span><span className="text-gray-800 font-medium">{plumber.teamSize}</span> licensed plumbers</span>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="mt-6 flex flex-wrap gap-3">
            
//             <a
//               href={`tel:${plumber.phone}`}
//               // className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 !text-gray-700 hover:bg-gray-100 transition"
//             >
//               <FaPhone className="text-gray-900" />
//               Call
            
//             </a>

//             <a
//               href={`mailto:${plumber.email}`}
//             //  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 !text-black hover:bg-gray-100 transition"
//             >
//               <FaEnvelope className="text-gray-900" />
//               Email
//             </a>


//               <a
//               href={`mailto:${plumber.email}`}
//             //  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 !text-black hover:bg-gray-100 transition"
//             >
//               <FaTwitter className="text-gray-900" />
//               X.com
//             </a>

//               <a
//               href={`mailto:${plumber.email}`}
//             //  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 !text-black hover:bg-gray-100 transition"
//             >
//               <FaInstagram className="text-gray-900" />
//               Instagram
//             </a>

//               <a
//               href={`mailto:${plumber.email}`}
//             //  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 !text-black hover:bg-gray-100 transition"
//             >
//               <FaFacebook className="text-gray-900" />
//               Facebook
//             </a>
//               <a
//               href={`mailto:${plumber.email}`}

//             //  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 !text-black hover:bg-gray-100 transition"
//             >
//               <FaLinkedin className="text-gray-900" />
//               LinkedIn
//             </a>

//             {plumber.website && (
//               <a
//                 href={plumber.website}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 // className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 !text-black hover:bg-gray-100 transition c"
//               >
//                 <FaGlobe className="text-gray-900" />
//                 Website
//               </a>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }












































"use client";

import Image from "next/image";
import { useState } from "react";
import type { IconType } from "react-icons";
import { FaCalendarCheck, FaCheck, FaCheckCircle, FaClock, FaEnvelope, FaFacebook, FaGlobe, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhoneAlt, FaShareAlt, FaStar, FaTiktok, FaUsers, FaUserTie, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import type { Plumber } from "@/components/find/types";
import { openNowLabel } from "@/components/find/companyListing";
import CoverSlideshow from "./CoverSlideshow";
import { trackActivity, type ActivityEvent } from "@/components/activity/track";

const socialIcons: { key: keyof NonNullable<Plumber["socialLinks"]>; label: string; Icon: IconType }[] = [
  { key: "facebook", label: "Facebook", Icon: FaFacebook },
  { key: "instagram", label: "Instagram", Icon: FaInstagram },
  { key: "twitter", label: "X (Twitter)", Icon: FaXTwitter },
  { key: "linkedin", label: "LinkedIn", Icon: FaLinkedin },
  { key: "youtube", label: "YouTube", Icon: FaYoutube },
  { key: "tiktok", label: "TikTok", Icon: FaTiktok },
];
const outlineButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 transition hover:border-[#0b1f3b] hover:bg-gray-50";

/**
 * Profile header: cover banner, logo, name and badges, rating/location/open-now, short description,
 * key facts, top services, contact buttons and social links. Stacks on phones, sits side by side from tablets up.
 */
export default function ProfileHeader({ plumber }: { plumber: Plumber }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const isFreelancer = plumber.providerType === "freelancer";
  // Cover photos for the banner slideshow; sample plumbers use their first gallery photos.
  const covers = plumber.coverImages?.length ? plumber.coverImages : plumber.coverImage ? [plumber.coverImage] : (plumber.media?.images ?? []).slice(0, 4);
  const status = openNowLabel(plumber.openingHours?.weekly);
  const socials = socialIcons.filter(({ key }) => plumber.socialLinks?.[key]);
  const topServices = (plumber.specializations.length ? plumber.specializations : plumber.services).slice(0, 4);
  const moreServices = Math.max(0, new Set([...plumber.specializations, ...plumber.services]).size - topServices.length);
  const longDescription = plumber.description.length > 180;

  // Contact and share clicks are recorded for the plumber's activity (admins see them).
  const track = (event: ActivityEvent) => trackActivity({ providerType: plumber.providerType ?? "company", providerId: plumber.id, providerName: plumber.companyName, event });

  const share = async () => {
    track("share");
    const url = window.location.href;
    try {
      if (navigator.share) return await navigator.share({ title: plumber.companyName, url });
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Share sheet closed or clipboard blocked: nothing to do.
    }
  };

  return (
    <header className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Cover banner */}
      <div className="relative h-32 bg-gradient-to-br from-[#0b1f3b] via-[#17345a] to-[#0b1f3b] sm:h-44 lg:h-52">
        <CoverSlideshow images={covers} name={plumber.companyName} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" aria-hidden />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 sm:left-5 sm:top-4">
          {plumber.isVerified && <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#0b1f3b] shadow sm:text-xs"><FaCheckCircle className="text-emerald-600" aria-hidden /> Verified</span>}
          {plumber.isEmergency && <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white shadow sm:text-xs">24/7 Emergency</span>}
        </div>
        <button type="button" onClick={share} aria-label="Share this profile" className="absolute right-3 top-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-white/95 px-3 text-xs font-bold text-[#0b1f3b] shadow transition hover:bg-[#FFD60A] sm:right-5 sm:top-4">
          {copied ? <FaCheck aria-hidden /> : <FaShareAlt aria-hidden />} <span className="hidden sm:inline">{copied ? "Link copied" : "Share"}</span>
        </button>
      </div>

      <div className="px-4 pb-5 sm:px-6 sm:pb-6">
        {/* Logo + name */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-5">
          <div className="relative -mt-12 h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md sm:-mt-16 sm:h-32 sm:w-32">
            <Image src={plumber.logo} alt={`${plumber.companyName} logo`} fill sizes="(max-width: 640px) 96px, 128px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1 sm:pb-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#f7672c] sm:text-xs">{isFreelancer ? "Independent plumber" : "Plumbing company"}</p>
            <h1 className="mt-0.5 break-words text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl">
              {plumber.companyName}
              {plumber.isVerified && <FaCheckCircle className="ml-2 inline-block h-5 w-5 -translate-y-0.5 align-middle text-[#FFD60A]" aria-label="Verified" />}
            </h1>
            {plumber.tagline && <p className="mt-1 text-sm font-semibold text-[#0b1f3b] sm:text-base">{plumber.tagline}</p>}
          </div>
        </div>

        {/* Rating, location, open now, experience */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
          <a href="#reviews" className="inline-flex items-center gap-1.5 hover:underline">
            <span className="inline-flex" aria-hidden>{[1, 2, 3, 4, 5].map((n) => <FaStar key={n} className={`h-3.5 w-3.5 ${n <= Math.round(plumber.rating) ? "text-[#FFD60A]" : "text-gray-200"}`} />)}</span>
            {plumber.reviewCount > 0 ? <><span className="font-bold text-gray-900">{plumber.rating.toFixed(1)}</span><span className="text-gray-500">({plumber.reviewCount} review{plumber.reviewCount === 1 ? "" : "s"})</span></> : <span className="text-gray-500">No reviews yet</span>}
          </a>
          {plumber.location && <span className="inline-flex min-w-0 items-center gap-1.5"><FaMapMarkerAlt className="h-3.5 w-3.5 shrink-0 text-[#f7672c]" aria-hidden /><span className="break-words">{plumber.location}</span></span>}
          {status && <a href="#hours" className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${status === "Open now" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}><FaClock className="h-3 w-3" aria-hidden /> {status}</a>}
          {plumber.yearsInBusiness > 0 && <span className="inline-flex items-center gap-1.5"><FaCalendarCheck className="h-3.5 w-3.5 text-gray-400" aria-hidden />{plumber.yearsInBusiness}+ years</span>}
        </div>

        {/* Description */}
        {plumber.description && (
          <div className="mt-4 max-w-3xl">
            <p className={`text-sm leading-relaxed text-gray-600 sm:text-[15px] ${expanded ? "" : "line-clamp-3"}`}>{plumber.description}</p>
            {longDescription && <button type="button" onClick={() => setExpanded((open) => !open)} className="mt-1 text-sm font-semibold text-[#0b1f3b] hover:underline">{expanded ? "Show less" : "Read more"}</button>}
          </div>
        )}

        {/* Key facts and top services */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs sm:text-sm">
          {plumber.ownerName && <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-gray-700"><FaUserTie className="text-gray-500" aria-hidden /> Owner: <span className="font-semibold text-gray-900">{plumber.ownerName}</span></span>}
          {!isFreelancer && plumber.teamSize > 0 && <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-gray-700"><FaUsers className="text-gray-500" aria-hidden /><span className="font-semibold text-gray-900">{plumber.teamSize}</span> plumbers</span>}
          {plumber.responseTime && !/^contact/i.test(plumber.responseTime) && <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-gray-700"><FaClock className="text-gray-500" aria-hidden /> Responds {plumber.responseTime.toLowerCase().startsWith("within") ? "" : "in "}<span className="font-semibold text-gray-900">{plumber.responseTime}</span></span>}
        </div>
        {topServices.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Top services">
            {topServices.map((name) => <li key={name} className="rounded-full border border-[#FFD60A] bg-[#FFD60A]/10 px-3 py-1 text-xs font-semibold text-[#0b1f3b]">{name}</li>)}
            {moreServices > 0 && <li><a href="#services" className="inline-block rounded-full px-2 py-1 text-xs font-semibold text-gray-500 hover:underline">+{moreServices} more</a></li>}
          </ul>
        )}

        {/* Contact actions and social links */}
        <div className="mt-5 flex flex-col gap-4 border-t border-gray-100 pt-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {plumber.phone && (
              <a href={`tel:${plumber.phone.replace(/[^\d+]/g, "")}`} onClick={() => track("call_click")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#FFD60A] px-4 text-sm font-bold text-[#0b1f3b] shadow-sm transition hover:brightness-95">
                <FaPhoneAlt className="h-3.5 w-3.5" aria-hidden /> <span className="sm:hidden">Call</span><span className="hidden sm:inline">{plumber.phone}</span>
              </a>
            )}
            <a href="#booking" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0b1f3b] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#17345a]">
              <FaCalendarCheck className="h-3.5 w-3.5" aria-hidden /> Book now
            </a>
            {plumber.email && <a href={`mailto:${plumber.email}`} onClick={() => track("email_click")} className={outlineButton}><FaEnvelope className="h-3.5 w-3.5" aria-hidden /> Email</a>}
            {plumber.website && <a href={plumber.website} target="_blank" rel="noopener noreferrer" onClick={() => track("website_click")} className={outlineButton}><FaGlobe className="h-3.5 w-3.5" aria-hidden /> Website</a>}
          </div>
          {socials.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 lg:hidden">Follow</span>
              {socials.map(({ key, label, Icon }) => (
                <a key={key} href={plumber.socialLinks![key]} target="_blank" rel="noopener noreferrer" title={label} aria-label={label} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:border-[#0b1f3b] hover:bg-[#0b1f3b] hover:text-white">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
