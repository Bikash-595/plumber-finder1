import { FaCamera, FaClipboardList, FaDog, FaDoorOpen, FaTint } from "react-icons/fa";
import type { ServicePage } from "@/components/find/companyListing";
import type { Plumber } from "@/components/find/types";
import { serviceSectionIds } from "./sectionIds";

/** How booking works on Plumber Finder, and simple things that help the visit go quickly. */
export default function ServiceBookingSteps({ plumber, service }: { plumber: Plumber; service: ServicePage }) {
  const steps = [
    { title: "Send a request", text: `Choose ${service.name}, a date and a time. It's free and there's no commitment.` },
    { title: "Get confirmed", text: `${plumber.companyName} accepts your request and can message you or send a quote.` },
    { title: "The visit", text: "Your plumber arrives at the agreed time and does the work." },
    { title: "Confirm & review", text: "You confirm the job is done, then you can leave a verified review." },
  ];
  const prepare = [
    { icon: FaClipboardList, text: "Describe the problem — when it started and what you've noticed." },
    { icon: FaCamera, text: "Add a photo in your message if you can; it helps with the price." },
    { icon: FaTint, text: "Know where your main water shut-off valve is." },
    { icon: FaDoorOpen, text: "Clear the area around the problem and note parking or gate codes." },
    { icon: FaDog, text: "Keep pets in another room during the visit." },
  ];
  return (
    <section id={serviceSectionIds.booking} aria-labelledby="booking-steps-heading" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 id="booking-steps-heading" className="text-xl font-extrabold text-[#0b1f3b] sm:text-2xl">How booking works</h2>
      <ol className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step.title} className="rounded-2xl bg-gray-50 p-4 ring-1 ring-inset ring-gray-100">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0b1f3b] text-sm font-extrabold text-[#FFD60A]">{i + 1}</span>
            <p className="mt-3 text-sm font-bold text-gray-900">{step.title}</p>
            <p className="mt-0.5 text-sm text-gray-600">{step.text}</p>
          </li>
        ))}
      </ol>
      <h3 className="mt-6 text-sm font-extrabold uppercase tracking-wider text-gray-500">Before your visit</h3>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {prepare.map(({ icon: Icon, text }) => <li key={text} className="flex items-start gap-2.5 text-sm text-gray-700"><Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#a68600]" aria-hidden />{text}</li>)}
      </ul>
    </section>
  );
}
