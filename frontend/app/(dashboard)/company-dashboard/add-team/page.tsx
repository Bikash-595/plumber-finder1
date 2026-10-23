import { redirect } from "next/navigation";

// The old page kept data only in this browser; the Business Profile form saves it to the public profile.
export default function Page() {
  redirect("/company-dashboard/business-profile/team");
}
