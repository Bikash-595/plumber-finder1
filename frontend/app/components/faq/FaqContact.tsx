import Link from "next/link";
import { FaHeadset, FaEnvelope } from "react-icons/fa";

export default function FaqContact() {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-[#FFD60A]/10 to-[#B1A606]/10 border border-gray-200 p-8 text-center shadow-lg">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md mb-4">
        <FaHeadset className="h-6 w-6 text-[#FFD60A]" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 font-heading">Still have questions?</h2>
      <p className="mt-2 text-gray-600 max-w-md mx-auto">
        Our dedicated support team is available 24/7 to assist with your plumbing and platform needs.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full bg-[#FFD60A] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-105"
        >
          <FaHeadset className="h-4 w-4" />
          Contact Support
        </Link>
        <Link
          href="mailto:support@plumberfinder.com"
          className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#FFD60A] hover:bg-[#FFD60A]/5"
        >
          <FaEnvelope className="h-4 w-4" />
          Email Us
        </Link>
      </div>
      <p className="mt-4 text-xs text-gray-400">Average response time: 2 hours during business days</p>
    </div>
  );
}