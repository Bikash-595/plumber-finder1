import type { ServicePage } from "@/components/find/companyListing";
import type { Plumber } from "@/components/find/types";

/** Service and FAQ structured data, so search engines can show price, rating and questions. */
export default function ServiceJsonLd({ plumber, service, url }: { plumber: Plumber; service: ServicePage; url: string }) {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      serviceType: service.category ?? "Plumbing",
      description: service.description || service.overview?.slice(0, 300),
      url,
      image: service.images.filter((src) => src.startsWith("http")).slice(0, 4),
      areaServed: plumber.location || undefined,
      provider: { "@type": "Plumber", name: plumber.companyName, telephone: plumber.phone || undefined, ...(plumber.reviewCount > 0 ? { aggregateRating: { "@type": "AggregateRating", ratingValue: plumber.rating, reviewCount: plumber.reviewCount } } : {}) },
    },
    ...(service.faqs.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: service.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }] : []),
  ];
  // "<" is escaped so text from the dashboard can never close the script tag.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
