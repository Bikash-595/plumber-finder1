// Turns a post's HTML into the article (heading ids for the table of contents) and picks its category.

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function buildArticleMarkup(rawHtml: string): { html: string; toc: TocItem[] } {
  const counts: Record<string, number> = {};
  const toc: TocItem[] = [];

  let html = rawHtml.replace(/<(h[2-4])>([\s\S]*?)<\/\1>/gi, (_, tag: string, inner: string) => {
    const text = inner.replace(/<[^>]*>/g, "").trim();
    const normalizedTag = tag.toLowerCase();

    if (!text) return `<${normalizedTag}>${inner}</${normalizedTag}>`;

    const base = slugify(text) || "section";
    counts[base] = (counts[base] ?? 0) + 1;
    const id = counts[base] === 1 ? base : `${base}-${counts[base]}`;

    toc.push({
      id,
      text,
      level: Number(normalizedTag.replace("h", "")) as TocItem["level"],
    });

    const headingClasses =
      normalizedTag === "h2"
        ? "scroll-mt-28 mt-12 mb-4 text-3xl font-extrabold leading-tight text-slate-950 dark:text-slate-950"
        : normalizedTag === "h3"
          ? "scroll-mt-28 mt-9 mb-3 text-2xl font-bold leading-snug text-slate-900 dark:text-slate-900"
          : "scroll-mt-28 mt-7 mb-2 text-xl font-bold leading-snug text-slate-900 dark:text-slate-900";

    return `<${normalizedTag} id="${id}" class="${headingClasses}">${inner}</${normalizedTag}>`;
  });

  html = html
    .replace(/<p>/g, '<p class="mb-6 text-lg leading-8 text-slate-700 dark:text-slate-700">')
    .replace(/<ul>/g, '<ul class="mb-7 list-disc space-y-2 pl-6 text-lg leading-8 text-slate-700 dark:text-slate-700">')
    .replace(/<ol>/g, '<ol class="mb-7 list-decimal space-y-2 pl-6 text-lg leading-8 text-slate-700 dark:text-slate-700">')
    .replace(/<blockquote>/g, '<blockquote class="my-8 rounded-2xl border-l-4 border-[#f7672c] bg-orange-50 p-6 text-xl font-medium leading-8 text-slate-900 dark:bg-orange-500/10 dark:text-slate-900">')
    .replace(/<a /g, '<a class="font-semibold text-[#f7672c] underline-offset-4 hover:underline" ');

  return { html, toc };
}

export function getCategory(title: string, summary: string) {
  const text = `${title} ${summary}`.toLowerCase();

  if (/emergency|burst|flood|urgent/.test(text)) return "Emergency Plumbing";
  if (/heater|hot water|tankless/.test(text)) return "Water Heating";
  if (/drain|sewer|clog/.test(text)) return "Drain & Sewer";
  if (/upgrade|fixture|renovation/.test(text)) return "Home Upgrades";

  return "Maintenance Guide";
}
