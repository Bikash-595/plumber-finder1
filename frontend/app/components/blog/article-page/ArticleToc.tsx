"use client";

import { FaFacebookF, FaLinkedinIn, FaShareAlt, FaTwitter } from "react-icons/fa";
import type { ArticleMarkup, ShareLinks } from "./articleTypes";

/** The sticky table of contents and share links (desktop). */
export default function ArticleToc({ article, activeSection, shareLinks, scrollToSection }: { article: ArticleMarkup; activeSection: string; shareLinks: ShareLinks; scrollToSection: (sectionId: string) => void }) {
  return (
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4 lg:top-32">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-200 dark:bg-slate-50">
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-500">Contents</h2>
              <ol className="mt-4 space-y-1 text-sm">
                {article.toc.length === 0 && <li className="text-slate-500">Article overview</li>}
                {article.toc.map((item, index) => (
                  <li key={item.id} className={item.level === 3 ? "pl-4" : item.level === 4 ? "pl-8" : ""}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={`flex w-full items-start gap-2 rounded-xl px-3 py-2 text-left transition ${
                        activeSection === item.id
                          ? "bg-slate-950 text-white dark:bg-slate-950 dark:text-white"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-700 dark:hover:bg-white/10"
                      }`}
                    >
                      <span className="text-xs font-black">{index + 1}</span>
                      <span>{item.text}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-200 dark:bg-slate-50">
              <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-500">
                <FaShareAlt /> Share
              </p>
              <div className="mt-4 flex gap-2">
                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share on X" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-[#f7672c] dark:bg-slate-950 dark:text-white"><FaTwitter /></a>
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-[#f7672c] dark:bg-slate-950 dark:text-white"><FaFacebookF /></a>
                <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-[#f7672c] dark:bg-slate-950 dark:text-white"><FaLinkedinIn /></a>
              </div>
            </div>
          </div>
        </aside>
  );
}
