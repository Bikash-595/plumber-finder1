"use client";

import { useMemo, useState } from "react";
import type { Plumber } from "@/components/find/types";
import SpecialOfferCard from "./SpecialOfferCard";

export default function SpecialOffersList({ plumbers }: { plumbers: Plumber[] }) {
  const [search, setSearch] = useState("");
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const offers = useMemo(() => plumbers.filter((plumber) => {
    const query = search.trim().toLowerCase();
    const matchesQuery = !query || [plumber.companyName, plumber.location, plumber.discount, ...plumber.services].join(" ").toLowerCase().includes(query);
    return Boolean(plumber.discount) && matchesQuery && (!emergencyOnly || plumber.isEmergency);
  }), [emergencyOnly, plumbers, search]);

  return (
    <>
      <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by service, company, or location" className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
        <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap text-sm font-medium text-slate-700">
          <input type="checkbox" checked={emergencyOnly} onChange={(event) => setEmergencyOnly(event.target.checked)} className="h-4 w-4 accent-emerald-700" /> Emergency offers only
        </label>
      </div>
      {offers.length ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{offers.map((plumber) => <SpecialOfferCard key={plumber.id} plumber={plumber} />)}</div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">No offers match your search. Try a different service or location.</div>}
    </>
  );
}
