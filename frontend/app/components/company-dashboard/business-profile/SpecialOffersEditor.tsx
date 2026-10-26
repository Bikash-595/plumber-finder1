"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { FaPause, FaPlay, FaPlus, FaRandom, FaTag, FaTrash } from "react-icons/fa";
import LocalMediaUpload from "./LocalMediaUpload";
import { companyApi } from "./companyApi";
import { ExampleCard, NoticeMessage, useSavedItems } from "./SavedItems";

type DiscountType = "percent" | "amount" | "free" | "other";
type CouponDraft = { key: string; code: string; discountType: DiscountType; discountValue: string; label: string; appliesTo: string; minSpend: string; terms: string };
type OfferDraft = { title: string; description: string; startDate: string; endDate: string; image: string; active: boolean; coupons: CouponDraft[] };
type SavedCoupon = { code: string; discountType?: DiscountType; discountValue?: number; label?: string; appliesTo?: string; minSpend?: number; terms?: string };
type SavedOffer = { _id: string; title?: string; description?: string; startDate?: string; endDate?: string; image?: string; active?: boolean; coupons?: SavedCoupon[]; discount?: string; promoCode?: string };

type Props = {
  /** "/companies/special-offers" or "/freelancers/special-offers". */
  apiEndpoint: string;
  /** "/companies/services" or "/freelancers/services": suggestions for "Applies to". */
  servicesEndpoint: string;
};

const input = "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";
const typeOptions: { value: DiscountType; label: string }[] = [
  { value: "percent", label: "% off" },
  { value: "amount", label: "$ off" },
  { value: "free", label: "Something free" },
  { value: "other", label: "Other deal" },
];
let keySeq = 0;
const newKey = () => `coupon-${++keySeq}`;
const blankCoupon = (): CouponDraft => ({ key: newKey(), code: "", discountType: "percent", discountValue: "", label: "", appliesTo: "", minSpend: "", terms: "" });
const blankOffer = (): OfferDraft => ({ title: "", description: "", startDate: "", endDate: "", image: "", active: true, coupons: [blankCoupon()] });
const randomCode = (prefix: string) => `${(prefix.replace(/[^A-Za-z0-9]/g, "").toUpperCase() || "SAVE").slice(0, 8)}${Math.floor(10 + Math.random() * 90)}`;

/** "20% off on Drain Cleaning" — the same wording customers see. */
function couponLabel(coupon: Pick<CouponDraft, "discountType" | "discountValue" | "label" | "appliesTo">) {
  const value = Number(coupon.discountValue);
  const main = coupon.discountType === "percent" && value > 0 ? `${value}% off`
    : coupon.discountType === "amount" && value > 0 ? `$${value} off`
    : coupon.label || (coupon.discountType === "free" ? "Free …" : "Describe the deal");
  return `${main}${coupon.appliesTo ? ` on ${coupon.appliesTo}` : ""}`;
}

const today = () => new Date().toISOString().slice(0, 10);
/** Live, Scheduled, Expired or Paused — only Live offers show on the public profile and cards. */
function offerStatus(offer: SavedOffer) {
  const start = offer.startDate?.slice(0, 10);
  const end = offer.endDate?.slice(0, 10);
  if (offer.active === false) return { label: "Paused", tone: "bg-gray-100 text-gray-600", hint: "Hidden from customers until you resume it." };
  if (start && start > today()) return { label: "Scheduled", tone: "bg-blue-50 text-blue-700", hint: `Shows on your profile from ${start}.` };
  if (end && end < today()) return { label: "Expired", tone: "bg-red-50 text-red-700", hint: `Ended ${end}. Edit the end date to show it again.` };
  return { label: "Live", tone: "bg-emerald-50 text-emerald-700", hint: "Showing on your profile and cards." };
}

/** Saved offer → form; an old single-code offer becomes one coupon ("15% off" is read as 15 percent). */
function toDraft(offer: SavedOffer): OfferDraft {
  const coupons: CouponDraft[] = (offer.coupons ?? []).map((coupon) => ({
    key: newKey(), code: coupon.code, discountType: coupon.discountType ?? "percent", discountValue: coupon.discountValue != null ? String(coupon.discountValue) : "",
    label: coupon.label ?? "", appliesTo: coupon.appliesTo ?? "", minSpend: coupon.minSpend != null ? String(coupon.minSpend) : "", terms: coupon.terms ?? "",
  }));
  if (!coupons.length && (offer.promoCode || offer.discount)) {
    const percent = offer.discount?.match(/^\s*(\d+(?:\.\d+)?)\s*%/);
    const amount = offer.discount?.match(/^\s*\$\s*(\d+(?:\.\d+)?)/);
    coupons.push({ ...blankCoupon(), code: offer.promoCode ?? "", discountType: percent ? "percent" : amount ? "amount" : "other", discountValue: percent?.[1] ?? amount?.[1] ?? "", label: percent || amount ? "" : offer.discount ?? "" });
  }
  return { title: offer.title ?? "", description: offer.description ?? "", startDate: offer.startDate?.slice(0, 10) ?? "", endDate: offer.endDate?.slice(0, 10) ?? "", image: offer.image ?? "", active: offer.active !== false, coupons };
}

