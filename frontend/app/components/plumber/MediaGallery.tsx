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

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaImages, FaPause, FaPlay, FaTimes } from "react-icons/fa";
import { youtubeId, youtubeThumbnail } from "@/components/find/media";

interface MediaGalleryProps {
  images: string[];
  videos: string[];
}

type Media = { kind: "image" | "video"; src: string; youtube: string | null; number: number };
type Tab = "all" | "image" | "video";

const PER_PAGE = 2;
const AUTO_MS = 4500;
const roundButton = "grid h-9 w-9 place-items-center rounded-full bg-white/95 text-[#0b1f3b] shadow-md transition hover:bg-[#FFD60A] disabled:opacity-40";

/** A photo, or a video's thumbnail (YouTube's own picture, or the first frame of an uploaded file) with a play button. */
function Thumb({ item, sizes }: { item: Media; sizes: string }) {
  if (item.kind === "image") return <Image src={item.src} alt={`Photo ${item.number}`} fill sizes={sizes} className="object-cover transition duration-500 group-hover:scale-105" />;
  return (
    <>
      {item.youtube ? (
        // YouTube's thumbnail has black bars above and below the picture; scaling it up crops them off.
        // eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnails come from i.ytimg.com
        <img src={youtubeThumbnail(item.youtube)} alt={`Video ${item.number}`} loading="lazy" className="absolute inset-0 h-full w-full scale-[1.34] object-cover transition duration-500 group-hover:scale-[1.4]" />
      ) : (
        // The browser shows the first frame as the thumbnail (#t skips a black opening frame).
        <video src={item.src.startsWith("data:") ? item.src : `${item.src}#t=0.5`} preload="metadata" muted playsInline aria-label={`Video ${item.number}`} className="pointer-events-none absolute inset-0 h-full w-full bg-gray-900 object-cover" />
      )}
      <span className="absolute inset-0 bg-black/25 transition group-hover:bg-black/35" aria-hidden />
      <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#0b1f3b] shadow-lg transition group-hover:scale-110 sm:h-14 sm:w-14" aria-hidden><FaPlay className="ml-0.5 h-4 w-4 sm:h-5 sm:w-5" /></span>
      <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white sm:text-xs">Video</span>
    </>
  );
}

/**
 * Profile photos and videos: two at a time in a slideshow that moves on by itself, a "View all" grid
 * (All / Photos / Videos), and a full-screen viewer for photos and videos.
 */
