import { createElement } from "react";
import type { IconType } from "react-icons";
import {
  FaArrowUpFromWaterPump,
  FaBolt,
  FaBuilding,
  FaFaucetDrip,
  FaFilter,
  FaFireFlameCurved,
  FaHouseFloodWater,
  FaMagnifyingGlassChart,
  FaRecycle,
  FaSink,
  FaToilet,
  FaWater,
  FaWrench,
} from "react-icons/fa6";

export const serviceIcons: Record<string, IconType> = {
  "emergency-plumbing": FaBolt,
  "drain-cleaning": FaSink,
  "water-heater-repair": FaFireFlameCurved,
  "leak-detection": FaMagnifyingGlassChart,
  "pipe-repair": FaWrench,
  "bathroom-plumbing": FaToilet,
  "sewer-line-service": FaHouseFloodWater,
  "commercial-plumbing": FaBuilding,
  "hydro-jetting": FaWater,
  "garbage-disposal": FaRecycle,
  "sump-pump": FaArrowUpFromWaterPump,
  "water-softener": FaFilter,
};

/** Renders the icon for a service slug (falls back to a faucet). */
export function ServiceIcon({ slug, className }: { slug: string; className?: string }) {
  return createElement(serviceIcons[slug] ?? FaFaucetDrip, { className, "aria-hidden": true });
}
