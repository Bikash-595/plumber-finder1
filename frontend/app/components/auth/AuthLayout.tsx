import Link from "next/link";
import type { ReactNode } from "react";
import { FaCheckCircle, FaMapMarkerAlt, FaShieldAlt, FaStar } from "react-icons/fa";

const benefits = [
  { icon: FaShieldAlt, title: "Verified plumbers", text: "Licensed companies and freelancers, checked by our team." },
  { icon: FaMapMarkerAlt, title: "Near you", text: "See who serves your ZIP code and how far away they are." },
  { icon: FaStar, title: "Real reviews", text: "Compare ratings, projects, and prices before you book." },
];

/** Split-screen frame for login, signup, and password reset: brand panel + the form. */
export default function AuthLayout({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <main className="min-h-screen bg-[#f5f7fb] font-sans lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="relative hidden overflow-hidden bg-[#0b1f3b] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#FFD60A]/20 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" aria-hidden />
        <Link href="/" className="relative inline-flex items-center gap-3 text-lg font-extrabold tracking-tight">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFD60A] text-xl text-[#0b1f3b]" aria-hidden>🔧</span>
          Plumber Finder
        </Link>
        <div className="relative">
          <h2 className="text-4xl font-extrabold leading-tight xl:text-5xl">Trusted plumbers,<br /><span className="text-[#FFD60A]">one click away.</span></h2>
          <ul className="mt-10 space-y-6">
            {benefits.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-[#FFD60A]"><Icon className="h-5 w-5" /></span>
                <span><span className="block font-bold">{title}</span><span className="text-sm text-white/70">{text}</span></span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative flex items-center gap-2 text-sm text-white/60"><FaCheckCircle className="text-[#FFD60A]" /> Your email is confirmed with a one-time code — no fake accounts.</p>
      </aside>

      <section className="flex min-h-screen items-start justify-center px-4 py-8 sm:items-center sm:px-6 sm:py-12">
        <div className={`w-full ${wide ? "max-w-2xl" : "max-w-md"}`}>
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-base font-extrabold text-[#0b1f3b] lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#FFD60A]" aria-hidden>🔧</span> Plumber Finder
          </Link>
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">{children}</div>
        </div>
      </section>
    </main>
  );
}
