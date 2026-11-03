import type { ProfileField } from "@/components/company-dashboard/business-profile/SectionForm";

// Questions and answers shown on your profile.
// Saved to /api/freelancers/faqs.
export const faqsConfig = {
  section: "freelancer-faqs",
  apiEndpoint: "/freelancers/faqs",
  title: "Frequently Asked Questions",
  description: "Answer common questions before customers need to ask.",
  itemName: "Question",
  fields: [
    { name: "question", label: "Question" },
    { name: "answer", label: "Answer", type: "textarea" },
  ] satisfies ProfileField[],
};
