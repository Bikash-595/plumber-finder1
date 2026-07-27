// // components/about/AboutStats.tsx
// export default function AboutStats() {
//   const stats = [
//     { value: "2022", label: "FOUNDED", icon: "📅" },
//     { value: "48+", label: "CITIES COVERED", icon: "🌆" },
//     { value: "1000+", label: "VERIFIED PLUMBERS", icon: "🔧" },
//     { value: "99%", label: "SATISFACTION RATE", icon: "⭐" },
//   ];

//   return (
//     <div className="mt-16">
//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//         {stats.map((stat, idx) => (
//           <div
//             key={idx}
//             className="group rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm p-6 text-center transition-all hover:shadow-lg hover:border-[#FFD60A]/30 hover:-translate-y-1"
//           >
//             <div className="text-4xl mb-3">{stat.icon}</div>
//             <div className="text-3xl font-bold text-gray-900 font-heading">{stat.value}</div>
//             <div className="mt-1 text-sm font-semibold text-gray-500 tracking-wide">{stat.label}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }









"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const stats = [
  { label: "Years of Excellence", value: 4, suffix: "+", icon: "🏆" },
  { label: "Cities Covered", value: 48, suffix: "+", icon: "🌆" },
  { label: "Verified Pros", value: 250, suffix: "", icon: "👨‍🔧" },
  { label: "Happy Customers", value: 15000, suffix: "+", icon: "😊" },
];

const Counter = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, end, duration]);

  return <span ref={ref}>{count}</span>;
};

export default function AboutStats() {
  return (
    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl bg-white border border-gray-200 p-6 text-center shadow-sm transition hover:shadow-md"
        >
          <div className="text-4xl mb-2">{stat.icon}</div>
          <div className="text-3xl font-bold text-gray-900">
            <Counter end={stat.value} />
            {stat.suffix}
          </div>
          <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}