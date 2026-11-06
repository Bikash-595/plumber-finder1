"use client";

import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import { youtubeThumbnail } from "@/components/find/media";

export type Media = { kind: "image" | "video"; src: string; youtube: string | null; number: number };

/** A photo, or a video's thumbnail (YouTube's own picture, or the first frame of an uploaded file) with a play button. */
export default function Thumb({ item, sizes }: { item: Media; sizes: string }) {
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
