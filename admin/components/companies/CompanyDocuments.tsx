"use client";

import { useState } from "react";
import { adminApi, formatDate, type CompanyVerification } from "@/lib/adminApi";

const labels: [keyof CompanyVerification, string][] = [["license", "License"], ["insurance", "Insurance"], ["panVat", "PAN / VAT"], ["registrationCertificate", "Registration certificate"]];

/**
 * "Documents" button for a company (or, with `load`, a freelancer) row: loads the verification links the
 * account saved, on demand.
 */
export default function CompanyDocuments({ companyId, load }: { companyId: string; load?: (id: string) => Promise<{ data: CompanyVerification | null }> }) {
  const [open, setOpen] = useState(false);
  const [docs, setDocs] = useState<CompanyVerification | null | undefined>(undefined);
  const [error, setError] = useState("");
  const toggle = () => {
    setOpen(!open);
    if (docs === undefined) (load ?? adminApi.companyVerification)(companyId).then(({ data }) => setDocs(data)).catch((caught) => setError(caught instanceof Error ? caught.message : "Could not load documents."));
  };
  return (
    <div className="relative">
      <button type="button" onClick={toggle} aria-expanded={open} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">Documents</button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-gray-200 bg-white p-3 text-left text-xs shadow-xl">
          {error ? <p className="text-red-600">{error}</p> : docs === undefined ? <p className="text-gray-500">Loading…</p> : !docs ? <p className="text-gray-500">No documents added yet.</p> : (
            <dl className="space-y-2">
              {labels.map(([key, label]) => (
                <div key={key}><dt className="font-semibold text-gray-500">{label}</dt><dd className="truncate">{docs[key] ? <a href={docs[key]} target="_blank" rel="noopener noreferrer nofollow" className="font-semibold text-[#0b1f3b] underline">{docs[key]}</a> : <span className="text-gray-400">Not provided</span>}</dd></div>
              ))}
              {docs.notes && <div><dt className="font-semibold text-gray-500">Notes</dt><dd className="whitespace-pre-line text-gray-700">{docs.notes}</dd></div>}
              {docs.updatedAt && <p className="text-gray-400">Updated {formatDate(docs.updatedAt)}</p>}
            </dl>
          )}
        </div>
      )}
    </div>
  );
}
