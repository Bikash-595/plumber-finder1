"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { FaCommentDots, FaEye, FaLink, FaRegThumbsDown, FaRegThumbsUp, FaReply, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { API_BASE_URL } from "@/components/utils/apiClient";
import { readStoredUser } from "@/components/utils/auth";
import { timeAgo } from "@/components/bookings/bookingsApi";
import { formatCount, useBlogViews } from "./useBlogViews";

type Reaction = "like" | "dislike" | null;
type Summary = { likes: number; dislikes: number; comments: number; myReaction: Reaction };
type Comment = {
  _id: string; root: string | null; parent: string | null; createdAt: string; editedAt?: string;
  body: string; deleted: boolean; edited: boolean; likes: number; dislikes: number; replyCount: number;
  replyTo: { comment: string; name: string } | null;
  author: { name: string; type: "user" | "company" | "freelancer" | "admin"; isPostAuthor: boolean; isMe: boolean };
  myReaction: Reaction; canEdit: boolean; canDelete: boolean;
  replies?: Comment[];
};

const MAX = 2000;
const SHOWN_REPLIES = 3;

/** Calls the blog engagement API; reading works signed out, the token is sent when there is one. */
async function call<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<{ data: T; total?: number; message?: string }> {
  const token = readStoredUser()?.accessToken;
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/blogs${path}`, { method: init.method ?? "GET", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: init.body === undefined ? undefined : JSON.stringify(init.body) });
  } catch {
    throw new Error("Can't reach the server right now. Please try again.");
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || `Request failed (${response.status}).`);
  return payload;
}

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "?";
const avatarTone = { user: "bg-sky-100 text-sky-800", company: "bg-indigo-100 text-indigo-800", freelancer: "bg-violet-100 text-violet-800", admin: "bg-[#FFD60A] text-[#0b1f3b]" };
const typeBadge = { user: null, company: "Plumbing company", freelancer: "Plumber", admin: "Plumber Finder" };

function Badge({ comment }: { comment: Comment }) {
  if (comment.deleted) return null;
  if (comment.author.isPostAuthor) return <span className="rounded-full bg-[#0b1f3b] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Author</span>;
  const label = typeBadge[comment.author.type];
  return label ? <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-600">{label}</span> : null;
}

/** A text box for a new comment, a reply, or an edit. */
function Composer({ initial = "", placeholder, submitLabel, onSubmit, onCancel, autoFocus = false }: { initial?: string; placeholder: string; submitLabel: string; onSubmit: (body: string) => Promise<boolean>; onCancel?: () => void; autoFocus?: boolean }) {
  const [text, setText] = useState(initial);
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    if (await onSubmit(text.trim())) setText("");
    setBusy(false);
  };
  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea value={text} onChange={(e) => setText(e.target.value.slice(0, MAX))} rows={3} autoFocus={autoFocus} placeholder={placeholder} aria-label={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-[#f7672c] focus:ring-2 focus:ring-[#f7672c]/20" />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`text-xs ${text.length > MAX - 100 ? "text-amber-700" : "text-slate-400"}`}>{text.length}/{MAX}</span>
        <div className="flex gap-2">
          {onCancel && <button type="button" onClick={onCancel} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>}
          <button type="submit" disabled={!text.trim() || busy} className="rounded-full bg-slate-950 px-5 py-2 text-sm font-bold text-white transition hover:bg-[#f7672c] disabled:opacity-40">{busy ? "Posting…" : submitLabel}</button>
        </div>
      </div>
    </form>
  );
}

/**
 * Likes, dislikes, and comments for a blog post. `postPath` is "company/<id>", "freelancer/<id>",
 * "platform/<id>", or "demo/<plumber id>--<slug>". Any signed-in account can react, comment, and reply
 * (also to replies); authors edit or delete their own comments; comments can be liked or disliked.
 */
export default function BlogEngagement({ postPath, postTitle }: { postPath: string; postTitle: string }) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"newest" | "top" | "oldest">("newest");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [myName, setMyName] = useState("");
  const counted = useBlogViews(postPath);

  useEffect(() => {
    const user = readStoredUser();
    const timer = window.setTimeout(() => { setSignedIn(Boolean(user?.accessToken)); setMyName(user?.name ?? ""); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const loadSummary = useCallback(() => call<Summary>(`/posts/${postPath}/engagement`).then(({ data }) => setSummary(data)).catch(() => undefined), [postPath]);
  const loadComments = useCallback(async (nextPage = 1, append = false) => {
    try {
      const { data, total: count } = await call<Comment[]>(`/posts/${postPath}/comments?sort=${sort}&page=${nextPage}`);
      setComments((current) => (append && current ? [...current, ...data] : data));
      setTotal(count ?? 0);
      setPage(nextPage);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load comments.");
      setComments((current) => current ?? []);
    }
  }, [postPath, sort]);

  useEffect(() => { const timer = window.setTimeout(() => { loadSummary(); loadComments(1); }, 0); return () => window.clearTimeout(timer); }, [loadSummary, loadComments]);

  // Opened from a notification (#comment-<id>): show and highlight that comment.
  useEffect(() => {
    if (!comments) return;
    const id = window.location.hash.match(/^#comment-([a-f0-9]{24})$/)?.[1];
    if (!id) return;
    const thread = comments.find((c) => c._id === id || c.replies?.some((r) => r._id === id));
    if (!thread) return;
    const timer = window.setTimeout(() => {
      setExpanded((current) => new Set(current).add(thread._id));
      setHighlight(id);
      window.setTimeout(() => document.getElementById(`comment-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [comments]);

  /** Applies a change to one comment wherever it is (top level or a reply). */
  const patchComment = (id: string, change: (comment: Comment) => Comment) => setComments((current) => current?.map((c) => (c._id === id ? change(c) : { ...c, replies: c.replies?.map((r) => (r._id === id ? change(r) : r)) })) ?? null);
  const needLogin = () => setError("Log in to like, dislike, or comment.");

  const reactToPost = async (reaction: "like" | "dislike") => {
    if (!signedIn) return needLogin();
    if (!summary) return;
    const next = summary.myReaction === reaction ? "none" : reaction;
    const previous = summary;
    // Show it straight away; the server's answer then sets the true counts.
    setSummary({ ...summary, myReaction: next === "none" ? null : next, likes: summary.likes + (next === "like" ? 1 : 0) - (summary.myReaction === "like" ? 1 : 0), dislikes: summary.dislikes + (next === "dislike" ? 1 : 0) - (summary.myReaction === "dislike" ? 1 : 0) });
    try { setSummary((await call<Summary>(`/posts/${postPath}/reaction`, { method: "PUT", body: { reaction: next } })).data); } catch (caught) { setSummary(previous); setError(caught instanceof Error ? caught.message : "Could not save your reaction."); }
  };

  const reactToComment = async (comment: Comment, reaction: "like" | "dislike") => {
    if (!signedIn) return needLogin();
    const next = comment.myReaction === reaction ? "none" : reaction;
    patchComment(comment._id, (c) => ({ ...c, myReaction: next === "none" ? null : next, likes: c.likes + (next === "like" ? 1 : 0) - (c.myReaction === "like" ? 1 : 0), dislikes: c.dislikes + (next === "dislike" ? 1 : 0) - (c.myReaction === "dislike" ? 1 : 0) }));
    try {
      const { data } = await call<{ likes: number; dislikes: number; myReaction: Reaction }>(`/comments/${comment._id}/reaction`, { method: "PUT", body: { reaction: next } });
      patchComment(comment._id, (c) => ({ ...c, ...data }));
    } catch (caught) {
      patchComment(comment._id, () => comment);
      setError(caught instanceof Error ? caught.message : "Could not save your reaction.");
    }
  };

  const post = async (body: string, parent?: Comment) => {
    setError("");
    try {
      const { data } = await call<Comment>(`/posts/${postPath}/comments`, { method: "POST", body: { body, parentId: parent?._id } });
      if (parent) {
        const rootId = parent.root ?? parent._id;
        setComments((current) => current?.map((c) => (c._id === rootId ? { ...c, replyCount: c.replyCount + 1, replies: [...(c.replies ?? []), data] } : c)) ?? null);
        setExpanded((current) => new Set(current).add(rootId));
        setReplyingTo(null);
      } else {
        setComments((current) => [data, ...(current ?? [])]);
        setTotal((count) => count + 1);
      }
      setSummary((current) => current && { ...current, comments: current.comments + 1 });
      setHighlight(data._id);
      return true;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not post your comment.");
      return false;
    }
  };

  const saveEdit = async (comment: Comment, body: string) => {
    try {
      const { data } = await call<Comment>(`/comments/${comment._id}`, { method: "PATCH", body: { body } });
      patchComment(comment._id, (c) => ({ ...c, body: data.body, edited: data.edited, editedAt: data.editedAt }));
      setEditing(null);
      return true;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save your changes.");
      return false;
    }
  };

  const remove = async (comment: Comment) => {
    if (!window.confirm(comment.author.isMe ? "Delete your comment?" : `Delete this comment by ${comment.author.name}?`)) return;
    try {
      await call(`/comments/${comment._id}`, { method: "DELETE" });
      // Reload: the server decides whether the thread stays (with replies) or disappears.
      await Promise.all([loadComments(1), loadSummary()]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not delete the comment.");
    }
  };

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href.split("#")[0]); setCopied(true); window.setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ }
  };

  const renderComment = (comment: Comment, isReply: boolean) => (
    <div id={`comment-${comment._id}`} className={`scroll-mt-28 rounded-2xl p-3 transition sm:p-4 ${highlight === comment._id ? "bg-[#FFD60A]/15 ring-2 ring-[#FFD60A]" : isReply ? "bg-slate-50" : "bg-white"}`}>
      <div className="flex gap-3">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold ${comment.deleted ? "bg-slate-100 text-slate-400" : avatarTone[comment.author.type]}`} aria-hidden>{comment.deleted ? "–" : initials(comment.author.name)}</span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className={`font-bold ${comment.deleted ? "text-slate-400" : "text-slate-950"}`}>{comment.author.name}{comment.author.isMe && !comment.deleted ? " (you)" : ""}</span>
            <Badge comment={comment} />
            <span className="text-xs text-slate-500">{timeAgo(comment.createdAt)}{comment.edited && <span title={comment.editedAt ? `Edited ${new Date(comment.editedAt).toLocaleString()}` : undefined}> · edited</span>}</span>
          </p>
          {isReply && comment.replyTo && !comment.deleted && <p className="mt-0.5 text-xs text-slate-500">Replying to <span className="font-semibold text-[#f7672c]">@{comment.replyTo.name}</span></p>}
          {editing === comment._id ? (
            <div className="mt-2"><Composer initial={comment.body} placeholder="Edit your comment" submitLabel="Save" autoFocus onSubmit={(body) => saveEdit(comment, body)} onCancel={() => setEditing(null)} /></div>
          ) : comment.deleted ? (
            <p className="mt-1 text-sm italic text-slate-400">This comment was deleted.</p>
          ) : (
            <p className="mt-1 whitespace-pre-line break-words text-[15px] leading-7 text-slate-700">{comment.body}</p>
          )}
          {!comment.deleted && editing !== comment._id && (
            <div className="mt-2 flex flex-wrap items-center gap-1 text-xs font-semibold text-slate-600">
              <button type="button" onClick={() => reactToComment(comment, "like")} aria-pressed={comment.myReaction === "like"} aria-label={`Like comment by ${comment.author.name}`} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition hover:bg-slate-100 ${comment.myReaction === "like" ? "text-[#f7672c]" : ""}`}>
                {comment.myReaction === "like" ? <FaThumbsUp className="h-3 w-3" /> : <FaRegThumbsUp className="h-3 w-3" />} {comment.likes || ""}
              </button>
              <button type="button" onClick={() => reactToComment(comment, "dislike")} aria-pressed={comment.myReaction === "dislike"} aria-label={`Dislike comment by ${comment.author.name}`} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition hover:bg-slate-100 ${comment.myReaction === "dislike" ? "text-slate-950" : ""}`}>
                {comment.myReaction === "dislike" ? <FaThumbsDown className="h-3 w-3" /> : <FaRegThumbsDown className="h-3 w-3" />} {comment.dislikes || ""}
              </button>
              <button type="button" onClick={() => (signedIn ? setReplyingTo(replyingTo === comment._id ? null : comment._id) : needLogin())} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 transition hover:bg-slate-100"><FaReply className="h-3 w-3" /> Reply</button>
              {comment.canEdit && <button type="button" onClick={() => { setEditing(comment._id); setReplyingTo(null); }} className="rounded-full px-2.5 py-1 transition hover:bg-slate-100">Edit</button>}
              {comment.canDelete && <button type="button" onClick={() => remove(comment)} className="rounded-full px-2.5 py-1 text-red-600 transition hover:bg-red-50">Delete</button>}
            </div>
          )}
          {replyingTo === comment._id && (
            <div className="mt-3"><Composer placeholder={`Reply to ${comment.author.name}`} submitLabel="Reply" autoFocus onSubmit={(body) => post(body, comment)} onCancel={() => setReplyingTo(null)} /></div>
          )}
        </div>
      </div>
    </div>
  );

  const reactionButton = (reaction: "like" | "dislike") => {
    const active = summary?.myReaction === reaction;
    const icon = reaction === "like" ? (active ? <FaThumbsUp className="h-3.5 w-3.5" aria-hidden /> : <FaRegThumbsUp className="h-3.5 w-3.5" aria-hidden />) : active ? <FaThumbsDown className="h-3.5 w-3.5" aria-hidden /> : <FaRegThumbsDown className="h-3.5 w-3.5" aria-hidden />;
    return (
      <button type="button" onClick={() => reactToPost(reaction)} aria-pressed={active} aria-label={reaction === "like" ? "Like this article" : "Dislike this article"}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${active ? (reaction === "like" ? "border-[#f7672c] bg-[#f7672c] text-white" : "border-slate-950 bg-slate-950 text-white") : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"}`}>
        {icon} {reaction === "like" ? "Like" : "Dislike"} <span className={active ? "text-white/80" : "text-slate-400"}>{summary ? summary[reaction === "like" ? "likes" : "dislikes"] : "–"}</span>
      </button>
    );
  };

  return (
    <section id="comments" className="mt-8 scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="comments-heading">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-5">
        <p className="mr-2 text-sm font-semibold text-slate-600">Was this article helpful?</p>
        {reactionButton("like")}
        {reactionButton("dislike")}
        <a href="#comment-box" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-slate-400"><FaCommentDots className="h-3.5 w-3.5" aria-hidden /> {summary?.comments ?? 0}</a>
        <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-slate-400"><FaLink className="h-3.5 w-3.5" aria-hidden /> {copied ? "Link copied" : "Share"}</button>
        {counted && <span className="ml-auto inline-flex items-center gap-2 text-sm text-slate-500" title={`${counted.views.toLocaleString()} views by ${counted.readers.toLocaleString()} readers`}><FaEye className="h-3.5 w-3.5" aria-hidden /> {formatCount(counted.views)} views · {formatCount(counted.readers)} readers</span>}
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <h2 id="comments-heading" className="flex items-center gap-3 text-2xl font-black text-slate-950 sm:text-3xl"><FaCommentDots className="text-[#f7672c]" aria-hidden /> Comments <span className="text-lg font-bold text-slate-400">{summary?.comments ?? ""}</span></h2>
        <label className="text-sm text-slate-600">Sort by{" "}
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="ml-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 outline-none focus:border-[#f7672c]">
            <option value="newest">Newest</option><option value="top">Top</option><option value="oldest">Oldest</option>
          </select>
        </label>
      </div>

      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">{error} {/log in/i.test(error) && <Link href="/login" className="font-bold underline">Log in</Link>}</p>}

      <div id="comment-box" className="mt-5 scroll-mt-28">
        {signedIn ? (
          <>
            <p className="mb-2 text-xs text-slate-500">Commenting as <span className="font-semibold text-slate-800">{myName || "you"}</span></p>
            <Composer placeholder={`Share your thoughts on “${postTitle}”`} submitLabel="Post comment" onSubmit={(body) => post(body)} />
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-600">
            <Link href="/login" className="font-bold text-[#f7672c] underline">Log in</Link> or <Link href="/signup" className="font-bold text-[#f7672c] underline">sign up</Link> to like, comment, and reply.
          </div>
        )}
      </div>

      {comments === null && <p className="py-8 text-center text-sm text-slate-500">Loading comments…</p>}
      {comments && comments.length === 0 && <p className="mt-6 rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">No comments yet. Be the first to share your thoughts.</p>}
      <ul className="mt-6 space-y-4">
        {comments?.map((thread) => {
          const replies = thread.replies ?? [];
          const open = expanded.has(thread._id);
          const shown = open ? replies : replies.slice(0, SHOWN_REPLIES);
          return (
            <li key={thread._id} className="rounded-2xl border border-slate-100">
              {renderComment(thread, false)}
              {replies.length > 0 && (
                <div className="ml-6 space-y-2 border-l-2 border-slate-100 pb-3 pl-3 pr-2 sm:ml-12 sm:pl-4">
                  {shown.map((reply) => <div key={reply._id}>{renderComment(reply, true)}</div>)}
                  {replies.length > SHOWN_REPLIES && (
                    <button type="button" onClick={() => setExpanded((current) => { const next = new Set(current); if (open) next.delete(thread._id); else next.add(thread._id); return next; })} className="ml-3 text-xs font-bold text-[#f7672c] hover:underline">
                      {open ? "Show fewer replies" : `Show ${replies.length - SHOWN_REPLIES} more ${replies.length - SHOWN_REPLIES === 1 ? "reply" : "replies"}`}
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {comments && comments.length < total && (
        <button type="button" onClick={() => loadComments(page + 1, true)} className="mt-5 w-full rounded-full border border-slate-200 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">Load more comments</button>
      )}
    </section>
  );
}
