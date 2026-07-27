// "use client";

// import { use } from "react";
// import { notFound } from "next/navigation";
// import { plumbers } from "@/data/plumbers";
// import ProfileHeader from "@/components/plumber/ProfileHeader";
// import ProfileStats from "@/components/plumber/ProfileStats";
// import ProfileServices from "@/components/plumber/ProfileServices";
// import ProfileReviews from "@/components/plumber/ProfileReviews";
// import ProfileMap from "@/components/plumber/ProfileMap";
// import BookingWidget from "@/components/plumber/BookingWidget";

// const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// const plusJakarta = Plus_Jakarta_Sans({
//   subsets: ["latin"],
//   variable: "--font-plus-jakarta",
// });

// export default function PlumberProfilePage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = use(params);
//   const plumber = plumbers.find((p) => p.id === id);
//   if (!plumber) return notFound();

//   return (
//     <main
//       className={`${inter.variable} ${plusJakarta.variable} min-h-screen bg-gray-50 font-sans`}
//       style={{ fontFamily: "var(--font-inter)" }}
//     >
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         <div className="grid lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-6">
//             <ProfileHeader plumber={plumber} />
//             <ProfileStats plumber={plumber} />
//             <ProfileServices plumber={plumber} />
//             <ProfileReviews />
//             <ProfileMap plumber={plumber} />
//           </div>
//           <div className="lg:col-span-1">
//             <BookingWidget plumber={plumber} />
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }



// "use client";

// import { use } from "react";
// import { notFound } from "next/navigation";
// import { Inter, Plus_Jakarta_Sans } from "next/font/google";
// import { plumbers } from "@/data/plumbers";
// import ProfileHeader from "@/components/plumber/ProfileHeader";
// import ProfileStats from "@/components/plumber/ProfileStats";
// import ProfileServices from "@/components/plumber/ProfileServices";
// import ProfileAdditionalInfo from "@/components/plumber/ProfileAdditionalInfo";
// import ProfileReviews from "@/components/plumber/ProfileReviews";
// import ProfileMap from "@/components/plumber/ProfileMap";
// import BookingWidget from "@/components/plumber/BookingWidget";

// const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// const plusJakarta = Plus_Jakarta_Sans({
//   subsets: ["latin"],
//   variable: "--font-plus-jakarta",
// });

// export default function PlumberProfilePage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = use(params);
//   const plumber = plumbers.find((p) => p.id === id);
//   if (!plumber) return notFound();

//   return (
//     <main
//       className={`${inter.variable} ${plusJakarta.variable} min-h-screen bg-gray-50 font-sans`}
//       style={{ fontFamily: "var(--font-inter)" }}
//     >
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         <div className="grid lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-6">
//             <ProfileHeader plumber={plumber} />
//             <ProfileStats plumber={plumber} />
//             <ProfileServices plumber={plumber} />
//             <ProfileAdditionalInfo plumber={plumber} />
//             <ProfileReviews plumber={plumber} />
//             <ProfileMap plumber={plumber} />
//           </div>
//           <div className="lg:col-span-1">
//             <BookingWidget plumber={plumber} />
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }













// "use client";

// import { use } from "react";
// import { notFound } from "next/navigation";
// import { Inter, Plus_Jakarta_Sans } from "next/font/google";
// import { plumbers } from "@/data/plumbers";
// import ProfileHeader from "@/components/plumber/ProfileHeader";
// import ProfileStats from "@/components/plumber/ProfileStats";
// import ProfileServices from "@/components/plumber/ProfileServices";
// import ProfileAdditionalInfo from "@/components/plumber/ProfileAdditionalInfo";
// import ProfileReviews from "@/components/plumber/ProfileReviews";
// import ProfileMap from "@/components/plumber/ProfileMap";
// import BookingWidget from "@/components/plumber/BookingWidget";
// import MediaGallery from "@/components/plumber/MediaGallery"; // 👈 import

// const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// const plusJakarta = Plus_Jakarta_Sans({
//   subsets: ["latin"],
//   variable: "--font-plus-jakarta",
// });

// export default function PlumberProfilePage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = use(params);
//   const plumber = plumbers.find((p) => p.id === id);
//   if (!plumber) return notFound();

