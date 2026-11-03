import { createElement } from "react";
import type { IconType } from "react-icons";
import { FaBolt, FaExclamationTriangle, FaFire, FaHome, FaIndustry, FaSearch, FaShower, FaTint, FaTools, FaWater, FaWrench } from "react-icons/fa";

// An icon for a service, matched on words in its name (or its category).
const iconRules: [RegExp, IconType][] = [
  [/emergenc|24\/7|urgent/i, FaBolt], [/drain|sewer|jet|clog|grease|trenchless/i, FaTools], [/heater|tankless|boiler|hot water/i, FaWater],
  [/leak|slab/i, FaTint], [/inspect|camera|video|detect/i, FaSearch], [/gas/i, FaFire], [/bath|shower|remodel|kitchen/i, FaShower],
  [/toilet|faucet|sink|fixture|disposal/i, FaHome], [/commercial|industrial|backflow/i, FaIndustry], [/frozen|burst|flood/i, FaExclamationTriangle],
];
export const serviceIcon = (text: string, className: string) => createElement(iconRules.find(([pattern]) => pattern.test(text))?.[1] ?? FaWrench, { className, "aria-hidden": true });

/** Scrolls to the booking form on this page and picks this service there. */
export function bookService(name: string) {
  window.dispatchEvent(new CustomEvent("plumberfinder:book-service", { detail: name }));
  document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** "From $89" → { amount: 89, prefix: "From", suffix: "" }; "$95/hr" → suffix "/hr"; "Free quote" → null. */
export function splitPrice(price?: string) {
  const match = price?.match(/^(.*?)\$\s?([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  return { prefix: match[1].trim(), amount: Number(match[2].replace(/,/g, "")), suffix: match[3].trim() };
}
