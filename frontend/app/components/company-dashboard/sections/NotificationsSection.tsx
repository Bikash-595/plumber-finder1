// import CompanySectionPage, { CompanySectionTable } from "./addcompany/CompanySectionPage";

// const content = {
//   title: "Notifications",
//   description: "Stay on top of urgent leads, booking changes, account alerts, and review activity.",
//   stats: [
//     { label: "Unread", value: "12", detail: "4 urgent lead alerts" },
//     { label: "Booking changes", value: "5", detail: "2 need confirmation" },
//     { label: "Review alerts", value: "3", detail: "1 needs a reply" },
//   ],
//   tasks: [
//     { title: "Emergency lead requested callback", status: "New", detail: "Water heater leak in Austin, 2.8 miles away." },
//     { title: "Invoice paid", status: "Done", detail: "Invoice PF-1048 paid by Maria Coleman." },
//     { title: "New five star review", status: "Reply", detail: "Customer praised same-day drain cleaning." },
//   ],
// };

// const table = {
//   title: "Notification Queue",
//   description: "Alerts that need owner, dispatcher, or billing attention.",
//   headers: ["Alert", "Source", "Priority", "Status"],
//   rows: [
//     ["Emergency lead requested callback", "Lead inbox", "High", "New"],
//     ["Review waiting for reply", "Reviews", "Medium", "Open"],
//     ["Insurance document expiring", "Profile", "High", "Due soon"],
//     ["Customer changed appointment", "Schedule", "Medium", "Confirm"],
//   ],
// };

// export default function NotificationsSection() {
//   return (
//     <CompanySectionPage content={content}>
//       <CompanySectionTable table={table} />
//     </CompanySectionPage>
//   );
// }








import React from 'react'

const NotificationsSection = () => {
  return (
    <div>
      <h2>Notifications Section</h2>
      <p>This is where the notifications information will be displayed.</p>
      
    </div>
  )
}

export default NotificationsSection
