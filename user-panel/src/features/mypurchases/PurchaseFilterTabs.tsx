import React from "react"

interface Purchase {
  status: string
}

type TabKey = "all" | "succeeded" | "pending" | "failed"

interface PurchaseFilterTabsProps {
  purchases: Purchase[]
  selectedTab: TabKey
  onTabChange: (tab: TabKey) => void
}

export const PurchaseFilterTabs: React.FC<PurchaseFilterTabsProps> = ({
  purchases,
  selectedTab,
  onTabChange,
}) => {
  const tabs = [
    { key: "all" as const, label: "All", count: purchases.length },
    { 
      key: "succeeded" as const, 
      label: "Completed", 
      count: purchases.filter((p) => p.status === "succeeded").length 
    },
    { 
      key: "pending" as const, 
      label: "Pending", 
      count: purchases.filter((p) => p.status === "pending").length 
    },
    { 
      key: "failed" as const, 
      label: "Failed", 
      count: purchases.filter((p) => p.status === "failed").length 
    },
  ]

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedTab === tab.key
              ? "bg-primary-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  )
}