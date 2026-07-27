

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
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-slate-950 shadow-sm">
          Guide
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1"><FaCalendarAlt /> {post.date}</span>
          <span className="flex items-center gap-1"><FaClock /> {post.readTime} min</span>
          <span className="flex items-center gap-1"><FaEye /> {post.readCount.toLocaleString()}</span>
        </div>
        <h3 className="mt-3 text-xl font-black leading-snug text-slate-950 transition group-hover:text-[#f7672c]">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
          {post.summary}
        </p>
        <div className="mt-5 flex-1" /> {/* pushes the button to bottom */}
        <span className="inline-flex items-center gap-2 text-sm font-bold text-[#f7672c]">
          Read article <FaArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}