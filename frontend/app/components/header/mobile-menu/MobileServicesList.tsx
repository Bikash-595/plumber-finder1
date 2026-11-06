import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { serviceDefinitions } from "@/components/services/serviceData";
import { ServiceIcon } from "@/components/services/serviceIcons";
import { isActivePath } from "../headerConfig";

/** Every service page, inside the phone menu's Services group. */
export default function MobileServicesList({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return (
    <div className="border-t border-slate-100 bg-slate-50/60 p-2">
      <ul className="grid gap-1 sm:grid-cols-2">
        {serviceDefinitions.map((service) => {
          const active = isActivePath(pathname, `/services/${service.slug}`);
          return (
            <li key={service.slug}>
              <Link href={`/services/${service.slug}`} onClick={onNavigate} className={`flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm transition ${active ? "bg-[#FFD60A]/20 font-semibold text-[#0b1f3b]" : "text-slate-700 hover:bg-white"}`}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-[#0b1f3b]">
                  <ServiceIcon slug={service.slug} className="h-3.5 w-3.5" />
                </span>
                {service.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <Link href="/services" onClick={onNavigate} className="mt-1 flex items-center gap-2 px-2.5 py-2 text-sm font-semibold text-[#0b1f3b]">
        View all services <FaArrowRight className="h-3 w-3" aria-hidden />
      </Link>
    </div>
  );
}
