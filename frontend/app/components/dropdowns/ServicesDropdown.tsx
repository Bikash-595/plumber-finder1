// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import {
//   FaSearch,
//   FaFileAlt,
//   FaQuoteRight,
//   FaCalendarAlt,
//   FaUserPlus,
// } from "react-icons/fa";
// import { BsArrowDownCircleFill } from "react-icons/bs";

// const servicesDropdownItems = [
//   { label: "Find Plumber", href: "/find", icon: FaSearch },
//   { label: "Post Requirement", href: "/post-requirement", icon: FaFileAlt },
//   { label: "Get Quotes", href: "/quotes", icon: FaQuoteRight },
//   { label: "Book", href: "/book-appointment", icon: FaCalendarAlt },
//   { label: "Compare", href: "/compare", icon: BsArrowDownCircleFill },
//   { label: "Register", href: "/register-business", icon: FaUserPlus },
// ];

// export function ServicesDropdown() {
//   const [open, setOpen] = useState(false);

//   return (
//     <div
//       className="relative"
//       onMouseEnter={() => setOpen(true)}
//       onMouseLeave={() => setOpen(false)}
//     >
//       {/* Button */}
//       <button className="flex items-center gap-1 hover:text-yellow-400 transition">
//         Services
//         <svg
//           className={`w-3 h-3 transition-transform ${
//             open ? "rotate-180" : ""
//           }`}
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           viewBox="0 0 24 24"
//         >
//           <path d="M6 9l6 6 6-6" />
//         </svg>
//       </button>

//       {/* Dropdown */}
//       {open && (
//         <div className="absolute left-1/2 -translate-x-1/2 mt-4 w-[700px] bg-white rounded-2xl shadow-2xl p-6 animate-fadeIn">
          
//           {/* Grid 6 columns */}
//           <div className="grid grid-cols-6 gap-4 text-center">
//             {servicesDropdownItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className="group flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 hover:bg-yellow-50 hover:scale-105"
//               >
//                 {/* Icon */}
//                 <item.icon className="text-gray-400 text-xl transition group-hover:text-yellow-500 group-hover:scale-110" />

//                 {/* Text */}
//                 <span className="text-xs text-gray-600 group-hover:text-yellow-600">
//                   {item.label}
//                 </span>
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }









"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaSearch,
  FaFileAlt,
  FaQuoteRight,
  FaCalendarAlt,
  FaUserPlus,
  FaChevronDown
} from "react-icons/fa";
import { BsArrowDownCircleFill } from "react-icons/bs";

const servicesDropdownItems = [
  { label: "Find Plumber", href: "/find", icon: FaSearch },
  { label: "Post Requirement", href: "/post-requirement", icon: FaFileAlt },
  { label: "Get Quotes", href: "/quotes", icon: FaQuoteRight },
  { label: "Book", href: "/book-appointment", icon: FaCalendarAlt },
  { label: "Compare", href: "/compare", icon: BsArrowDownCircleFill },
  { label: "Register", href: "/signup", icon: FaUserPlus },
];

export function ServicesDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Button */}
      <button className="flex items-center gap-2 px-2 py-1 transition hover:text-yellow-400">

        {/* Left Icon */}
        {/* <FaSearch className="h-4 w-4" /> */}

        {/* Text */}
        <span>Services</span>

        {/* Arrow (rotate) */}
        <FaChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2">
          <div className="w-[720px] bg-white rounded-2xl shadow-2xl p-6 animate-fadeIn">

            {/* Header */}
            <div className="flex items-center gap-2 mb-5 text-gray-700 font-semibold">
              <FaSearch className="text-yellow-500" />
              Explore Services
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
              {servicesDropdownItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 hover:bg-yellow-50 hover:scale-105"
                >
                  {/* Icon */}
                  <item.icon className="text-gray-400 text-xl transition group-hover:text-yellow-500 group-hover:scale-110" />

                  {/* Text */}
                  <span className="text-xs text-gray-600 group-hover:text-yellow-600">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}