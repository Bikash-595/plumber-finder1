// SEO & keywords for a company's or freelancer's public profile: what search engines show (title,
// description, keywords) and a short "about" card with popular searches in the profile's sidebar.
// Everything is plain text — shown escaped, never as HTML.

export const seoFields = {
  metaTitle: { type: "string", max: 70 },        // the title in Google results and the browser tab
  metaDescription: { type: "string", max: 160 }, // the snippet under the title in Google results
  keywords: { type: "list", maxItems: 20, max: 40 },
  sidebarHeading: { type: "string", max: 80 },
  sidebarContent: { type: "text", max: 1200 },
};

export const seoSchemaFields = {
  metaTitle: { type: String, trim: true, maxlength: 70 },
  metaDescription: { type: String, trim: true, maxlength: 160 },
  keywords: { type: [String], default: undefined },
  sidebarHeading: { type: String, trim: true, maxlength: 80 },
  sidebarContent: { type: String, trim: true, maxlength: 1200 },
};

/** The public part (everything, minus internal fields). */
export const publicSeo = (doc) => (doc ? { metaTitle: doc.metaTitle, metaDescription: doc.metaDescription, keywords: doc.keywords ?? [], sidebarHeading: doc.sidebarHeading, sidebarContent: doc.sidebarContent } : null);
