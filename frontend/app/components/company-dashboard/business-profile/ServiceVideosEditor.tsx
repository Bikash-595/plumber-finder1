"use client";

import { useRef, useState } from "react";
import { FaLink, FaPlay, FaTrash, FaUpload, FaYoutube } from "react-icons/fa";
import { youtubeId, youtubeThumbnail } from "@/components/find/media";

const MAX_VIDEOS = 4;
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
// Same rule as the server: YouTube, or a direct .mp4 / .webm / .mov link.
const VIDEO_LINK = /^https:\/\/((www\.|m\.)?youtube(-nocookie)?\.com\/(watch\?v=|embed\/|shorts\/)[\w-]{11}|youtu\.be\/[\w-]{11})\S*$|^https:\/\/\S+\.(mp4|webm|mov)(\?\S*)?$/i;
const shortsId = (url: string) => url.match(/youtube\.com\/shorts\/([\w-]{11})/)?.[1] ?? null;
const ytId = (url: string) => youtubeId(url) ?? shortsId(url);

/** Videos for a service: YouTube or video-file links (any number up to 4) and one short uploaded clip. */
export default function ServiceVideosEditor({ value, onChange }: { value: string[]; onChange: (videos: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const full = value.length >= MAX_VIDEOS;
  const hasUpload = value.some((video) => video.startsWith("data:"));

  const addLink = () => {
    const url = link.trim();
    if (!url) return;
    if (!VIDEO_LINK.test(url)) return setError("Paste a YouTube link (youtube.com or youtu.be) or a link ending in .mp4, .webm or .mov.");
    if (value.includes(url)) return setError("That video is already added.");
    setError("");
    onChange([...value, url]);
    setLink("");
  };

  const upload = (file?: File) => {
    if (!file) return;
    if (!/^video\/(mp4|webm|quicktime)$/.test(file.type)) return setError("Choose an MP4, WEBM or MOV video.");
    if (file.size > MAX_UPLOAD_BYTES) return setError("Uploaded clips can be up to 4 MB. For longer videos, upload to YouTube and paste the link.");
    setBusy(true);
    setError("");
    const reader = new FileReader();
    reader.onload = () => { onChange([...value, String(reader.result)]); setBusy(false); };
    reader.onerror = () => { setError("That video could not be read. Please try another file."); setBusy(false); };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <p className="text-sm font-semibold text-gray-700">Service videos <span className="font-normal text-gray-400">({value.length}/{MAX_VIDEOS})</span></p>
      <p className="mt-0.5 text-xs text-gray-500">A short walkthrough builds trust. Paste YouTube links, or upload one clip up to 4 MB.</p>
      {value.length > 0 && (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {value.map((video, index) => {
            const id = ytId(video);
            return (
              <li key={`${index}-${video.slice(-20)}`} className="group relative aspect-video overflow-hidden rounded-xl border border-gray-200 bg-gray-900">
                {/* eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnails come from i.ytimg.com */}
                {id ? <img src={youtubeThumbnail(id)} alt="" className="h-full w-full object-cover" /> : <video src={video.startsWith("data:") ? video : `${video}#t=0.5`} preload="metadata" muted playsInline className="h-full w-full object-cover" />}
                <span className="pointer-events-none absolute inset-0 grid place-items-center"><span className="grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white"><FaPlay className="ml-0.5 h-3 w-3" /></span></span>
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">{id ? <><FaYoutube className="h-3 w-3 text-red-500" /> YouTube</> : video.startsWith("data:") ? "Uploaded" : "Video link"}</span>
                <button type="button" onClick={() => onChange(value.filter((_, i) => i !== index))} aria-label={`Remove video ${index + 1}`} className="absolute bottom-1.5 right-1.5 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-red-600"><FaTrash className="h-2.5 w-2.5" /></button>
              </li>
            );
          })}
        </ul>
      )}
      {!full && (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <FaLink className="pointer-events-none absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" aria-hidden />
            <input value={link} onChange={(e) => setLink(e.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addLink(); } }} placeholder="https://youtu.be/… or https://…/video.mp4" aria-label="Video link" className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-8 pr-3 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30" />
          </div>
          <button type="button" onClick={addLink} disabled={!link.trim()} className="rounded-xl bg-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40">Add link</button>
          {/* Hidden (display: none) so opening the picker never scrolls the page. */}
          <input ref={inputRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" tabIndex={-1} aria-hidden onChange={(event) => { upload(event.target.files?.[0]); event.target.value = ""; }} />
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy || hasUpload} title={hasUpload ? "One uploaded clip per service — add others as YouTube links" : undefined} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40"><FaUpload className="h-3 w-3" /> {busy ? "Reading…" : "Upload clip"}</button>
        </div>
      )}
      {error && <p role="alert" className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
