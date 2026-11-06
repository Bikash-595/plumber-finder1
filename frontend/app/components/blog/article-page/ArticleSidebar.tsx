"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { plumberHref } from "@/components/find/companyListing";
import { FaArrowRight, FaEnvelope, FaStar, FaUserTie } from "react-icons/fa";
import type { ArticlePlumber, ArticlePost } from "./articleTypes";

/** The author card, newsletter signup and more from this plumber. */
export default function ArticleSidebar({ plumber, post, email, setEmail }: { plumber: ArticlePlumber; post: ArticlePost; email: string; setEmail: (value: string) => void }) {
  const router = useRouter();
  return (
        <aside className="space-y-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-200 dark:bg-white">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-100">
              <Image src={plumber.logo || "/Plumber.png"} alt={plumber.companyName} fill sizes="64px" className="object-cover" />
            </div>
            <h2 className="mt-4 text-xl font-black text-slate-950 dark:text-slate-950">{plumber.companyName}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-700">{plumber.description}</p>
            <div className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-700">
              <FaStar className="text-[#f7672c]" /> {plumber.rating} rating
            </div>
            <Link href={plumberHref(plumber)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f7672c] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#de5520]">
              View profile <FaArrowRight />
            </Link>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm dark:border-slate-200 dark:bg-slate-950 dark:text-white">
            <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-orange-200 dark:text-orange-200">
              <FaEnvelope /> Newsletter
            </p>
            <h2 className="mt-3 text-2xl font-black">Smarter home maintenance</h2>
            <p className="mt-3 text-sm leading-6 text-white/80 dark:text-white/80">
              Get seasonal checklists, cost guides, and repair tips in your inbox.
            </p>
            <form
              className="mt-5"
              onSubmit={(event) => {
                event.preventDefault();
                if (!email) return;
                router.push(`/contact?email=${encodeURIComponent(email)}`);
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                className="w-full rounded-full border border-white/20 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:ring-2 focus:ring-[#f7672c]"
              />
              <button type="submit" className="mt-3 w-full rounded-full bg-[#f7672c] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#de5520]">
                Subscribe
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-200 dark:bg-white">
            <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-500">
              <FaUserTie /> Author
            </p>
            <p className="mt-3 text-lg font-black text-slate-950 dark:text-slate-950">{post.author}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-700">
              Field-tested advice from a plumbing professional focused on clear estimates, safe repairs, and long-lasting systems.
            </p>
          </section>
        </aside>
  );
}
