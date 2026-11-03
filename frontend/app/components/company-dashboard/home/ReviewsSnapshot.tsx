import Link from "next/link";
import { FaGoogle, FaStar } from "react-icons/fa";
import Panel from "@/components/dashboard/ui/Panel";
import { Stars } from "@/components/reviews/Stars";
import type { CompanyDashboard } from "../companyApi";
import { editorHref, isFreelancer } from "@/components/utils/providerSide";

/** PlumberFinder and Google ratings side by side (never averaged together). Google is for companies only. */
export default function ReviewsSnapshot({ reviews }: { reviews: CompanyDashboard["reviews"] }) {
  return (
    <Panel title="Ratings" action={<Link href={editorHref("reviews")} className="text-sm font-semibold text-[#8a7300] hover:underline">Reviews →</Link>}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD60A]/20 text-[#8a7300]"><FaStar className="h-4 w-4" /></span>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">PlumberFinder</p>
            <p className="flex items-center gap-2"><span className="text-xl font-bold tabular-nums text-gray-900">{reviews.platform.count ? reviews.platform.average.toFixed(1) : "–"}</span><Stars value={reviews.platform.average} size="h-3 w-3" /></p>
            <p className="text-xs text-gray-500">{reviews.verified} verified · {reviews.directory} directory</p>
          </div>
        </div>
        {!isFreelancer() && <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#4285F4]"><FaGoogle className="h-4 w-4" /></span>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Google</p>
            {reviews.google ? <p className="flex items-center gap-2"><span className="text-xl font-bold tabular-nums text-gray-900">{reviews.google.rating.toFixed(1)}</span><Stars value={reviews.google.rating} size="h-3 w-3" /><span className="text-xs text-gray-500">{reviews.google.count.toLocaleString()}</span></p>
              : <Link href={editorHref("reviews")} className="text-sm font-semibold text-[#1a73e8] hover:underline">Connect Google reviews</Link>}
          </div>
        </div>}
      </div>
    </Panel>
  );
}
