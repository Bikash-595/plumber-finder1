"use client";

import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaCheck, FaPlus, FaTrash, FaUsers } from "react-icons/fa";
import LocalMediaUpload from "@/components/company-dashboard/business-profile/LocalMediaUpload";
import { saveProfileDraft } from "@/components/company-dashboard/business-profile/profileStore";

type TeamMember = {
  id: string; name: string; photo: string; role: string; bio: string; specialties: string;
  experienceYears: string; experienceMonths: string; projectsInvolved: string; projectsCompleted: string;
  careerStartMonth: string; careerStartYear: string; joinedCompanyMonth: string; joinedCompanyYear: string;
  certificates: string; licenseNumber: string; phone: string; email: string; availability: string; visible: boolean;
};

const steps = [
  ["Header", "Add the name, role, image, and availability shown at the top of the profile."],
  ["Professional profile", "Write a clear introduction customers will read first."],
  ["Specialties", "List the services and project types this professional focuses on."],
  ["Experience & projects", "Record experience in years and months, plus project involvement."],
  ["Experience journey", "Add the important dates in their professional path."],
  ["Certificates & training", "Add licenses, credentials, and completed training."],
  ["Professional details", "Add contact details and choose what is visible publicly."],
] as const;

const createMember = (): TeamMember => ({
  id: crypto.randomUUID(), name: "", photo: "", role: "Plumber", bio: "", specialties: "", experienceYears: "", experienceMonths: "",
  projectsInvolved: "", projectsCompleted: "", careerStartMonth: "", careerStartYear: "", joinedCompanyMonth: "", joinedCompanyYear: "",
  certificates: "", licenseNumber: "", phone: "", email: "", availability: "Available", visible: true,
});

