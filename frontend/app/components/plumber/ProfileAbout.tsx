import type { Plumber } from "@/components/find/types";

const sections = [
  ["longDescription", "About us"],
  ["missionStatement", "Our mission"],
  ["visionStatement", "Our vision"],
  ["companyHistory", "Our history"],
  ["founderStory", "Founder story"],
  ["coreValues", "Core values"],
] as const;

/** The story a live company wrote in its Add Company wizard (mission, history, values, ...). */
export default function ProfileAbout({ plumber }: { plumber: Plumber }) {
  const about = plumber.about ?? {};
  const filled = sections.filter(([key]) => about[key]);
  if (!filled.length && !about.slogan) return null;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">About {plumber.companyName}</h2>
      {about.slogan && <p className="mt-2 text-sm font-semibold italic text-[#b59a00]">“{about.slogan}”</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {filled.map(([key, label]) => (
          <div key={key} className={key === "longDescription" ? "sm:col-span-2" : ""}>
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">{label}</h3>
            <p className="mt-1 whitespace-pre-line text-sm leading-6 text-gray-700">{about[key]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
