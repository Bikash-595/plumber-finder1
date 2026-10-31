"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type KeyboardEvent } from "react";
import { FaSearch } from "react-icons/fa";

const pages = [
  { label: "Dashboard home", href: "/dashboard" },
  { label: "Overview", href: "/dashboard/overview" },
  { label: "My bookings", href: "/dashboard/bookings" },
  { label: "Saved plumbers", href: "/dashboard/saved" },
  { label: "Compare plumbers", href: "/dashboard/compare" },
  { label: "My reviews", href: "/dashboard/reviews" },
  { label: "Invoices", href: "/dashboard/invoices" },
  { label: "Wallet & payments", href: "/dashboard/wallet" },
  { label: "Notifications", href: "/dashboard/notifications" },
  { label: "Profile", href: "/dashboard/profile" },
  { label: "Settings", href: "/dashboard/settings" },
  { label: "Privacy & security", href: "/dashboard/security" },
];

/** Suggestions for what was typed: matching pages, then searches in bookings, invoices and the directory. */
function suggestionsFor(text: string) {
  const query = text.trim();
  if (!query) return [];
  const q = encodeURIComponent(query);
  const lower = query.toLowerCase();
  const searches = [
    { label: `Bookings matching “${query}”`, href: `/dashboard/bookings?q=${q}` },
    { label: `Invoices matching “${query}”`, href: `/dashboard/invoices?q=${q}` },
    { label: `Find plumbers: “${query}”`, href: `/find?search=${q}` },
  ];
  // A reference code goes straight to the right list.
  if (/^inv-/i.test(query)) searches.unshift(searches.splice(1, 1)[0]);
  return [...pages.filter((page) => page.label.toLowerCase().includes(lower)).slice(0, 4), ...searches];
}

/** Navbar search: jump to a dashboard page, or search bookings, invoices or plumbers. Arrow keys + Enter. */
export default function DashboardSearch() {
  const router = useRouter();
  const listId = useId();
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const suggestions = suggestionsFor(text);

  const go = (href: string) => { setOpen(false); setText(""); router.push(href); };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;
    if (event.key === "ArrowDown") { event.preventDefault(); setActive((active + 1) % suggestions.length); }
    else if (event.key === "ArrowUp") { event.preventDefault(); setActive((active - 1 + suggestions.length) % suggestions.length); }
    else if (event.key === "Enter") { event.preventDefault(); go(suggestions[Math.min(active, suggestions.length - 1)].href); }
    else if (event.key === "Escape") setOpen(false);
  };

  return (
    <div className="relative hidden min-w-[240px] max-w-md flex-1 md:block">
      <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
      <input type="search" role="combobox" aria-expanded={open && suggestions.length > 0} aria-controls={listId} aria-autocomplete="list" aria-label="Search your dashboard"
        aria-activedescendant={open && suggestions.length ? `${listId}-${active}` : undefined}
        value={text} placeholder="Search bookings, invoices, plumbers"
        onChange={(event) => { setText(event.target.value); setActive(0); setOpen(true); }}
        onFocus={() => setOpen(true)} onBlur={() => window.setTimeout(() => setOpen(false), 150)} onKeyDown={onKeyDown}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#FFD60A] focus:bg-white focus:ring-2 focus:ring-[#FFD60A]/30" />
      {open && suggestions.length > 0 && (
        <ul id={listId} role="listbox" className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
          {suggestions.map((item, index) => (
            <li key={item.href} id={`${listId}-${index}`} role="option" aria-selected={index === active}
              onMouseDown={(event) => { event.preventDefault(); go(item.href); }} onMouseEnter={() => setActive(index)}
              className={`cursor-pointer truncate px-4 py-2 text-sm ${index === active ? "bg-[#FFD60A]/20 text-gray-900" : "text-gray-700"}`}>{item.label}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
