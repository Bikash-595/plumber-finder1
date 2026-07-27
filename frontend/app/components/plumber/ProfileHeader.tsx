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
import { Plumber } from "@/components/find/types";
import {
  FaStar,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaUsers,
  FaUserTie,
  FaFacebook,
  // FaTwitter,
  // FaInstagram,
  FaLinkedin,
} from "react-icons/fa";




export default function ProfileHeader({ plumber }: { plumber: Plumber }) {
  const socialLinks = plumber.socialLinks || {};



  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200 transition hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
        {/* Logo */}
        <div className="flex justify-center sm:justify-start">
          <div className="relative h-28 w-28 overflow-hidden rounded-full border border-gray-200 bg-gray-50 shadow-sm sm:h-32 sm:w-32">
            <Image
              src={plumber.logo}
              alt={plumber.companyName}
              fill
              sizes="(max-width: 640px) 112px, 128px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-4 text-center sm:text-left">
          {/* Name and badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">

              {plumber.companyName}

            </h1>


            {plumber.isVerified && (
              <FaCheckCircle className="h-5 w-5 text-[#FFD60A]" />
            )}



            {plumber.isEmergency && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                🚨 24/7
              </span>


            )}
          </div>





          {/* Rating & Location */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-600 sm:justify-start">
            <div className="flex items-center gap-1">
              <FaStar className="h-4 w-4 text-[#FFD60A]" />
              <span className="font-semibold text-gray-800">{plumber.rating}</span>


              <span className="text-gray-500">({plumber.reviewCount} reviews)</span>


            </div>
            <span className="hidden text-gray-300 sm:inline">•</span>
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="h-3.5 w-3.5 text-gray-500" />


              <span className="break-words text-gray-600">{plumber.location}</span>


            </div>
          </div>





          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {plumber.description}
          </p>







          {/* Owner & Team */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 sm:justify-start">
            <div className="flex items-center gap-1.5">
              <FaUserTie className="h-4 w-4 text-gray-500" />


              <span>
                Owner: <span className="font-medium text-gray-800">{plumber.ownerName}</span>
              </span>


            </div>
            <div className="flex items-center gap-1.5">
              <FaUsers className="h-4 w-4 text-gray-500" />


              <span>
                <span className="font-medium text-gray-800">{plumber.teamSize}</span> plumbers
              </span>


            </div>
          </div>









          {/* Action Buttons (Contact & Social) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 sm:justify-start">



            {/* Phone */}
            <a
              href={`tel:${plumber.phone}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-sm font-medium text-white transition hover:bg-[#FFD60A] hover:text-gray-900"
              title="Call"
            >
              <FaPhone className="h-3.5 w-3.5" />
              {/* <span className="hidden sm:inline">Call</span> */}
            </a>





            {/* Email */}
            <a
              href={`mailto:${plumber.email}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-sm font-medium text-white transition hover:bg-[#FFD60A] hover:text-gray-900"
              title="Email"
            >
              <FaEnvelope className="h-3.5 w-3.5" />
              {/* <span className="hidden sm:inline">Email</span> */}
            </a>




            {/* Website */}
            {plumber.website && (
              <a
                href={plumber.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-sm font-medium text-white transition hover:bg-[#FFD60A] hover:text-gray-900"
                title="Website"
              >
                <FaGlobe className="h-3.5 w-3.5" />
                {/* <span className="hidden sm:inline">Website</span> */}
              </a>



            )}


            {/* Social Icons (only if links exist) */}

            <div className="flex items-center gap-1">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 text-white transition hover:bg-[#FFD60A] hover:text-gray-900"
                  title="Facebook"
                >
                  <FaFacebook className="h-4 w-4" />
                </a>
              )}

              
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 text-white transition hover:bg-[#FFD60A] hover:text-gray-900"
                  title="X (Twitter)"
                >
                   <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                      alt="Instagram"
                      width={24}
                      height={24}
                     className="object-contain"
                  />
                  
                  {/* <FaTwitter className="h-4 w-4" /> */}
                </a>
              )}






              
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 text-white transition hover:bg-[#FFD60A] hover:text-gray-900"
                  // title="Instagram"
                >
                  <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                      alt="Instagram"
                      width={24}
                      height={24}
                     className="object-contain"
                  />
                  {/* <FaInstagram className="h-4 w-4" /> */}
                </a>
              )}





              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-700 text-white transition hover:bg-[#FFD60A] hover:text-gray-900"
                  title="LinkedIn"
                >
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                      alt="Instagram"
                      width={24}
                      height={24}
                     className="object-contain"
                  />
                  <FaLinkedin className="h-4 w-4" />
                </a>
              )}





            </div>
          </div>
        </div>
      </div>
    </div>
  );


}
