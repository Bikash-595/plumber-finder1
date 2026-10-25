// import { FaStar } from "react-icons/fa";

// interface Review {
//   name: string;
//   rating: number;
//   text: string;
//   date: string;
// }

// const sampleReviews: Review[] = [
//   { name: "John D.", rating: 5, text: "Excellent service! Fixed my leaky faucet in 30 minutes.", date: "2024-02-15" },
//   { name: "Sarah M.", rating: 5, text: "Very professional and clean. Will hire again.", date: "2024-02-10" },
// ];

// export default function ProfileReviews() {
//   return (
//     <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
//       <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
//       <div className="space-y-4">
//         {sampleReviews.map((review, idx) => (
//           <div key={idx} className="border-b border-gray-100 pb-4 last:border-0">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <span className="font-semibold text-gray-900">{review.name}</span>
//                 <div className="flex text-[#FFD60A]">
//                   {[...Array(review.rating)].map((_, i) => (
//                     <FaStar key={i} className="h-3 w-3" />
//                   ))}
//                 </div>
//               </div>
//               <span className="text-xs text-gray-400">{review.date}</span>
//             </div>
//             <p className="mt-1 text-gray-700">{review.text}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }










import { FaStar } from "react-icons/fa";
import type { Plumber } from "@/components/find/types";

const sampleReviews = [
  { name: "John D.", rating: 5, text: "Excellent service! Fixed my leaky faucet in 30 minutes.", date: "2024-02-15" },
  { name: "Sarah M.", rating: 5, text: "Very professional and clean. Will hire again.", date: "2024-02-10" },
  { name: "Robert K.", rating: 4, text: "Good work, a bit pricey but quality.", date: "2024-02-05" },
];

/** Real reviews for live companies; demo plumbers keep the sample reviews. */
export default function ProfileReviews({ plumber }: { plumber?: Plumber }) {
  const isLive = plumber?.reviews !== undefined;
  const reviews = isLive ? plumber.reviews! : sampleReviews;
  return (
    <div id="reviews" className="scroll-mt-24 rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
        {isLive && reviews.length > 0 && <span className="text-sm text-gray-500">{plumber.rating.toFixed(1)} average · {plumber.reviewCount} review{plumber.reviewCount === 1 ? "" : "s"}</span>}
      </div>
      {reviews.length === 0 && <p className="text-sm text-gray-500">No reviews yet.</p>}
      <div className="space-y-4">
        {reviews.map((review, idx) => (
          <div key={idx} className="border-b border-gray-100 pb-4 last:border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{review.name}</span>
                <div className="flex text-[#FFD60A]" aria-label={`${review.rating} out of 5 stars`}>
                  {[...Array(Math.round(review.rating))].map((_, i) => (
                    <FaStar key={i} className="h-3 w-3" />
                  ))}
                </div>
              </div>
              <span className="text-xs text-gray-400">{review.date}</span>
            </div>
            <p className="mt-1 text-gray-700">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
