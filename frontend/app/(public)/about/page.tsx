import AboutAudience from "@/components/about/about-page/AboutAudience";
import AboutFaqCta from "@/components/about/about-page/AboutFaqCta";
import AboutPageHero from "@/components/about/about-page/AboutPageHero";
import AboutPrinciples from "@/components/about/about-page/AboutPrinciples";
import AboutQualityStandards from "@/components/about/about-page/AboutQualityStandards";
import AboutTimeline from "@/components/about/about-page/AboutTimeline";
import AboutTrustStats from "@/components/about/about-page/AboutTrustStats";
import AboutWorkflow from "@/components/about/about-page/AboutWorkflow";

// The About page, one section per component (components/about/about-page).
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-gray-800">
      <AboutPageHero />
      <AboutTrustStats />
      <AboutPrinciples />
      <AboutTimeline />
      <AboutQualityStandards />
      <AboutWorkflow />
      <AboutAudience />
      <AboutFaqCta />
    </main>
  );
}
