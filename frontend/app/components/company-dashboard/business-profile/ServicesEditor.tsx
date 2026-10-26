"use client";

import { FormEvent, KeyboardEvent, useRef, useState } from "react";
import { FaBolt, FaCheck, FaClock, FaPlus, FaShieldAlt, FaStar, FaTimes, FaWrench } from "react-icons/fa";
import LocalMediaUpload from "./LocalMediaUpload";
import { ExampleCard, NoticeMessage, useSavedItems } from "./SavedItems";

type PriceType = "fixed" | "from" | "hourly" | "quote" | "free" | "custom";
type Draft = { name: string; category: string; description: string; priceType: PriceType; priceAmount: string; price: string; duration: string; includes: string[]; warranty: string; emergency: boolean; featured: boolean; image: string };
type SavedService = { _id: string; name: string; category?: string; description?: string; priceType?: Exclude<PriceType, "custom">; priceAmount?: number; price?: string; duration?: string; includes?: string[]; warranty?: string; emergency?: boolean; featured?: boolean; image?: string };

// Same lists as the backend (shared/profileSections/servicesSection.js).
const categories = ["Repairs", "Installation", "Drains & Sewer", "Water Heaters", "Leak Detection", "Emergency", "Inspection & Maintenance", "Remodeling", "Commercial", "Other"];
const priceTypes: { value: PriceType; label: string; hint: string }[] = [
  { value: "fixed", label: "Fixed price", hint: "$89" },
  { value: "from", label: "Starting from", hint: "From $89" },
  { value: "hourly", label: "Hourly", hint: "$95/hr" },
  { value: "quote", label: "Free quote", hint: "Price after a visit" },
  { value: "free", label: "Free", hint: "No charge" },
  { value: "custom", label: "Custom", hint: "Your own wording" },
];
const durations = ["30 min", "1 hour", "1–2 hours", "2–3 hours", "Half day", "Full day", "2–3 days"];
const suggestions = ["Leak Repair", "Drain Cleaning", "Water Heater Installation", "Water Heater Repair", "Tankless Water Heater", "Toilet Repair", "Faucet Installation", "Sewer Line Repair", "Hydro Jetting", "Video Camera Inspection", "Gas Line Repair", "Garbage Disposal", "Sump Pump Installation", "Repiping", "Slab Leak Detection", "Backflow Testing", "Bathroom Remodel", "Emergency Plumbing", "Water Softener Installation", "Frozen Pipe Repair"];
const needsAmount = (type: PriceType) => type === "fixed" || type === "from" || type === "hourly";
const input = "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";
const blank = (): Draft => ({ name: "", category: "", description: "", priceType: "from", priceAmount: "", price: "", duration: "", includes: [], warranty: "", emergency: false, featured: false, image: "" });

/** "From $89" — the same wording customers see. */
function shownPrice(draft: Pick<Draft, "priceType" | "priceAmount" | "price">) {
  const amount = Number(draft.priceAmount);
  const money = Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
  if (draft.priceType === "quote") return "Free quote";
  if (draft.priceType === "free") return "Free";
  if (draft.priceType === "custom") return draft.price || "Ask for a quote";
  if (!(amount > 0)) return "Set a price";
  return draft.priceType === "from" ? `From ${money}` : draft.priceType === "hourly" ? `${money}/hr` : money;
}

const toDraft = (service: SavedService): Draft => ({
  name: service.name, category: service.category ?? "", description: service.description ?? "",
  // Services saved before structured prices keep their own wording as "Custom".
  priceType: service.priceType ?? (service.price ? "custom" : "quote"), priceAmount: service.priceAmount ? String(service.priceAmount) : "", price: service.priceType ? "" : service.price ?? "",
  duration: service.duration ?? "", includes: service.includes ?? [], warranty: service.warranty ?? "", emergency: Boolean(service.emergency), featured: Boolean(service.featured), image: service.image ?? "",
});

const payload = (draft: Draft) => ({
  name: draft.name.trim(), category: draft.category, description: draft.description,
  priceType: draft.priceType === "custom" ? "" : draft.priceType,
  priceAmount: needsAmount(draft.priceType) ? Number(draft.priceAmount) : "",
  ...(draft.priceType === "custom" ? { price: draft.price } : {}),
  duration: draft.duration, includes: draft.includes, warranty: draft.warranty, emergency: draft.emergency, featured: draft.featured, image: draft.image,
});

