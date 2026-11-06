import type { RankingPage } from "./directoryApi";

// Headings, page titles, descriptions, the introduction and the FAQ of a ranking page — written from the real
// numbers on the page (never invented): how many premium providers, how many are verified, the actual top names.
// Each page design (USA, state, city) has its own wording; an admin's own title / description / introduction
// (data.text) replaces the built-in one.

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** "the USA", "Texas", "Austin, TX". */
export function placeName(data: RankingPage) {
  const { state, city } = data.page;
  if (!state) return "the USA";
  return city ? `${city.name}, ${state.code}` : state.name;
}

/** "USA", "Texas", "Austin" — the short form for headings. */
export function shortPlace(data: RankingPage) {
  return data.page.city?.name ?? data.page.state?.name ?? "the USA";
}

/** "Plumbers", "Licensed Plumbers", "Drain Cleaning Companies". */
export function nounName(data: RankingPage) {
  return data.page.service?.noun ?? (data.page.verifiedOnly ? "Licensed Plumbers" : "Plumbers");
}

export function heading(data: RankingPage) {
  return `Top ${data.page.limit} ${nounName(data)} in ${shortPlace(data)}`;
}

export function pageTitle(data: RankingPage) {
  if (data.text.title) return data.text.title;
  const { limit, scope, service } = data.page;
  const base = `Top ${limit} ${nounName(data)} in ${placeName(data)}`;
  if (scope === "usa") return `${base} – Premium Plumbing Companies Across America`;
  return limit === 50 && !service ? `${base} – Best Plumbing Companies` : `${base} – Premium & Verified`;
}

export function pageDescription(data: RankingPage) {
  if (data.text.description) return data.text.description;
  const place = placeName(data);
  const noun = nounName(data).toLowerCase();
  if (!data.qualifying) return `No premium ${noun} are listed in ${place} on Plumber Finder yet. Explore nearby areas and related services, or list your plumbing business.`;
  const shown = Math.min(data.qualifying, data.page.limit);
  const across = data.page.scope === "usa" ? ` across ${plural(data.coverage.length, "state")}` : "";
  return `Compare the top ${shown} premium ${noun} in ${place}${across}, ranked by customer reviews, verification, completed jobs and profile quality. See ratings, services, contact details and websites.`.slice(0, 300);
}

export function introduction(data: RankingPage) {
  if (data.text.intro) return data.text.intro;
  const place = placeName(data);
  const noun = nounName(data).toLowerCase();
  if (!data.qualifying) return `There are no premium ${noun} in ${place} yet. When local businesses join Plumber Finder Premium, they will be ranked here on real reviews, verification and completed jobs.`;
  const shown = Math.min(data.qualifying, data.page.limit);
  const fewer = data.qualifying < data.page.limit ? ` ${plural(data.qualifying, "premium provider")} ${data.qualifying === 1 ? "qualifies" : "qualify"} so far, so this list shows ${shown} instead of ${data.page.limit}.` : "";
  const scope = data.page.scope === "usa"
    ? `from ${plural(data.coverage.length, "state")}`
    : data.page.scope === "city" ? `serving ${data.page.city!.name}` : `across ${data.page.state!.name}`;
  return `This ranking lists premium plumbing businesses on Plumber Finder ${scope}. Verified businesses come first; within each group the order comes from reviews by Plumber Finder customers and Google, completed jobs, service coverage and profile quality — never from what anyone pays.${fewer}`;
}

