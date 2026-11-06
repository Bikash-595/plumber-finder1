"use client";

import { useState } from "react";
import { Panel } from "@/components/AdminData";
import ByPlumber from "./ByPlumber";
import LiveActivity from "./LiveActivity";

export default function ActivityManager() {
  const [view, setView] = useState<"plumbers" | "live">("plumbers");
  return (
    <Panel title={view === "plumbers" ? "Activity by plumber" : "Live activity"} description="Profile visits count once per person per 30 minutes; plumbers' own visits and search-engine bots aren't counted. Guests are counted per browser.">
      <div className="mb-4 flex gap-2" role="tablist">
        {([["plumbers", "By plumber"], ["live", "Live activity"]] as const).map(([key, label]) => (
          <button key={key} type="button" role="tab" aria-selected={view === key} onClick={() => setView(key)} className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${view === key ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>{label}</button>
        ))}
      </div>
      {view === "plumbers" ? <ByPlumber /> : <LiveActivity />}
    </Panel>
  );
}
