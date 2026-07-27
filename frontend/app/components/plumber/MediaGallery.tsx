// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { FaPlay, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// interface MediaGalleryProps {
//   images: string[];
//   videos: string[];
// }

// export default function MediaGallery({ images, videos }: MediaGalleryProps) {
//   const [lightboxOpen, setLightboxOpen] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [activeType, setActiveType] = useState<"image" | "video">("image");

//   const openLightbox = (type: "image" | "video", index: number) => {
//     setActiveType(type);
//     setActiveIndex(index);
//     setLightboxOpen(true);
//   };

//   const closeLightbox = () => setLightboxOpen(false);

//   const next = () => {
//     if (activeType === "image") {
//       setActiveIndex((prev) => (prev + 1) % images.length);
//     } else {
//       setActiveIndex((prev) => (prev + 1) % videos.length);
//     }
//   };

//   const prev = () => {
//     if (activeType === "image") {
//       setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
//     } else {
//       setActiveIndex((prev) => (prev - 1 + videos.length) % videos.length);
//     }
//   };

//   if (!images.length && !videos.length) return null;

//   return (
//     <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
//       <h2 className="text-xl font-bold text-gray-900 mb-4">Media Gallery</h2>

//       {/* Images Grid */}
//       {images.length > 0 && (
//         <div className="mb-6">
//           <h3 className="font-semibold text-gray-800 mb-2">Photos</h3>
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//             {images.slice(0, 6).map((img, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => openLightbox("image", idx)}
//                 className="relative aspect-video rounded-lg overflow-hidden hover:opacity-90 transition"
//               >
//                 <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
//               </button>
//             ))}
//             {images.length > 6 && (
//               <div className="relative aspect-video rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
//                 +{images.length - 6} more
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Videos Grid */}
//       {videos.length > 0 && (
//         <div>
//           <h3 className="font-semibold text-gray-800 mb-2">Videos</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             {videos.slice(0, 4).map((video, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => openLightbox("video", idx)}
//                 className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 group"
//               >
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <FaPlay className="h-12 w-12 text-white opacity-80 group-hover:opacity-100 transition" />
//                 </div>
//                 <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
//                   Video {idx + 1}
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Lightbox Modal */}
//       {lightboxOpen && (
//         <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
//           <button
//             onClick={closeLightbox}
//             className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
//           >
//             <FaTimes />
//           </button>
//           <button
//             onClick={prev}
//             className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-gray-300"
//           >
//             <FaChevronLeft />
//           </button>
//           <button
//             onClick={next}
//             className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-gray-300"
//           >
//             <FaChevronRight />
//           </button>
//           <div className="max-w-4xl max-h-full">
//             {activeType === "image" && images[activeIndex] && (
//               <div className="relative w-full h-[80vh]">
//                 <Image
//                   src={images[activeIndex]}
//                   alt="Fullscreen"
//                   fill
//                   className="object-contain"
//                 />
//               </div>
//             )}
//             {activeType === "video" && videos[activeIndex] && (
//               <div className="relative w-full aspect-video">
//                 <iframe
//                   src={videos[activeIndex]}
//                   className="w-full h-full"
//                   allowFullScreen
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






"use client";

import { useState } from "react";
import Image from "next/image";
import { FaPlay, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface MediaGalleryProps {
  images: string[];
  videos: string[];
}

export default function MediaGallery({ images, videos }: MediaGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeType, setActiveType] = useState<"image" | "video">("image");

  const openLightbox = (type: "image" | "video", index: number) => {
    setActiveType(type);
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const next = () => {
    const length = activeType === "image" ? images.length : videos.length;
    setActiveIndex((prev) => (prev + 1) % length);
  };

  const prev = () => {
    const length = activeType === "image" ? images.length : videos.length;
    setActiveIndex((prev) => (prev - 1 + length) % length);
  };

  if (!images.length && !videos.length) return null;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Media Gallery</h2>

      {/* Images */}
      {images.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Photos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.slice(0, 6).map((img, idx) => (
              <button
                key={idx}
                onClick={() => openLightbox("image", idx)}
                className="relative aspect-video rounded-lg overflow-hidden hover:opacity-90 transition"
              >
                <Image
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Videos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {videos.slice(0, 4).map((video, idx) => (
              <button
                key={idx}
                onClick={() => openLightbox("video", idx)}
                className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 group"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaPlay className="h-12 w-12 text-white opacity-80 group-hover:opacity-100 transition" />
                </div>
                <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
                  Video {idx + 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white text-2xl">
            <FaTimes />
          </button>

          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl">
            <FaChevronLeft />
          </button>

          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl">
            <FaChevronRight />
          </button>

          <div className="max-w-4xl w-full">
            {activeType === "image" && images[activeIndex] && (
              <div className="relative w-full h-[70vh]">
                <Image
                  src={images[activeIndex]}
                  alt="Fullscreen"
                  fill
                  sizes="100vw"
                  className="object-contain"
                  quality={75}
                  priority // only for active image
                />
              </div>
            )}

            {activeType === "video" && videos[activeIndex] && (
              <div className="relative w-full aspect-video">
                <iframe
                  src={videos[activeIndex]}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
