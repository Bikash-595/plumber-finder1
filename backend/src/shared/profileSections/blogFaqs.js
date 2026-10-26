// Questions and answers at the end of a blog post (company, freelancer, or Plumber Finder's own),
// shown under the article and as FAQ structured data for search engines.

export const blogFaqsField = {
  type: "objects",
  maxItems: 15,
  fields: {
    question: { type: "string", required: true, max: 300 },
    answer: { type: "text", required: true, max: 2000 },
  },
};

export const blogFaqsSchema = { type: [{ question: { type: String, trim: true, maxlength: 300 }, answer: { type: String, trim: true, maxlength: 2000 }, _id: false }], default: [] };
