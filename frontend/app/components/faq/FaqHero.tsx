export default function FaqHero() {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-2 rounded-full bg-[#FFD60A]/10 px-3 py-1 text-sm font-semibold text-[#FFD60A] mb-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD60A] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD60A]"></span>
        </span>
        Got questions? We have answers
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl font-heading">
        Frequently Asked <span className="text-[#FFD60A]">Questions</span>
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Everything you need to know about PlumberFinder. Can&apos;t find what you&apos;re looking for? Feel free to contact our support team.
      </p>
    </div>
  );
}