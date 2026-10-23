"use client";

import { FormEvent, useEffect, useState } from "react";
import { FaCrosshairs, FaExternalLinkAlt, FaPlus, FaTrash } from "react-icons/fa";
import { companyApi } from "./companyApi";
import { NoticeMessage, type Notice } from "./SavedItems";

type Area = { name: string; services: string[] };
type Saved = { branchLocation?: string | null; radius?: number | null; latitude?: number | null; longitude?: number | null; areaDetails?: Area[] };
type Props = {
  /** "/companies/service-areas" or "/freelancers/service-areas". */
  apiEndpoint: string;
  /** The account's services, offered per area. */
  servicesEndpoint: string;
};

const inputClass = "mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";
const blank = { branchLocation: "", radius: "", latitude: "", longitude: "" };

/**
 * Service areas: a base location (its coordinates power "x mi away" on the cards), a radius, and
 * the areas served — each with the services offered there. Saved: summary with Edit and Delete.
 */
export default function ServiceAreasForm({ apiEndpoint, servicesEndpoint }: Props) {
  const [values, setValues] = useState(blank);
  const [areas, setAreas] = useState<Area[]>([]);
  const [newAreas, setNewAreas] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [saved, setSaved] = useState<Saved | null>(null);
  const [mode, setMode] = useState<"loading" | "view" | "edit">("loading");
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);
  const [locating, setLocating] = useState(false);

  const load = (data: Saved) => {
    setValues({ branchLocation: data.branchLocation ?? "", radius: data.radius?.toString() ?? "", latitude: data.latitude?.toString() ?? "", longitude: data.longitude?.toString() ?? "" });
    setAreas((data.areaDetails ?? []).map((area) => ({ name: area.name, services: area.services ?? [] })));
  };

  useEffect(() => {
    companyApi<{ name: string }[]>(servicesEndpoint).then(({ data }) => setServices(data.map((service) => service.name))).catch(() => undefined);
    companyApi<Saved | null>(apiEndpoint)
      .then(({ data }) => { if (data) { setSaved(data); load(data); setMode("view"); } else setMode("edit"); })
      .catch((error: Error) => { setNotice({ tone: "error", text: error.message }); setMode("edit"); });
  }, [apiEndpoint, servicesEndpoint]);

  const addAreas = () => {
    const names = newAreas.split(",").map((name) => name.trim()).filter(Boolean);
    setAreas((current) => [...current, ...names.filter((name) => !current.some((area) => area.name.toLowerCase() === name.toLowerCase())).map((name) => ({ name, services: [] }))]);
    setNewAreas("");
  };
  const updateArea = (index: number, changes: Partial<Area>) => setAreas((current) => current.map((area, i) => (i === index ? { ...area, ...changes } : area)));
  const toggleService = (index: number, service: string) => updateArea(index, { services: areas[index].services.includes(service) ? areas[index].services.filter((item) => item !== service) : [...areas[index].services, service] });

  const useMyLocation = () => {
    if (!navigator.geolocation) return setNotice({ tone: "error", text: "Your browser cannot share its location. Enter the coordinates instead." });
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setValues((current) => ({ ...current, latitude: coords.latitude.toFixed(6), longitude: coords.longitude.toFixed(6) })); setLocating(false); },
      () => { setNotice({ tone: "error", text: "Location permission was denied. Enter the coordinates instead." }); setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  // Ticks for services that were renamed or deleted are dropped when saving.
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const pending = newAreas.split(",").map((name) => name.trim()).filter(Boolean);
    const allAreas = [...areas, ...pending.map((name) => ({ name, services: [] }))].filter((area) => area.name.trim());
    if ((values.latitude === "") !== (values.longitude === "")) return setNotice({ tone: "error", text: "Enter both latitude and longitude, or leave both empty." });
    setBusy(true);
    setNotice(null);
    try {
      const { data } = await companyApi<Saved>(apiEndpoint, { method: "PUT", body: { ...values, areaDetails: allAreas.map((area) => ({ name: area.name.trim(), services: services.length ? area.services.filter((name) => services.includes(name)) : area.services })) } });
      setSaved(data);
      load(data);
      setNewAreas("");
      setMode("view");
      setNotice({ tone: "success", text: saved ? "Service areas updated." : "Service areas saved to your public profile." });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Unable to save service areas." });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete your service areas? This cannot be undone.")) return;
    setBusy(true);
    try {
      await companyApi(apiEndpoint, { method: "DELETE" });
      setSaved(null);
      setValues(blank);
      setAreas([]);
      setMode("edit");
      setNotice({ tone: "success", text: "Service areas deleted." });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Unable to delete." });
    } finally {
      setBusy(false);
    }
  };

  const mapsQuery = values.latitude && values.longitude ? `${values.latitude},${values.longitude}` : values.branchLocation;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <p className="text-xs font-bold uppercase tracking-wider text-[#0b1f3b]">Business Profile</p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">Service Areas</h1>
      <p className="mt-2 max-w-3xl text-sm text-gray-500">Add each area you serve and the services offered there. Customers can pick an area on your profile map. Your base location&apos;s coordinates show customers how far away you are.</p>

      {mode === "loading" && <p className="mt-7 rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">Loading your service areas…</p>}

      {mode === "view" && saved && (
        <div className="mt-7 rounded-xl border border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-bold text-gray-900">Saved service areas <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">Live on your profile</span></p>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setMode("edit"); setNotice(null); }} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50">Edit</button>
              <button type="button" onClick={remove} disabled={busy} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-60">Delete</button>
            </div>
          </div>
          <dl className="grid gap-4 p-4 sm:grid-cols-3">
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Base location</dt><dd className="mt-1 text-sm text-gray-900">{saved.branchLocation || <span className="text-gray-400">Not set</span>}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Coordinates</dt><dd className="mt-1 text-sm text-gray-900">{saved.latitude != null && saved.longitude != null ? `${saved.latitude}, ${saved.longitude}` : <span className="text-gray-400">Not set (no distance on cards)</span>}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Radius</dt><dd className="mt-1 text-sm text-gray-900">{saved.radius != null ? `${saved.radius} miles` : <span className="text-gray-400">Not set</span>}</dd></div>
          </dl>
          <ul className="grid gap-3 border-t border-gray-100 p-4 md:grid-cols-2">
            {(saved.areaDetails ?? []).map((area) => (
              <li key={area.name} className="rounded-lg bg-gray-50 p-3">
                <p className="font-semibold text-gray-900">{area.name}</p>
                <p className="mt-1 text-xs text-gray-500">{area.services?.length ? area.services.join(" · ") : "All services"}</p>
              </li>
            ))}
            {!saved.areaDetails?.length && <li className="text-sm text-gray-400">No areas added.</li>}
          </ul>
        </div>
      )}

      {mode === "edit" && (
        <form onSubmit={submit} noValidate className="mt-7 space-y-6">
          <fieldset disabled={busy} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <label><span className="text-sm font-semibold text-gray-700">Base location</span><input value={values.branchLocation} onChange={(e) => setValues({ ...values, branchLocation: e.target.value })} placeholder="e.g. Dallas, TX" className={inputClass} /></label>
              <label><span className="text-sm font-semibold text-gray-700">Service radius (miles)</span><input type="number" min="0" max="500" value={values.radius} onChange={(e) => setValues({ ...values, radius: e.target.value })} placeholder="e.g. 25" className={inputClass} /></label>
              <label><span className="text-sm font-semibold text-gray-700">Latitude</span><input inputMode="decimal" value={values.latitude} onChange={(e) => setValues({ ...values, latitude: e.target.value })} placeholder="e.g. 32.7767" className={inputClass} /></label>
              <label><span className="text-sm font-semibold text-gray-700">Longitude</span><input inputMode="decimal" value={values.longitude} onChange={(e) => setValues({ ...values, longitude: e.target.value })} placeholder="e.g. -96.7970" className={inputClass} /></label>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <button type="button" onClick={useMyLocation} disabled={locating} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 font-semibold text-gray-700 hover:border-[#FFD60A] disabled:opacity-60"><FaCrosshairs className="h-3.5 w-3.5" /> {locating ? "Finding location…" : "Use my current location"}</button>
              {mapsQuery && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl px-3 py-2 font-semibold text-[#0b1f3b] hover:bg-gray-50"><FaExternalLinkAlt className="h-3 w-3" /> Check on Google Maps</a>}
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <h2 className="font-bold text-gray-900">Areas you serve</h2>
              <p className="mt-1 text-xs text-gray-500">Tick the services offered in each area. Leave all unticked if every service is available there.{!services.length && " Add services first to choose them per area."}</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input value={newAreas} onChange={(e) => setNewAreas(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAreas(); } }} placeholder="e.g. Dallas, Plano, Irving" aria-label="New areas, separated by commas" className={`${inputClass} mt-0 flex-1`} />
                <button type="button" onClick={addAreas} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-white"><FaPlus className="h-3 w-3" /> Add areas</button>
              </div>
              <ul className="mt-4 space-y-3">
                {areas.map((area, index) => (
                  <li key={index} className="rounded-xl border border-gray-200 bg-white p-3">
                    <div className="flex items-center gap-2">
                      <input value={area.name} onChange={(e) => updateArea(index, { name: e.target.value })} aria-label={`Area ${index + 1} name`} className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold outline-none focus:border-[#FFD60A]" />
                      <button type="button" onClick={() => setAreas((current) => current.filter((_, i) => i !== index))} aria-label={`Remove ${area.name}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><FaTrash className="h-3.5 w-3.5" /></button>
                    </div>
                    {services.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {services.map((service) => (
                          <label key={service} className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${area.services.includes(service) ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 text-gray-600"}`}>
                            <input type="checkbox" checked={area.services.includes(service)} onChange={() => toggleService(index, service)} className="sr-only" />
                            {service}
                          </label>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
                {!areas.length && <li className="rounded-xl border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500">No areas yet. Type area names above and press Add areas.</li>}
              </ul>
            </div>
          </fieldset>
          <NoticeMessage notice={notice} />
          <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
            <button type="submit" disabled={busy} className="rounded-xl bg-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#17345a] disabled:opacity-60">{busy ? "Saving…" : saved ? "Update" : "Save"}</button>
            {saved && <button type="button" onClick={() => { load(saved); setMode("view"); setNotice(null); }} className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50">Cancel</button>}
          </div>
        </form>
      )}
      {mode === "view" && <div className="mt-4"><NoticeMessage notice={notice} /></div>}
    </section>
  );
}
