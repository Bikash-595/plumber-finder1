"use client";

import type { DirectoryCity, DirectoryState } from "@/lib/adminApi";

const select = "rounded-full border border-gray-200 px-3 py-1.5 text-sm";

/** "United States" or a state, then (for a state) the whole state or one of its cities. */
export default function LocationPicker({ states, cities, state, city, onChange }: {
  states: DirectoryState[]; cities: DirectoryCity[]; state: string; city: string; onChange: (value: { state: string; city: string }) => void;
}) {
  return (
    <>
      <select aria-label="Location" value={state} onChange={(e) => onChange({ state: e.target.value, city: "" })} className={select}>
        <option value="usa">United States (USA pages)</option>
        {states.map((item) => <option key={item.code} value={item.slug}>{item.name}{item.providers ? ` (${item.providers})` : ""}</option>)}
      </select>
      {state !== "usa" && (
        <select aria-label="City" value={city} onChange={(e) => onChange({ state, city: e.target.value })} className={select}>
          <option value="">Whole state</option>
          {cities.map((item) => <option key={item.slug} value={item.slug}>{item.name}{item.providers ? ` (${item.providers})` : ""}</option>)}
        </select>
      )}
    </>
  );
}