//   return (
//     <main
//       className={`${inter.variable} ${plusJakarta.variable} min-h-screen bg-gray-50 font-sans`}
//       style={{ fontFamily: "var(--font-inter)" }}
//     >
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         <div className="grid lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-6">
//             <ProfileHeader plumber={plumber} />
//               {/* 👇 Add MediaGallery if media exists */}
//             {plumber.media && (plumber.media.images.length > 0 || plumber.media.videos.length > 0) && (
//               <MediaGallery images={plumber.media.images} videos={plumber.media.videos} />
//             )}
//             <ProfileStats plumber={plumber} />
//             <ProfileServices plumber={plumber} />
//             <ProfileAdditionalInfo plumber={plumber} />
//             <ProfileReviews plumber={plumber} />
//             <ProfileMap plumber={plumber} />
//           </div>
//           <div className="lg:col-span-1">
//             <BookingWidget plumber={plumber} />
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }











"use client";

export const dynamic = "force-dynamic";

import { use, useEffect } from "react";
import { notFound } from "next/navigation";
import { plumbers } from "@/data/plumbers";
import ProfileHeader from "@/components/plumber/ProfileHeader";
import ProfileStats from "@/components/plumber/ProfileStats";
import ProfileServices from "@/components/plumber/ProfileServices";
// import ProfileAdditionalInfo from "@/components/plumber/ProfileAdditionalInfo";
import ProfileReviews from "@/components/plumber/ProfileReviews";
import ProfileMap from "@/components/plumber/ProfileMap";
import BookingWidget from "@/components/plumber/BookingWidget";
import MediaGallery from "@/components/plumber/MediaGallery";
import ProfilePreviousProjects from "@/components/plumber/ProfilePreviousProjects";
import DiscountCard from "@/components/plumber/DiscountCard";
import ProfileBlogSection from "@/components/plumber/ProfileBlogSection";
import ProfileFaq from "@/components/plumber/ProfileFaq";
import ProfileTeam from "@/components/plumber/ProfileTeam";

const RECENT_DEALS_KEY = "plumberfinder_recent_deals";

export default function PlumberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const plumber = plumbers.find((p) => p.id === id);

  useEffect(() => {
    if (!plumber) return;
    if (typeof window === "undefined") return;

    const nextEntry = {
      id: plumber.id,
      companyName: plumber.companyName,
      title: plumber.discount || plumber.specializations[0] || "Limited time offer",
      location: plumber.location,
      discount: plumber.discount,
      promoCode: plumber.promoCode,
      image: plumber.media?.images?.[0] || plumber.logo || "/Plumber.png",
      rating: plumber.rating,
      priceRange: plumber.priceRange,
    };

    try {
      const stored = window.localStorage.getItem(RECENT_DEALS_KEY);
      const parsed = stored ? (JSON.parse(stored) as Array<typeof nextEntry>) : [];
      const deduped = [nextEntry, ...parsed.filter((item) => item.id !== nextEntry.id)].slice(0, 6);
      window.localStorage.setItem(RECENT_DEALS_KEY, JSON.stringify(deduped));
    } catch {
      window.localStorage.setItem(RECENT_DEALS_KEY, JSON.stringify([nextEntry]));
    }
  }, [plumber]);

  if (!plumber) return notFound();

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] lg:gap-8">
          <div className="min-w-0 space-y-5 sm:space-y-6">
            <ProfileHeader plumber={plumber} />
            <ProfileStats plumber={plumber} />
            <ProfileServices plumber={plumber} />
            <ProfileTeam plumber={plumber} />


            {plumber.media && (plumber.media.images.length > 0 || plumber.media.videos.length > 0) && (
              <MediaGallery images={plumber.media.images} videos={plumber.media.videos} />
            )}
          
            {/* <ProfileAdditionalInfo plumber={plumber} /> */}

            {plumber.projects && plumber.projects.length > 0 && <ProfilePreviousProjects plumber={plumber} />}
            <ProfileFaq plumber={plumber} />
            <ProfileReviews />
            <ProfileMap plumber={plumber} />

            <ProfileBlogSection plumber={plumber} />
            
            
            
          </div>
          <aside className="min-w-0 space-y-5 sm:space-y-6">
            <DiscountCard plumber={plumber} />
             <BookingWidget plumber={plumber} />
          </aside>
        </div>
      </div>
    </main>
  );
}
