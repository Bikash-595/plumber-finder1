// import CompanySectionPage, { CompanySectionTable } from "./addcompany/CompanySectionPage";

// const content = {
//   title: "Jobs",
//   description: "Manage active jobs, technician assignments, job notes, materials, and completion status.",
//   stats: [
//     { label: "Active jobs", value: "19", detail: "7 in progress today" },
//     { label: "Completed", value: "64", detail: "This month" },
//     { label: "Callbacks", value: "2", detail: "Below 3% target" },
//   ],
//   tasks: [
//     { title: "Dispatch team to slab leak", status: "In progress", detail: "Crew B has equipment staged." },
//     { title: "Upload photos for PF-1092", status: "Missing", detail: "Before and after gallery required." },
//     { title: "Close drain cleaning job", status: "Ready", detail: "Customer signature collected." },
//   ],
// };

// const table = {
//   title: "Job Control",
//   description: "Active field work, assignments, closeout needs, and service status.",
//   headers: ["Job", "Technician", "Window", "Status"],
//   rows: [
//     ["Slab leak repair", "Crew B", "8 AM - 12 PM", "In progress"],
//     ["Kitchen drain replacement", "Nina Patel", "10 AM - 1 PM", "Assigned"],
//     ["Water heater install", "Marco Diaz", "1 PM - 4 PM", "Parts ready"],
//     ["Commercial inspection", "Crew C", "3 PM - 6 PM", "Confirmed"],
//   ],
// };

// export default function JobsSection() {
//   return (
//     <CompanySectionPage content={content}>
//       <CompanySectionTable table={table} />
//     </CompanySectionPage>
//   );
// }

import React from 'react'

const JobsSection = () => {
  return (
    <div>

      <h2>Jobs Section</h2>
      <p>This is where the jobs information will be displayed.</p>
      
    </div>
  )
}

export default JobsSection
