

import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/components/find/types";
import { FaArrowRight, FaCalendarAlt, FaClock, FaEye } from "react-icons/fa";

interface LatestArticleCardProps {
  post: BlogPost;
  href: string;
}

export default function LatestArticleCard({ post, href }: LatestArticleCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#f7672c]/40 hover:shadow-xl"
    >
      <div className="relative h-28 w-full overflow-hidden bg-slate-100 sm:h-48">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-black text-slate-950 shadow-sm sm:left-4 sm:top-4 sm:px-3 sm:py-1 sm:text-xs">
          Guide
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-slate-500 sm:gap-3 sm:text-xs">
          <span className="flex items-center gap-1"><FaCalendarAlt /> {post.date}</span>
          <span className="flex items-center gap-1"><FaClock /> {post.readTime} min</span>
          <span className="flex items-center gap-1"><FaEye /> {post.readCount.toLocaleString()}</span>
        </div>
        <h3 className="mt-2 line-clamp-3 text-sm font-black leading-snug text-slate-950 transition group-hover:text-[#f7672c] sm:mt-3 sm:text-xl">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600 sm:line-clamp-3 sm:text-sm sm:leading-6">
          {post.summary}
        </p>
        <div className="mt-3 flex-1 sm:mt-5" /> {/* pushes the button to bottom */}
        <span className="inline-flex items-center gap-2 text-xs font-bold text-[#f7672c] sm:text-sm">
          Read article <FaArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}