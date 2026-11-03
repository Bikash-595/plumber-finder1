import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import { youtubeThumbnail } from "@/components/find/media";
import type { MediaItem } from "./serviceMedia";

/** A small preview of a photo or video (the thumbnails strip and the "all photos" grid). */
export default function MediaThumb({ item, sizes = "120px" }: { item: MediaItem; sizes?: string }) {
  return (
    <>
      {item.kind === "image" ? <Image src={item.src} alt="" fill sizes={sizes} unoptimized={item.src.startsWith("data:")} className="object-cover" />
        // eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnails come from i.ytimg.com
        : item.youtube ? <img src={youtubeThumbnail(item.youtube)} alt="" className="h-full w-full scale-[1.34] object-cover" />
        : <video src={item.src.startsWith("data:") ? item.src : `${item.src}#t=0.5`} preload="metadata" muted playsInline className="pointer-events-none h-full w-full object-cover" />}
      {item.kind === "video" && <span className="absolute inset-0 grid place-items-center bg-black/30"><span className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[#0b1f3b]"><FaPlay className="ml-0.5 h-3 w-3" /></span></span>}
    </>
  );
}
