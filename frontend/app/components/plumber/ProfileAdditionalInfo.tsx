// import { Plumber } from "@/components/find/types";
// import { FaMoneyBillWave, FaHandshake, FaLanguage, FaShieldAlt, FaCreditCard } from "react-icons/fa";

// export default function ProfileAdditionalInfo({ plumber }: { plumber: Plumber }) {
//   return (
//     <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
//       <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div className="flex items-center gap-3">
//           <FaMoneyBillWave className="h-5 w-5 text-[#FFD60A]" />
//           <div>
//             <div className="text-sm text-gray-500">Avg. Cost</div>
//             <div className="font-semibold">${plumber.averageCost}</div>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//           <FaHandshake className="h-5 w-5 text-[#FFD60A]" />
//           <div>
//             <div className="text-sm text-gray-500">Warranty</div>
//             <div className="font-semibold">{plumber.warranty}</div>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//           <FaLanguage className="h-5 w-5 text-[#FFD60A]" />
//           <div>
//             <div className="text-sm text-gray-500">Languages</div>
//             <div className="font-semibold">{plumber.languages.join(", ")}</div>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//           <FaShieldAlt className="h-5 w-5 text-[#FFD60A]" />
//           <div>
//             <div className="text-sm text-gray-500">Insurance</div>
//             <div className="font-semibold">{plumber.insurance}</div>
//           </div>
//         </div>
//       </div>
//       {plumber.certifications.length > 0 && (
//         <div className="mt-4">
//           <div className="text-sm text-gray-500 mb-1">Certifications</div>
//           <div className="flex flex-wrap gap-2">
//             {plumber.certifications.map((cert) => (
//               <span key={cert} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
//                 {cert}
//               </span>
//             ))}
//           </div>
//         </div>
//       )}
//       <div className="mt-4">
//         <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
//           <FaCreditCard className="h-3 w-3" /> Payment Methods
//         </div>
//         <div className="flex flex-wrap gap-2">
//           {plumber.paymentMethods.map((method) => (
//             <span key={method} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
//               {method}
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }









import { Plumber } from "@/components/find/types";
import { FaMoneyBillWave, FaHandshake, FaLanguage, FaShieldAlt, FaCreditCard } from "react-icons/fa";

export default function ProfileAdditionalInfo({ plumber }: { plumber: Plumber }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Additional Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <FaMoneyBillWave className="h-5 w-5 text-[#FFD60A]" />
          <div>
            <div className="text-sm text-gray-500">Avg. Cost</div>
            <div className="font-semibold text-gray-800">${plumber.averageCost}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FaHandshake className="h-5 w-5 text-[#FFD60A]" />
          <div>
            <div className="text-sm text-gray-500">Warranty</div>
            <div className="font-semibold text-gray-800">{plumber.warranty}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FaLanguage className="h-5 w-5 text-[#FFD60A]" />
          <div>
            <div className="text-sm text-gray-500">Languages</div>
            <div className="font-semibold text-gray-800">
              {plumber.languages?.join(", ") || "Not specified"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FaShieldAlt className="h-5 w-5 text-[#FFD60A]" />
          <div>
            <div className="text-sm text-gray-500">Insurance</div>
            <div className="font-semibold text-gray-800">{plumber.insurance}</div>
          </div>
        </div>
      </div>
      {(plumber.certifications?.length ?? 0) > 0 && (
        <div className="mt-4">
          <div className="text-sm text-gray-500 mb-1">Certifications</div>
          <div className="flex flex-wrap gap-2">
            {plumber.certifications.map((cert) => (
              <span key={cert} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="mt-4">
        <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
          <FaCreditCard className="h-3 w-3" /> Payment Methods
        </div>
        <div className="flex flex-wrap gap-2">
          {plumber.paymentMethods?.map((method) => (
            <span key={method} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
              {method}
            </span>
          )) || <span className="text-sm text-gray-500">Not specified</span>}
        </div>
      </div>
    </div>
  );
}