"use client";

import CompanyBlogForm from "@/components/company-dashboard/business-profile/CompanyBlogForm";

/** Blogs: articles shown on your profile and in the blog directory (/api/freelancers/blogs). */
export default function FreelancerBlogsForm() {
  return <CompanyBlogForm apiEndpoint="/freelancers/blogs" draftKey="freelancer-blogs" startEmpty />;
}
