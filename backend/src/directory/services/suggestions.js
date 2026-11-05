import { DIRECTORY_SERVICES } from "../config/directoryServices.js";
import { US_STATES, stateByCode } from "../config/usStates.js";
import { findService, rankingPath } from "./intentParser.js";
import { citiesByState } from "./locations.js";
import { profileSuggestions } from "./providerSearch.js";
import { rankingEntries } from "./rankingIndex.js";

// Search-as-you-type suggestions from real data: states, major cities and cities providers are in, the services,
// and provider names. "Best plumbers in New…" → New York, New Jersey, New Mexico, New Hampshire, New Orleans…

const MAX = 8;

/** The place part being typed: after " in " / " near ", else nothing (then popular places are used). */
function typedPlace(q) {
  const match = /\b(?:in|near|around)\s+([^,]*)(?:,\s*([a-z]{0,2}))?$/.exec(q);
  return match ? { text: match[1].trim(), stateHint: match[2] ?? "" } : null;
}

const nounFor = (service, verified) => (service ? service.noun : verified ? "Licensed Plumbers" : "Plumbers");

export async function searchSuggestions(rawQuery) {
  const q = String(rawQuery ?? "").toLowerCase().replace(/\s+/g, " ").trimStart();
  if (q.trim().length < 2) return [];
  const service = findService(q)?.service ?? null;
  const verified = /\b(licensed|verified|certified)\b/.test(q);
  const limitMatch = /\btop[\s-]*(\d{1,3})\b/.exec(q);
  const limit = limitMatch ? (Number(limitMatch[1]) <= 10 ? 10 : 50) : null;
  const type = verified ? "verified" : "top-rated";
  const noun = nounFor(service, verified);

  const [cities, entries] = await Promise.all([citiesByState(), rankingEntries()]);
  const providersIn = new Map();
  for (const entry of entries) if (entry.stateCode && !entry.blocked) providersIn.set(entry.stateCode, (providersIn.get(entry.stateCode) ?? 0) + 1);

  // Places: what is typed after "in", or (nothing typed yet) the states and cities with the most providers.
  const typed = typedPlace(q);
  const places = [];
  const prefix = typed?.text ?? "";
  if (prefix) {
    for (const state of US_STATES) if (state.name.toLowerCase().startsWith(prefix) || (prefix.length === 2 && state.code.toLowerCase() === prefix)) places.push({ state, city: null, providers: providersIn.get(state.code) ?? 0 });
    for (const [code, list] of cities) {
      if (typed.stateHint && !code.toLowerCase().startsWith(typed.stateHint)) continue;
      for (const city of list.values()) if (city.name.toLowerCase().startsWith(prefix)) places.push({ state: stateByCode.get(code), city, providers: city.providers });
    }
    // States first, then cities with providers, then major cities.
    places.sort((a, b) => Number(Boolean(a.city)) - Number(Boolean(b.city)) || b.providers - a.providers || Number(Boolean(b.city?.major)) - Number(Boolean(a.city?.major)));
  } else {
    for (const [code, count] of [...providersIn].sort((a, b) => b[1] - a[1]).slice(0, 3)) places.push({ state: stateByCode.get(code), city: null, providers: count });
  }

  const suggestions = [];
  const add = (item) => { if (suggestions.length < MAX && !suggestions.some((s) => s.url === item.url && s.label === item.label)) suggestions.push(item); };
  const placeLabel = (place) => (place.city ? `${place.city.name}, ${place.state.code}` : place.state.name);
  const top = places.slice(0, 4);
  for (const [index, place] of top.entries()) {
    const at = placeLabel(place);
    const count = place.providers ? `${place.providers} listed` : undefined;
    if (limit) add({ kind: "ranking", label: `Top ${limit} ${noun.toLowerCase()} in ${at}`, url: rankingPath({ limit, service, type, ...place }), hint: count });
    else {
      add({ kind: "ranking", label: `Best ${noun.toLowerCase()} in ${at}`, url: rankingPath({ limit: 10, service, type, ...place }), hint: count });
      // "Best …" already opens the Top 10, so only the Top 50 is offered beside it (for the first place).
      if (index === 0) add({ kind: "ranking", label: `Top 50 ${noun.toLowerCase()} in ${at}`, url: rankingPath({ limit: 50, service, type, ...place }), hint: "Top 50" });
    }
  }
  // Services that match the words typed (when no service is chosen yet).
  if (!service) {
    const word = q.replace(/\b(best|top|\d+|in|near|the|plumbers?|plumbing|companies)\b/g, " ").trim().split(" ")[0] ?? "";
    for (const item of DIRECTORY_SERVICES) {
      if (word.length >= 2 && (item.name.toLowerCase().startsWith(word) || item.keywords.some((keyword) => keyword.startsWith(word)))) {
        const place = top[0];
        add(place ? { kind: "service", label: `${item.noun} in ${placeLabel(place)}`, url: rankingPath({ limit: limit ?? 10, service: item, type, ...place }) } : { kind: "service", label: item.name, url: `/services/${item.slug}` });
      }
    }
  }
  // Profiles that match what's typed (prefix and typo tolerant), shown first like a shop's product suggestions.
  const profiles = typed ? [] : (await profileSuggestions(q, 4)).map((item) => ({
    kind: "provider", label: item.name, url: item.url, hint: [item.city, item.stateCode].filter(Boolean).join(", ") || undefined,
    logo: item.logo ?? undefined, rating: item.reviewCount ? item.rating : undefined, reviewCount: item.reviewCount || undefined, verified: item.verified || undefined,
  }));
  // A name being typed ("kings cou") doesn't need the popular-places rankings; "best …" / "top …" / "… in" searches do.
  const rankingWords = /\b(best|top|plumbers?|plumbing|companies|in|near|rated|licensed|verified)\b/.test(q) || limit || service;
  // Words that are neither a ranking search nor a name ("zzqx") get no popular-place rankings either.
  const others = suggestions.filter((item) => !profiles.some((profile) => profile.url === item.url) && (rankingWords || item.kind !== "ranking"));
  return [...profiles, ...others].slice(0, profiles.length + (profiles.length ? 6 : MAX));
}
