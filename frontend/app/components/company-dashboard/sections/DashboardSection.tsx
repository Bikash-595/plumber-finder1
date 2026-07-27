import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import CompanySectionPage, { CompanySectionTable } from "./addcompany/CompanySectionPage";
// import { companyNavSections } from "../companyDashboardData";

const content = {
  title: "Company Dashboard",
  description: "Run the plumbing business from one focused workspace.",
  stats: [
    { label: "New leads", value: "28", detail: "9 high intent" },
    { label: "Active jobs", value: "19", detail: "7 in progress today" },
    { label: "Monthly revenue", value: "$84.2k", detail: "+14% from last month" },
  ],
  tasks: [
    { title: "Respond to emergency lead", status: "Hot", detail: "Burst pipe request within 3 miles." },
    { title: "Approve tomorrow's route", status: "Today", detail: "14 jobs across three teams." },
    { title: "Reply to new review", status: "Open", detail: "Five star review on water heater install." },
  ],
};

const table = {
  title: "Command Summary",
  description: "A daily snapshot of sales, dispatch, and listing health.",
  headers: ["Area", "Current", "Owner", "Action"],
  rows: [
    ["Lead response", "8 min average", "Sales desk", "Keep under 15 min"],
    ["Dispatch load", "82% utilization", "Operations", "Protect emergency slots"],
    ["Profile health", "92%", "Marketing", "Add two project photos"],
    ["Billing status", "Pro plan active", "Owner", "Review credits Friday"],
  ],
};

// function CompanyPageDirectory() {
//   return (
//     <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
//       <div>
//         <h2 className="text-lg font-bold text-gray-900">Company Dashboard Pages</h2>
//         <p className="text-sm text-gray-500">
//           Every company workspace page is connected here and in the sidebar.
//         </p>
//       </div>

//       {/* <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
//         {companyNavSections.map((section) => (
//           <div key={section.label} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
//             <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">
//               {section.label}
//             </h3>
//             <div className="mt-3 space-y-2">
//               {section.items.map((item) => {
//                 const Icon = item.icon;

//                 return (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     className="group flex min-h-11 items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-[#0b1f3b] hover:text-white"
//                   >
//                     <span className="flex min-w-0 items-center gap-3">
//                       <Icon className="h-4 w-4 flex-shrink-0 text-[#FFD60A]" />
//                       <span className="truncate">{item.label}</span>
//                     </span>
//                     <FaArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-gray-300 transition group-hover:text-[#FFD60A]" />
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div> */}
//     </section>
//   );
// }

export default function DashboardSection() {
  return (
    <CompanySectionPage content={content}>
      {/* <CompanyPageDirectory /> */}
      <CompanySectionTable table={table} />
    </CompanySectionPage>
  );
}
