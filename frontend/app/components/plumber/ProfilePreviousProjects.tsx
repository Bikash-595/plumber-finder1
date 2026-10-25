"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import { Plumber } from "@/components/find/types";
import StarRating from "@/components/ui/StarRating";
import { plumberHref } from "@/components/find/companyListing";

interface ProfilePreviousProjectsProps {
  plumber: Plumber;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ProfilePreviousProjects({ plumber }: ProfilePreviousProjectsProps) {
  if (!plumber.projects || plumber.projects.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f7672c]">Completed work</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">Previous Projects</h2>
          <p className="mt-1 text-sm text-gray-500">
            {plumber.companyName} has {plumber.projects.length} featured project{plumber.projects.length === 1 ? "" : "s"} ready to review.
          </p>
        </div>
        <span className="w-fit rounded-full border border-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
          {plumber.projects.length} case studies
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5">
        {plumber.projects.map((project, index) => {
          const projectId = project.id ?? `project-${index + 1}`;

          return (
            <Link
              key={projectId}
              href={`${plumberHref(plumber)}/projects/${projectId}`}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:border-[#f7672c]/40 hover:shadow-lg"
            >
              <div className="relative h-28 w-full overflow-hidden bg-gray-100 sm:h-52">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                    Project image unavailable
                  </div>
                )}
                <div className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-bold text-gray-900 shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">
                  {project.year}
                </div>
              </div>

              <div className="p-2.5 sm:p-4">
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900 sm:text-lg">{project.title}</h3>
                    <p className="mt-1 truncate text-xs text-gray-600 sm:text-sm">Client: {project.client}</p>
                  </div>
                  <FaArrowRight className="mt-1 h-4 w-4 shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#f7672c]" />
                </div>

                <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500 sm:mt-3 sm:text-sm sm:leading-6">{project.description}</p>

                <div className="mt-3 grid grid-cols-1 gap-1.5 text-xs sm:mt-4 sm:grid-cols-2 sm:gap-3 sm:text-sm">
                  <div className="rounded-lg bg-gray-50 p-2 sm:p-3">
                    <div className="flex items-center gap-2 text-gray-500">
                      <FaCalendarAlt className="h-3.5 w-3.5 text-[#f7672c]" />
                      Time
                    </div>
                    <p className="mt-1 font-semibold text-gray-900">{project.durationDays ?? "-"} days</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-2 sm:p-3">
                    <div className="flex items-center gap-2 text-gray-500">
                      <FaDollarSign className="h-3.5 w-3.5 text-[#f7672c]" />
                      Charges
                    </div>
                    <p className="mt-1 font-semibold text-gray-900">
                      {project.projectCost ? formatCurrency(project.projectCost) : "On request"}
                    </p>
                  </div>
                </div>

                {project.clientRating && (
                  <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4">
                    <StarRating rating={project.clientRating} size={13} />
                    <span className="text-xs font-semibold text-gray-600">{project.clientRating.toFixed(1)} client rating</span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