/** How the service will look on the public profile. */
function Preview({ draft }: { draft: Draft }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="relative h-28 bg-gradient-to-br from-[#0b1f3b] to-[#17345a]">
        {/* eslint-disable-next-line @next/next/no-img-element -- uploads are data URLs */}
        {draft.image ? <img src={draft.image} alt="" className="h-full w-full object-cover" /> : <FaWrench className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-[#FFD60A]/80" aria-hidden />}
        <div className="absolute left-3 top-3 flex gap-1.5">
          {draft.featured && <span className="inline-flex items-center gap-1 rounded-full bg-[#FFD60A] px-2 py-0.5 text-[11px] font-bold text-[#0b1f3b]"><FaStar className="h-2.5 w-2.5" /> Featured</span>}
          {draft.emergency && <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white"><FaBolt className="h-2.5 w-2.5" /> 24/7</span>}
        </div>
      </div>
      <div className="p-4">
        {draft.category && <p className="text-[11px] font-bold uppercase tracking-wider text-[#f7672c]">{draft.category}</p>}
        <h3 className="font-bold text-gray-900">{draft.name || "Service name"}</h3>
        <p className="mt-1 line-clamp-3 text-sm text-gray-600">{draft.description || "A short description of the job and what makes your service great."}</p>
        {draft.includes.length > 0 && <ul className="mt-2 space-y-1">{draft.includes.slice(0, 4).map((item) => <li key={item} className="flex items-start gap-2 text-sm text-gray-700"><FaCheck className="mt-1 h-3 w-3 shrink-0 text-emerald-600" /> {item}</li>)}</ul>}
        {draft.warranty && <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700"><FaShieldAlt className="h-3 w-3" /> {draft.warranty}</p>}
        <div className="mt-3 flex items-end justify-between border-t border-gray-100 pt-3">
          <div><p className="text-lg font-extrabold text-gray-900">{shownPrice(draft)}</p>{draft.duration && <p className="flex items-center gap-1 text-xs text-gray-500"><FaClock className="h-2.5 w-2.5" /> {draft.duration}</p>}</div>
          <span className="rounded-xl bg-[#0b1f3b] px-3 py-1.5 text-xs font-bold text-white">Book</span>
        </div>
      </div>
    </article>
  );
}

/**
 * Services & pricing: one form per service (name, category, price, duration, what's included, warranty,
 * featured / emergency, photo) with a live preview, and the saved services as cards. Companies and freelancers.
 */
export default function ServicesEditor({ apiEndpoint }: { apiEndpoint: "/companies/services" | "/freelancers/services" }) {
  const { items, loading, editingId, setEditingId, notice, setNotice, saving, save, patch, remove } = useSavedItems(apiEndpoint, { singular: "service" });
  const services = items as unknown as SavedService[];
  const [draft, setDraft] = useState<Draft>(blank);
  const [include, setInclude] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const set = (changes: Partial<Draft>) => setDraft((current) => ({ ...current, ...changes }));

  const startNew = () => { setEditingId(null); setDraft(blank()); setInclude(""); };
  const edit = (service: SavedService) => { setEditingId(service._id); setDraft(toDraft(service)); setNotice(null); formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const addInclude = () => {
    const item = include.trim();
    if (item && !draft.includes.includes(item) && draft.includes.length < 12) set({ includes: [...draft.includes, item] });
    setInclude("");
  };
  const onIncludeKey = (event: KeyboardEvent<HTMLInputElement>) => { if (event.key === "Enter") { event.preventDefault(); addInclude(); } };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim()) return setNotice({ tone: "error", text: "Give the service a name." });
    if (needsAmount(draft.priceType) && !(Number(draft.priceAmount) > 0)) return setNotice({ tone: "error", text: "Enter the price, or choose Free quote." });
    if (services.some((service) => service._id !== editingId && service.name.trim().toLowerCase() === draft.name.trim().toLowerCase())) return setNotice({ tone: "error", text: `You already have a service called "${draft.name.trim()}".` });
    const saved = await save(payload(draft), editingId ? "Service updated." : "Service added to your profile.");
    if (saved) startNew();
  };

  const showExample = !loading && !services.length && !editingId && !draft.name;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <p className="text-xs font-bold uppercase tracking-wider text-[#0b1f3b]">Business Profile</p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">Services &amp; Pricing</h1>
      <p className="mt-2 max-w-3xl text-sm text-gray-500">Add each service you offer with its price, how long it takes, and what&apos;s included. Featured services are shown first on your profile, and customers can book any service directly.</p>

      {showExample && (
        <ExampleCard itemName="service">
          <p className="font-semibold text-gray-900">Drain Cleaning <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">Drains &amp; Sewer</span></p>
          <p className="mt-1 text-sm text-gray-600">From $129 · 1–2 hours · Includes camera check, hydro jetting, clean-up · 90-day guarantee</p>
        </ExampleCard>
      )}

      <form ref={formRef} onSubmit={submit} noValidate className="mt-6 scroll-mt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-gray-900">{editingId ? `Edit “${services.find((service) => service._id === editingId)?.name ?? "service"}”` : "Add a service"}</h2>
          {editingId && <button type="button" onClick={startNew} className="text-sm font-semibold text-gray-500 hover:underline">+ New service instead</button>}
        </div>
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <fieldset disabled={saving} className="space-y-5">
            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-sm font-bold text-gray-900">1. The service</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <label><span className="text-sm font-semibold text-gray-700">Service name <span className="text-red-500">*</span></span>
                  <input list="service-suggestions" value={draft.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Drain Cleaning" className={input} />
                  <datalist id="service-suggestions">{suggestions.map((name) => <option key={name} value={name} />)}</datalist>
                </label>
                <label><span className="text-sm font-semibold text-gray-700">Category</span>
                  <select value={draft.category} onChange={(e) => set({ category: e.target.value })} className={input}>
                    <option value="">Choose a category</option>
                    {categories.map((name) => <option key={name}>{name}</option>)}
                  </select>
                </label>
                <label className="sm:col-span-2"><span className="flex justify-between text-sm font-semibold text-gray-700">Description <span className="font-normal text-gray-400">{draft.description.length}/2000</span></span>
                  <textarea rows={3} maxLength={2000} value={draft.description} onChange={(e) => set({ description: e.target.value })} placeholder="What the job involves and why customers choose you for it." className={input} />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-sm font-bold text-gray-900">2. Price &amp; time</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Price type">
                {priceTypes.map((option) => (
                  <button key={option.value} type="button" role="radio" aria-checked={draft.priceType === option.value} onClick={() => set({ priceType: option.value })} className={`rounded-xl border px-3 py-2 text-left transition ${draft.priceType === option.value ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 bg-white text-gray-800 hover:border-[#FFD60A]"}`}>
                    <span className="block text-sm font-semibold">{option.label}</span>
                    <span className={`block text-xs ${draft.priceType === option.value ? "text-white/70" : "text-gray-500"}`}>{option.hint}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {needsAmount(draft.priceType) && (
                  <label><span className="text-sm font-semibold text-gray-700">{draft.priceType === "hourly" ? "Price per hour" : draft.priceType === "from" ? "Starting price" : "Price"} <span className="text-red-500">*</span></span>
                    <div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 mt-0.5 -translate-y-1/2 text-sm text-gray-500">$</span><input type="number" min="0" step="any" inputMode="decimal" value={draft.priceAmount} onChange={(e) => set({ priceAmount: e.target.value })} placeholder="89" aria-label="Price amount" className={`${input} pl-7`} /></div>
                  </label>
                )}
                {draft.priceType === "custom" && (
                  <label><span className="text-sm font-semibold text-gray-700">Price wording</span><input maxLength={60} value={draft.price} onChange={(e) => set({ price: e.target.value })} placeholder="e.g. $150–$300" className={input} /></label>
                )}
                <label><span className="text-sm font-semibold text-gray-700">Typical duration</span><input list="service-durations" maxLength={60} value={draft.duration} onChange={(e) => set({ duration: e.target.value })} placeholder="e.g. 1–2 hours" className={input} /></label>
                <datalist id="service-durations">{durations.map((value) => <option key={value} value={value} />)}</datalist>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">{durations.slice(0, 6).map((value) => <button key={value} type="button" onClick={() => set({ duration: value })} className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${draft.duration === value ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 text-gray-600 hover:border-[#FFD60A]"}`}>{value}</button>)}</div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-sm font-bold text-gray-900">3. What&apos;s included <span className="font-normal text-gray-400">({draft.includes.length}/12)</span></p>
              <div className="mt-3 flex gap-2">
                <input value={include} onChange={(e) => setInclude(e.target.value)} onKeyDown={onIncludeKey} maxLength={120} placeholder="e.g. Camera inspection — press Enter to add" aria-label="Included item" className={`${input} mt-0`} />
                <button type="button" onClick={addInclude} disabled={!include.trim() || draft.includes.length >= 12} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#0b1f3b] px-3 text-sm font-bold text-white disabled:opacity-40"><FaPlus className="h-3 w-3" /> Add</button>
              </div>
              {draft.includes.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {draft.includes.map((item) => (
                    <li key={item} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 py-1 pl-3 pr-1.5 text-xs font-semibold text-emerald-800">
                      <FaCheck className="h-2.5 w-2.5" /> {item}
                      <button type="button" onClick={() => set({ includes: draft.includes.filter((value) => value !== item) })} aria-label={`Remove ${item}`} className="grid h-5 w-5 place-items-center rounded-full hover:bg-emerald-100"><FaTimes className="h-2.5 w-2.5" /></button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-sm font-bold text-gray-900">4. Extras</p>
              <label className="mt-3 block"><span className="text-sm font-semibold text-gray-700">Warranty or guarantee</span><input maxLength={120} value={draft.warranty} onChange={(e) => set({ warranty: e.target.value })} placeholder="e.g. 1-year labor warranty" className={input} /></label>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${draft.featured ? "border-[#FFD60A] bg-[#FFD60A]/10" : "border-gray-200"}`}>
                  <input type="checkbox" checked={draft.featured} onChange={(e) => set({ featured: e.target.checked })} className="mt-0.5 h-4 w-4 accent-[#0b1f3b]" />
                  <span><span className="block text-sm font-semibold text-gray-900">Featured service</span><span className="text-xs text-gray-500">Shown first, as a large card</span></span>
                </label>
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${draft.emergency ? "border-red-300 bg-red-50" : "border-gray-200"}`}>
                  <input type="checkbox" checked={draft.emergency} onChange={(e) => set({ emergency: e.target.checked })} className="mt-0.5 h-4 w-4 accent-red-600" />
                  <span><span className="block text-sm font-semibold text-gray-900">24/7 emergency</span><span className="text-xs text-gray-500">Available day and night</span></span>
                </label>
              </div>
              <div className="mt-4"><LocalMediaUpload label="Service photo (optional)" kind="image" value={draft.image} onChange={(image) => set({ image })} /></div>
            </div>

            <NoticeMessage notice={notice} />
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={saving} className="rounded-xl bg-[#0b1f3b] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#17345a] disabled:opacity-60">{saving ? "Saving…" : editingId ? "Update service" : "Save service"}</button>
              {editingId && <button type="button" onClick={startNew} className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50">Cancel</button>}
            </div>
          </fieldset>

          <aside className="lg:sticky lg:top-4 lg:self-start">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Preview on your profile</p>
            <Preview draft={draft} />
          </aside>
        </div>
      </form>

      {services.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-bold text-gray-900">Your services <span className="font-medium text-gray-400">({services.length})</span></h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <li key={service._id} className={`flex flex-col rounded-2xl border p-4 ${editingId === service._id ? "border-[#0b1f3b] ring-2 ring-[#FFD60A]/40" : "border-gray-200"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">{service.name}</p>
                    <p className="truncate text-xs text-gray-500">{[service.category, service.duration].filter(Boolean).join(" · ") || "No category"}</p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-gray-900">{service.price || "Quote"}</p>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {service.featured && <span className="inline-flex items-center gap-1 rounded-full bg-[#FFD60A]/20 px-2 py-0.5 text-[11px] font-bold text-[#0b1f3b]"><FaStar className="h-2.5 w-2.5" /> Featured</span>}
                  {service.emergency && <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-700">24/7</span>}
                  {(service.includes?.length ?? 0) > 0 && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">{service.includes!.length} included</span>}
                  {!service.priceType && !service.price && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800">Add a price</span>}
                </div>
                <div className="mt-auto flex flex-wrap gap-2 pt-3">
                  <button type="button" onClick={() => patch(service._id, { featured: !service.featured }, service.featured ? `${service.name} is no longer featured.` : `${service.name} is now featured.`)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50">{service.featured ? "Unfeature" : "Feature"}</button>
                  <button type="button" onClick={() => edit(service)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50">{editingId === service._id ? "Editing" : "Edit"}</button>
                  <button type="button" onClick={() => { if (window.confirm(`Delete "${service.name}"?`)) { remove(service._id); if (editingId === service._id) startNew(); } }} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
