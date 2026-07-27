import Link from "next/link";
import {
  FaArrowRight,
  FaBuilding,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { plumbers } from "@/data/plumbers";

function CompanyList() {
  const listedCompanies = plumbers.slice(0, 10);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Registered Company List</h2>
          <p className="text-sm text-gray-500">
            Browse companies, verification, emergency support, locations, and service focus.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", "Verified", "Emergency", "Needs review"].map((filter) => (
            <button
              key={filter}
              className={`min-h-10 rounded-lg px-3 py-2 text-sm font-bold transition ${
                filter === "All"
                  ? "bg-[#0b1f3b] text-white"
                  : "border border-gray-200 text-gray-600 hover:border-[#FFD60A] hover:text-[#0b1f3b]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {listedCompanies.map((company) => (
          <article
            key={company.id}
            className="grid gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 lg:grid-cols-[1.4fr_1fr_auto] lg:items-center"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0b1f3b] text-[#FFD60A]">
                  <FaBuilding className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-gray-900">{company.companyName}</h3>
                  <p className="text-sm font-semibold text-gray-500">{company.ownerName}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                {company.isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-emerald-700">
                    <FaShieldAlt className="h-3 w-3" />
                    Verified
                  </span>
                )}
                {company.isEmergency && (
                  <span className="rounded-lg bg-red-50 px-2.5 py-1 text-red-700">
                    Emergency
                  </span>
                )}
                <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-amber-700">
                  {company.rating.toFixed(1)} rating
                </span>
              </div>
            </div>

            <div className="grid gap-2 text-sm text-gray-600">
              <p className="flex items-center gap-2 font-semibold">
                <FaMapMarkerAlt className="h-3.5 w-3.5 text-[#0b1f3b]" />
                {company.location}
              </p>
              <p className="flex items-center gap-2 font-semibold">
                <FaPhoneAlt className="h-3.5 w-3.5 text-[#0b1f3b]" />
                {company.phone}
              </p>
              <p className="line-clamp-1 text-xs text-gray-500">
                {company.specializations.slice(0, 3).join(", ")}
              </p>
            </div>

            <Link
              href={`/plumber/${company.id}`}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#FFD60A] px-4 py-2 text-sm font-bold text-[#0b1f3b] transition hover:bg-[#0b1f3b] hover:text-white"
            >
              View Profile
              <FaArrowRight className="h-3.5 w-3.5" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function CompanyListSection() {
  return (

      <CompanyList />
   
  );
}
