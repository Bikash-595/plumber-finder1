"use client";

import Link from "next/link";
import { useState } from "react";
import { isCustomerSignedIn, userApi } from "@/components/utils/userApi";
import type { Plumber } from "@/components/find/types";

type Props = { plumbers: Plumber[]; initialPlumberId?: string; initialOffer?: string };

export default function BookPlumberForm({ plumbers, initialPlumberId = "", initialOffer = "" }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ plumberId: initialPlumberId, name: "", email: "", phone: "", service: "", date: "", time: "", address: "", details: "", offer: initialOffer });
  const selectedPlumber = plumbers.find((plumber) => plumber.id === form.plumberId);
  const update = (name: keyof typeof form, value: string) => setForm((current) => ({ ...current, [name]: value }));

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ text: string; login?: boolean } | null>(null);

  // Booking requests are saved to the customer's account (and shown in their dashboard), so they need a customer login.
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isCustomerSignedIn()) return setError({ text: "Log in with a customer account to send your booking request. Your details stay on this page.", login: true });
    if (!selectedPlumber) return setError({ text: "Please choose a plumber." });
    setBusy(true);
    setError(null);
    try {
      await userApi.requestBooking({
        providerType: "company", providerId: selectedPlumber.id, providerName: selectedPlumber.companyName,
        service: form.service, scheduledDate: form.date || undefined, timeSlot: form.time || undefined,
        address: form.address, phone: form.phone, details: form.details, offer: form.offer || undefined,
      });
      setSubmitted(true);
    } catch (caught) {
      setError({ text: caught instanceof Error ? caught.message : "Could not send your booking request." });
    } finally {
      setBusy(false);
    }
  };

  if (submitted) return <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center"><p className="text-2xl font-bold text-emerald-900">Your booking request is on its way.</p><p className="mt-2 text-sm text-emerald-800">{selectedPlumber ? `${selectedPlumber.companyName} will contact you to confirm the appointment.` : "A local plumber will contact you to confirm the appointment."}</p><button type="button" onClick={() => setSubmitted(false)} className="mt-5 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white">Book another service</button></div>;

  return (
    <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="sm:col-span-2 text-sm font-semibold text-slate-700">Choose a plumber<select required value={form.plumberId} onChange={(e) => update("plumberId", e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-emerald-600"><option value="">Match me with a local plumber</option>{plumbers.map((plumber) => <option key={plumber.id} value={plumber.id}>{plumber.companyName} — {plumber.location}</option>)}</select></label>
        <label className="text-sm font-semibold text-slate-700">Full name<input required value={form.name} onChange={(e) => update("name", e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-600" placeholder="Your name" /></label>
        <label className="text-sm font-semibold text-slate-700">Phone number<input required type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-600" placeholder="(555) 000-0000" /></label>
        <label className="text-sm font-semibold text-slate-700">Email address<input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-600" placeholder="you@example.com" /></label>
        <label className="text-sm font-semibold text-slate-700">Service needed<select required value={form.service} onChange={(e) => update("service", e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-emerald-600"><option value="">Select a service</option>{(selectedPlumber?.services ?? ["Leak repair", "Drain cleaning", "Water heater", "Emergency plumbing", "Other"]).map((service) => <option key={service}>{service}</option>)}</select></label>
        <label className="text-sm font-semibold text-slate-700">Preferred date<input required type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-600" /></label>
        <label className="text-sm font-semibold text-slate-700">Preferred time<select required value={form.time} onChange={(e) => update("time", e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-emerald-600"><option value="">Select a time</option><option>8:00 AM – 10:00 AM</option><option>10:00 AM – 12:00 PM</option><option>1:00 PM – 3:00 PM</option><option>3:00 PM – 5:00 PM</option></select></label>
        <label className="sm:col-span-2 text-sm font-semibold text-slate-700">Service address<input required value={form.address} onChange={(e) => update("address", e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-600" placeholder="Street address, city, ZIP code" /></label>
        <label className="sm:col-span-2 text-sm font-semibold text-slate-700">Offer code <span className="font-normal text-slate-400">(optional)</span><input value={form.offer} onChange={(e) => update("offer", e.target.value.toUpperCase())} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-600" placeholder="Enter your discount code" /></label>
        <label className="sm:col-span-2 text-sm font-semibold text-slate-700">Describe the issue<textarea required rows={4} value={form.details} onChange={(e) => update("details", e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-emerald-600" placeholder="Tell the plumber what is happening and any access details." /></label>
      </div>
      {error && <p role="alert" className={`mt-5 rounded-xl px-4 py-3 text-sm ${error.login ? "bg-amber-50 text-amber-800" : "bg-red-50 text-red-700"}`}>{error.text} {error.login && <Link href="/login" className="font-semibold underline">Log in</Link>}</p>}
      <button type="submit" disabled={busy} className="mt-6 w-full rounded-full bg-[#FFD60A] px-5 py-3.5 font-bold text-slate-900 shadow-sm transition hover:brightness-105 disabled:opacity-60">{busy ? "Sending…" : "Request my booking"}</button>
      <p className="mt-3 text-center text-xs text-slate-500">Free booking request. Your plumber will confirm availability and pricing before work begins.</p>
    </form>
  );
}
