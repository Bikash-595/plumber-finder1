import { API_BASE_URL } from "@/components/utils/apiClient";
import { readStoredUser } from "@/components/utils/auth";

export type Reaction = "like" | "dislike" | null;

export type Summary = { likes: number; dislikes: number; comments: number; myReaction: Reaction };

export type Comment = {
  _id: string; root: string | null; parent: string | null; createdAt: string; editedAt?: string;
  body: string; deleted: boolean; edited: boolean; likes: number; dislikes: number; replyCount: number;
  replyTo: { comment: string; name: string } | null;
  author: { name: string; type: "user" | "company" | "freelancer" | "admin"; isPostAuthor: boolean; isMe: boolean };
  myReaction: Reaction; canEdit: boolean; canDelete: boolean;
  replies?: Comment[];
};

export const MAX = 2000;

export const SHOWN_REPLIES = 3;

/** Calls the blog engagement API; reading works signed out, the token is sent when there is one. */
export async function call<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<{ data: T; total?: number; message?: string }> {
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

export const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "?";

export const avatarTone = { user: "bg-sky-100 text-sky-800", company: "bg-indigo-100 text-indigo-800", freelancer: "bg-violet-100 text-violet-800", admin: "bg-[#FFD60A] text-[#0b1f3b]" };

export const typeBadge = { user: null, company: "Plumbing company", freelancer: "Plumber", admin: "Plumber Finder" };
