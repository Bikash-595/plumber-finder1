import { youtubeId } from "@/components/find/media";

/** One photo or video of a service. YouTube videos keep their id (for the still and the player). */
export type MediaItem = { kind: "image"; src: string } | { kind: "video"; src: string; youtube: string | null };

const shortsId = (url: string) => url.match(/youtube\.com\/shorts\/([\w-]{11})/)?.[1] ?? null;

/** Photos first, then videos. */
export const serviceMedia = (images: string[], videos: string[] = []): MediaItem[] => [
  ...images.map((src) => ({ kind: "image" as const, src })),
  ...videos.map((src) => ({ kind: "video" as const, src, youtube: youtubeId(src) ?? shortsId(src) })),
];
