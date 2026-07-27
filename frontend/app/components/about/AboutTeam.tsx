// // components/about/AboutTeam.tsx
// import Link from "next/link";
// import { FaLinkedin, FaTwitter } from "react-icons/fa";

// const team = [
//   {
//     name: "Julian Vance",
//     role: "Voluntary leader with a passion for individual protection and operational excellence.",
//     imagePlaceholder: "JV",
//     linkedin: "#",
//     twitter: "#",
//   },
//   {
//     name: "Elena Rossi",
//     role: "Architecting the warranties interface that connects homeowners to elite technicians.",
//     imagePlaceholder: "ER",
//     linkedin: "#",
//     twitter: "#",
//   },
//   {
//     name: "Marcus Chen",
//     role: "Managing complex logistics to ensure 24/7 reliability across 46+ cities.",
//     imagePlaceholder: "MC",
//     linkedin: "#",
//     twitter: "#",
//   },
//   {
//     name: "Sarah Jenkins",
//     role: "Curating the white-glove service that turns a repair into a concierge experience.",
//     imagePlaceholder: "SJ",
//     linkedin: "#",
//     twitter: "#",
//   },
// ];

// export default function AboutTeam() {
//   return (
//     <div className="mt-20">
//       <div className="text-center">
//         <h2 className="text-3xl font-bold text-gray-900 font-heading">Meet Our Team</h2>
//         <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
//           The ranks behind the industry&apos;s most sophisticated concierge platform.
//         </p>
//       </div>
//       <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
//         {team.map((member) => (
//           <div
//             key={member.name}
//             className="group rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm p-6 text-center transition-all hover:shadow-xl hover:-translate-y-1"
//           >
//             <div className="relative mx-auto h-28 w-28 rounded-full bg-gradient-to-br from-[#FFD60A]/20 to-[#B1A606]/20 flex items-center justify-center text-3xl font-bold text-[#FFD60A]">
//               {member.imagePlaceholder}
//               <div className="absolute inset-0 rounded-full bg-[#FFD60A]/0 transition-all group-hover:bg-[#FFD60A]/10"></div>
//             </div>
//             <h3 className="mt-4 text-xl font-semibold text-gray-900">{member.name}</h3>
//             <p className="mt-2 text-sm text-gray-600 leading-relaxed">{member.role}</p>
//             <div className="mt-4 flex justify-center gap-3">
//               <Link href={member.linkedin} className="text-gray-400 hover:text-[#FFD60A] transition">
//                 <FaLinkedin className="h-5 w-5" />
//               </Link>
//               <Link href={member.twitter} className="text-gray-400 hover:text-[#FFD60A] transition">
//                 <FaTwitter className="h-5 w-5" />
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }










"use client";

import Image from "next/image";
import { FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import { useEffect, useRef } from "react";

const teamMembers = [
  {
    name: "Julian Vance",
    role: "Founder & CEO",
    bio: "Former master plumber with 20+ years of experience. Julian leads with a passion for operational excellence and customer trust.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    linkedin: "#",
    twitter: "#",
    email: "julian@plumberfinder.com",
  },
  {
    name: "Elena Rossi",
    role: "Chief Technology Officer",
    bio: "Architect of the concierge interface that connects homeowners to elite technicians. Elena previously led engineering at a Fortune 500.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    linkedin: "#",
    twitter: "#",
    email: "elena@plumberfinder.com",
  },
  {
    name: "Marcus Chen",
    role: "Head of Logistics",
    bio: "Managing complex supply chains and ensuring 24/7 reliability across 48+ cities. Marcus is a logistics wizard with a black belt in Lean Six Sigma.",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    linkedin: "#",
    twitter: "#",
    email: "marcus@plumberfinder.com",
  },
  {
    name: "Sarah Jenkins",
    role: "Customer Experience Director",
    bio: "Curating the white-glove service that turns a repair into a concierge experience. Sarah has a background in luxury hospitality.",
    image: "https://randomuser.me/api/portraits/women/89.jpg",
    linkedin: "#",
    twitter: "#",
    email: "sarah@plumberfinder.com",
  },
  {
    name: "David Okafor",
    role: "Lead Field Technician",
    bio: "Master plumber and trainer, David ensures every technician meets our architectural standards. He's a certified welding and piping expert.",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    linkedin: "#",
    twitter: "#",
    email: "david@plumberfinder.com",
  },
  {
    name: "Priya Mehta",
    role: "Head of Partnerships",
    bio: "Building relationships with top plumbing firms and industry associations. Priya has scaled partnerships for several tech unicorns.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    linkedin: "#",
    twitter: "#",
    email: "priya@plumberfinder.com",
  },
];

export default function AboutTeam() {
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
          Meet the Minds
        </span>
        <h2 className="text-3xl font-bold text-gray-900 font-heading">
          The People Behind the Platform
        </h2>
        <p className="mt-2 text-gray-600">
          A diverse team of industry experts, tech innovators, and customer
          advocates united by a mission to elevate home services.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <div
            key={member.name}
            className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 16rem"
                    className="object-cover"
                  />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                <p className="text-sm text-[#FFD60A]">{member.role}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              {member.bio}
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href={member.linkedin}
                className="text-gray-400 hover:text-[#0077b5] transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin size={18} />
              </a>
              <a
                href={member.twitter}
                className="text-gray-400 hover:text-[#1DA1F2] transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href={`mailto:${member.email}`}
                className="text-gray-400 hover:text-[#FFD60A] transition"
              >
                <FaEnvelope size={18} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
