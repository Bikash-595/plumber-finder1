import Link from "next/link";
import { FaUserFriends, FaBuilding, FaCreditCard, FaAmbulance, FaChartLine } from "react-icons/fa";

const categories = [
  { name: "For Users", icon: FaUserFriends, href: "/faq?tab=users", color: "text-[#FFD60A]" },
  { name: "For Companies", icon: FaBuilding, href: "/faq?tab=companies", color: "text-[#B1A606]" },
  { name: "Payments", icon: FaCreditCard, href: "/faq?tab=payments", color: "text-[#7B8F06]" },
  { name: "Emergency", icon: FaAmbulance, href: "/faq?tab=emergency", color: "text-red-500" },
  { name: "Success Stories", icon: FaChartLine, href: "/faq?tab=success", color: "text-blue-500" },
];

export default function FaqCategoryCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {categories.map((cat) => (
        <Link
          key={cat.name}
          href={cat.href}
          className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 text-center transition hover:shadow-md hover:border-[#FFD60A]/30"
        >
          <cat.icon className={`h-8 w-8 ${cat.color} transition group-hover:scale-110`} />
          <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}