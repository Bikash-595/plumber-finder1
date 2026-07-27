// import CompanySectionPage, { CompanySectionTable } from "./addcompany/CompanySectionPage";

// const content = {
//   title: "Reviews",
//   description: "Monitor ratings, reply to customer feedback, and surface testimonials on your profile.",
//   stats: [
//     { label: "Rating", value: "4.9", detail: "From 386 reviews" },
//     { label: "New reviews", value: "18", detail: "This month" },
//     { label: "Response rate", value: "94%", detail: "Target is 100%" },
//   ],
//   tasks: [
//     { title: "Reply to neutral review", status: "Important", detail: "Customer mentioned scheduling confusion." },
//     { title: "Feature commercial testimonial", status: "Ready", detail: "Restaurant group approved public quote." },
//     { title: "Request reviews from completed jobs", status: "Queued", detail: "12 customers eligible." },
//   ],
// };

// const table = {
//   title: "Review Desk",
//   description: "Recent feedback and response responsibilities.",
//   headers: ["Reviewer", "Rating", "Topic", "Status"],
//   rows: [
//     ["Lena Ortiz", "5.0", "Same-day drain cleaning", "Featured"],
//     ["Chris Nguyen", "4.0", "Scheduling clarity", "Reply needed"],
//     ["Harbor Cafe", "5.0", "Commercial maintenance", "Published"],
//     ["Maria Coleman", "5.0", "Water heater install", "Request testimonial"],
//   ],
// };

// export default function ReviewsSection() {
//   return (
//     <CompanySectionPage content={content}>
//       <CompanySectionTable table={table} />
//     </CompanySectionPage>
//   );
// }







import React from 'react'

const ReviewsSection = () => {
  return (
    <div>
      <h2>Reviews Section</h2>
      <p>This is where the reviews information will be displayed.</p>
      
    </div>
  )
}

export default ReviewsSection
