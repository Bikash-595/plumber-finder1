import { FaBell, FaBuilding, FaCartShopping, FaCircleInfo, FaCircleQuestion, FaEnvelope, FaEye, FaGauge, FaHeart, FaHouse, FaMagnifyingGlassLocation, FaNewspaper, FaUser } from "react-icons/fa6";
import { allStateAbbrs, getStateName } from "@/components/utils/location";
import type { AccountLink } from "@/components/utils/accountLinks";

// What the site header links to, shared by the desktop header and the mobile menu.

export const navLinks = [
  { label: "Home", href: "/", icon: FaHouse },
  { label: "Find Plumber", href: "/find", icon: FaMagnifyingGlassLocation },
  { label: "About Us", href: "/about", icon: FaCircleInfo },
  { label: "FAQ", href: "/faq", icon: FaCircleQuestion },
  { label: "Blogs", href: "/blogs", icon: FaNewspaper },
  { label: "Contact", href: "/contact", icon: FaEnvelope },
];

export const usStates = allStateAbbrs.map(getStateName);

export const headerActions = [
  { label: "Saved deals", href: "/saved", icon: FaHeart, countKey: "savedCount" },
  { label: "Alerts", href: "/notifications", icon: FaBell, countKey: "notifCount" },
  { label: "Cart", href: "/checkout", icon: FaCartShopping, countKey: "cartCount" },
] as const;

export type HeaderCounts = Record<(typeof headerActions)[number]["countKey"], number>;

export const menuIcons: Record<AccountLink["key"], typeof FaUser> = { dashboard: FaGauge, profile: FaUser, saved: FaHeart, notifications: FaBell, cart: FaCartShopping, business: FaBuilding, preview: FaEye };

export const isActivePath = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

export const iconButton = "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-[#0b1f3b]";
