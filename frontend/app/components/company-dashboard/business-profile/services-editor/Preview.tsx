"use client";

import { youtubeId, youtubeThumbnail } from "@/components/find/media";
import ServiceCard from "@/components/plumber/services/ServiceCard";
import { type FaqItem } from "../FaqListEditor";

export type PriceType = "fixed" | "from" | "hourly" | "quote" | "free" | "custom";

export type Draft = { name: string; category: string; description: string; priceType: PriceType; priceAmount: string; price: string; duration: string; includes: string[]; warranty: string; emergency: boolean; featured: boolean; images: string[]; videos: string[]; tagline: string; overview: string; process: string[]; problems: string[]; highlights: string[]; prepare: string[]; faqs: FaqItem[] };

/** "From $89" — the same wording customers see. */
function shownPrice(draft: Pick<Draft, "priceType" | "priceAmount" | "price">) {
  const amount = Number(draft.priceAmount);
  const money = Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
  if (draft.priceType === "quote") return "Free quote";
  if (draft.priceType === "free") return "Free";
  if (draft.priceType === "custom") return draft.price || "Ask for a quote";
  if (!(amount > 0)) return "Set a price";
  return draft.priceType === "from" ? `From ${money}` : draft.priceType === "hourly" ? `${money}/hr` : money;
}

/** How the service will look on the public profile: the same card customers see. */
export default function Preview({ draft }: { draft: Draft }) {
  const youtube = draft.videos.map((video) => youtubeId(video) ?? video.match(/youtube\.com\/shorts\/([\w-]{11})/)?.[1]).find(Boolean);
  return (
    <div className="@container pointer-events-none select-none" aria-hidden>
      <ServiceCard service={{
        id: "preview", name: draft.name || "Service name", category: draft.category || undefined,
        description: draft.description || "A short description of the job and what makes your service great.",
        price: shownPrice(draft), duration: draft.duration || undefined, includes: draft.includes, warranty: draft.warranty || undefined,
        emergency: draft.emergency, featured: draft.featured, image: draft.images[0], photoCount: draft.images.length, videoCount: draft.videos.length,
        poster: youtube ? youtubeThumbnail(youtube) : undefined,
      }} />
    </div>
  );
}
