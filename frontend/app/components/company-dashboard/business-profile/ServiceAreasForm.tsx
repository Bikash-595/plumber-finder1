"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { FaCrosshairs, FaExternalLinkAlt, FaPlus } from "react-icons/fa";
import { companyApi } from "./companyApi";
import { NoticeMessage, type Notice } from "./SavedItems";
import ServiceAreaCard, { hasPoint, type AreaDraft } from "./ServiceAreaCard";
import ServiceAreaMap from "@/components/plumber/ServiceAreaMap";
import { API_BASE_URL } from "@/components/utils/apiClient";

type SavedArea = { name: string; address?: string | null; services?: string[]; radius?: number | null; latitude?: number | null; longitude?: number | null };
type Saved = { branchLocation?: string | null; radius?: number | null; latitude?: number | null; longitude?: number | null; areaDetails?: SavedArea[] };
type Props = {
  /** "/companies/service-areas" or "/freelancers/service-areas". */
  apiEndpoint: string;
  /** The account's services, offered per area. */
  servicesEndpoint: string;
};

const inputClass = "mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";
const blank = { branchLocation: "", radius: "", latitude: "", longitude: "" };
const stateOf = (location: string) => location.match(/,\s*([A-Za-z]{2})\s*$/)?.[1]?.toUpperCase() ?? "";
let keySeq = 0;
const newKey = () => `area-${Date.now()}-${++keySeq}`;
const emptyArea = (name = ""): AreaDraft => ({ key: newKey(), name, address: "", services: [], radius: "", latitude: "", longitude: "" });
const fromSaved = (area: SavedArea): AreaDraft => ({ key: newKey(), name: area.name, address: area.address ?? "", services: area.services ?? [], radius: area.radius?.toString() ?? "", latitude: area.latitude?.toString() ?? "", longitude: area.longitude?.toString() ?? "" });
const toMapArea = (area: AreaDraft) => ({ name: area.name, address: area.address || undefined, services: area.services, radius: Number(area.radius) > 0 ? Number(area.radius) : undefined, latitude: hasPoint(area) ? Number(area.latitude) : undefined, longitude: hasPoint(area) ? Number(area.longitude) : undefined });

/** Real coordinates for an area's address (or its name as a city in the base state). */
async function findPlace(query: { name?: string; address?: string; state?: string }) {
  const params = new URLSearchParams(Object.entries(query).filter(([, value]) => value) as [string, string][]);
  const response = await fetch(`${API_BASE_URL}/location/place?${params}`);
  const payload = (await response.json().catch(() => ({}))) as { data?: { latitude: number; longitude: number }; message?: string };
  if (!response.ok || !payload.data) throw new Error(payload.message || "We couldn't find that place.");
  return payload.data;
}
const currentPosition = () => new Promise<GeolocationCoordinates>((resolve, reject) => {
  if (!navigator.geolocation) return reject(new Error("Your browser can't share its location. Enter the coordinates instead."));
  navigator.geolocation.getCurrentPosition(({ coords }) => resolve(coords), () => reject(new Error("Location permission was denied. Enter the coordinates instead.")), { enableHighAccuracy: true, timeout: 10000 });
});

/**
 * Service areas: a main base location (its coordinates power "x mi away" on the cards), then any
 * number of service areas — each with its own location, radius, services, and map.
 */
