// Social media profiles shown as icons in a company's or freelancer's profile header.
const url = { type: "string", max: 300, pattern: /^https?:\/\/[^\s]+$/i, patternMessage: "must be a full link starting with https://" };

export const socialLinkNames = ["facebook", "instagram", "twitter", "linkedin", "youtube", "tiktok"];
export const socialLinksFields = Object.fromEntries(socialLinkNames.map((name) => [name, url]));
export const socialLinksSchemaFields = Object.fromEntries(socialLinkNames.map((name) => [name, { type: String, trim: true, maxlength: 300 }]));
