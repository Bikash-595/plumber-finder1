// import { Plumber } from "../find/types";
// import { FaBriefcase, FaClock, FaShieldAlt, FaMapMarkerAlt } from "react-icons/fa";

// export default function ProfileStats({ plumber }: { plumber: Plumber }) {
//   return (
//     <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
//       <h2 className="text-xl font-bold text-gray-900 mb-4">Company Details</h2>
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//         <div className="text-center">
//           <FaBriefcase className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-sm text-gray-500">Experience</div>
//           <div className="font-semibold text-gray-900">{plumber.yearsInBusiness}+ years</div>
//         </div>
//         <div className="text-center">
//           <FaClock className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-sm text-gray-500">Response Time</div>
//           <div className="font-semibold text-gray-900">{plumber.responseTime}</div>
//         </div>
//         <div className="text-center">
//           <FaShieldAlt className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-sm text-gray-500">License #</div>
//           <div className="font-semibold text-gray-900">{plumber.licenseNumber || "Not provided"}</div>
//         </div>
//         <div className="text-center">
//           <FaMapMarkerAlt className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-sm text-gray-500">Service Areas</div>
//           <div className="font-semibold text-gray-900">{plumber.serviceAreas.length} cities</div>
//         </div>
//       </div>
//     </div>
//   );
// }















// import { Plumber } from "@/components/find/types";
// import { FaBriefcase, FaClock, FaShieldAlt, FaMapMarkerAlt, FaUsers, FaCalendarAlt } from "react-icons/fa";

// export default function ProfileStats({ plumber }: { plumber: Plumber }) {
//   return (
//     <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
//       <h2 className="text-xl font-bold text-gray-900 mb-4">Company at a Glance</h2>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//         <div className="text-center">
//           <FaCalendarAlt className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-xs text-gray-500">Founded</div>
//           <div className="font-semibold text-gray-900">{plumber.established}</div>
//         </div>
//         <div className="text-center">
//           <FaBriefcase className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-xs text-gray-500">Experience</div>
//           <div className="font-semibold text-gray-900">{plumber.yearsInBusiness}+ years</div>
//         </div>
//         <div className="text-center">
//           <FaUsers className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-xs text-gray-500">Team Size</div>
//           <div className="font-semibold text-gray-900">{plumber.teamSize} plumbers</div>
//         </div>
//         <div className="text-center">
//           <FaClock className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-xs text-gray-500">Response Time</div>
//           <div className="font-semibold text-gray-900">{plumber.responseTime}</div>
//         </div>
//         <div className="text-center">
//           <FaShieldAlt className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-xs text-gray-500">License #</div>
//           <div className="font-semibold text-gray-900">{plumber.licenseNumber || "—"}</div>
//         </div>
//         <div className="text-center">
//           <FaMapMarkerAlt className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-xs text-gray-500">Service Areas</div>
//           <div className="font-semibold text-gray-900">{plumber.serviceAreas.length} cities</div>
//         </div>
//       </div>
//     </div>
//   );
// }









// import { Plumber } from "@/components/find/types";
// import {
//   FaBriefcase,
//   FaClock,
//   FaShieldAlt,
//   FaMapMarkerAlt,
//   FaUsers,
//   FaCalendarAlt,
//   FaMoneyBillWave,
//   FaHandshake,
//   FaCertificate,
//   FaLanguage,
//   FaCreditCard,
//   FaProjectDiagram,
// } from "react-icons/fa";

