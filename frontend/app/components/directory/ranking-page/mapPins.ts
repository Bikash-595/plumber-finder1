import type { RankedProvider } from "../directoryApi";
import type { MapPin } from "../RankingMap";

/** Map markers for the ranked providers that have a known location. */
export const mapPins = (items: RankedProvider[]): MapPin[] =>
  items.filter((item) => item.coordinates && item.position).map((item) => ({ position: item.position!, name: item.name, url: item.url, lat: item.coordinates!.lat, lng: item.coordinates!.lng }));
