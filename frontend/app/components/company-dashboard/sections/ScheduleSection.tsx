// import CompanySectionPage, { CompanySectionTable } from "./addcompany/CompanySectionPage";

// const content = {
//   title: "Schedule",
//   description: "Plan technician routes, availability windows, emergency slots, and recurring visits.",
//   stats: [
//     { label: "Today visits", value: "14", detail: "3 emergency windows" },
//     { label: "Open slots", value: "6", detail: "Afternoon availability" },
//     { label: "On-time rate", value: "96%", detail: "+4% this week" },
//   ],
//   tasks: [
//     { title: "Reassign downtown repair", status: "Route", detail: "Move to closest technician after 2 PM." },
//     { title: "Confirm HOA inspection", status: "Tomorrow", detail: "Needs two certified plumbers." },
//     { title: "Block training window", status: "Friday", detail: "Backflow certification refresh." },
//   ],
// };

// const table = {
//   title: "Schedule Planner",
//   description: "Today and tomorrow route windows across the service team.",
//   headers: ["Window", "Route", "Open Slots", "Notes"],
//   rows: [
//     ["8 AM - 10 AM", "North route", "0", "Full"],
//     ["10 AM - 1 PM", "Downtown route", "1", "Emergency buffer"],
//     ["1 PM - 4 PM", "West route", "3", "Good for estimates"],
//     ["4 PM - 7 PM", "South route", "2", "After-work calls"],
//   ],
// };

// export default function ScheduleSection() {
//   return (
//     <CompanySectionPage content={content}>
//       <CompanySectionTable table={table} />
//     </CompanySectionPage>
//   );
// }








import React from 'react'

const ScheduleSection = () => {
  return (
    <div>
      <h2>Schedule Section</h2>
      <p>This is where the schedule information will be displayed.</p>
      
    </div>
  )
}

export default ScheduleSection
