// import CompanySectionPage, { CompanySectionTable } from "./addcompany/CompanySectionPage";

// const content = {
//   title: "Company Profile",
//   description: "Keep public listing details, license data, photos, badges, and business story current.",
//   stats: [
//     { label: "Profile health", value: "92%", detail: "Add two project photos" },
//     { label: "Verified badges", value: "6", detail: "License, insured, emergency" },
//     { label: "Listing rank", value: "#3", detail: "In primary service area" },
//   ],
//   tasks: [
//     { title: "Upload new crew photo", status: "Recommended", detail: "Profiles with team photos convert better." },
//     { title: "Renew insurance document", status: "Due soon", detail: "Expires in 18 days." },
//     { title: "Add emergency service copy", status: "Open", detail: "Improve after-hours search matching." },
//   ],
// };

// const table = {
//   title: "Profile Completion",
//   description: "Public listing areas that influence customer trust and ranking.",
//   headers: ["Profile Area", "Health", "Impact", "Next Step"],
//   rows: [
//     ["License and insurance", "Complete", "High", "Renew before expiry"],
//     ["Project gallery", "Needs work", "High", "Add two photos"],
//     ["Service descriptions", "Strong", "Medium", "Refresh emergency copy"],
//     ["Owner story", "Draft", "Medium", "Publish profile intro"],
//   ],
// };

// export default function CompanyProfileSection() {
//   return (
//     <CompanySectionPage content={content}>
//       <CompanySectionTable table={table} />
//     </CompanySectionPage>
//   );
// }








import React from 'react'

const CompanyProfileSection = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900">Company Profile Section</h1>
      <p className="text-gray-600  " >This is where the company profile information will be displayed.</p>
    </>
  )
}

export default CompanyProfileSection
