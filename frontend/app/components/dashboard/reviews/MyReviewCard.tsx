import Link from "next/link";
import { FaCheckCircle, FaReply } from "react-icons/fa";
import { Stars } from "@/components/reviews/Stars";
import { formatDate, type MyReview } from "@/components/utils/userApi";
import StatusPill from "../ui/StatusPill";
import type { Tone } from "../ui/tones";

const statusMeta: Record<string, { label: string; tone: Tone }> = {
  published: { label: "Published", tone: "success" },
  pending: { label: "Being checked", tone: "warning" },
  hidden: { label: "Hidden by moderators", tone: "neutral" },
};

/** One review the customer wrote, its moderation status, and the plumber's reply. */
export default function MyReviewCard({ review }: { review: MyReview }) {
  const status = statusMeta[review.status] ?? { label: review.status, tone: "neutral" as Tone };
  const href = `/plumber/${encodeURIComponent(review.providerId)}#reviews`;
  return (
    <article className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={href} className="font-bold text-gray-900 hover:underline">{review.providerName}</Link>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <Stars value={review.rating} size="h-3.5 w-3.5" />
            <span>{formatDate(review.createdAt)}{review.edited ? " · edited" : ""}</span>
            {review.serviceCategory && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">{review.serviceCategory}</span>}
            {review.verified && <span className="inline-flex items-center gap-1 font-semibold text-emerald-700"><FaCheckCircle className="h-3 w-3" />Verified booking</span>}
          </div>
        </div>
        <StatusPill tone={status.tone}>{status.label}</StatusPill>
      </div>
      <h3 className="mt-3 font-semibold text-gray-900">{review.title}</h3>
      <p className="mt-1 line-clamp-4 whitespace-pre-line text-sm text-gray-700">{review.body}</p>
      {review.photos.length > 0 && (
        <div className="mt-3 flex gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- review photos are uploads */}
          {review.photos.slice(0, 4).map((photo) => <img key={photo} src={photo} alt="" loading="lazy" className="h-16 w-16 rounded-lg object-cover" />)}
        </div>
      )}
      {review.reply && (
        <div className="mt-4 rounded-xl border-l-4 border-[#FFD60A] bg-gray-50 px-4 py-3">
          <p className="flex items-center gap-1.5 text-xs font-bold text-gray-700"><FaReply className="h-3 w-3" /> Reply from {review.providerName}</p>
          <p className="mt-1 text-sm text-gray-700">{review.reply.body}</p>
        </div>
      )}
      <div className="mt-4 border-t border-gray-100 pt-3">
        <Link href={href} className="text-sm font-semibold text-[#0b1f3b] hover:underline">View or edit on their profile →</Link>
      </div>
    </article>
  );
}
