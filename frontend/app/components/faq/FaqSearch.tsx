// "use client";

// import { FaSearch } from "react-icons/fa";

// interface FaqSearchProps {
//   searchQuery: string;
//   onSearchChange: (query: string) => void;
// }

// export default function FaqSearch({ searchQuery, onSearchChange }: FaqSearchProps) {
//   return (
//     <div className="relative">
//       <FaSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
//       <input
//         type="text"
//         placeholder="Search for answers..."
//         value={searchQuery}
//         onChange={(e) => onSearchChange(e.target.value)}
//         className="w-full rounded-full border border-white/20 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-white/40 outline-none transition focus:border-[#B1A606] focus:ring-1 focus:ring-[#B1A606]"
//       />
//     </div>
//   );
// }







"use client";

import { FaSearch } from "react-icons/fa";

interface FaqSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function FaqSearch({ searchQuery, onSearchChange }: FaqSearchProps) {
  return (
    <div className="relative max-w-2xl mx-auto">
      <FaSearch className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search for answers..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-full border border-gray-200 bg-white/80 py-4 pl-12 pr-5 text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A] focus:bg-white"
      />
    </div>
  );
}