export default function ServiceAreasForm({ apiEndpoint, servicesEndpoint }: Props) {
  const [values, setValues] = useState(blank);
  const [areas, setAreas] = useState<AreaDraft[]>([]);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [quickAdd, setQuickAdd] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [saved, setSaved] = useState<Saved | null>(null);
  const [mode, setMode] = useState<"loading" | "view" | "edit">("loading");
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);
  const [locating, setLocating] = useState(false);

  const load = (data: Saved) => {
    setValues({ branchLocation: data.branchLocation ?? "", radius: data.radius?.toString() ?? "", latitude: data.latitude?.toString() ?? "", longitude: data.longitude?.toString() ?? "" });
    setAreas((data.areaDetails ?? []).map(fromSaved));
    setOpenKey(null);
  };

  useEffect(() => {
    companyApi<{ name: string }[]>(servicesEndpoint).then(({ data }) => setServices(data.map((service) => service.name))).catch(() => undefined);
    companyApi<Saved | null>(apiEndpoint)
      .then(({ data }) => { if (data) { setSaved(data); load(data); setMode("view"); } else setMode("edit"); })
      .catch((error: Error) => { setNotice({ tone: "error", text: error.message }); setMode("edit"); });
  }, [apiEndpoint, servicesEndpoint]);

  const region = stateOf(values.branchLocation);
  const defaultRadius = Number(values.radius) > 0 ? Number(values.radius) : 10;
  const updateArea = (key: string, changes: Partial<AreaDraft>) => setAreas((current) => current.map((area) => (area.key === key ? { ...area, ...changes } : area)));
  const addArea = () => {
    const area = emptyArea();
    setAreas((current) => [...current, area]);
    setOpenKey(area.key);
  };
  const quickAddAreas = () => {
    const names = quickAdd.split(",").map((name) => name.trim()).filter((name) => name && !areas.some((area) => area.name.toLowerCase() === name.toLowerCase()));
    if (!names.length) return;
    const added = names.map((name) => emptyArea(name));
    setAreas((current) => [...current, ...added]);
    setOpenKey(added[added.length - 1].key);
    setQuickAdd("");
  };

  // Areas with a name or address but no coordinates are looked up shortly after typing (real places).
  const [lookups, setLookups] = useState<Record<string, "looking" | "missing">>({});
  const tried = useRef(new Set<string>());
  const pending = areas.filter((area) => (area.name.trim() || area.address.trim()) && !hasPoint(area));
  const pendingKey = pending.map((area) => `${area.key}:${area.name}:${area.address}`).join("|") + "#" + region;
  useEffect(() => {
    const todo = pending.filter((area) => !tried.current.has(`${area.name}|${area.address}|${region}`));
    if (!todo.length) return;
    const timer = window.setTimeout(() => {
      todo.forEach((area) => {
        tried.current.add(`${area.name}|${area.address}|${region}`);
        setLookups((current) => ({ ...current, [area.key]: "looking" }));
        findPlace({ name: area.name, address: area.address, state: region })
          .then((place) => {
            setAreas((current) => current.map((item) => (item.key === area.key && item.name === area.name && item.address === area.address && !hasPoint(item) ? { ...item, latitude: String(place.latitude), longitude: String(place.longitude) } : item)));
            setLookups((current) => { const next = { ...current }; delete next[area.key]; return next; });
          })
          .catch(() => setLookups((current) => ({ ...current, [area.key]: "missing" })));
      });
    }, 700);
    return () => window.clearTimeout(timer);
    // pendingKey captures the areas (and base state) that still need a lookup.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingKey]);

  const locateArea = async (area: AreaDraft) => {
    if (!area.name.trim() && !area.address.trim()) return "Enter the area name or its base location first.";
    try {
      const place = await findPlace({ name: area.name, address: area.address, state: region });
      updateArea(area.key, { latitude: String(place.latitude), longitude: String(place.longitude) });
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : "We couldn't find that place.";
    }
  };
  const areaFromDevice = async (area: AreaDraft) => {
    try {
      const coords = await currentPosition();
      const changes: Partial<AreaDraft> = { latitude: coords.latitude.toFixed(6), longitude: coords.longitude.toFixed(6) };
      // Fill the base location from the device location when it's empty (real reverse lookup).
      if (!area.address) {
        const response = await fetch(`${API_BASE_URL}/location/reverse?lat=${coords.latitude}&lng=${coords.longitude}`).catch(() => null);
        const place = response?.ok ? ((await response.json()) as { data?: { street?: string; city: string; stateCode: string; zipCode: string } }).data : undefined;
        if (place) changes.address = [place.street, place.city, `${place.stateCode} ${place.zipCode}`].filter(Boolean).join(", ");
      }
      updateArea(area.key, changes);
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : "Couldn't get your location.";
    }
  };
  // "+ Create & add" makes a real service in the Services section, so it also shows on the profile.
  const createService = async (name: string) => {
    const existing = services.find((service) => service.toLowerCase() === name.toLowerCase());
    if (existing) return existing;
    const { data } = await companyApi<{ name: string }>(servicesEndpoint, { method: "POST", body: { name } });
    setServices((current) => [...current, data.name]);
    return data.name;
  };

  const useMyLocation = async () => {
    setLocating(true);
    try {
      const coords = await currentPosition();
      setValues((current) => ({ ...current, latitude: coords.latitude.toFixed(6), longitude: coords.longitude.toFixed(6) }));
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Couldn't get your location." });
    } finally {
      setLocating(false);
    }
  };

  // Services that were renamed or deleted are dropped when saving.
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const named = areas.filter((area) => area.name.trim());
    if (areas.some((area) => !area.name.trim() && (area.address || area.services.length))) return setNotice({ tone: "error", text: "Every service area needs a name." });
    if ((values.latitude === "") !== (values.longitude === "")) return setNotice({ tone: "error", text: "Enter both latitude and longitude for the main base, or leave both empty." });
    const badPoint = named.find((area) => (area.latitude === "") !== (area.longitude === "") || ((area.latitude !== "" || area.longitude !== "") && (!hasPoint(area) || Math.abs(Number(area.latitude)) > 90 || Math.abs(Number(area.longitude)) > 180)));
    if (badPoint) return setNotice({ tone: "error", text: `Check the latitude and longitude of “${badPoint.name}”.` });
    const badRadius = named.find((area) => area.radius !== "" && !(Number(area.radius) >= 0 && Number(area.radius) <= 500));
    if (badRadius) return setNotice({ tone: "error", text: `“${badRadius.name}” needs a radius between 0 and 500 miles.` });
    setBusy(true);
    setNotice(null);
    try {
      const { data } = await companyApi<Saved>(apiEndpoint, { method: "PUT", body: { ...values, areaDetails: named.map((area) => ({
        name: area.name.trim(),
        address: area.address.trim(),
        services: services.length ? area.services.filter((name) => services.includes(name)) : area.services,
        ...(area.radius !== "" ? { radius: Number(area.radius) } : {}),
        // Known coordinates are kept; the server looks up the rest.
        ...(hasPoint(area) ? { latitude: Number(area.latitude), longitude: Number(area.longitude) } : {}),
      })) } });
      setSaved(data);
      load(data);
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
  const lat = Number(values.latitude), lng = Number(values.longitude);
  const basePoint = values.latitude !== "" && values.longitude !== "" && Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : undefined;
  const openArea = areas.find((area) => area.key === openKey);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <p className="text-xs font-bold uppercase tracking-wider text-[#0b1f3b]">Business Profile</p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">Service Areas</h1>
      <p className="mt-2 max-w-3xl text-sm text-gray-500">Add every area you serve. Each one has its own location, radius, services, and map. Customers pick an area on your profile to see where you work and what you offer there.</p>

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
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Main base</dt><dd className="mt-1 text-sm text-gray-900">{saved.branchLocation || <span className="text-gray-400">Not set</span>}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Coordinates</dt><dd className="mt-1 text-sm text-gray-900">{saved.latitude != null && saved.longitude != null ? `${saved.latitude}, ${saved.longitude}` : <span className="text-gray-400">Not set (no distance on cards)</span>}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Default radius</dt><dd className="mt-1 text-sm text-gray-900">{saved.radius != null ? `${saved.radius} miles` : <span className="text-gray-400">10 miles</span>}</dd></div>
          </dl>
          <div className="border-t border-gray-100 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">How customers see it on your profile — choose an area to open its map</p>
            <ServiceAreaMap areas={(saved.areaDetails ?? []).map((area) => toMapArea(fromSaved(area)))} services={services} ownerName="your company" baseName={saved.branchLocation ?? ""} baseRadius={saved.radius ?? undefined} coordinates={saved.latitude != null && saved.longitude != null ? { lat: saved.latitude, lng: saved.longitude } : undefined} />
          </div>
        </div>
      )}

      {mode === "edit" && (
        <form onSubmit={submit} noValidate className="mt-7 space-y-6">
          <fieldset disabled={busy} className="space-y-6">
            <div className="rounded-xl border border-gray-200 p-4">
              <h2 className="font-bold text-gray-900">Main base location</h2>
              <p className="mt-1 text-xs text-gray-500">Where your business is based. Its coordinates show customers how far away you are; its radius is the default for each area.</p>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <label><span className="text-sm font-semibold text-gray-700">Base location</span><input value={values.branchLocation} onChange={(e) => setValues({ ...values, branchLocation: e.target.value })} placeholder="e.g. Dallas, TX" className={inputClass} /></label>
                <label><span className="text-sm font-semibold text-gray-700">Service radius (miles)</span><input type="number" min="0" max="500" value={values.radius} onChange={(e) => setValues({ ...values, radius: e.target.value })} placeholder="e.g. 25" className={inputClass} /></label>
                <label><span className="text-sm font-semibold text-gray-700">Latitude</span><input inputMode="decimal" value={values.latitude} onChange={(e) => setValues({ ...values, latitude: e.target.value })} placeholder="e.g. 32.7767" className={inputClass} /></label>
                <label><span className="text-sm font-semibold text-gray-700">Longitude</span><input inputMode="decimal" value={values.longitude} onChange={(e) => setValues({ ...values, longitude: e.target.value })} placeholder="e.g. -96.7970" className={inputClass} /></label>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <button type="button" onClick={useMyLocation} disabled={locating} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 font-semibold text-gray-700 hover:border-[#FFD60A] disabled:opacity-60"><FaCrosshairs className="h-3.5 w-3.5" /> {locating ? "Finding location…" : "Use my current location"}</button>
                {mapsQuery && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl px-3 py-2 font-semibold text-[#0b1f3b] hover:bg-gray-50"><FaExternalLinkAlt className="h-3 w-3" /> Check on Google Maps</a>}
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-bold text-gray-900">Service areas <span className="font-medium text-gray-400">({areas.filter((area) => area.name.trim()).length})</span></h2>
                  <button type="button" onClick={addArea} className="inline-flex items-center gap-2 rounded-xl bg-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#17345a]"><FaPlus className="h-3 w-3" /> Add service area</button>
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input value={quickAdd} onChange={(e) => setQuickAdd(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); quickAddAreas(); } }} placeholder="Quick add several: Plano, Irving, Frisco" aria-label="New areas, separated by commas" className={`${inputClass} mt-0 flex-1`} />
                  <button type="button" onClick={quickAddAreas} className="rounded-xl border border-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-[#0b1f3b]">Add areas</button>
                </div>
                <ul className="mt-4 space-y-3">
                  {areas.map((area, index) => (
                    <ServiceAreaCard
                      key={area.key}
                      area={area}
                      index={index}
                      open={openKey === area.key}
                      services={services}
                      defaultRadius={defaultRadius}
                      lookupStatus={lookups[area.key]}
                      onToggle={() => setOpenKey(openKey === area.key ? null : area.key)}
                      onChange={(changes) => updateArea(area.key, changes)}
                      onRemove={() => { setAreas((current) => current.filter((item) => item.key !== area.key)); if (openKey === area.key) setOpenKey(null); }}
                      onLocate={() => locateArea(area)}
                      onUseMyLocation={() => areaFromDevice(area)}
                      onCreateService={createService}
                    />
                  ))}
                  {!areas.length && <li className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">No service areas yet. Press <span className="font-semibold">Add service area</span> to add your first one.</li>}
                </ul>
              </div>

              <div className="xl:sticky xl:top-4 xl:self-start">
                <div className="rounded-xl border border-gray-200 p-4">
                  <h2 className="font-bold text-gray-900">All areas preview</h2>
                  <p className="mb-3 mt-1 text-xs text-gray-500">Every area&apos;s circle together, as customers will see it. Choose an area to open it.</p>
                  <ServiceAreaMap compact areas={areas.map(toMapArea)} baseRadius={Number(values.radius) > 0 ? Number(values.radius) : undefined} services={services} ownerName="your company" baseName={values.branchLocation} coordinates={basePoint} selected={openArea?.name.trim() ? openArea.name : null} onSelect={(name) => setOpenKey(name ? areas.find((area) => area.name === name)?.key ?? null : null)} />
                </div>
              </div>
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