export default function MediaGallery({ images, videos }: MediaGalleryProps) {
  // Photos and videos mixed, so the slideshow shows both kinds early on.
  const items = useMemo<Media[]>(() => {
    const photos = images.filter(Boolean).map((src, index) => ({ kind: "image" as const, src, youtube: null, number: index + 1 }));
    const clips = videos.filter(Boolean).map((src, index) => ({ kind: "video" as const, src, youtube: youtubeId(src), number: index + 1 }));
    const mixed: Media[] = [];
    for (let i = 0; i < Math.max(photos.length, clips.length); i++) {
      if (photos[i]) mixed.push(photos[i]);
      if (clips[i]) mixed.push(clips[i]);
    }
    return mixed;
  }, [images, videos]);
  const pages = Math.ceil(items.length / PER_PAGE);
  const [page, setPage] = useState(0);
  const [touchX, setTouchX] = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [tab, setTab] = useState<Tab>("all");
  // The open viewer: the list it steps through (all items, or the current tab) and the position in it.
  const [viewer, setViewer] = useState<{ list: Media[]; index: number } | null>(null);
  const photoCount = images.filter(Boolean).length;
  const videoCount = videos.filter(Boolean).length;
  const tabItems = tab === "all" ? items : items.filter((item) => item.kind === tab);

  // Slideshow: moves on every few seconds unless paused, hovered, or something is open.
  useEffect(() => {
    if (pages < 2 || !playing || hovering || showAll || viewer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setPage((current) => (current + 1) % pages), AUTO_MS);
    return () => window.clearInterval(timer);
  }, [pages, playing, hovering, showAll, viewer]);

  const step = useCallback((delta: number) => setViewer((current) => current && { ...current, index: (current.index + delta + current.list.length) % current.list.length }), []);

  // Keyboard: arrows step through the viewer, Escape closes the viewer, then the grid. The page doesn't scroll behind them.
  useEffect(() => {
    if (!showAll && !viewer) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") return viewer ? setViewer(null) : setShowAll(false);
      if (viewer && event.key === "ArrowRight") step(1);
      if (viewer && event.key === "ArrowLeft") step(-1);
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = overflow; };
  }, [showAll, viewer, step]);

  if (!items.length) return null;
  const current = viewer?.list[viewer.index];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6" aria-labelledby="media-gallery-heading">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="media-gallery-heading" className="text-xl font-bold text-gray-900">Media Gallery</h2>
          <p className="mt-0.5 text-sm text-gray-500">{[photoCount && `${photoCount} photo${photoCount === 1 ? "" : "s"}`, videoCount && `${videoCount} video${videoCount === 1 ? "" : "s"}`].filter(Boolean).join(" · ")}</p>
        </div>
        {items.length > PER_PAGE && (
          <button type="button" onClick={() => { setTab("all"); setShowAll(true); }} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-[#0b1f3b] transition hover:border-[#0b1f3b] hover:bg-gray-50">
            <FaImages className="h-3.5 w-3.5" aria-hidden /> View all ({items.length})
          </button>
        )}
      </div>

      {/* Slideshow: two at a time */}
      <div
        className="relative"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        // Phones: swipe left or right to change page.
        onTouchStart={(event) => setTouchX(event.touches[0].clientX)}
        onTouchEnd={(event) => {
          const moved = touchX === null ? 0 : event.changedTouches[0].clientX - touchX;
          if (pages > 1 && Math.abs(moved) > 40) setPage((page + (moved < 0 ? 1 : -1) + pages) % pages);
          setTouchX(null);
        }}
      >
        <div className="overflow-hidden rounded-xl">
          <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${page * 100}%)` }}>
            {Array.from({ length: pages }, (_, pageIndex) => (
              <div key={pageIndex} className="grid w-full shrink-0 grid-cols-2 gap-2 sm:gap-3" aria-hidden={pageIndex !== page}>
                {items.slice(pageIndex * PER_PAGE, pageIndex * PER_PAGE + PER_PAGE).map((item, offset) => (
                  <button key={`${item.kind}-${item.number}`} type="button" tabIndex={pageIndex === page ? 0 : -1} onClick={() => setViewer({ list: items, index: pageIndex * PER_PAGE + offset })} aria-label={`Open ${item.kind === "image" ? "photo" : "video"} ${item.number}`} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                    <Thumb item={item} sizes="(max-width: 640px) 50vw, 33vw" />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
        {pages > 1 && (
          <>
            <button type="button" onClick={() => setPage((page - 1 + pages) % pages)} aria-label="Previous" className={`${roundButton} absolute left-2 top-1/2 hidden -translate-y-1/2 sm:grid`}><FaChevronLeft className="h-3.5 w-3.5" /></button>
            <button type="button" onClick={() => setPage((page + 1) % pages)} aria-label="Next" className={`${roundButton} absolute right-2 top-1/2 hidden -translate-y-1/2 sm:grid`}><FaChevronRight className="h-3.5 w-3.5" /></button>
          </>
        )}
      </div>

      {pages > 1 && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Gallery pages">
            {Array.from({ length: pages }, (_, index) => (
              <button key={index} type="button" role="tab" aria-selected={index === page} aria-label={`Show ${index * PER_PAGE + 1}–${Math.min(items.length, index * PER_PAGE + PER_PAGE)}`} onClick={() => setPage(index)} className={`h-2 rounded-full transition-all ${index === page ? "w-6 bg-[#0b1f3b]" : "w-2 bg-gray-300 hover:bg-gray-400"}`} />
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-2 text-xs text-gray-500">
            <span aria-live="polite">{page * PER_PAGE + 1}–{Math.min(items.length, page * PER_PAGE + PER_PAGE)} of {items.length}</span>
            <button type="button" onClick={() => setPlaying((on) => !on)} aria-label={playing ? "Pause slideshow" : "Play slideshow"} className="grid h-7 w-7 place-items-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50">{playing ? <FaPause className="h-2.5 w-2.5" /> : <FaPlay className="h-2.5 w-2.5" />}</button>
          </div>
        </div>
      )}

      {/* View all */}
      {showAll && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white" role="dialog" aria-modal="true" aria-label="All photos and videos">
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 sm:px-6">
            <div className="flex gap-1.5 overflow-x-auto" role="tablist">
              {([["all", `All (${items.length})`], ["image", `Photos (${photoCount})`], ["video", `Videos (${videoCount})`]] as const).filter(([key]) => key === "all" || (key === "image" ? photoCount : videoCount)).map(([key, label]) => (
                <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold transition ${tab === key ? "bg-[#0b1f3b] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>{label}</button>
              ))}
            </div>
            <button type="button" onClick={() => setShowAll(false)} aria-label="Close" className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-gray-700 hover:bg-gray-100"><FaTimes className="h-4 w-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
              {tabItems.map((item, index) => (
                <button key={`${item.kind}-${item.number}`} type="button" onClick={() => setViewer({ list: tabItems, index })} aria-label={`Open ${item.kind === "image" ? "photo" : "video"} ${item.number}`} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                  <Thumb item={item} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full-screen viewer */}
      {viewer && current && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-black/95" role="dialog" aria-modal="true" aria-label="Media viewer">
          <div className="flex items-center justify-between px-4 py-3 text-sm text-white/80">
            <span>{current.kind === "image" ? "Photo" : "Video"} · {viewer.index + 1} of {viewer.list.length}</span>
            <button type="button" onClick={() => setViewer(null)} aria-label="Close viewer" className="grid h-10 w-10 place-items-center rounded-full text-white hover:bg-white/10"><FaTimes className="h-5 w-5" /></button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-6 sm:px-16">
            {current.kind === "image" ? (
              <div className="relative h-full w-full max-w-5xl"><Image key={current.src} src={current.src} alt={`Photo ${current.number}`} fill sizes="100vw" priority className="object-contain" /></div>
            ) : current.youtube ? (
              <iframe key={current.src} src={`https://www.youtube-nocookie.com/embed/${current.youtube}?autoplay=1&rel=0&modestbranding=1`} title={`Video ${current.number}`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="aspect-video w-full max-w-5xl rounded-lg border-0" />
            ) : (
              <video key={current.src} src={current.src} controls autoPlay playsInline className="max-h-full w-full max-w-5xl rounded-lg bg-black" />
            )}
            {viewer.list.length > 1 && (
              <>
                <button type="button" onClick={() => step(-1)} aria-label="Previous" className={`${roundButton} absolute left-2 top-1/2 h-11 w-11 -translate-y-1/2 sm:left-4`}><FaChevronLeft className="h-4 w-4" /></button>
                <button type="button" onClick={() => step(1)} aria-label="Next" className={`${roundButton} absolute right-2 top-1/2 h-11 w-11 -translate-y-1/2 sm:right-4`}><FaChevronRight className="h-4 w-4" /></button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
