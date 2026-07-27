export default function ContactHero() {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-2 rounded-full bg-[#FFD60A]/10 px-3 py-1 text-sm font-semibold text-[#FFD60A] mb-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD60A] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD60A]"></span>
        </span>
        We reply within 24 hours
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl font-heading">
        Let&apos;s <span className="text-[#FFD60A]">Connect</span>
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Have a project in mind? Need urgent plumbing help? Our team is ready to assist you 24/7.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <div className="rounded-full bg-gray-100 px-4 py-1.5 text-sm text-gray-700 flex items-center gap-2">
          <span>📞</span> 24/7 Emergency Support
        </div>
        <div className="rounded-full bg-gray-100 px-4 py-1.5 text-sm text-gray-700 flex items-center gap-2">
          <span>⚡</span> Average response: 15 min
        </div>
        <div className="rounded-full bg-gray-100 px-4 py-1.5 text-sm text-gray-700 flex items-center gap-2">
          <span>✅</span> 100% Satisfaction Guarantee
        </div>
      </div>
    </div>
  );
}