export default function TeamManagementForm() {
  const [members, setMembers] = useState<TeamMember[]>([createMember()]);
  const [activeSteps, setActiveSteps] = useState<Record<string, number>>({});
  const [notice, setNotice] = useState("");
  const update = <Key extends keyof TeamMember>(id: string, key: Key, value: TeamMember[Key]) => setMembers((items) => items.map((item) => item.id === id ? { ...item, [key]: value } : item));
  const setStep = (id: string, step: number) => setActiveSteps((items) => ({ ...items, [id]: step }));
  const addMember = () => { const member = createMember(); setMembers((items) => [...items, member]); setStep(member.id, 0); };
  const save = (draft = false) => setNotice(saveProfileDraft("company-team", { members }, draft));

  return <section>
    <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-wider text-[#0b1f3b]">Team management</p><h1 className="mt-2 text-2xl font-bold text-gray-900">Add your team members</h1><p className="mt-2 max-w-2xl text-sm text-gray-500">Complete one professional profile at a time using the same sections customers see on the public team page.</p></div><div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700"><FaUsers className="text-[#0b1f3b]" /> {members.length} member{members.length === 1 ? "" : "s"}</div></div>
    <form onSubmit={(event) => { event.preventDefault(); save(); }} className="mt-6 space-y-6">
      {members.map((member, memberIndex) => {
        const activeStep = activeSteps[member.id] ?? 0;
        return <article key={member.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white"><div className="flex items-center justify-between gap-4 border-b border-gray-100 bg-gray-50 px-4 py-4 sm:px-6"><div><p className="text-xs font-bold uppercase tracking-wider text-gray-400">Team member {memberIndex + 1}</p><h2 className="mt-1 text-lg font-bold text-gray-900">{member.name || "New team member"}</h2></div>{members.length > 1 && <button type="button" onClick={() => setMembers((items) => items.filter((item) => item.id !== member.id))} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50"><FaTrash /> Remove</button>}</div>
          <ol className="grid border-b border-gray-100 sm:grid-cols-2 xl:grid-cols-4" aria-label="Team member form sections">{steps.map(([title], index) => <li key={title} className={`flex items-center gap-3 px-4 py-3 text-sm ${index === activeStep ? "bg-amber-50 text-[#0b1f3b]" : "text-gray-500"}`}><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${index < activeStep ? "bg-[#0b1f3b] text-white" : index === activeStep ? "bg-[#FFD60A] text-[#0b1f3b]" : "bg-gray-200 text-gray-600"}`}>{index < activeStep ? <FaCheck /> : index + 1}</span><span className="font-semibold">{title}</span></li>)}</ol>
          <div className="p-4 sm:p-6"><div className="mb-6"><p className="text-xs font-bold uppercase tracking-wider text-[#b59a00]">Section {activeStep + 1} of {steps.length}</p><h3 className="mt-1 text-lg font-bold text-gray-900">{steps[activeStep][0]}</h3><p className="mt-1 text-sm text-gray-500">{steps[activeStep][1]}</p></div>
            {activeStep === 0 && <div className="grid gap-5 md:grid-cols-2"><div className="md:col-span-2"><LocalMediaUpload label="Profile photo" value={member.photo} onChange={(value) => update(member.id, "photo", value)} /></div><Field label="Full name" value={member.name} required placeholder="Team member name" onChange={(value) => update(member.id, "name", value)} /><Field label="Position or role" value={member.role} required placeholder="Lead plumber, technician, dispatcher..." onChange={(value) => update(member.id, "role", value)} /><Select label="Availability" value={member.availability} onChange={(value) => update(member.id, "availability", value)} options={["Available", "On calls", "Office hours", "Not currently available"]} /></div>}
            {activeStep === 1 && <TextArea label="Professional profile" value={member.bio} onChange={(value) => update(member.id, "bio", value)} placeholder="Describe this professional's experience, customer approach, and strengths." />}
            {activeStep === 2 && <Field label="Specialties" value={member.specialties} hint="Separate each specialty with a comma" placeholder="Drain cleaning, water heaters, leak detection" onChange={(value) => update(member.id, "specialties", value)} />}
            {activeStep === 3 && <div className="grid gap-5 md:grid-cols-2"><Field label="Years of experience" type="number" value={member.experienceYears} placeholder="8" onChange={(value) => update(member.id, "experienceYears", value)} /><Field label="Additional months" type="number" max="11" value={member.experienceMonths} placeholder="6" onChange={(value) => update(member.id, "experienceMonths", value)} /><Field label="Projects involved" type="number" value={member.projectsInvolved} placeholder="145" onChange={(value) => update(member.id, "projectsInvolved", value)} /><Field label="Projects completed" type="number" value={member.projectsCompleted} placeholder="120" onChange={(value) => update(member.id, "projectsCompleted", value)} /></div>}
            {activeStep === 4 && <div className="grid gap-5 md:grid-cols-2"><Select label="Started professional work — month" value={member.careerStartMonth} onChange={(value) => update(member.id, "careerStartMonth", value)} options={months} placeholder="Select month" /><Field label="Started professional work — year" type="number" value={member.careerStartYear} placeholder="2016" onChange={(value) => update(member.id, "careerStartYear", value)} /><Select label="Joined this company — month" value={member.joinedCompanyMonth} onChange={(value) => update(member.id, "joinedCompanyMonth", value)} options={months} placeholder="Select month" /><Field label="Joined this company — year" type="number" value={member.joinedCompanyYear} placeholder="2021" onChange={(value) => update(member.id, "joinedCompanyYear", value)} /></div>}
            {activeStep === 5 && <div className="grid gap-5 md:grid-cols-2"><Field label="Certificates and training" value={member.certificates} hint="Separate credentials with a comma" placeholder="Master Plumber, OSHA 30, Backflow prevention" onChange={(value) => update(member.id, "certificates", value)} /><Field label="License number" value={member.licenseNumber} placeholder="License number" onChange={(value) => update(member.id, "licenseNumber", value)} /></div>}
            {activeStep === 6 && <div className="grid gap-5 md:grid-cols-2"><Field label="Phone number" type="tel" value={member.phone} placeholder="(555) 000-0000" onChange={(value) => update(member.id, "phone", value)} /><Field label="Email address" type="email" value={member.email} placeholder="name@company.com" onChange={(value) => update(member.id, "email", value)} /><label className="md:col-span-2 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700"><input type="checkbox" checked={member.visible} onChange={(event) => update(member.id, "visible", event.target.checked)} className="h-4 w-4 accent-[#0b1f3b]" /> Show this team member on the public company profile</label></div>}
            <div className="mt-7 flex items-center justify-between gap-3 border-t border-gray-100 pt-5">{activeStep > 0 ? <button type="button" onClick={() => setStep(member.id, activeStep - 1)} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"><FaArrowLeft /> Back</button> : <span />}{activeStep < steps.length - 1 ? <button type="button" onClick={() => setStep(member.id, activeStep + 1)} className="inline-flex items-center gap-2 rounded-xl bg-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#17345a]">Continue <FaArrowRight /></button> : <span className="text-sm font-semibold text-emerald-700">Profile ready to save</span>}</div>
          </div></article>;
      })}
      <button type="button" onClick={addMember} className="inline-flex items-center gap-2 rounded-xl border border-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-[#0b1f3b] hover:bg-[#0b1f3b] hover:text-white"><FaPlus /> Add another team member</button>{notice && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{notice}</p>}<div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5"><button type="submit" className="rounded-xl bg-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#17345a]">Save team members</button><button type="button" onClick={() => save(true)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">Save as draft</button></div>
    </form>
  </section>;
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function Field({ label, value, onChange, type = "text", placeholder, hint, required = false, max }: { label: string; value: string; onChange: (value: string) => void; type?: "text" | "number" | "tel" | "email"; placeholder?: string; hint?: string; required?: boolean; max?: string }) { return <label><span className="text-sm font-semibold text-gray-700">{label}</span>{hint && <span className="ml-2 text-xs text-gray-400">{hint}</span>}<input type={type} required={required} min={type === "number" ? "0" : undefined} max={max} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]" /></label>; }
function Select({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (value: string) => void; options: readonly string[]; placeholder?: string }) { return <label><span className="text-sm font-semibold text-gray-700">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]"><option value="">{placeholder ?? "Select an option"}</option>{options.map((option, index) => <option key={option} value={options === months ? index + 1 : option}>{option}</option>)}</select></label>; }
function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) { return <label><span className="text-sm font-semibold text-gray-700">{label}</span><textarea rows={6} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]" /></label>; }
