import { FaFlag } from "react-icons/fa";
import ReviewReply from "./ReviewReply";
import SourceBadge from "./SourceBadge";
import { Stars } from "./Stars";
import { formatReviewDate, type PFReview } from "./reviewsApi";

/** A PlumberFinder review (directory or verified booking): rating, text, photos and the plumber's reply. */
export default function PlatformReviewCard({ review, plumberName, onReport }: { review: PFReview; plumberName: string; onReport?: (review: PFReview) => void }) {
  return (
    <article className="py-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0b1f3b] text-xs font-bold text-white" aria-hidden>{review.author.name.slice(0, 1)}</span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900">{review.author.name}{review.isMine ? " (you)" : ""}</p>
          <p className="text-xs text-gray-500">{formatReviewDate(review.createdAt)}{review.edited ? " · edited" : ""}</p>
        </div>
        <div className="ml-auto"><SourceBadge source={review.source} /></div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2"><Stars value={review.rating} />{review.title && <span className="font-semibold text-gray-900">{review.title}</span>}</div>
      {review.serviceCategory && <p className="mt-0.5 text-xs font-semibold text-[#b26b00]">{review.serviceCategory}</p>}
      <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-gray-700">{review.body}</p>
      {review.photos.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- customer uploads are data URLs */}
          {review.photos.map((photo, index) => <a key={index} href={photo} target="_blank" rel="noreferrer"><img src={photo} alt={`Photo ${index + 1} from ${review.author.name}`} loading="lazy" className="h-20 w-28 rounded-lg object-cover" /></a>)}
        </div>
      )}
      {review.reply && <ReviewReply from={plumberName} body={review.reply.body} />}
      {onReport && !review.isMine && <button type="button" onClick={() => onReport(review)} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-red-600"><FaFlag className="h-2.5 w-2.5" aria-hidden /> Report</button>}
    </article>
  );
}