function validate(draft: OfferDraft): string | null {
  if (!draft.title.trim()) return "Give the offer a title.";
  if (draft.startDate && draft.endDate && draft.endDate < draft.startDate) return "The end date must be on or after the start date.";
  const seen = new Set<string>();
  for (const [index, coupon] of draft.coupons.entries()) {
    const name = `Coupon ${index + 1}`;
    const code = coupon.code.trim().toUpperCase();
    const value = Number(coupon.discountValue);
    if (!/^[A-Z0-9][A-Z0-9_-]{2,39}$/.test(code)) return `${name}: the code must be 3–40 letters or numbers (no spaces).`;
    if (seen.has(code)) return `${name}: ${code} is already used in this offer — each code must be different.`;
    seen.add(code);
    if ((coupon.discountType === "percent" || coupon.discountType === "amount") && !(value > 0)) return `${name}: enter the discount amount.`;
    if (coupon.discountType === "percent" && value > 100) return `${name}: a discount can't be more than 100%.`;
    if ((coupon.discountType === "free" || coupon.discountType === "other") && !coupon.label.trim()) return `${name}: describe what the customer gets, e.g. "Free inspection".`;
    if (coupon.minSpend && !(Number(coupon.minSpend) >= 0)) return `${name}: the minimum spend must be a number.`;
  }
  return null;
}

const payload = (draft: OfferDraft) => ({
  title: draft.title, description: draft.description, startDate: draft.startDate, endDate: draft.endDate, image: draft.image, active: draft.active,
  // Codes live in `coupons`; clear the old single-code fields.
  discount: "", promoCode: "",
  coupons: draft.coupons.map((coupon) => ({
    code: coupon.code.trim().toUpperCase(), discountType: coupon.discountType,
    discountValue: coupon.discountType === "percent" || coupon.discountType === "amount" ? Number(coupon.discountValue) : null,
    label: coupon.label, appliesTo: coupon.appliesTo, minSpend: coupon.minSpend === "" ? null : Number(coupon.minSpend), terms: coupon.terms,
  })),
});

/**
 * Special offers: each offer (title, dates, image) has one or more coupon codes, and every code has its
 * own discount. Saved offers are listed with their status (Live / Scheduled / Expired / Paused).
 */
