// import { Plumber } from "../find/types";

// export default function ProfileServices({ plumber }: { plumber: Plumber }) {
//   return (
//     <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
//       <h2 className="text-xl font-bold text-gray-900 mb-4">Services Offered</h2>
//       <div className="flex flex-wrap gap-2">
//         {plumber.services.map((s) => (
//           <span key={s} className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">
//             {s}
//           </span>
//         ))}
//       </div>
//       {plumber.specializations.length > 0 && (
//         <>
//           <h3 className="font-semibold text-gray-900 mt-6 mb-2">Specializations</h3>
//           <div className="flex flex-wrap gap-2">
//             {plumber.specializations.map((spec) => (
//               <span key={spec} className="rounded-full bg-[#FFD60A]/10 px-3 py-1 text-sm text-[#B1A606]">
//                 {spec}
//               </span>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }






import { Plumber } from "@/components/find/types";
import { JSX } from "react";
import { 
  FaWrench, FaTools, FaWater, FaFire, FaSnowplow, FaShower, 
  FaTint, FaSearch, FaExclamationTriangle, FaHome, 
  FaRegSnowflake, FaLeaf, FaIndustry, FaRegBuilding
} from "react-icons/fa";

// Extended icon mapping for more services
const serviceIcons: Record<string, JSX.Element> = {
  "Leak Repair": <FaWrench />,
  "Drain Cleaning": <FaTools />,
  "Water Heater": <FaWater />,
  "Pipe Repair": <FaWrench />,
  "Sewer Line": <FaTools />,
  "Emergency Service": <FaFire />,
  "Frozen Pipes": <FaSnowplow />,
  "Bathroom Remodel": <FaShower />,
  "Faucet Installation": <FaTint />,
  "Toilet Repair": <FaHome />,
  "Garbage Disposal": <FaTools />,
  "Hydro Jetting": <FaWater />,
  "Video Inspection": <FaSearch />,
  "Slab Leak": <FaExclamationTriangle />,
  "Repiping": <FaWrench />,
  "Sump Pump": <FaWater />,
  "Water Softener": <FaTint />,
  "Gas Line Repair": <FaFire />,
  "Radiant Heating": <FaRegSnowflake />,
  "Commercial Plumbing": <FaIndustry />,
  "Backflow Testing": <FaRegBuilding />,
  "Grease Trap": <FaTools />,
  "Water Main Repair": <FaWater />,
  "Trenchless Sewer": <FaTools />,
  "Eco-friendly": <FaLeaf />,
  "Tankless Water Heater": <FaWater />,
  "Pipe Insulation": <FaRegSnowflake />,
};

// Fallback icon
const fallbackIcon = <FaWrench />;

export default function ProfileServices({ plumber }: { plumber: Plumber }) {
  // Ensure specializations is always an array (if missing, default to empty)
  const specializations = plumber.specializations ?? [];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Services Offered</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {plumber.services.map((service) => (
          <div key={service} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
            <span className="text-[#FFD60A]">{serviceIcons[service] || fallbackIcon}</span>
            <span className="text-sm text-gray-700">{service}</span>
          </div>
        ))}
      </div>
      {specializations.length > 0 && (
        <>
          <h3 className="font-semibold text-gray-900 mt-6 mb-2">Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {specializations.map((spec) => (
              <span key={spec} className="rounded-full bg-[#FFD60A]/10 px-3 py-1 text-sm text-[#B1A606]">
                {spec}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
