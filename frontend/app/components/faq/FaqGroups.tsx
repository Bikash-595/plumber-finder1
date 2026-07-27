import { FaqItem } from '../../data/faqData';
import FaqAccordion from "./FaqAccordion";

interface FaqGroupsProps {
  filteredFaqs: FaqItem[];
}

export default function FaqGroups({ filteredFaqs }: FaqGroupsProps) {
  const groups: { title: string; items: FaqItem[] }[] = [];

  const generalItems = filteredFaqs.filter((f) => f.category === "general");
  if (generalItems.length) groups.push({ title: "General Information", items: generalItems });

  const companyItems = filteredFaqs.filter((f) => f.category === "companies");
  if (companyItems.length) groups.push({ title: "For Companies", items: companyItems });

  const paymentItems = filteredFaqs.filter((f) => f.category === "payments");
  if (paymentItems.length) groups.push({ title: "Plans & Billing", items: paymentItems });

  const emergencyItems = filteredFaqs.filter((f) => f.category === "emergency");
  if (emergencyItems.length) groups.push({ title: "Emergency Services", items: emergencyItems });

  if (groups.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-500">No matching questions found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <div key={group.title}>
          <h2 className="text-xl font-bold text-gray-900 font-heading flex items-center gap-2">
            <span className="h-1 w-8 rounded-full bg-[#FFD60A]"></span>
            {group.title}
          </h2>
          <div className="mt-4">
            <FaqAccordion items={group.items} />
          </div>
        </div>
      ))}
    </div>
  );
}