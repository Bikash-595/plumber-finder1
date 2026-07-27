import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaArrowLeft,
  FaBriefcase,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaDollarSign,
  FaMapMarkerAlt,
  FaQuoteLeft,
  FaShieldAlt,
  FaStar,
  FaTools,
  FaUserTie,
  FaUsers,
} from "react-icons/fa";
import { plumbers } from "@/data/plumbers";
import StarRating from "@/components/ui/StarRating";

export const dynamic = "force-dynamic";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value?: string) {
  if (!value) return "Completed";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getRelatedProjects(plumberId: string, projectId: string) {
  return plumbers
    .flatMap((plumber) =>
      plumber.projects.map((project, index) => ({
        plumber,
        project,
        projectId: project.id ?? `project-${index + 1}`,
      }))
    )
    .filter((entry) => entry.plumber.id === plumberId && entry.projectId !== projectId)
    .slice(0, 3);
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string; projectId: string }>;
}) {
  const { id, projectId } = await params;
  const plumber = plumbers.find((entry) => entry.id === id);
  if (!plumber) return notFound();

  const projectEntry = plumber.projects
    .map((project, index) => ({ project, projectId: project.id ?? `project-${index + 1}` }))
    .find((entry) => entry.projectId === projectId);

  if (!projectEntry) return notFound();

  const { project } = projectEntry;
  const details = project.projectDetails;
  const client = project.clientDetails;
  const relatedProjects = getRelatedProjects(plumber.id, projectId);

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-gray-900">
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href={`/plumber/${plumber.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-[#f7672c]"
          >
            <FaArrowLeft className="h-3.5 w-3.5" />
            Back to {plumber.companyName}
          </Link>
        </div>

        <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-10 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:px-8">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#0f1b36] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
                Project case study
              </span>
              <span className="rounded-full bg-[#fff2e8] px-3 py-1 text-xs font-bold text-[#c64d1f]">
                {details?.category ?? plumber.specializations[0]}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-extrabold leading-tight text-[#0f1b36] sm:text-4xl lg:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-gray-600 sm:text-lg">
              {project.description}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <FaDollarSign className="h-5 w-5 text-[#f7672c]" />
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Charges</p>
                <p className="mt-1 text-lg font-bold text-[#0f1b36]">
                  {project.projectCost ? formatCurrency(project.projectCost) : "On request"}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <FaClock className="h-5 w-5 text-[#f7672c]" />
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Timeline</p>
                <p className="mt-1 text-lg font-bold text-[#0f1b36]">{project.durationDays ?? "-"} days</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <FaCalendarAlt className="h-5 w-5 text-[#f7672c]" />
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Completed</p>
                <p className="mt-1 text-lg font-bold text-[#0f1b36]">{formatDate(details?.completedAt)}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <FaStar className="h-5 w-5 text-[#f7672c]" />
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Feedback</p>
                <p className="mt-1 text-lg font-bold text-[#0f1b36]">{project.clientRating?.toFixed(1) ?? plumber.rating.toFixed(1)}</p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-xl">
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[320px] items-center justify-center text-gray-400">Project image unavailable</div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 text-white">
              <p className="text-sm font-semibold">{plumber.companyName}</p>
              <p className="mt-1 flex items-center gap-2 text-sm text-white/80">
                <FaMapMarkerAlt className="h-3.5 w-3.5" />
                {client?.location ?? plumber.location}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#0f1b36]">Project Details</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-[#f7672c]">
                  <FaBriefcase />
                  Scope
                </div>
                <p className="mt-3 leading-7 text-gray-600">{details?.scope ?? project.description}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-[#f7672c]">
                  <FaTools />
                  Challenge
                </div>
                <p className="mt-3 leading-7 text-gray-600">{details?.challenge}</p>
              </div>
            </div>
            <div className="mt-5 rounded-xl border border-[#f7672c]/20 bg-[#fff8f3] p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-[#c64d1f]">
                <FaCheckCircle />
                Solution
              </div>
              <p className="mt-3 leading-7 text-gray-700">{details?.solution}</p>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#0f1b36]">Work Summary</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {(details?.materials ?? plumber.services).map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <FaCheckCircle className="h-4 w-4 shrink-0 text-[#f7672c]" />
                  <span className="font-medium text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0f1b36] text-white">
                <FaQuoteLeft />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0f1b36]">Client Feedback</h2>
                <p className="mt-3 text-lg leading-8 text-gray-700">&ldquo;{project.clientReview}&rdquo;</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <StarRating rating={project.clientRating ?? plumber.rating} size={16} />
                  <span className="font-semibold text-gray-700">{project.clientRating?.toFixed(1) ?? plumber.rating.toFixed(1)} out of 5</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600">{project.client}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0f1b36]">Client Details</h2>
            <div className="mt-5 space-y-4 text-sm">
              <div className="flex gap-3">
                <FaUserTie className="mt-1 h-4 w-4 text-[#f7672c]" />
                <div>
                  <p className="font-semibold text-gray-900">{client?.name ?? project.client}</p>
                  <p className="text-gray-500">{client?.type ?? "Project client"}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <FaMapMarkerAlt className="mt-1 h-4 w-4 text-[#f7672c]" />
                <div>
                  <p className="font-semibold text-gray-900">Location</p>
                  <p className="text-gray-500">{client?.location ?? plumber.location}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <FaUsers className="mt-1 h-4 w-4 text-[#f7672c]" />
                <div>
                  <p className="font-semibold text-gray-900">Crew size</p>
                  <p className="text-gray-500">{details?.teamSize ?? plumber.teamSize} technicians</p>
                </div>
              </div>
              <div className="flex gap-3">
                <FaShieldAlt className="mt-1 h-4 w-4 text-[#f7672c]" />
                <div>
                  <p className="font-semibold text-gray-900">Warranty</p>
                  <p className="text-gray-500">{details?.warranty ?? plumber.warranty}</p>
                </div>
              </div>
            </div>

            <Link
              href={`/plumber/${plumber.id}`}
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[#f7672c] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#de5520]"
            >
              View company profile
            </Link>
          </section>

          {relatedProjects.length > 0 && (
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#0f1b36]">More Projects</h2>
              <div className="mt-5 space-y-4">
                {relatedProjects.map((entry) => (
                  <Link
                    key={entry.projectId}
                    href={`/plumber/${entry.plumber.id}/projects/${entry.projectId}`}
                    className="block rounded-xl border border-gray-100 p-4 transition hover:border-[#f7672c]/40 hover:bg-gray-50"
                  >
                    <p className="font-semibold text-gray-900">{entry.project.title}</p>
                    <p className="mt-1 text-sm text-gray-500">{entry.project.client}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </aside>
      </section>
    </main>
  );
}
