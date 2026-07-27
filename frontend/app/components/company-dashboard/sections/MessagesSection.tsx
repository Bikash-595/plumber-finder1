// import CompanySectionPage, { CompanySectionTable } from "./addcompany/CompanySectionPage";

// const content = {
//   title: "Messages",
//   description: "Reply to customers, internal dispatch notes, quote questions, and support threads.",
//   stats: [
//     { label: "Customer inbox", value: "21", detail: "7 unread" },
//     { label: "Avg reply", value: "8 min", detail: "Target is 15 min" },
//     { label: "Team notes", value: "34", detail: "Across active jobs" },
//   ],
//   tasks: [
//     { title: "Reply to bathtub leak question", status: "Unread", detail: "Customer attached two photos." },
//     { title: "Send arrival ETA", status: "Queued", detail: "Technician is 18 minutes away." },
//     { title: "Clarify warranty coverage", status: "Open", detail: "Water heater install from March." },
//   ],
// };

// const table = {
//   title: "Message Center",
//   description: "Customer and internal threads that keep work moving.",
//   headers: ["Thread", "From", "Last Message", "Status"],
//   rows: [
//     ["Estimate question", "Maria Coleman", "Can you include haul-away?", "Unread"],
//     ["Technician note", "Crew B", "Need one more compression fitting", "Open"],
//     ["Warranty request", "Daniel Morris", "Water pressure changed", "Reply"],
//     ["Arrival ETA", "Harbor Cafe", "Back door access confirmed", "Done"],
//   ],
// };

// export default function MessagesSection() {
//   return (
//     <CompanySectionPage content={content}>
//       <CompanySectionTable table={table} />
//     </CompanySectionPage>
//   );
// }




import React from 'react'

const MessagesSection = () => {
  return (
    <div>
      
      <h2>Messages Section</h2>
      <p>This is where the messages information will be displayed.</p>  
    </div>
  )
}

export default MessagesSection
