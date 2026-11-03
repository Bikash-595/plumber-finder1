import type { ProfileField } from "@/components/company-dashboard/business-profile/SectionForm";

// Private links to your licence and insurance, for verification. Never shown on your profile.
// Saved to /api/freelancers/verification.
export const verificationConfig = {
  section: "freelancer-verification",
  apiEndpoint: "/freelancers/verification",
  title: "Documents & Verification",
  description: "Links to your licence and insurance documents (for example a shared Google Drive file). Only you and the Plumber Finder team can see them.",
  defaults: { license: "https://drive.google.com/…/license.pdf", insurance: "https://drive.google.com/…/insurance.pdf", panVat: "", registrationCertificate: "", notes: "" },
  fields: [
    { name: "license", label: "Licence Document Link", type: "url" },
    { name: "insurance", label: "Insurance Certificate Link", type: "url" },
    { name: "panVat", label: "PAN / VAT Document Link", type: "url" },
    { name: "registrationCertificate", label: "Registration Certificate Link", type: "url" },
    { name: "notes", label: "Notes for the reviewer", type: "textarea" },
  ] satisfies ProfileField[],
};
