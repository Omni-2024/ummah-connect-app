// ==================== PROFILE TABS ====================
interface ProfileTabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

export default function ProfileTabs({ tabs, activeTab, setActiveTab }: ProfileTabsProps) {
  return (
    <div className="sticky top-0 z-10 bg-white rounded-lg shadow-sm p-1 mb-4 sm:mb-6">
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-primary-500 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}