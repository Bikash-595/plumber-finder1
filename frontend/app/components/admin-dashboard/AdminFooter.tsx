import Link from "next/link";
import { FaShieldAlt, FaTools } from "react-icons/fa";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Privacy", href: "/privacy" },
  { label: "Help", href: "/contact" },
];

export default function AdminFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0b1f3b] text-[#FFD60A]">
              <FaTools className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900">Admin Control</p>
              <p className="text-xs text-gray-500">Manage platform users, companies and freelancers.</p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2 text-xs font-semibold text-gray-600" aria-label="Admin footer links">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-[#0b1f3b]">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
