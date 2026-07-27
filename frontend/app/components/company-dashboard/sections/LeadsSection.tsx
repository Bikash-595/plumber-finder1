// import CompanySectionPage, { CompanySectionTable } from "./addcompany/CompanySectionPage";

// const content = {
//   title: "Leads",
//   description: "Qualify new requests, assign estimators, and move opportunities into booked work.",
//   stats: [
//     { label: "New leads", value: "28", detail: "9 marked high intent" },
//     { label: "Quoted", value: "17", detail: "6 awaiting approval" },
//     { label: "Won revenue", value: "$18.4k", detail: "From 43 booked jobs" },
//   ],
//   tasks: [
//     { title: "Quote kitchen pipe repair", status: "Due 11:30 AM", detail: "Needs license and insurance attachment." },
//     { title: "Call commercial property manager", status: "Hot", detail: "Backflow inspection for three locations." },
//     { title: "Follow up on sewer camera estimate", status: "Pending", detail: "Customer opened quote twice." },
//   ],
// };

// const table = {
//   title: "Lead Board",
//   description: "Qualified customer requests moving from intake to booked jobs.",
//   headers: ["Customer", "Service", "Value", "Stage"],
//   rows: [
//     ["Maria Coleman", "Water heater replacement", "$1,850", "Quoted"],
//     ["Harbor Cafe", "Grease line inspection", "$680", "Needs quote"],
//     ["Riverside HOA", "Backflow testing", "$2,400", "Qualified"],
//     ["Daniel Morris", "Emergency leak repair", "$520", "New"],
//   ],
// };

// export default function LeadsSection() {
//   return (
//     <CompanySectionPage content={content}>
//       <CompanySectionTable table={table} />
//     </CompanySectionPage>
//   );
// }




import React from 'react'

const LeadsSection = () => {
  return (
    <div>
      <h2>Leads Section</h2>
      <p>This is where the leads information will be displayed.</p> 
      
    </div>
  )
}

export default LeadsSection
