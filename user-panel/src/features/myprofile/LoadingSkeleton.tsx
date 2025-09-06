import React from "react"

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen">
      Header skeleton
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="animate-pulse space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
            <div className="h-4 w-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 mt-14">
        {/* Main profile form skeleton */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 animate-pulse space-y-8">
            {/* Profile Image Section */}
            <div>
              <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full bg-gray-200"></div>
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-gray-200 rounded"></div>
                  <div className="h-3 w-56 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>

            {/* Basic Information Section */}
            <div>
              <div className="h-6 w-36 bg-gray-200 rounded mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-11 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-11 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-gray-200 rounded"></div>
                  <div className="h-11 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="h-11 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div>
              <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-11 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-36 bg-gray-200 rounded"></div>
                  <div className="h-11 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-gray-200 rounded"></div>
                  <div className="h-11 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-11 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>

            {/* Save Button Section */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-end">
                <div className="h-11 w-32 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="bg-white rounded-lg shadow-sm border mt-6">
          <div className="p-6 animate-pulse space-y-6">
            <div className="h-6 w-36 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-11 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-28 bg-gray-200 rounded"></div>
                <div className="h-11 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-40 bg-gray-200 rounded"></div>
                <div className="h-11 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="h-10 w-36 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}