// // components/about/AboutMissionValues.tsx
// export default function AboutMissionValues() {
//   const values = [
//     {
//       title: "Transparency",
//       description: "Upfront pricing models and real-time project tracking for absolute clarity.",
//       icon: "🔍",
//       color: "text-[#FFD60A]",
//     },
//     {
//       title: "Trust",
//       description: "A zero-compromise vetting process for every technician on our network.",
//       icon: "🤝",
//       color: "text-[#B1A606]",
//     },
//     {
//       title: "Quality",
//       description: "Applying architectural standards to every fitting and fixture installation.",
//       icon: "✨",
//       color: "text-[#7B8F06]",
//     },
//     {
//       title: "Accessibility",
//       description: "A concierge-level interface designed for effortless scheduling and care.",
//       icon: "📱",
//       color: "text-gray-600",
//     },
//   ];

//   return (
//     <div className="mt-20">
//       <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm shadow-lg p-8 md:p-10">
//         <div className="text-center max-w-3xl mx-auto">
//           <p className="text-xl italic text-gray-700 leading-relaxed">
//             “Our mission is to elevate the plumbing industry to an architectural art form, providing homeowners with peace of mind through radical transparency and technical mastery.”
//           </p>
//           <div className="mt-2 text-[#FFD60A] font-semibold">— The PlumberFinder Team</div>
//         </div>

//         <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//           {values.map((value) => (
//             <div
//               key={value.title}
//               className="rounded-xl border border-gray-200 bg-white p-6 text-center transition-all hover:shadow-md hover:border-[#FFD60A]/20"
//             >
//               <div className="text-4xl mb-3">{value.icon}</div>
//               <h3 className={`text-lg font-bold ${value.color}`}>{value.title}</h3>
//               <p className="mt-2 text-sm text-gray-600 leading-relaxed">{value.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import { useEffect, useRef } from "react";

const values = [
  {
    title: "Transparency",
    description:
      "Upfront pricing models and real-time project tracking for absolute clarity.",
    icon: "🔍",
  },
  {
    title: "Trust",
    description:
      "A zero-compromise vetting process for every technician on our network.",
    icon: "🤝",
  },
  {
    title: "Quality",
    description:
      "Applying architectural standards to every fitting and fixture installation.",
    icon: "✨",
  },
  {
    title: "Accessibility",
    description:
      "A concierge-level interface designed for effortless scheduling and care.",
    icon: "📱",
  },
];

export default function AboutMissionValues() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mt-20 rounded-3xl bg-white border border-gray-200 shadow-lg p-8 md:p-12 opacity-0"
    >
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full bg-[#FFD60A]/10 text-[#FFD60A] text-sm font-semibold mb-4">
          Our Mission
        </span>
        <p className="text-xl md:text-2xl font-medium text-gray-800 italic">
          “Elevate the plumbing industry to an architectural art form, providing
          homeowners with peace of mind through radical transparency and
          technical mastery.”
        </p>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {values.map((value) => (
          <div
            key={value.title}
            className="group rounded-2xl border border-gray-100 bg-gray-50/50 p-6 text-center transition hover:shadow-md hover:border-[#FFD60A]/30"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition">
              {value.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
            <p className="mt-2 text-gray-600 text-sm">{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}