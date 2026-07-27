"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { plumbers } from "@/data/plumbers";
import BookPlumberForm from "@/components/booking/BookPlumberForm";

export default function BookPlumberPage() {
  return (
    <Suspense fallback={<BookingPageFallback />}>
      <BookPlumberPageContent />
    </Suspense>
  );
}

function BookPlumberPageContent() {
  const params = useSearchParams();
  return <main className="min-h-screen bg-slate-50"><section className="bg-gradient-to-br from-emerald-800 to-[#0f2a4d] px-4 py-14 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-4xl text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FFD60A]">Book online in minutes</p><h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Request a plumber visit</h1><p className="mx-auto mt-4 max-w-2xl text-slate-200">Tell us what you need and when. A qualified plumber will confirm the appointment, price, and any offer details.</p></div></section><section className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[1.35fr_0.65fr] sm:px-6 lg:px-8"><BookPlumberForm plumbers={plumbers} initialPlumberId={params.get("plumber") ?? ""} initialOffer={params.get("offer") ?? ""} /><aside className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><h2 className="text-xl font-bold text-slate-900">What happens next?</h2><ol className="mt-5 space-y-5 text-sm leading-6 text-slate-600"><li><span className="mr-2 font-bold text-emerald-700">01</span>Submit your request with your preferred date and time.</li><li><span className="mr-2 font-bold text-emerald-700">02</span>The plumber contacts you to confirm availability and pricing.</li><li><span className="mr-2 font-bold text-emerald-700">03</span>Your service is scheduled—no charge is made through this form.</li></ol></aside></section></main>;
}

function BookingPageFallback() {
  return <main className="min-h-screen bg-slate-50" aria-busy="true" />;
}
