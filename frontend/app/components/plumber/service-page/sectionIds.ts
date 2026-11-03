// Anchors for the service page's sections, shared by the section menu and the sections themselves.
export const serviceSectionIds = {
  facts: "at-a-glance",
  overview: "about-this-service",
  problems: "signs-you-need-it",
  process: "how-it-works",
  pricing: "pricing",
  why: "why-choose-us",
  areas: "areas-covered",
  prepare: "before-your-visit",
  faqs: "faqs",
} as const;

/** The provider's reply time, only when it's a real time ("Within 2 hours"), not a placeholder. */
export const replyTime = (value?: string) => (value && /\d|minute|hour|day|same/i.test(value) && !/contact/i.test(value) ? value : undefined);
