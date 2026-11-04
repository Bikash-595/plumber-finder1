import SeoEditor from "@/components/company-dashboard/business-profile/seo/SeoEditor";

/** SEO & keywords: search title and description, keywords, and the profile sidebar card. */
export default function Page() {
  return <SeoEditor apiEndpoint="/companies/seo" />;
}
