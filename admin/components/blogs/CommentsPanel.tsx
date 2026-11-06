"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminApi, type BlogComment, type PlatformBlog } from "@/lib/adminApi";
import { field } from "./blogConfig";

/** Comments on one post: read, reply as Plumber Finder, delete. */
export default function CommentsPanel({ post, onClose }: { post: PlatformBlog; onClose: () => void }) {
  const [items, setItems] = useState<BlogComment[] | null>(null);
  const [error, setError] = useState("");
  const [replying, setReplying] = useState<string | null>(null);
  const [text, setText] = useState("");
  const load = () => adminApi.blogComments(post._id).then(({ data }) => setItems(data)).catch((caught: Error) => { setError(caught.message); setItems([]); });
  // eslint-disable-next-line react-hooks/exhaustive-deps -- load once per post
  useEffect(() => { load(); }, [post._id]);

  const reply = async (event: FormEvent, parent: BlogComment) => {
    event.preventDefault();
    if (!text.trim()) return;
    try { await adminApi.replyToComment(post._id, parent._id, text.trim()); setText(""); setReplying(null); await load(); } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not reply."); }
  };
  const remove = async (comment: BlogComment) => {
    if (!window.confirm(`Delete this comment by ${comment.author.name}?`)) return;
    try { await adminApi.deleteComment(comment._id); await load(); } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not delete."); }
  };
  const item = (comment: BlogComment, isReply = false) => (
    <div className={`rounded-xl p-3 ${isReply ? "bg-gray-50" : "border border-gray-200"}`}>
      <p className="text-sm"><span className="font-semibold text-gray-900">{comment.author.name}</span>{comment.author.isPostAuthor && <span className="ml-2 rounded-full bg-[#0b1f3b] px-2 py-0.5 text-[10px] font-bold text-white">AUTHOR</span>} <span className="text-xs text-gray-500">· {new Date(comment.createdAt).toLocaleString()}{comment.edited ? " · edited" : ""} · 👍 {comment.likes} 👎 {comment.dislikes}</span></p>
      {isReply && comment.replyTo && <p className="text-xs text-gray-500">Replying to @{comment.replyTo.name}</p>}
      <p className={`mt-1 whitespace-pre-line text-sm ${comment.deleted ? "italic text-gray-400" : "text-gray-700"}`}>{comment.deleted ? "This comment was deleted." : comment.body}</p>
      {!comment.deleted && (
        <div className="mt-2 flex gap-2 text-xs font-semibold">
          <button type="button" onClick={() => { setReplying(replying === comment._id ? null : comment._id); setText(""); }} className="rounded-lg border border-gray-200 px-2.5 py-1 text-gray-700 hover:bg-white">Reply as Plumber Finder</button>
          <button type="button" onClick={() => remove(comment)} className="rounded-lg border border-red-200 px-2.5 py-1 text-red-600 hover:bg-red-50">Delete</button>
        </div>
      )}
      {replying === comment._id && (
        <form onSubmit={(event) => reply(event, comment)} className="mt-2 space-y-2">
          <textarea rows={2} value={text} maxLength={2000} onChange={(e) => setText(e.target.value)} placeholder={`Reply to ${comment.author.name}`} className={field} />
          <button type="submit" disabled={!text.trim()} className="rounded-lg bg-[#0b1f3b] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40">Post reply</button>
        </form>
      )}
    </div>
  );
  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/40" onClick={onClose}>
      <aside role="dialog" aria-modal="true" aria-label="Comments" onClick={(event) => event.stopPropagation()} className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-gray-200 px-5 py-4">
          <div><p className="text-xs text-gray-500">Comments on</p><h2 className="font-bold text-gray-900">{post.title}</h2></div>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-100">Close</button>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-5">
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {!items && <p className="text-sm text-gray-500">Loading…</p>}
          {items?.length === 0 && <p className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">No comments yet.</p>}
          {items?.map((comment) => (
            <div key={comment._id} className="space-y-2">
              {item(comment)}
              {(comment.replies ?? []).length > 0 && <div className="ml-6 space-y-2 border-l-2 border-gray-100 pl-3">{comment.replies!.map((reply) => <div key={reply._id}>{item(reply, true)}</div>)}</div>}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
