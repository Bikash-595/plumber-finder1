import type { RankingPage } from "./directoryApi";

// Headings, page titles, descriptions, the introduction and the FAQ of a ranking page — written from the real
// numbers on the page (never invented): how many providers, how many are verified, the actual top names.

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export function placeName(data: RankingPage) {
  return data.page.city ? `${data.page.city.name}, ${data.page.state.code}` : data.page.state.name;
}

/** "Plumbers", "Licensed Plumbers", "Drain Cleaning Companies". */
export function nounName(data: RankingPage) {
  return data.page.service?.noun ?? (data.page.verifiedOnly ? "Licensed Plumbers" : "Plumbers");
}

export function heading(data: RankingPage) {
  return `Top ${data.page.limit} ${nounName(data)} in ${data.page.city ? data.page.city.name : data.page.state.name}`;
}

export function pageTitle(data: RankingPage) {
  const base = `Top ${data.page.limit} ${nounName(data)} in ${placeName(data)}`;
  return data.page.limit === 50 && !data.page.service ? `${base} – Best Plumbing Companies` : base;
}

export function pageDescription(data: RankingPage) {
  const place = placeName(data);
  const noun = nounName(data).toLowerCase();
  if (!data.qualifying) return `No ${noun} are listed in ${place} on Plumber Finder yet. See nearby areas and related services, or list your plumbing business.`;
  const shown = Math.min(data.qualifying, data.page.limit);
  return `${data.page.limit === 10 ? "Discover" : "Explore"} the top ${shown} ${noun} in ${place}, ranked by customer reviews, verification, completed jobs and profile quality. Compare ratings, services and contact details on Plumber Finder.`.slice(0, 300);
}

export function introduction(data: RankingPage) {
  const place = placeName(data);
  if (!data.qualifying) return `There are no ${nounName(data).toLowerCase()} listed in ${place} yet. When local businesses join Plumber Finder, they will be ranked here on real reviews and completed jobs.`;
  const shown = Math.min(data.qualifying, data.page.limit);
  const fewer = data.qualifying < data.page.limit ? ` Only ${plural(data.qualifying, "provider")} qualify so far, so this list shows ${shown} instead of ${data.page.limit}.` : "";
  return `We ranked ${plural(data.qualifying, "plumbing provider")} in ${place} using reviews from Plumber Finder customers and Google, business verification, jobs completed through Plumber Finder, service coverage and profile completeness.${fewer} Sponsored listings are shown separately and never change the ranking.`;
}

export function faqs(data: RankingPage): { question: string; answer: string }[] {
  const place = placeName(data);
  const noun = nounName(data).toLowerCase();
  const list: { question: string; answer: string }[] = [];
  if (data.items.length) {
    const top = data.items.slice(0, 3).map((item) => (item.rating.count ? `${item.name} (${item.rating.average.toFixed(1)}★ from ${plural(item.rating.count, "review")})` : item.name));
    list.push({ question: `Who are the best ${noun} in ${place}?`, answer: `Based on Plumber Finder's ranking, the top ${noun} in ${place} right now are ${top.join(", ")}. The ranking updates as new reviews and completed jobs come in.` });
  }
  // The weights in use (admins can change them), read from a listing's score breakdown.
  const factors = (data.items[0] ?? data.sponsored[0])?.breakdown;
  const total = factors?.reduce((sum, factor) => sum + factor.weight, 0) || 0;
  const method = factors && total
    ? factors.filter((factor) => factor.weight > 0).map((factor) => `${factor.label.toLowerCase()} (${Math.round((factor.weight / total) * 100)}%)`).join(", ")
    : "customer ratings and review volume, business verification, completed jobs, service and location relevance, profile completeness and recent customer engagement";
  list.push({ question: "How are these plumbers ranked?", answer: `Each provider gets a score from ${method}. Open “Why this rank?” on any listing to see its score. Paid placement never changes the order.` });
  if (data.items.length) list.push({ question: `Are the ${noun} in ${place} verified?`, answer: `${data.stats.verified} of the ${plural(data.items.length, "provider")} listed here ${data.stats.verified === 1 ? "is" : "are"} verified by Plumber Finder (an approved business or checked documents). Verified providers show a badge.` });
  if (!data.page.service || data.page.service.slug === "emergency-plumbing") list.push({ question: `Can I find an emergency plumber in ${place}?`, answer: data.stats.emergency ? `Yes — ${plural(data.stats.emergency, "provider")} on this list offer${data.stats.emergency === 1 ? "s" : ""} emergency or 24/7 service.` : `None of the providers on this list advertise emergency service yet. Try the emergency plumbers ranking for ${data.page.state.name}.` });
  list.push({ question: "Where do the ratings come from?", answer: "Ratings combine reviews written on Plumber Finder (verified bookings and customers) with the Google rating a business has connected. Both are shown separately on each listing; nothing is counted twice." });
  return list;
}
