"use client";

import { FormEvent, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import MultiImageUpload from "@/components/company-dashboard/business-profile/MultiImageUpload";
import { StarPicker } from "./Stars";
import { reviewsApi, type EligibleBooking, type PFReview } from "./reviewsApi";

export type Provider = { type: "company" | "freelancer"; id: string; name: string };
type Props = {
  provider: Provider;
  categories: string[];
  /** A directory review, or a verified review for this booking (the booking can't be changed here). */
  booking?: EligibleBooking | null;
  existing?: PFReview | null;
  onSaved: (review: PFReview, message: string) => void;
  onCancel: () => void;
};
const field = "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";

/** One form for every PlumberFinder review: stars, optional title, text, service and photos. */
export default function ReviewForm({ provider, categories, booking, existing, onSaved, onCancel }: Props) {
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [serviceCategory, setServiceCategory] = useState(existing?.serviceCategory ?? "");
  const [photos, setPhotos] = useState<string[]>(existing?.photos ?? []);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const verified = existing ? existing.source === "verified_booking" : Boolean(booking);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!rating) return setError("Choose a star rating.");
    if (title.trim() && title.trim().length < 3) return setError("Make the title a little longer, or leave it empty.");
    if (body.trim().length < 20) return setError("Tell other customers a little more (at least 20 characters).");
    setBusy(true);
    setError("");
    try {
      const values = { rating, title: title.trim(), body: body.trim(), serviceCategory: serviceCategory || "", photos };
      const result = existing
        ? await reviewsApi.update(existing._id, values)
        : await reviewsApi.create({ ...values, providerType: provider.type, providerId: provider.id, providerName: provider.name, ...(booking ? { bookingId: booking._id } : {}) });
      onSaved(result.data, result.message ?? "Saved.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save your review.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className={`flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm ${verified ? "bg-emerald-50 text-emerald-900" : "bg-gray-50 text-gray-700"}`}>
        {verified ? <FaCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden /> : null}
        <p>{verified
          ? <>Verified review for booking <span className="font-mono font-semibold">{existing?.bookingReference ?? booking?.reference}</span>{booking ? ` · ${booking.service}` : ""}. It will show a <span className="font-semibold">Verified Booking</span> label.</>
          : <>Directory review of {provider.name}. It isn&apos;t tied to a PlumberFinder booking, so it won&apos;t show a Verified label.</>}</p>
      </div>
      <StarPicker value={rating} onChange={setRating} />
      <label className="block"><span className="text-sm font-semibold text-gray-700">Title <span className="font-normal text-gray-400">(optional)</span></span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="e.g. Fast, tidy leak repair" className={field} />
      </label>
      <label className="block"><span className="flex justify-between text-sm font-semibold text-gray-700">Your review <span className="text-red-500">*</span><span className="ml-auto font-normal text-gray-400">{body.length}/3000</span></span>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} maxLength={3000} placeholder="What did they do, how was the service, and would you hire them again?" className={field} />
      </label>
      <label className="block"><span className="text-sm font-semibold text-gray-700">Service</span>
        <select value={serviceCategory} onChange={(e) => setServiceCategory(e.target.value)} className={field}>
          <option value="">Choose a service (optional)</option>
          {categories.map((name) => <option key={name}>{name}</option>)}
        </select>
      </label>
      <MultiImageUpload label="Photos (optional)" value={photos} onChange={setPhotos} max={4} hint="Show the finished work — up to 4 photos." />
      {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy} className="rounded-full bg-[#0b1f3b] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#17345a] disabled:opacity-60">{busy ? "Saving…" : existing ? "Save changes" : "Post review"}</button>
        <button type="button" onClick={onCancel} className="rounded-full px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
      </div>
      <p className="text-xs text-gray-500">Reviews must be about your own experience. Links, advertising and copied text are held for a quick check.</p>
    </form>
  );
}
