// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { Plumber } from "@/components/find/types";
// import { FaCalendarAlt, FaClock, FaEye, FaThumbsUp, FaHeart, FaRegLightbulb } from "react-icons/fa";

// interface ProfileBlogsProps {
//   plumber: Plumber;
// }

// export default function ProfileBlogs({ plumber }: ProfileBlogsProps) {
//   if (!plumber.blogs || plumber.blogs.length === 0) return null;

//   return (
//     <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-bold text-gray-900">Latest from Our Blog</h2>
//         <Link
//           href="/blogs"
//           className="text-sm text-[#FFD60A] hover:underline"
//         >
//           View all →
//         </Link>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         {plumber.blogs.slice(0, 2).map((post) => (
//           <Link
//             key={post.slug}
//             href={`/plumber/${plumber.id}/blog/${post.slug}`}
//             className="group rounded-xl border border-gray-200 overflow-hidden bg-white transition hover:shadow-md hover:-translate-y-1"
//           >
//             <div className="relative h-40 w-full bg-gray-100">
//               <Image
//                 src={post.image}
//                 alt={post.title}
//                 fill
//                 sizes="(max-width: 768px) 100vw, 50vw"
//                 className="object-cover group-hover:scale-105 transition duration-300"
//               />
//             </div>
//             <div className="p-4">
//               <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
//                 <span className="flex items-center gap-1"><FaCalendarAlt className="h-3 w-3" /> {post.date}</span>
//                 <span className="flex items-center gap-1"><FaClock className="h-3 w-3" /> {post.readTime} min read</span>
//                 <span className="flex items-center gap-1"><FaEye className="h-3 w-3" /> {post.readCount}</span>
//               </div>
//               <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{post.title}</h3>
//               <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.summary}</p>
//               <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
//                 <span><FaThumbsUp className="inline mr-1" /> {post.reactions.like}</span>
//                 <span><FaHeart className="inline mr-1" /> {post.reactions.love}</span>
//                 <span><FaRegLightbulb className="inline mr-1" /> {post.reactions.helpful}</span>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }
