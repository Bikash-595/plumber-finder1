import SectionForm from "../SectionForm";

// Example values, shown as hints until the company saves its own.
const examples = { foundedYear: "2016", yearsInBusiness: "10", teamSize: "8", licenseNumber: "PL-90991", insurance: "$2M liability", responseTime: "Within 1 hour", serviceAreaCount: "12", averageCost: "185", projectsCompleted: "240", certifications: "OSHA, EPA" };

/** "Company at a Glance" numbers on the public profile, saved to /companies/company-overview. */
export default function CompanyAtAGlanceForm() {
  return <SectionForm section="company-overview" apiEndpoint="/companies/company-overview" title="Company Overview" description="These details fill the “Company at a Glance” section of your public profile." defaults={examples} fields={[
    { name: "foundedYear", label: "Founded Year", type: "number" },
    { name: "yearsInBusiness", label: "Years in Business", type: "number" },
    { name: "teamSize", label: "Team Size (number of plumbers)", type: "number" },
    { name: "licenseNumber", label: "License Number" },
    { name: "insurance", label: "Insurance Coverage" },
    { name: "responseTime", label: "Typical Response Time" },
    { name: "serviceAreaCount", label: "Service Areas (number of cities)", type: "number" },
    { name: "averageCost", label: "Average Service Cost (USD)", type: "number" },
    { name: "projectsCompleted", label: "Projects Completed", type: "number" },
    { name: "certifications", label: "Certifications (separate with commas)" },
  ]} />;
}
