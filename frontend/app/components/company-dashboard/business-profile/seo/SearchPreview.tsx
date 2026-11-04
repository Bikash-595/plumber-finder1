/** How the profile could look in Google results: link line, title and snippet (cut where Google cuts). */
export default function SearchPreview({ title, description, url }: { title: string; description: string; url: string }) {
  const cut = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 font-[arial,sans-serif]">
      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Google preview</p>
      <p className="mt-2 truncate text-xs text-[#202124]">plumberfinder.com <span className="text-[#5f6368]">› {url.replace(/^\//, "").split("/").join(" › ")}</span></p>
      <p className="mt-0.5 text-lg leading-snug text-[#1a0dab]">{cut(title, 60) || "Your page title"}</p>
      <p className="mt-0.5 text-sm leading-5 text-[#4d5156]">{cut(description, 158) || "Your description appears here — what you do, where, and why customers choose you."}</p>
    </div>
  );
}
