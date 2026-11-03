import type { ProfileField } from "@/components/company-dashboard/business-profile/SectionForm";

// Phones, WhatsApp, an emergency line, email and website. The main phone is copied to your public listing.
// Saved to /api/freelancers/contact.
export const contactConfig = {
  section: "freelancer-contact",
  apiEndpoint: "/freelancers/contact",
  title: "Contact Information",
  description: "How customers reach you. Your main phone appears on your profile and directory card.",
  defaults: { primaryPhone: "(214) 555-6677", secondaryPhone: "", whatsapp: "+1 214 555 6677", emergencyHotline: "(214) 555-9111", email: "you@example.com", website: "https://yourwebsite.com" },
  fields: [
    { name: "primaryPhone", label: "Main Phone", type: "tel" },
    { name: "secondaryPhone", label: "Second Phone", type: "tel" },
    { name: "whatsapp", label: "WhatsApp", type: "tel" },
    { name: "emergencyHotline", label: "24/7 Emergency Line", type: "tel" },
    { name: "email", label: "Email", type: "email" },
    { name: "website", label: "Website", type: "url" },
  ] satisfies ProfileField[],
};
