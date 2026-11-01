import { FaExternalLinkAlt } from "react-icons/fa";
import ReviewReply from "./ReviewReply";
import SourceBadge from "./SourceBadge";
import { Stars } from "./Stars";
import { formatReviewDate, type GoogleReview } from "./reviewsApi";

/** A review from Google, with the author's attribution, a link back to Google and the owner's reply when Google provides it. */
export default function GoogleReviewCard({ review, businessName }: { review: GoogleReview; businessName: string }) {
  return (
    <article className="py-5">
      <div className="flex flex-wrap items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element -- Google author photos come from Google's hosts */}
        {review.author.photoUri ? <img src={review.author.photoUri} alt="" referrerPolicy="no-referrer" className="h-9 w-9 rounded-full" /> : <span className="grid h-9 w-9 place-items-center rounded-full bg-gray-200 text-xs font-bold text-gray-700" aria-hidden>{review.author.name.slice(0, 1)}</span>}
        <div className="min-w-0">
          {review.author.uri ? <a href={review.author.uri} target="_blank" rel="noreferrer" className="text-sm font-bold text-gray-900 hover:underline">{review.author.name}</a> : <p className="text-sm font-bold text-gray-900">{review.author.name}</p>}
          <p className="text-xs text-gray-500">{review.relativeTime ?? formatReviewDate(review.publishTime)} · on Google</p>
        </div>
        <div className="ml-auto"><SourceBadge source="google" /></div>
      </div>
      <div className="mt-2"><Stars value={review.rating} /></div>
      {review.text && <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-gray-700">{review.text}</p>}
      {review.ownerReply?.text && <ReviewReply from={businessName} body={review.ownerReply.text} label="Owner's response on Google ·" />}
      {review.googleMapsUri && <a href={review.googleMapsUri} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#1a73e8] hover:underline">View on Google <FaExternalLinkAlt className="h-2.5 w-2.5" aria-hidden /></a>}
    </article>
  );
}
