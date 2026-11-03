// A service's own page lives under its provider's page: /company/<slug>/services/<name>-<id>.
// The readable name part is for people and search engines; only the id at the end is used.

const slugify = (text: string) => text.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_-]+/g, "-").slice(0, 60).replace(/-+$/, "");
const SERVICE_ID = /^[a-f0-9]{24}$/i;

/** Whether a service id belongs to a live (database) service, so it has a page. */
export const hasServicePage = (id: string | undefined): id is string => Boolean(id && SERVICE_ID.test(id));

/** "drain-cleaning-6650c2…" */
export const serviceSegment = (name: string, id: string) => `${slugify(name) || "service"}-${id}`;

/** The service id at the end of a URL segment, or null. */
export function serviceIdFrom(segment: string): string | null {
  const id = decodeURIComponent(segment).slice(-24);
  return SERVICE_ID.test(id) ? id : null;
}