export default function SpecialOffersEditor({ apiEndpoint, servicesEndpoint }: Props) {
  const { items, loading, editingId, setEditingId, notice, setNotice, saving, save, patch, remove } = useSavedItems(apiEndpoint, { singular: "offer" });
  const offers = items as unknown as SavedOffer[];
  const [draft, setDraft] = useState<OfferDraft>(blankOffer);
  const [services, setServices] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    companyApi<{ name?: string }[]>(servicesEndpoint).then(({ data }) => setServices(data.map((item) => item.name ?? "").filter(Boolean))).catch(() => undefined);
  }, [servicesEndpoint]);

  const set = (changes: Partial<OfferDraft>) => setDraft((current) => ({ ...current, ...changes }));
  const setCoupon = (key: string, changes: Partial<CouponDraft>) => set({ coupons: draft.coupons.map((coupon) => (coupon.key === key ? { ...coupon, ...changes } : coupon)) });
  const startNew = () => { setEditingId(null); setDraft(blankOffer()); setNotice(null); };
  const edit = (offer: SavedOffer) => {
    setEditingId(offer._id);
    setDraft(toDraft(offer));
    setNotice(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const problem = validate(draft);
    if (problem) return setNotice({ tone: "error", text: problem });
    const saved = await save(payload(draft), editingId ? "Offer updated." : "Offer saved. Live offers show on your profile and cards.");
    if (saved) startNew();
  };

  const showExample = !loading && !offers.length && !editingId && !draft.title && draft.coupons.every((coupon) => !coupon.code);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <p className="text-xs font-bold uppercase tracking-wider text-[#0b1f3b]">Business Profile</p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">Special Offers</h1>
      <p className="mt-2 max-w-3xl text-sm text-gray-500">Create offers with one or more coupon codes. Each code can give a different discount, e.g. SAVE10 for 10% off any job and DRAIN25 for $25 off drain cleaning. Live offers show on your cards and profile.</p>

      {showExample && (
        <ExampleCard itemName="offer">
          <p className="font-semibold text-gray-900">Spring savings <span className="ml-1 text-xs text-gray-500">· until May 31</span></p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-green-50 px-2.5 py-1 font-semibold text-green-700">SAVE10 · 10% off</span>
            <span className="rounded-full bg-green-50 px-2.5 py-1 font-semibold text-green-700">DRAIN25 · $25 off on Drain Cleaning</span>
            <span className="rounded-full bg-green-50 px-2.5 py-1 font-semibold text-green-700">CHECKUP · Free inspection</span>
          </div>
        </ExampleCard>
      )}

      <form ref={formRef} onSubmit={submit} noValidate className="mt-6 scroll-mt-4 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-gray-900">{editingId ? "Edit offer" : "Add an offer"}</h2>
          {editingId && <button type="button" onClick={startNew} className="text-sm font-semibold text-gray-500 hover:underline">+ New offer instead</button>}
        </div>
        <fieldset disabled={saving} className="grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2"><span className="text-sm font-semibold text-gray-700">Offer title <span className="text-red-500">*</span></span>
            <input value={draft.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. Spring savings" className={input} />
          </label>
          <label className="md:col-span-2"><span className="text-sm font-semibold text-gray-700">Description</span>
            <textarea rows={2} value={draft.description} onChange={(e) => set({ description: e.target.value })} placeholder="e.g. Book any plumbing job before the end of May." className={input} />
          </label>
          <label><span className="text-sm font-semibold text-gray-700">Start date <span className="font-normal text-gray-400">(optional)</span></span>
            <input type="date" value={draft.startDate} onChange={(e) => set({ startDate: e.target.value })} className={input} />
          </label>
          <label><span className="text-sm font-semibold text-gray-700">End date <span className="font-normal text-gray-400">(optional — the offer hides after this day)</span></span>
            <input type="date" value={draft.endDate} onChange={(e) => set({ endDate: e.target.value })} className={input} />
          </label>
          <label className="flex items-center gap-3 text-sm font-semibold text-gray-700 md:col-span-2">
            <input type="checkbox" checked={draft.active} onChange={(e) => set({ active: e.target.checked })} className="h-4 w-4 accent-[#0b1f3b]" />
            Show this offer to customers
          </label>
        </fieldset>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-gray-900">Coupon codes <span className="font-medium text-gray-400">({draft.coupons.length})</span></h3>
            <button type="button" onClick={() => set({ coupons: [...draft.coupons, blankCoupon()] })} disabled={draft.coupons.length >= 20} className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#0b1f3b] px-3 py-1.5 text-xs font-bold text-[#0b1f3b] hover:bg-white disabled:opacity-40"><FaPlus className="h-2.5 w-2.5" /> Add coupon code</button>
          </div>
          {!draft.coupons.length && <p className="mt-3 text-sm text-gray-500">No codes: customers just see the offer. Add a code to give a discount.</p>}
          <ul className="mt-3 space-y-3">
            {draft.coupons.map((coupon, index) => {
              const needsValue = coupon.discountType === "percent" || coupon.discountType === "amount";
              return (
                <li key={coupon.key} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="inline-flex min-w-0 items-center gap-2 text-sm font-semibold text-gray-900"><FaTag className="h-3 w-3 shrink-0 text-green-600" /><span className="truncate">{coupon.code ? `${coupon.code.toUpperCase()} · ` : `Coupon ${index + 1} · `}<span className="text-green-700">{couponLabel(coupon)}</span></span></p>
                    <button type="button" onClick={() => set({ coupons: draft.coupons.filter((item) => item.key !== coupon.key) })} aria-label={`Remove coupon ${index + 1}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><FaTrash className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <label className="sm:col-span-2 lg:col-span-1"><span className="text-xs font-semibold text-gray-700">Code <span className="text-red-500">*</span></span>
                      <div className="flex gap-1.5">
                        <input value={coupon.code} onChange={(e) => setCoupon(coupon.key, { code: e.target.value.toUpperCase().replace(/\s+/g, "") })} placeholder="e.g. SAVE10" aria-label={`Coupon ${index + 1} code`} className={`${input} font-mono uppercase`} />
                        <button type="button" onClick={() => setCoupon(coupon.key, { code: randomCode(draft.title) })} title="Make a code" aria-label={`Make a code for coupon ${index + 1}`} className="mt-1 shrink-0 rounded-xl border border-gray-200 px-3 text-gray-600 hover:border-[#FFD60A]"><FaRandom className="h-3.5 w-3.5" /></button>
                      </div>
                    </label>
                    <label><span className="text-xs font-semibold text-gray-700">Discount type</span>
                      <select value={coupon.discountType} onChange={(e) => setCoupon(coupon.key, { discountType: e.target.value as DiscountType })} aria-label={`Coupon ${index + 1} discount type`} className={input}>
                        {typeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    </label>
                    {needsValue ? (
                      <label><span className="text-xs font-semibold text-gray-700">{coupon.discountType === "percent" ? "Percent off" : "Amount off ($)"} <span className="text-red-500">*</span></span>
                        <input type="number" min="0" max={coupon.discountType === "percent" ? 100 : undefined} step="any" value={coupon.discountValue} onChange={(e) => setCoupon(coupon.key, { discountValue: e.target.value })} placeholder={coupon.discountType === "percent" ? "e.g. 10" : "e.g. 25"} aria-label={`Coupon ${index + 1} discount`} className={input} />
                      </label>
                    ) : (
                      <label><span className="text-xs font-semibold text-gray-700">What the customer gets <span className="text-red-500">*</span></span>
                        <input value={coupon.label} onChange={(e) => setCoupon(coupon.key, { label: e.target.value })} placeholder={coupon.discountType === "free" ? "e.g. Free inspection" : "e.g. Buy one, get one half price"} aria-label={`Coupon ${index + 1} deal`} className={input} />
                      </label>
                    )}
                    <label><span className="text-xs font-semibold text-gray-700">Applies to</span>
                      <input list={`offer-services-${coupon.key}`} value={coupon.appliesTo} onChange={(e) => setCoupon(coupon.key, { appliesTo: e.target.value })} placeholder="Any service" aria-label={`Coupon ${index + 1} applies to`} className={input} />
                      <datalist id={`offer-services-${coupon.key}`}>{services.map((name) => <option key={name} value={name} />)}</datalist>
                    </label>
                    <label><span className="text-xs font-semibold text-gray-700">Minimum spend ($)</span>
                      <input type="number" min="0" step="any" value={coupon.minSpend} onChange={(e) => setCoupon(coupon.key, { minSpend: e.target.value })} placeholder="None" aria-label={`Coupon ${index + 1} minimum spend`} className={input} />
                    </label>
                    <label className="sm:col-span-2 lg:col-span-3"><span className="text-xs font-semibold text-gray-700">Terms</span>
                      <input value={coupon.terms} onChange={(e) => setCoupon(coupon.key, { terms: e.target.value })} placeholder="e.g. New customers only. One per household." aria-label={`Coupon ${index + 1} terms`} className={input} />
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <LocalMediaUpload label="Offer image (optional)" kind="image" value={draft.image} onChange={(image) => set({ image })} />

        <NoticeMessage notice={notice} />
        <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
          <button type="submit" disabled={saving} className="rounded-xl bg-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#17345a] disabled:opacity-60">{saving ? "Saving…" : editingId ? "Update offer" : "Save offer"}</button>
          {editingId && <button type="button" onClick={startNew} className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50">Cancel</button>}
        </div>
      </form>

      {offers.length > 0 && (
        <div className="mt-8 rounded-xl border border-gray-200">
          <h3 className="border-b border-gray-100 px-4 py-3 text-sm font-bold text-gray-900">Your offers <span className="font-medium text-gray-400">({offers.length})</span></h3>
          <ul className="divide-y divide-gray-100">
            {offers.map((offer) => {
              const status = offerStatus(offer);
              const coupons = toDraft(offer).coupons;
              return (
                <li key={offer._id} className={`flex flex-col gap-3 px-4 py-4 lg:flex-row lg:items-start lg:justify-between ${editingId === offer._id ? "bg-[#FFD60A]/10" : ""}`}>
                  <div className="min-w-0 space-y-2">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-900">{offer.title}<span className={`rounded-full px-2 py-0.5 text-xs font-bold ${status.tone}`}>{status.label}</span></p>
                    <p className="text-xs text-gray-500">{status.hint}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {coupons.length ? coupons.map((coupon) => <span key={coupon.key} className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700"><span className="font-mono">{coupon.code || "No code"}</span> · {couponLabel(coupon)}</span>) : <span className="text-xs text-gray-400">No coupon codes</span>}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button type="button" onClick={() => patch(offer._id, { active: offer.active === false }, offer.active === false ? "Offer resumed." : "Offer paused.")} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50">{offer.active === false ? <><FaPlay className="h-2.5 w-2.5" /> Resume</> : <><FaPause className="h-2.5 w-2.5" /> Pause</>}</button>
                    <button type="button" onClick={() => edit(offer)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50">{editingId === offer._id ? "Editing" : "Edit"}</button>
                    <button type="button" onClick={() => { if (window.confirm(`Delete "${offer.title}" and its coupon codes?`)) remove(offer._id); }} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">Delete</button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
