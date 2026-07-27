// "use client";

// import { Inter, Plus_Jakarta_Sans } from "next/font/google";
// import ContactHero from "../components/contact/ContactHero";
// import ContactForm from "../components/contact/ContactForm";
// import ContactInfo from "../components/contact/ContactInfo";
// import ContactMap from "../components/contact/ContactMap";
// import ContactChatPreview from "../components/contact/ContactChatPreview";
// import ContactFaq from "../components/contact/ContactFaq";
// import ContactLiquidGlass from "../components/contact/ContactLiquidGlass";

// const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// const plusJakarta = Plus_Jakarta_Sans({
//   subsets: ["latin"],
//   variable: "--font-plus-jakarta",
// });

// export default function ContactPage() {
//   return (
//     <main
//       className={`${inter.variable} ${plusJakarta.variable} relative min-h-screen overflow-x-hidden bg-[#0b1f3b] font-sans`}
//       style={{ fontFamily: "var(--font-inter)" }}
//     >
//       {/* Liquid glass background wrapper */}
//       <ContactLiquidGlass />

//       <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
//         <ContactHero />
        
//         <div className="mt-16 grid gap-12 lg:grid-cols-2">
//           <ContactForm />
//           <ContactInfo />
//         </div>

//         <div className="mt-20">
//           <ContactMap />
//         </div>

//         <div className="mt-20">
//           <ContactChatPreview />
//         </div>

//         <div className="mt-20">
//           <ContactFaq />
//         </div>
//       </div>
//     </main>
//   );
// }









import Link from "next/link";

const supportCards = [
  {
    title: "Customer Support",
    detail: "Need help with booking, pricing, or account issues?",
    action: "support@plumberfinder.com",
  },
  {
    title: "Business Partnerships",
    detail: "Want to join as a verified plumbing professional?",
    action: "partners@plumberfinder.com",
  },
  {
    title: "Urgent Service Help",
    detail: "For urgent plumbing needs, search and connect instantly.",
    action: "Open Find Page",
  },
];

const quickFaq = [
  {
    q: "How quickly can I find a plumber?",
    a: "Most customers are matched with available pros in under 60 seconds.",
  },
  {
    q: "Are plumbers verified?",
    a: "Yes. We review licensing, profile quality, and service details before listing.",
  },
  {
    q: "Can I compare multiple quotes?",
    a: "Yes. You can compare profiles, ratings, and pricing details before booking.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-gray-800">
      <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_left,#123260,transparent_45%),radial-gradient(circle_at_top_right,#0f2a4d,transparent_40%),radial-gradient(circle_at_bottom_left,#0f2a4d,transparent_35%)]">
        <div className="absolute inset-0 bg-[#0b1f3b]/70" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 text-center sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
          <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
            Contact Us
          </span>
          <h1 className="mx-auto mt-5 max-w-4xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            Talk to our team and get the right plumbing help faster.
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-white/80 sm:text-lg">
            Whether you are a customer looking for support or a plumber looking to join, we are here to help.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/find"
              className="rounded-full bg-[#FFD60A] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-105"
            >
              Find a Plumber
            </Link>
            <Link
              href="/add-business"
              className="rounded-full border border-emerald-700 bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              Join as a Pro
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {supportCards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">{card.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{card.detail}</p>
              <p className="mt-3 text-sm font-semibold text-[#b59a00]">{card.action}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
            <p className="mt-2 text-sm text-gray-600">We usually reply within one business day.</p>
            <form className="mt-6 grid gap-4 sm:grid-cols-2">
              <input type="text" placeholder="Full name" className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#FFD60A]" />
              <input type="email" placeholder="Email address" className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#FFD60A]" />
              <input type="text" placeholder="Phone (optional)" className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#FFD60A]" />
              <input type="text" placeholder="Subject" className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#FFD60A]" />
              <textarea placeholder="How can we help?" className="sm:col-span-2 min-h-[140px] rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#FFD60A]" />
              <button type="button" className="sm:col-span-2 inline-flex w-fit rounded-full bg-[#FFD60A] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-105">
                Send Message
              </button>
            </form>
          </div>

          <aside className="rounded-3xl bg-[#0f2a4d] p-6 text-white sm:p-8">
            <h3 className="text-xl font-bold">Quick answers</h3>
            <div className="mt-5 space-y-4">
              {quickFaq.map((item) => (
                <article key={item.q} className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <h4 className="text-sm font-semibold">{item.q}</h4>
                  <p className="mt-1 text-sm text-white/80">{item.a}</p>
                </article>
              ))}
            </div>
            <p className="mt-6 text-sm text-white/80">Prefer instant help? Browse verified plumbers in your area now.</p>
            <Link href="/find" className="mt-4 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0f2a4d] transition hover:bg-gray-100">
              Start Searching
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
