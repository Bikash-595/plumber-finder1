// import CompanySectionPage, { CompanySectionTable } from "./addcompany/CompanySectionPage";

// const content = {
//   title: "Customers",
//   description: "Manage household and commercial accounts, job history, preferences, and lifetime value.",
//   stats: [
//     { label: "Customers", value: "1,248", detail: "82 new this month" },
//     { label: "Repeat rate", value: "38%", detail: "+5% quarter over quarter" },
//     { label: "Commercial accounts", value: "46", detail: "12 on service plans" },
//   ],
//   tasks: [
//     { title: "Update property access notes", status: "Open", detail: "Gate code changed for Riverbend HOA." },
//     { title: "Send maintenance reminder", status: "Ready", detail: "Annual water heater flush campaign." },
//     { title: "Review VIP account", status: "Today", detail: "Restaurant group requested priority plan." },
//   ],
// };

// const table = {
//   title: "Customer Accounts",
//   description: "Household and commercial accounts with recent activity.",
//   headers: ["Customer", "Type", "Last Job", "Value"],
//   rows: [
//     ["Riverside HOA", "Commercial", "Backflow testing", "$8,450"],
//     ["Maria Coleman", "Residential", "Water heater", "$1,850"],
//     ["Harbor Cafe", "Commercial", "Drain service", "$4,120"],
//     ["Daniel Morris", "Residential", "Leak repair", "$920"],
//   ],
// };

// export default function CustomersSection() {
//   return (
//     <CompanySectionPage content={content}>
//       <CompanySectionTable table={table} />
//     </CompanySectionPage>
//   );
// }


import React from 'react'

const CustomersSection = () => {
  return (
    <div>
      <h2>Customers Section</h2>
      <p>This is where the customers information will be displayed.</p>
      
    </div>
  )
}

export default CustomersSection
