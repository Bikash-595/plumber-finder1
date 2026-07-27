import Image from "next/image";
import Link from "next/link";

const footerColumns = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Emergency Plumbing", href: "/services/emergency-plumbing" },
      { label: "Drain Cleaning", href: "/services/drain-cleaning" },
      { label: "Water Heater Repair", href: "/services/water-heater-repair" },
      { label: "Leak Detection", href: "/services/leak-detection" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Guides", href: "/guides" },
      { label: "Find a Plumber", href: "/find" },
      { label: "List Your Business", href: "/add-business" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-0 w-full border-t border-white/10 bg-[linear-gradient(180deg,#0b1f3b_0%,#09182f_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 grid-cols-1 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <div className="space-y-4 text-center lg:text-left">
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start lg:justify-start">
              <div className="relative h-12 w-12 shrink-0">
                <Image
                  src="/Plumber%20(1).png"
                  alt="Plumber Finder logo"
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
                  Plumber Finder
                </p>
                <p className="mt-2 mx-auto max-w-xs text-sm leading-6 text-white/75 lg:mx-0">
                  Trusted plumbing connections nationwide. Find reliable local plumbers with clear service paths and verified reviews.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 min-w-0">
            {footerColumns.map((column) => (
              <div key={column.title} className="space-y-4 min-w-0 text-center sm:text-left">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
                  {column.title}
                </h3>
                <nav className="flex flex-col items-center gap-3 text-sm text-white/75 sm:items-start">
                  {column.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center sm:text-left">© 2026 Plumber Finder. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-end">
            <Link href="/privacy" className="transition hover:text-white whitespace-nowrap">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-white whitespace-nowrap">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="transition hover:text-white whitespace-nowrap">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}