import React from "react"

export const PurchaseLoadingSkeleton: React.FC = () => {
  return (
    <div className="container px-4 py-4 lg:px-20 lg:py-10">
      {/* Header Skeleton */}
      <div className="mb-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
        <div className="h-5 w-64 bg-gray-200 rounded"></div>
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-28 bg-gray-200 rounded-full animate-pulse"></div>
        ))}
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden animate-pulse"
          >
            <div className="px-6 pt-5 pb-2">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 w-24 bg-gray-200 rounded"></div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="px-6 pb-6">
              <div className="h-6 w-full bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 w-full bg-gray-200 rounded-lg mb-4"></div>
              <div className="flex gap-2">
                <div className="h-9 flex-1 bg-gray-200 rounded"></div>
                <div className="h-9 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}