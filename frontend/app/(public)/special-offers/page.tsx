import Link from "next/link";
import { plumbers } from "@/data/plumbers";
import SpecialOffersList from "@/components/offers/SpecialOffersList";

export default function SpecialOffersPage() {
  const offerPlumbers = plumbers.filter((plumber) => plumber.discount);
  return <main className="min-h-screen bg-slate-50">
    <section className="bg-[#0f2a4d] px-4 py-16 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FFD60A]">Save on trusted service</p><h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">Special plumbing offers near you</h1><p className="mt-5 max-w-2xl text-lg text-slate-200">Browse current discounts from verified local plumbers. Copy an offer code, then book online when you are ready.</p><Link href="/book-plumber" className="mt-7 inline-flex rounded-full bg-[#FFD60A] px-6 py-3 text-sm font-bold text-slate-900 transition hover:brightness-105">Book a plumber</Link></div></section>
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-bold text-slate-900">{offerPlumbers.length} offers available</h2><p className="mt-1 text-sm text-slate-600">Offer terms are confirmed with the plumber before your appointment.</p></div></div><SpecialOffersList plumbers={offerPlumbers} /></section>
  </main>;
}
