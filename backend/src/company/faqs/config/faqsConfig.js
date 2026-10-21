// Questions and answers shown on the company's public profile.
export const faqsConfig = {
  label: "FAQ",
  labelPlural: "FAQs",
  maxItems: 50,
  fields: {
    question: { type: "string", required: true, max: 300 },
    answer: { type: "text", required: true, max: 3000 },
  },
};