/** The questions of a page, depending on its design. */
export function faqs(data: RankingPage): { question: string; answer: string }[] {
  const place = placeName(data);
  const noun = nounName(data).toLowerCase();
  const { scope, state, city } = data.page;
  const list: { question: string; answer: string }[] = [];
  if (data.items.length) {
    const top = data.items.slice(0, 3).map((item) => (item.rating.count ? `${item.name} (${item.rating.average.toFixed(1)}★ from ${plural(item.rating.count, "review")})` : item.name));
    list.push({ question: `Who are the best ${noun} in ${place}?`, answer: `Based on Plumber Finder's ranking, the top premium ${noun} in ${place} right now are ${top.join(", ")}. The ranking updates as new reviews, verifications and completed jobs come in.` });
  }
  // The weights in use (admins can change them), read from a listing's score breakdown.
  const factors = (data.items[0] ?? data.sponsored[0])?.breakdown;
  const total = factors?.reduce((sum, factor) => sum + factor.weight, 0) || 0;
  const method = factors && total
    ? factors.filter((factor) => factor.weight > 0).map((factor) => `${factor.label.toLowerCase()} (${Math.round((factor.weight / total) * 100)}%)`).join(", ")
    : "customer ratings and review volume, business verification, completed jobs, service and location relevance, profile completeness and recent customer engagement";
  list.push({ question: "Why are only premium companies ranked?", answer: "Top 10 and Top 50 lists feature Plumber Finder Premium members: businesses with a complete, actively managed profile. Premium decides who can be listed, not the order. Every plumber, premium or not, is still listed in the full directory." });
  list.push({ question: "How is the order decided?", answer: `Verified businesses come first. Within each group, every provider gets a score from ${method}. Open “Why this rank?” on any listing to see its score.` });
  if (scope === "usa") {
    const states = data.coverage.slice(0, 3).map((item) => item.name);
    list.push({ question: "Which states have the most premium plumbers?", answer: states.length ? `Right now ${states.join(", ")} have the most premium plumbing businesses on Plumber Finder. Choose a state to see its own Top 10 and Top 50.` : "Premium plumbers are joining every week. Choose a state to see its own ranking." });
    list.push({ question: "Is there a ranking for my state or city?", answer: "Yes. Every US state and its major cities has its own Top 10 and Top 50 page, with plumbers who are based there or serve the area." });
  }
  if (scope === "state" && state) {
    const cities = data.nearby.filter((item) => item.providers > 0).slice(0, 3).map((item) => item.name);
    list.push({ question: `Which cities in ${state.name} have premium plumbers?`, answer: cities.length ? `Premium plumbers on Plumber Finder are based in or serve ${cities.join(", ")} and other ${state.name} cities. Each city has its own ranking.` : `Premium plumbers in ${state.name} are listed above. Each city in ${state.name} also has its own ranking.` });
    list.push({ question: `Do plumbers in ${state.name} need a license?`, answer: `Most states, ${state.name} included, license plumbers at the state or local level. Providers marked Verified Business have been checked by Plumber Finder; always ask a plumber for their license number before work starts.` });
  }
  if (scope === "city" && city) {
    list.push({ question: `Do these plumbers serve all of ${city.name}?`, answer: `The list includes plumbers based in ${city.name} and plumbers who list ${city.name} in their service area. Distances are measured from the city centre.` });
  }
  if (data.items.length) list.push({ question: `Are the ${noun} in ${place} verified?`, answer: `${data.stats.verified} of the ${plural(data.items.length, "provider")} listed here ${data.stats.verified === 1 ? "is a" : "are"} Verified Business${data.stats.verified === 1 ? "" : "es"} (an approved business or checked documents) and shown first.` });
  if (!data.page.service || data.page.service.slug === "emergency-plumbing") list.push({ question: `Can I find an emergency plumber in ${place}?`, answer: data.stats.emergency ? `Yes — ${plural(data.stats.emergency, "provider")} on this list offer${data.stats.emergency === 1 ? "s" : ""} emergency or 24/7 service.` : "None of the providers on this list advertise emergency service yet. Try the emergency plumbers ranking." });
  list.push({ question: "Where do the ratings come from?", answer: "Ratings combine reviews written on Plumber Finder (verified bookings and customers) with the Google rating a business has connected. Both are shown separately on each listing; nothing is counted twice." });
  return list;
}
