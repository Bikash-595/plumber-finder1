"use client";

import PreviousProjectForm from "@/components/company-dashboard/business-profile/PreviousProjectForm";

/** Previous projects: before-and-after case studies (/api/freelancers/previous-projects). */
export default function FreelancerProjectsForm() {
  return <PreviousProjectForm apiEndpoint="/freelancers/previous-projects" draftKey="freelancer-projects" startEmpty />;
}
