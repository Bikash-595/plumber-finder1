// Colour sets shared by status pills, stat cards and icons across the customer dashboard.
export type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "brand" | "violet";

export const toneClasses: Record<Tone, { pill: string; icon: string; dot: string }> = {
  neutral: { pill: "bg-gray-100 text-gray-700 ring-gray-200", icon: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
  info: { pill: "bg-blue-50 text-blue-700 ring-blue-200", icon: "bg-blue-50 text-blue-600", dot: "bg-blue-500" },
  success: { pill: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
  warning: { pill: "bg-amber-50 text-amber-800 ring-amber-200", icon: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
  danger: { pill: "bg-red-50 text-red-700 ring-red-200", icon: "bg-red-50 text-red-600", dot: "bg-red-500" },
  brand: { pill: "bg-[#FFD60A]/20 text-[#6b5900] ring-[#FFD60A]/50", icon: "bg-[#FFD60A]/20 text-[#8a7300]", dot: "bg-[#FFD60A]" },
  violet: { pill: "bg-violet-50 text-violet-700 ring-violet-200", icon: "bg-violet-50 text-violet-600", dot: "bg-violet-500" },
};
