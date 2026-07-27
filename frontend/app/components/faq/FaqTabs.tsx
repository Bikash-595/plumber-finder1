interface FaqTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs: Array<{ id: string; label: string }>;
}

export default function FaqTabs({ activeTab, onTabChange, tabs }: FaqTabsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 border-b border-gray-200 pb-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            activeTab === tab.id
              ? "bg-[#FFD60A] text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}