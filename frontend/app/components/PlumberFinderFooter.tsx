// import Image from "next/image";
// import Link from "next/link";

// const primaryLinks = [
//   { label: "Home", href: "/" },
//   { label: "Find Plumber", href: "/find" },
//   { label: "About Us", href: "/about" },
//   { label: "FAQ", href: "/faq" },
//   { label: "Blogs", href: "/blogs" },
//   { label: "Contact", href: "/contact" },
// ];

// const servicesLinks = [
//   { label: "Find Plumber", href: "/find" },
//   { label: "Post Requirement", href: "/post-requirement" },
//   { label: "Get Quotes", href: "/quotes" },
//   { label: "Book", href: "/book-appointment" },
//   { label: "Compare", href: "/compare" },
//   { label: "Register", href: "/signup" },
// ];

// const statesLinks = [
//   { label: "California", href: "/states/california" },
//   { label: "Texas", href: "/states/texas" },
//   { label: "Florida", href: "/states/florida" },
//   { label: "New York", href: "/states/new-york" },
//   { label: "Illinois", href: "/states/illinois" },
//   { label: "Pennsylvania", href: "/states/pennsylvania" },
// ];

// export default function PlumberFinderFooter() {
//   return (
//     <footer className="border-t border-gray-200 bg-white text-gray-800">
//       <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
//         <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
//           <div className="max-w-sm">
//             <Link href="/" className="inline-flex items-center gap-2 text-[#FFD60A]">
//               <div className="relative h-12 w-12">
//                 <Image
//                   src="/Plumber%20(1).png"
//                   alt="Plumber Finder icon"
//                   fill
//                   sizes="48px"
//                   className="object-contain"
//                 />
//               </div>
//               <span className="text-lg font-extrabold text-gray-800">Plumber Finder</span>
//             </Link>
//             <p className="mt-3 text-sm leading-relaxed text-gray-600">
//               Find trusted local plumbers, compare verified reviews, and book confidently.
//             </p>
//             <div className="mt-4 flex flex-wrap gap-2">
//               <Link
//                 href="/find"
//                 className="rounded-full bg-[#FFD60A] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
//               >
//                 Find Plumber
//               </Link>
//               <Link
//                 href="/add-business"
//                 className="rounded-full border border-emerald-700 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
//               >
//                 Get Pro Leads
//               </Link>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:w-[760px]">
//             <div>
//               <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800">Navigation</h3>
//               <div className="mt-3 space-y-2">
//                 {primaryLinks.map((link) => (
//                   <Link
//                     key={link.href}
//                     href={link.href}
//                     className="block text-sm text-gray-600 transition hover:text-[#FFD60A]"
//                   >
//                     {link.label}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800">Services</h3>
//               <div className="mt-3 space-y-2">
//                 {servicesLinks.map((link) => (
//                   <Link
//                     key={link.href}
//                     href={link.href}
//                     className="block text-sm text-gray-600 transition hover:text-[#FFD60A]"
//                   >
//                     {link.label}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800">States</h3>
//               <div className="mt-3 space-y-2">
//                 {statesLinks.map((link) => (
//                   <Link
//                     key={link.href}
//                     href={link.href}
//                     className="block text-sm text-gray-600 transition hover:text-[#FFD60A]"
//                   >
//                     {link.label}
//                   </Link>
//                 ))}
//                 <Link href="/states" className="block pt-1 text-sm font-semibold text-[#FFD60A] transition hover:brightness-95">
//                   View all states
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="border-t border-gray-200">
//         <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
//           <span>© 2026 Plumber Finder. All rights reserved.</span>
//           <div className="flex flex-wrap items-center gap-3">
//             <span>Trusted pros</span>
//             <span>Transparent pricing</span>
//             <span>Fast booking</span>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }



















import Image from "next/image";
import Link from "next/link";

const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "Find Plumber", href: "/find" },
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

const servicesLinks = [
  { label: "Find Plumber", href: "/find" },
  { label: "Post Requirement", href: "/post-requirement" },
  { label: "Get Quotes", href: "/quotes" },
  { label: "Book", href: "/book-appointment" },
  { label: "Compare", href: "/compare" },
  { label: "Register", href: "/signup" },
];

const statesLinks = [
  { label: "California", href: "/states/california" },
  { label: "Texas", href: "/states/texas" },
  { label: "Florida", href: "/states/florida" },
  { label: "New York", href: "/states/new-york" },
  { label: "Illinois", href: "/states/illinois" },
  { label: "Pennsylvania", href: "/states/pennsylvania" },
];

export default function PlumberFinderFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white text-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-around">
          {/* Logo & CTA */}
          <div className="max-w-sm text-center sm:text-left lg:max-w-xs">
            <Link href="/" className="inline-flex flex-col items-center gap-2 text-[#FFD60A] sm:flex-row sm:items-center">
              <div className="relative h-12 w-12">
                <Image
                  src="/Plumber%20(1).png"
                  alt="Plumber Finder icon"
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-extrabold text-gray-800">Plumber Finder</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Find trusted local plumbers, compare verified reviews, and book confidently.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-center">
              <Link
                href="/find"
                className="rounded-full bg-[#FFD60A] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
              >
                Find Plumber
              </Link>
              <Link
                href="/add-business"
                className="rounded-full border border-emerald-700 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
              >
                Get Pro Leads
              </Link>
            </div>
          </div>

          {/* Three columns: Navigation, Services, States */}
          <div className="grid grid-cols-3 gap-20 text-left text-xs sm:text-sm">
            {/* Navigation Column */}
            <div>
              <h3 className="mb-3 font-bold uppercase tracking-wide text-gray-800">Navigation</h3>
              <ul className="space-y-2">
                {primaryLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block text-gray-600 transition hover:text-[#FFD60A]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Column */}
            <div>
              <h3 className="mb-3 font-bold uppercase tracking-wide text-gray-800">Services</h3>
              <ul className="space-y-2">
                {servicesLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block text-gray-600 transition hover:text-[#FFD60A]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* States Column */}
            <div>
              <h3 className="mb-3 font-bold uppercase tracking-wide text-gray-800">States</h3>
              <ul className="space-y-2">
                {statesLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block text-gray-600 transition hover:text-[#FFD60A]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-1">
                  <Link
                    href="/states"
                    className="block font-semibold text-[#FFD60A] transition hover:brightness-95"
                  >
                    View all states
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-around sm:px-6 lg:px-8">
          <span className="text-center sm:text-left">© 2026 Plumber Finder. All rights reserved.</span>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
            <span>Trusted pros</span>
            <span>Transparent pricing</span>
            <span>Fast booking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}