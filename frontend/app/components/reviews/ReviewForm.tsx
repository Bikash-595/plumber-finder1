"use client";

import { FormEvent, useEffect, useState } from "react";
import MultiImageUpload from "@/components/company-dashboard/business-profile/MultiImageUpload";
import { userApi, type Booking } from "@/components/utils/userApi";
import { StarPicker } from "./Stars";
import { reviewsCall, type PFReview } from "./reviewsApi";

type Props = {
  providerType: "company" | "freelancer";
  providerId: string;
  providerName: string;
  categories: string[];
  existing?: PFReview | null;
  onSaved: (review: PFReview, message: string) => void;
  onCancel: () => void;
};
const field = "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";

/** Write or edit a PlumberFinder review: stars, title, text, service, photos, and (when writing) the booking it's about. */
export default function ReviewForm({ providerType, providerId, providerName, categories, existing, onSaved, onCancel }: Props) {
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [serviceCategory, setServiceCategory] = useState(existing?.serviceCategory ?? "");
  const [photos, setPhotos] = useState<string[]>(existing?.photos ?? []);
  const [bookingReference, setBookingReference] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // The customer's bookings with this plumber, to link the review (completed ones show as "Verified").
  useEffect(() => {
    if (existing) return;
    userApi.bookingsPage({ providerType, providerId, limit: 50 }).then(({ data }) => setBookings(data.filter((b) => b.reference && b.status !== "declined"))).catch(() => undefined);
  }, [existing, providerType, providerId]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!rating) return setError("Choose a star rating.");
    if (title.trim().length < 3) return setError("Give your review a short title.");
    if (body.trim().length < 20) return setError("Tell other customers a little more (at least 20 characters).");
    setBusy(true);
    setError("");
    try {
      const payload = { rating, title: title.trim(), body: body.trim(), serviceCategory: serviceCategory || "", photos, ...(existing ? {} : { bookingReference: bookingReference || undefined }) };
      const result = existing
        ? await reviewsCall<PFReview>(`/reviews/item/${existing._id}`, { method: "PATCH", body: payload })
        : await reviewsCall<PFReview>(`/reviews/${providerType}/${providerId}`, { method: "POST", body: { ...payload, providerName } });
      onSaved(result.data, result.message ?? "Saved.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save your review.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4 rounded-2xl border border-[#FFD60A] bg-[#FFD60A]/5 p-4 sm:p-5">
      <p className="text-base font-bold text-gray-900">{existing ? "Edit your review" : `Review ${providerName}`}</p>
      <StarPicker value={rating} onChange={setRating} />
      <label className="block"><span className="text-sm font-semibold text-gray-700">Title <span className="text-red-500">*</span></span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="e.g. Fast, tidy leak repair" className={field} />
      </label>
      <label className="block"><span className="flex justify-between text-sm font-semibold text-gray-700">Your review <span className="text-red-500">*</span><span className="ml-auto font-normal text-gray-400">{body.length}/3000</span></span>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} maxLength={3000} placeholder="What did they do, how was the service, and would you hire them again?" className={field} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="text-sm font-semibold text-gray-700">Service</span>
          <select value={serviceCategory} onChange={(e) => setServiceCategory(e.target.value)} className={field}>
            <option value="">Choose a service (optional)</option>
            {categories.map((name) => <option key={name}>{name}</option>)}
          </select>
        </label>
        {!existing && (
          <label className="block"><span className="text-sm font-semibold text-gray-700">Booking</span>
            <select value={bookingReference} onChange={(e) => setBookingReference(e.target.value)} className={field}>
              <option value="">Not linked to a booking</option>
              {bookings.map((b) => <option key={b._id} value={b.reference}>{b.reference} · {b.service}{b.status === "completed" ? " · completed" : ""}</option>)}
            </select>
            <span className="mt-1 block text-xs text-gray-500">A completed booking marks your review as Verified.</span>
          </label>
        )}
      </div>
      <MultiImageUpload label="Photos (optional)" value={photos} onChange={setPhotos} max={4} hint="Show the finished work — up to 4 photos." />
      {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy} className="rounded-full bg-[#0b1f3b] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#17345a] disabled:opacity-60">{busy ? "Saving…" : existing ? "Save changes" : "Post review"}</button>
        <button type="button" onClick={onCancel} className="rounded-full px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
      </div>
      <p className="text-xs text-gray-500">Reviews must be about your own experience. Links and advertising are held for moderation.</p>
    </form>
  );
}
