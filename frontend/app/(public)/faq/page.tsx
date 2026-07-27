// "use client";

// import { useState } from "react";
// import { faqData, tabs } from "../data/faqData";
// import FaqSearch from "../components/faq/FaqSearch";
// import FaqTabs from "../components/faq/FaqTabs";
// import FaqGroups from "../components/faq/FaqGroups";
// import FaqContact from "../components/faq/FaqContact";

// const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// const plusJakarta = Plus_Jakarta_Sans({
//   subsets: ["latin"],
//   variable: "--font-plus-jakarta",
// });

// export default function FaqPage() {
//   const [activeTab, setActiveTab] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");

//   // Filter FAQs
//   const filteredFaqs = faqData.filter((faq) => {
//     // Tab filter
//     if (activeTab !== "all") {
//       if (activeTab === "users" && faq.category !== "general") return false;
//       if (activeTab === "companies" && faq.category !== "companies") return false;
//       if (activeTab === "payments" && faq.category !== "payments") return false;
//       if (activeTab === "emergency" && faq.category !== "emergency") return false;
//     }
//     // Search filter
//     if (searchQuery.trim() !== "") {
//       const query = searchQuery.toLowerCase();
//       return (
//         faq.question.toLowerCase().includes(query) ||
//         faq.answer.toLowerCase().includes(query) ||
//         faq.tags.some((tag) => tag.includes(query))
//       );
//     }
//     return true;
//   });

//   return (
//     <main
//       className={`${inter.variable} ${plusJakarta.variable} relative isolate min-h-screen overflow-hidden bg-[#0b1f3b] font-sans`}
//       style={{ fontFamily: "var(--font-inter)" }}
//     >
//       <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#FFD60A]/5 via-transparent to-[#7B8F06]/5" />

//       <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center">
//           <h1
//             className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
//             style={{ fontFamily: "var(--font-plus-jakarta)" }}
//           >
//             Frequently Asked Questions
//           </h1>
//           <p className="mt-2 text-white/70">
//             Find quick answers to common questions about our high-end architectural services.
//           </p>
//         </div>

//         {/* Search */}
//         <div className="mt-8">
//           <FaqSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
//         </div>

//         {/* Tabs */}
//         <div className="mt-8">
//           <FaqTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
//         </div>

//         {/* FAQ Groups */}
//         <div className="mt-10">
//           <FaqGroups filteredFaqs={filteredFaqs} />
//         </div>

//         {/* Contact Section */}
//         <FaqContact />
//       </div>
//     </main>
//   );
// }













"use client";

import { useState } from "react";
import { faqData, tabs } from "@/data/faqData";
import FaqHero from "@/components/faq/FaqHero";
import FaqSearch from "@/components/faq/FaqSearch";
import FaqCategoryCards from "@/components/faq/FaqCategoryCards";
import FaqPopularQuestions from "@/components/faq/FaqPopularQuestions";
import FaqTabs from "@/components/faq/FaqTabs";
import FaqGroups from "@/components/faq/FaqGroups";
import FaqContact from "@/components/faq/FaqContact";

export default function FaqPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter FAQs based on tab and search
  const filteredFaqs = faqData.filter((faq) => {
    if (activeTab !== "all") {
      if (activeTab === "users" && faq.category !== "general") return false;
      if (activeTab === "companies" && faq.category !== "companies") return false;
      if (activeTab === "payments" && faq.category !== "payments") return false;
      if (activeTab === "emergency" && faq.category !== "emergency") return false;
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags.some((tag) => tag.includes(query))
      );
    }
    return true;
  });

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white font-sans">
      {/* Soft animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-[#FFD60A]/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#B1A606]/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7B8F06]/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <FaqHero />
        
        <div className="mt-12">
          <FaqSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>

        <div className="mt-12">
          <FaqCategoryCards />
        </div>

        <div className="mt-16">
          <FaqPopularQuestions />
        </div>

        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 font-heading">Browse by Topic</h2>
            <p className="text-gray-500">Select a category to see relevant questions</p>
          </div>
          <FaqTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
        </div>

        <div className="mt-10">
          <FaqGroups filteredFaqs={filteredFaqs} />
        </div>

        <div className="mt-20">
          <FaqContact />
        </div>
      </div>
    </main>
  );
}