// export default function ProfileStats({ plumber }: { plumber: Plumber }) {
//   return (
//     <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
//       <h2 className="text-xl font-bold text-gray-900 mb-4">Company at a Glance</h2>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
//         <div className="text-center">
//           <FaCalendarAlt className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-xs text-gray-500">Founded</div>
//           <div className="font-semibold text-gray-900">{plumber.established}</div>
//         </div>
//         <div className="text-center">
//           <FaBriefcase className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-xs text-gray-500">Experience</div>
//           <div className="font-semibold text-gray-900">{plumber.yearsInBusiness}+ years</div>
//         </div>
//         <div className="text-center">
//           <FaUsers className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-xs text-gray-500">Team Size</div>
//           <div className="font-semibold text-gray-900">{plumber.teamSize} plumbers</div>
//         </div>
//         <div className="text-center">
//           <FaClock className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-xs text-gray-500">Response Time</div>
//           <div className="font-semibold text-gray-900">{plumber.responseTime}</div>
//         </div>
//         <div className="text-center">
//           <FaShieldAlt className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-xs text-gray-500">License #</div>
//           <div className="font-semibold text-gray-900">{plumber.licenseNumber || "—"}</div>
//         </div>
//         <div className="text-center">
//           <FaMapMarkerAlt className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-xs text-gray-500">Service Areas</div>
//           <div className="font-semibold text-gray-900">{plumber.serviceAreas.length} cities</div>
//         </div>
//         <div className="text-center">
//           <FaMoneyBillWave className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-xs text-gray-500">Avg. Cost</div>
//           <div className="font-semibold text-gray-900">${plumber.averageCost}</div>
//         </div>
//         <div className="text-center">
//           <FaHandshake className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-xs text-gray-500">Warranty</div>
//           <div className="font-semibold text-gray-900">{plumber.warranty}</div>
//         </div>
//         <div className="text-center">
//           <FaCertificate className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-xs text-gray-500">Certifications</div>
//           <div className="font-semibold text-gray-900">{plumber.certifications.length}</div>
//         </div>
//         <div className="text-center">
//           <FaLanguage className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-xs text-gray-500">Languages</div>
//           <div className="font-semibold text-gray-900">{plumber.languages.length}</div>
//         </div>
//         <div className="text-center">
//           <FaCreditCard className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-xs text-gray-500">Payment Methods</div>
//           <div className="font-semibold text-gray-900">{plumber.paymentMethods.length}</div>
//         </div>
//         <div className="text-center">
//           <FaProjectDiagram className="mx-auto h-6 w-6 text-[#FFD60A]" />
//           <div className="mt-1 text-xs text-gray-500">Projects Done</div>
//           <div className="font-semibold text-gray-900">{plumber.projects?.length || 0}</div>
//         </div>
//       </div>
//     </div>
//   );
// }






import { Plumber } from "@/components/find/types";
import {
  FaBriefcase,
  // FaClock,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillWave,
  // FaHandshake,
  FaCertificate,
  // FaLanguage,
  // FaCreditCard,
  FaProjectDiagram,
} from "react-icons/fa";

export default function ProfileStats({ plumber }: { plumber: Plumber }) {
  const stats = [
    { icon: FaCalendarAlt, label: "Founded", value: plumber.established },
    { icon: FaBriefcase, label: "Experience", value: `${plumber.yearsInBusiness}+ years` },
    { icon: FaUsers, label: "Team Size", value: `${plumber.teamSize} plumbers` },
    // { icon: FaClock, label: "Response Time", value: plumber.responseTime },
    { icon: FaShieldAlt, label: "License #", value: plumber.licenseNumber || "—" },
    { icon: FaMapMarkerAlt, label: "Service Areas", value: `${plumber.serviceAreas.length} cities` },
    { icon: FaMoneyBillWave, label: "Avg. Cost", value: `$${plumber.averageCost}` },
    // { icon: FaHandshake, label: "Warranty", value: plumber.warranty },
    { icon: FaCertificate, label: "Certifications", value: plumber.certifications.length },
    // { icon: FaLanguage, label: "Languages", value: plumber.languages.length },
    // { icon: FaCreditCard, label: "Payment Methods", value: plumber.paymentMethods.length },
    { icon: FaProjectDiagram, label: "Projects Done", value: plumber.projects?.length || 0 },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-4 text-xl font-bold text-gray-900 sm:mb-5">Company at a Glance</h2>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-5">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="group rounded-xl p-2 text-center transition hover:bg-gray-50 hover:shadow-md sm:p-3"
          >
            <stat.icon className="mx-auto h-6 w-6 text-[#FFD60A] group-hover:scale-110 transition-transform" />
            <div className="mt-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
              {stat.label}
            </div>
            <div className="mt-1 break-words text-sm font-semibold text-gray-900 sm:text-base">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
