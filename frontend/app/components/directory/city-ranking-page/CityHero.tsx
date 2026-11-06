import { FaCheckCircle, FaCrown, FaMapMarkerAlt } from "react-icons/fa";
import type { RankingPage } from "../directoryApi";
import { heading, introduction } from "../directorySeo";
import RankingMapPanel from "../RankingMapPanel";
import Breadcrumbs from "../ranking-page/Breadcrumbs";
import LimitToggle from "../ranking-page/LimitToggle";
import { mapPins } from "../ranking-page/mapPins";

/** City pages: text on the left, the map of the ranked plumbers on the right. */
export default function CityHero({ data }: { data: RankingPage }) {
  const { city, state } = data.page;
  const pins = data.sections.map ? mapPins(data.items) : [];
  return (
    <section className="border-b border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <Breadcrumbs data={data} />
        <div className={`mt-5 grid gap-6 ${pins.length ? "lg:grid-cols-[minmax(0,1fr)_420px]" : ""}`}>
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800 ring-1 ring-inset ring-sky-200"><FaMapMarkerAlt className="h-3 w-3" aria-hidden />Serving {city!.name}, {state!.name}</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0b1f3b] sm:text-4xl">{heading(data)}</h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">{introduction(data)}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <LimitToggle data={data} />
              <span className="inline-flex items-center gap-1.5 text-sm text-slate-600"><FaCrown className="h-3.5 w-3.5 text-[#d4a900]" aria-hidden /><b className="text-slate-900">{data.qualifying}</b> premium</span>
              <span className="inline-flex items-center gap-1.5 text-sm text-slate-600"><FaCheckCircle className="h-3.5 w-3.5 text-emerald-600" aria-hidden /><b className="text-slate-900">{data.verifiedQualifying}</b> verified</span>
            </div>
          </div>
          {pins.length > 0 && <div className="[&>section]:h-full"><RankingMapPanel pins={pins} height={300} /></div>}
        </div>
      </div>
    </section>
  );
}
