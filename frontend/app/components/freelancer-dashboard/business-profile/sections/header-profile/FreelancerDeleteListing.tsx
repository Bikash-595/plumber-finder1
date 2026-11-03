"use client";

import { useState } from "react";
import { apiRequest } from "@/components/utils/apiClient";

/** Removes the freelancer from the public directory. Their other profile sections are kept. */
export default function FreelancerDeleteListing() {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  const remove = async () => {
    if (!window.confirm("Remove your public listing? You will disappear from the directory. Your services, projects, blogs and other sections are kept, and saving Your Profile again re-lists you.")) return;
    setBusy(true);
    setNotice(null);
    try {
      const response = await apiRequest("/freelancers/header-profile", { method: "DELETE", loginMessage: "Please log in with your freelancer account." });
      setNotice({ tone: "ok", text: `${response.message} Reload the page to start a new profile.` });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Unable to remove your listing." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-6 rounded-xl border border-red-100 bg-red-50/50 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700"><span className="font-bold text-red-700">Remove listing.</span> Deletes your profile header and takes you out of the public directory. To hide yourself temporarily, untick &ldquo;Show me in the public directory&rdquo; instead.</p>
        <button type="button" onClick={remove} disabled={busy} className="shrink-0 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50">{busy ? "Removing…" : "Remove listing"}</button>
      </div>
      {notice && <p role={notice.tone === "ok" ? "status" : "alert"} className={`mt-3 rounded-xl px-4 py-3 text-sm font-medium ${notice.tone === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{notice.text}</p>}
    </section>
  );
}
